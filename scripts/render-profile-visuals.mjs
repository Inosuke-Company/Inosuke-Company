import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as cheerio from 'cheerio';

const require = createRequire(import.meta.url);
const lucide = require('@iconify-json/lucide/icons.json');
const simple = require('@iconify-json/simple-icons/icons.json');

const USER = process.env.GITHUB_USER || 'Inosuke-Company';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const PRIVATE_TOKEN = process.env.PROFILE_STATS_TOKEN || '';
const PRIVATE_BASELINE = Number(process.env.PRIVATE_COMMIT_BASELINE || 704);

const now = new Date();
const fromDate = new Date(now);
fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
const from = fromDate.toISOString();
const to = now.toISOString();
const ymd = d => d.toISOString().slice(0, 10);
const fmt = n => new Intl.NumberFormat('pt-BR').format(Number(n || 0));

const LIGHT = {
  bg:'#f7f5f1', panel:'#fffdf9', panel2:'#f0ece6', text:'#17191d', muted:'#70737a', line:'#d9d3cb',
  copper:'#b85f36', copper2:'#e4aa82', copper3:'#7d3b24', blue:'#2d4e78', blue2:'#88a7cf', blue3:'#172b47',
  silver:'#aeb4bd', silver2:'#dde1e6', ivory:'#fffaf3', champagne:'#d9c3a7'
};
const DARK = {
  bg:'#0b0d11', panel:'#11151a', panel2:'#171c23', text:'#f2f0ec', muted:'#9da3aa', line:'#2c323a',
  copper:'#d67b4d', copper2:'#f0b38a', copper3:'#93482c', blue:'#719bd0', blue2:'#b8cde7', blue3:'#263f61',
  silver:'#99a2ad', silver2:'#d8dde3', ivory:'#f4efe8', champagne:'#c6ae91'
};

function icon(collection, name, x, y, size, color, opacity=1) {
  const source = collection.icons[name] || lucide.icons[name] || lucide.icons.code;
  const w = source.width || collection.width || 24;
  const h = source.height || collection.height || 24;
  const scale = size / Math.max(w, h);
  return `<g transform="translate(${x} ${y}) scale(${scale})" color="${color}" opacity="${opacity}">${source.body}</g>`;
}

async function requestJson(url, token='') {
  try {
    const headers = { accept:'application/vnd.github+json', 'user-agent':'inosuke-profile-premium' };
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (!res.ok) return { data:null, headers:res.headers, status:res.status };
    return { data:await res.json(), headers:res.headers, status:res.status };
  } catch { return { data:null, headers:new Headers(), status:0 }; }
}

async function listOwnedRepositories() {
  const token = PRIVATE_TOKEN;
  const repos = [];
  for (let page=1; page<=10; page++) {
    const url = token
      ? `https://api.github.com/user/repos?affiliation=owner&visibility=all&sort=full_name&per_page=100&page=${page}`
      : `https://api.github.com/users/${encodeURIComponent(USER)}/repos?type=owner&sort=full_name&per_page=100&page=${page}`;
    const { data } = await requestJson(url, token);
    if (!Array.isArray(data)) break;
    for (const repo of data) {
      if (repo?.owner?.login === USER && !repo.fork && !repo.archived) repos.push(repo);
    }
    if (data.length < 100) break;
  }
  return repos;
}

function lastPage(link='') {
  const match = [...String(link).matchAll(/[?&]page=(\d+)>; rel="last"/g)].at(-1);
  return match ? Number(match[1]) : null;
}

async function repositoryCommitCount(repo) {
  const token = repo.private ? PRIVATE_TOKEN : (PRIVATE_TOKEN || GITHUB_TOKEN);
  const { data, headers, status } = await requestJson(`https://api.github.com/repos/${repo.full_name}/commits?per_page=1`, token);
  if (status === 409) return 0;
  if (!Array.isArray(data)) return 0;
  return lastPage(headers.get('link')) || data.length;
}

async function aggregateCommits() {
  const repos = await listOwnedRepositories();
  const counts = await Promise.all(repos.map(repositoryCommitCount));
  let total = counts.reduce((sum, n) => sum + Number(n || 0), 0);

  // Se o token privado ainda não estiver configurado, preserva o histórico privado
  // já verificado do produto principal, sem expor o repositório no perfil público.
  if (!PRIVATE_TOKEN) total += PRIVATE_BASELINE;

  // O próprio renderizador publica um commit ao atualizar os SVGs.
  if (repos.some(r => r.name === USER)) total += 1;

  return { total, repositories:repos.length, privateLive:Boolean(PRIVATE_TOKEN) };
}

async function graphData() {
  const token = PRIVATE_TOKEN || GITHUB_TOKEN;
  if (!token) return null;
  const query = `query P($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions contributionCalendar{totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method:'POST',
      headers:{authorization:`bearer ${token}`,'content-type':'application/json','user-agent':'inosuke-profile-premium'},
      body:JSON.stringify({query,variables:{login:USER,from,to}})
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.user?.contributionsCollection || null;
  } catch { return null; }
}

async function scrapeCalendar() {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(USER)}/contributions?from=${ymd(fromDate)}&to=${ymd(now)}`, {headers:{'user-agent':'Mozilla/5.0'}});
    if (!res.ok) return null;
    const $ = cheerio.load(await res.text());
    const tips = new Map();
    $('tool-tip[for]').each((_, el) => {
      const m = $(el).text().trim().match(/([\d,.]+)\s+contribution/i);
      tips.set($(el).attr('for'), m ? Number(m[1].replace(/[.,]/g,'')) : 0);
    });
    const days=[];
    $('.ContributionCalendar-day[data-date]').each((_,el)=>{
      const date=$(el).attr('data-date');
      const id=$(el).attr('id');
      let count=id&&tips.has(id)?tips.get(id):Number($(el).attr('data-count')||0);
      if(!Number.isFinite(count)) count=0;
      days.push({date,contributionCount:count,weekday:new Date(`${date}T00:00:00Z`).getUTCDay()});
    });
    const match=$.text().match(/([\d,.]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    return {days,total:match?Number(match[1].replace(/[.,]/g,'')):days.reduce((s,d)=>s+d.contributionCount,0)};
  } catch { return null; }
}

const [commitData, gql, scraped] = await Promise.all([aggregateCommits(), graphData(), scrapeCalendar()]);
const gqlDays = gql?.contributionCalendar?.weeks?.flatMap(w=>w.contributionDays) || [];
const days = scraped?.days?.length ? scraped.days : gqlDays;
const publicContribs = Math.max(scraped?.total || 0, gql?.contributionCalendar?.totalContributions || 0);
const activeDays = days.filter(d=>d.contributionCount>0).length;
const prs = gql?.totalPullRequestContributions || 0;
const reviews = gql?.totalPullRequestReviewContributions || 0;
const issues = gql?.totalIssueContributions || 0;
const totalCommits = commitData.total;
const milestone = Math.max(1000, Math.ceil(totalCommits / 500) * 500);
const progress = Math.min(1, totalCommits / milestone);

let longest=0, run=0;
for (const d of [...days].sort((a,b)=>a.date.localeCompare(b.date))) {
  run = d.contributionCount>0 ? run+1 : 0;
  longest=Math.max(longest,run);
}

await fs.mkdir('assets/premium',{recursive:true});
await fs.mkdir('assets/stats',{recursive:true});

function defs(c,id){
  return `<defs>
    <linearGradient id="${id}-duo" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${c.copper3}"/><stop offset=".27" stop-color="${c.copper2}"/><stop offset=".5" stop-color="${c.silver2}"/><stop offset=".73" stop-color="${c.blue2}"/><stop offset="1" stop-color="${c.blue3}"/></linearGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".44" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".65"/><stop offset=".56" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}-halo"><stop stop-color="${c.copper2}" stop-opacity=".18"/><stop offset=".48" stop-color="${c.blue2}" stop-opacity=".09"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></radialGradient>
    <filter id="${id}-grain"><feTurbulence baseFrequency=".82" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .025 0"/></filter>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dy="7"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <style>@media (prefers-reduced-motion:reduce){animate,animateTransform,animateMotion{display:none}}</style>
  </defs>`;
}

function wordmark(c,dark=false){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 330" width="1200" height="330" role="img" aria-label="Inosuke — Desenvolvedor Full Stack">${defs(c,'w')}
    <rect width="1200" height="330" rx="28" fill="${c.bg}"/><rect width="1200" height="330" rx="28" filter="url(#w-grain)" opacity="${dark?'.52':'.30'}"/>
    <circle cx="600" cy="154" r="120" fill="url(#w-halo)"/><circle cx="600" cy="154" r="106" fill="none" stroke="url(#w-duo)" stroke-width="10" opacity=".10" stroke-dasharray="210 460"><animateTransform attributeName="transform" type="rotate" from="0 600 154" to="360 600 154" dur="34s" repeatCount="indefinite"/></circle>
    <rect x="54" y="46" width="1092" height="238" rx="22" fill="${c.panel}" fill-opacity="${dark?'.62':'.88'}" stroke="url(#w-duo)" stroke-width=".75"/>
    <text x="600" y="145" text-anchor="middle" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="91" font-style="italic" font-weight="600" fill="url(#w-duo)" letter-spacing="10">INOSUKE</text>
    <line x1="470" y1="171" x2="730" y2="171" stroke="url(#w-duo)" stroke-width=".8"/>
    <text x="600" y="207" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-size="18" font-weight="600" fill="${c.text}" letter-spacing="3">DESENVOLVEDOR FULL STACK · ENGENHEIRO DE PRODUTO</text>
    <text x="600" y="239" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" fill="${c.muted}" letter-spacing="4.4">WEB · ANDROID · iOS · SAAS · NUVEM · SEGURANÇA · CI/CD</text>
  </svg>`;
}

function divider(c){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 56" width="1200" height="56" aria-hidden="true">${defs(c,'d')}
    <line x1="72" y1="28" x2="1128" y2="28" stroke="${c.line}" stroke-width=".65"/><line x1="72" y1="28" x2="1128" y2="28" stroke="url(#d-duo)" stroke-width="1" opacity=".42"/>
    <line x1="-150" y1="28" x2="0" y2="28" stroke="url(#d-shine)" stroke-width="2.2"><animate attributeName="x1" values="-160;1210" dur="7s" repeatCount="indefinite"/><animate attributeName="x2" values="-10;1360" dur="7s" repeatCount="indefinite"/></line>
  </svg>`;
}

const techs = [
  ['typescript','TypeScript'],['react','React 19'],['tanstack','TanStack'],['vite','Vite'],['tailwindcss','Tailwind CSS'],
  ['nodedotjs','Node.js'],['supabase','Supabase'],['postgresql','PostgreSQL'],['capacitor','Capacitor'],['android','Android'],
  ['apple','iOS'],['openjdk','Java 21'],['gradle','Gradle'],['cloudflare','Cloudflare'],['githubactions','GitHub Actions'],
  ['git','Git'],['zod','Zod'],['reactquery','React Query'],['npm','npm'],['cloudflareworkers','Workers']
];

function stack(c,dark=false){
  const cells=techs.map((item,i)=>{
    const col=i%10, row=Math.floor(i/10);
    const x=72+col*117.2, y=112+row*137;
    const accent=i%2?c.blue:c.copper;
    return `<g transform="translate(${x} ${y})"><circle r="36" fill="${c.panel2}" fill-opacity="${dark?'.58':'.82'}" stroke="${c.line}" stroke-width=".7"/><circle r="42" fill="none" stroke="${accent}" stroke-width=".65" stroke-dasharray="18 13" opacity=".34"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${22+i*.35}s" repeatCount="indefinite"/></circle>${icon(simple,item[0],-18,-18,36,accent,.96)}<text x="0" y="62" text-anchor="middle" fill="${c.text}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11.5" font-weight="600">${item[1]}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 385" width="1200" height="385" role="img" aria-label="Stack tecnológica">${defs(c,'s')}<rect width="1200" height="385" rx="28" fill="${c.bg}"/><text x="64" y="47" fill="${c.muted}" font-family="'JetBrains Mono',monospace" font-size="9" letter-spacing="4">STACK TECNOLÓGICA · FERRAMENTAS PRINCIPAIS</text><line x1="64" y1="63" x2="1136" y2="63" stroke="url(#s-duo)" stroke-width=".7" opacity=".7"/>${cells}</svg>`;
}

function product(c,dark=false){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" width="1200" height="350" role="img" aria-label="Meu Salão — produto principal">${defs(c,'m')}
    <rect width="1200" height="350" rx="30" fill="${c.bg}"/><rect x="42" y="34" width="1116" height="282" rx="24" fill="${c.panel}" fill-opacity="${dark?'.70':'.95'}" stroke="${c.line}" stroke-width=".7" filter="url(#m-shadow)"/>
    <text x="82" y="87" fill="${c.copper}" font-family="'JetBrains Mono',monospace" font-size="10" letter-spacing="4.4">PRODUTO PRINCIPAL · CÓDIGO PROPRIETÁRIO</text>
    <text x="80" y="175" fill="${c.text}" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="73" font-weight="600">Meu Salão</text>
    <text x="83" y="216" fill="${c.muted}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="17">Plataforma integrada de gestão para negócios de beleza.</text>
    <text x="83" y="247" fill="${c.muted}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="15">Operação real · Web · Android · fundação iOS · evolução para SaaS comercial</text>
    <rect x="825" y="74" width="250" height="54" rx="27" fill="${c.panel2}" stroke="url(#m-duo)" stroke-width=".8"/><circle cx="858" cy="101" r="5" fill="${c.copper}"><animate attributeName="opacity" values=".35;1;.35" dur="2.8s" repeatCount="indefinite"/></circle><text x="880" y="107" fill="${c.text}" font-family="monospace" font-size="11" letter-spacing="2">EM PRODUÇÃO</text>
    <line x1="80" y1="276" x2="1120" y2="276" stroke="url(#m-duo)" stroke-width=".7" opacity=".65"/>
  </svg>`;
}

function roadmap(c){
  const stages=[['Web Desktop','EM OPERAÇÃO'],['Web Mobile','EM OPERAÇÃO'],['Android','BUILD INSTALÁVEL'],['iOS','FUNDAÇÃO PRONTA'],['SaaS','EM PREPARAÇÃO']];
  const nodes=stages.map((s,i)=>{const x=112+i*244;return `<g><circle cx="${x}" cy="132" r="10" fill="${i<3?c.copper:c.blue}"/><circle cx="${x}" cy="132" r="19" fill="none" stroke="${i<3?c.copper:c.blue}" stroke-width=".7" opacity=".35"><animate attributeName="r" values="14;22;14" dur="${4+i*.3}s" repeatCount="indefinite"/></circle><text x="${x}" y="188" text-anchor="middle" fill="${c.text}" font-family="Arial,sans-serif" font-size="14" font-weight="650">${s[0]}</text><text x="${x}" y="213" text-anchor="middle" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="1.5">${s[1]}</text></g>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 265" width="1200" height="265" role="img" aria-label="Evolução multiplataforma">${defs(c,'r')}<rect width="1200" height="265" rx="28" fill="${c.bg}"/><text x="64" y="47" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="4">PLATAFORMAS &amp; EVOLUÇÃO</text><line x1="112" y1="132" x2="1088" y2="132" stroke="${c.line}" stroke-width="1.4"/><line x1="112" y1="132" x2="1088" y2="132" stroke="url(#r-duo)" stroke-width="1.7" stroke-dasharray="130 846"><animate attributeName="stroke-dashoffset" values="0;-976" dur="8s" repeatCount="indefinite"/></line>${nodes}</svg>`;
}

function activity(c,dark=false){
  const x1=106,x2=1094,y=250,bar=x1+(x2-x1)*progress;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 430" width="1200" height="430" role="img" aria-label="Atividade geral de engenharia">${defs(c,'a')}
    <rect width="1200" height="430" rx="30" fill="${c.bg}"/><rect x="42" y="34" width="1116" height="352" rx="24" fill="${c.panel}" fill-opacity="${dark?'.78':'.96'}" stroke="${c.line}" stroke-width=".7" filter="url(#a-shadow)"/>
    <text x="80" y="86" fill="${c.muted}" font-family="'JetBrains Mono',monospace" font-size="10" letter-spacing="4.5">ATIVIDADE GERAL DE ENGENHARIA</text>
    <text x="80" y="166" fill="url(#a-duo)" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="80" font-weight="600">${fmt(totalCommits)}+</text>
    <text x="80" y="198" fill="${c.text}" font-family="Arial,sans-serif" font-size="17" font-weight="600" letter-spacing="2">COMMITS TOTAIS RASTREADOS</text>
    <text x="1090" y="108" text-anchor="end" fill="${c.muted}" font-family="monospace" font-size="10">PRÓXIMA META</text><text x="1090" y="145" text-anchor="end" fill="${c.text}" font-family="Arial,sans-serif" font-size="27" font-weight="650">${fmt(milestone)}</text>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${c.line}" stroke-width="7" stroke-linecap="round"/><line x1="${x1}" y1="${y}" x2="${bar}" y2="${y}" stroke="url(#a-duo)" stroke-width="7" stroke-linecap="round"><animate attributeName="x2" from="${x1}" to="${bar}" dur="1.8s" fill="freeze"/></line><circle cx="${bar}" cy="${y}" r="8" fill="${c.panel}" stroke="${c.copper}" stroke-width="2.5"/>
    <line x1="80" y1="318" x2="1120" y2="318" stroke="${c.line}" stroke-width=".7"/>
    <text x="80" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="1.8">CONTRIBUIÇÕES VISÍVEIS</text><text x="285" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(publicContribs)}</text>
    <text x="430" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="1.8">DIAS ATIVOS</text><text x="558" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(activeDays)}</text>
    <text x="700" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="1.6">ALTERAÇÕES PROPOSTAS</text><text x="900" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(prs)}</text>
    <text x="962" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="1.4">REVISÕES</text><text x="1070" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(reviews)}</text>
  </svg>`;
}

function heatmap(c){
  const recent=[...days].slice(-371);
  const max=Math.max(1,...recent.map(d=>d.contributionCount||0));
  const cells=recent.map((d,i)=>{const col=Math.floor(i/7), row=i%7, x=73+col*19.2, y=126+row*19.2, t=(d.contributionCount||0)/max;const fill=t===0?c.panel2:t<.25?c.champagne:t<.55?c.copper2:t<.8?c.blue2:c.blue3;return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="13" height="13" rx="3" fill="${fill}" opacity="${t===0?'.55':'.95'}"/>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 335" width="1200" height="335" role="img" aria-label="Calendário público de contribuições">${defs(c,'h')}<rect width="1200" height="335" rx="28" fill="${c.bg}"/><text x="64" y="48" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="4">CALENDÁRIO PÚBLICO DE CONTRIBUIÇÕES</text><line x1="64" y1="64" x2="1136" y2="64" stroke="url(#h-duo)" stroke-width=".7" opacity=".65"/>${cells}<text x="73" y="293" fill="${c.muted}" font-family="monospace" font-size="9">CONTRIBUIÇÕES VISÍVEIS</text><text x="275" y="293" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="650">${fmt(publicContribs)}</text><text x="430" y="293" fill="${c.muted}" font-family="monospace" font-size="9">DIAS ATIVOS</text><text x="545" y="293" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="650">${fmt(activeDays)}</text><text x="700" y="293" fill="${c.muted}" font-family="monospace" font-size="9">MAIOR SEQUÊNCIA</text><text x="862" y="293" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="650">${fmt(longest)} dias</text></svg>`;
}

await Promise.all([
  fs.writeFile('assets/premium/wordmark-light.svg',wordmark(LIGHT,false)),
  fs.writeFile('assets/premium/wordmark-dark.svg',wordmark(DARK,true)),
  fs.writeFile('assets/premium/divider-light.svg',divider(LIGHT)),
  fs.writeFile('assets/premium/divider-dark.svg',divider(DARK)),
  fs.writeFile('assets/premium/stack-light.svg',stack(LIGHT,false)),
  fs.writeFile('assets/premium/stack-dark.svg',stack(DARK,true)),
  fs.writeFile('assets/premium/product-light.svg',product(LIGHT,false)),
  fs.writeFile('assets/premium/product-dark.svg',product(DARK,true)),
  fs.writeFile('assets/premium/roadmap-light.svg',roadmap(LIGHT)),
  fs.writeFile('assets/premium/roadmap-dark.svg',roadmap(DARK)),
  fs.writeFile('assets/stats/overall-activity-light.svg',activity(LIGHT,false)),
  fs.writeFile('assets/stats/overall-activity-dark.svg',activity(DARK,true)),
  fs.writeFile('assets/stats/heatmap-premium-light.svg',heatmap(LIGHT)),
  fs.writeFile('assets/stats/heatmap-premium-dark.svg',heatmap(DARK))
]);

console.log({
  usuario:USER,
  repositoriosDetectados:commitData.repositories,
  commitsTotais:totalCommits,
  contribuicoesVisiveis:publicContribs,
  diasAtivos:activeDays,
  tokenPrivadoAtivo:commitData.privateLive,
  observacaoPrivada:commitData.privateLive ? 'repositórios privados contabilizados ao vivo' : `baseline privado preservado: ${PRIVATE_BASELINE}`
});
