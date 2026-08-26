import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as cheerio from 'cheerio';

const require = createRequire(import.meta.url);
const lucide = require('@iconify-json/lucide/icons.json');
const mdi = require('@iconify-json/mdi/icons.json');

const USER = process.env.GITHUB_USER || 'Inosuke-Company';
const PROFILE_REPO = USER;
const TOKEN = process.env.GITHUB_TOKEN || '';
const CORE_COMMIT_FLOOR = Number(process.env.CORE_COMMIT_FLOOR || 704);

const now = new Date();
const fromDate = new Date(now);
fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
const from = fromDate.toISOString();
const to = now.toISOString();
const ymd = d => d.toISOString().slice(0, 10);
const fmt = n => new Intl.NumberFormat('en-US').format(Number(n || 0));
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));

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
  const source = collection.icons[name] || lucide.icons[name] || lucide.icons.circle;
  const w = source.width || collection.width || 24;
  const h = source.height || collection.height || 24;
  const scale = size / Math.max(w, h);
  return `<g transform="translate(${x} ${y}) scale(${scale})" color="${color}" opacity="${opacity}">${source.body}</g>`;
}

async function commitCount(repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/commits?per_page=1`, {
      headers:{accept:'application/vnd.github+json','user-agent':'inosuke-profile-premium'}
    });
    if (!res.ok) return 0;
    const link = res.headers.get('link') || '';
    const last = [...link.matchAll(/[?&]page=(\d+)>; rel="last"/g)].at(-1);
    if (last) return Number(last[1]);
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  } catch { return 0; }
}

async function graphData() {
  if (!TOKEN) return null;
  const query = `query P($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions contributionCalendar{totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method:'POST',
      headers:{authorization:`bearer ${TOKEN}`,'content-type':'application/json','user-agent':'inosuke-profile-premium'},
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
      const m = $(el).text().trim().match(/([\d,]+)\s+contribution/i);
      tips.set($(el).attr('for'), m ? Number(m[1].replace(/,/g,'')) : 0);
    });
    const days=[];
    $('.ContributionCalendar-day[data-date]').each((_,el)=>{
      const date=$(el).attr('data-date');
      const id=$(el).attr('id');
      let count=id&&tips.has(id)?tips.get(id):Number($(el).attr('data-count')||0);
      if(!Number.isFinite(count)) count=0;
      days.push({date,contributionCount:count,weekday:new Date(`${date}T00:00:00Z`).getUTCDay()});
    });
    const match=$.text().match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    return {days,total:match?Number(match[1].replace(/,/g,'')):days.reduce((s,d)=>s+d.contributionCount,0)};
  } catch { return null; }
}

const [profileCommits, gql, scraped] = await Promise.all([commitCount(PROFILE_REPO), graphData(), scrapeCalendar()]);
const gqlDays = gql?.contributionCalendar?.weeks?.flatMap(w=>w.contributionDays) || [];
const days = scraped?.days?.length ? scraped.days : gqlDays;
const publicContribs = Math.max(scraped?.total || 0, gql?.contributionCalendar?.totalContributions || 0);
const activeDays = days.filter(d=>d.contributionCount>0).length;
const prs = gql?.totalPullRequestContributions || 0;
const reviews = gql?.totalPullRequestReviewContributions || 0;
const issues = gql?.totalIssueContributions || 0;
const totalCommits = CORE_COMMIT_FLOOR + profileCommits;
const milestone = Math.max(1000, Math.ceil(totalCommits / 500) * 500);
const progress = Math.min(1, totalCommits / milestone);

await fs.mkdir('assets/premium',{recursive:true});
await fs.mkdir('assets/stats',{recursive:true});

function defs(c,id){
  return `<defs>
    <linearGradient id="${id}-duo" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${c.copper3}"/><stop offset=".27" stop-color="${c.copper2}"/><stop offset=".5" stop-color="${c.silver2}"/><stop offset=".73" stop-color="${c.blue2}"/><stop offset="1" stop-color="${c.blue3}"/></linearGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".44" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".65"/><stop offset=".56" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"><animate attributeName="offset" values=".82;1;.82" dur="7s" repeatCount="indefinite"/></stop></linearGradient>
    <radialGradient id="${id}-halo"><stop stop-color="${c.copper2}" stop-opacity=".18"/><stop offset=".48" stop-color="${c.blue2}" stop-opacity=".09"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></radialGradient>
    <filter id="${id}-grain"><feTurbulence baseFrequency=".82" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .025 0"/></filter>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dy="7"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <style>@media (prefers-reduced-motion:reduce){animate,animateTransform,animateMotion{display:none}}</style>
  </defs>`;
}

function wordmark(c,dark=false){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 330" width="1200" height="330" role="img" aria-label="Inosuke Full Stack Developer">${defs(c,'w')}
    <rect width="1200" height="330" rx="28" fill="${c.bg}"/><rect width="1200" height="330" rx="28" filter="url(#w-grain)" opacity="${dark?'.52':'.30'}"/>
    <circle cx="600" cy="154" r="120" fill="url(#w-halo)"/><circle cx="600" cy="154" r="106" fill="none" stroke="url(#w-duo)" stroke-width="10" opacity=".10" stroke-dasharray="210 460"><animateTransform attributeName="transform" type="rotate" from="0 600 154" to="360 600 154" dur="34s" repeatCount="indefinite"/></circle>
    <rect x="54" y="46" width="1092" height="238" rx="22" fill="${c.panel}" fill-opacity="${dark?'.62':'.88'}" stroke="url(#w-duo)" stroke-width=".75"/>
    <rect x="60" y="52" width="1080" height="226" rx="18" fill="none" stroke="${c.line}" stroke-width=".45"/>
    <text x="600" y="145" text-anchor="middle" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="91" font-style="italic" font-weight="600" fill="url(#w-duo)" letter-spacing="10">INOSUKE</text>
    <text x="600" y="145" text-anchor="middle" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="91" font-style="italic" font-weight="600" fill="url(#w-shine)" letter-spacing="10">INOSUKE</text>
    <line x1="470" y1="171" x2="730" y2="171" stroke="url(#w-duo)" stroke-width=".8"/>
    <text x="600" y="207" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-size="18" font-weight="600" fill="${c.text}" letter-spacing="4">FULL STACK DEVELOPER · PRODUCT ENGINEER</text>
    <text x="600" y="239" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" fill="${c.muted}" letter-spacing="5">WEB · ANDROID · iOS · SAAS · CLOUD · SECURITY · CI/CD</text>
  </svg>`;
}

function divider(c){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 56" width="1200" height="56" aria-hidden="true">${defs(c,'d')}
    <line x1="72" y1="28" x2="1128" y2="28" stroke="${c.line}" stroke-width=".65"/><line x1="72" y1="28" x2="1128" y2="28" stroke="url(#d-duo)" stroke-width="1" opacity=".42"/>
    <line x1="0" y1="28" x2="150" y2="28" stroke="url(#d-shine)" stroke-width="2.2"><animate attributeName="x1" values="-160;1210" dur="7s" repeatCount="indefinite"/><animate attributeName="x2" values="-10;1360" dur="7s" repeatCount="indefinite"/></line>
    <circle cx="600" cy="28" r="2.4" fill="${c.copper}"><animate attributeName="opacity" values=".3;1;.3" dur="4s" repeatCount="indefinite"/></circle>
  </svg>`;
}

function stack(c,dark=false){
  const items=[
    ['language-typescript','TypeScript'],['react','React'],['database','PostgreSQL'],['shield-lock-outline','Security'],['android','Android'],['apple','iOS'],['cloud-outline','Cloud'],['github','GitHub Actions']
  ];
  const cells=items.map((item,i)=>{
    const x=95+i*136;
    const color=i%2?c.blue:c.copper;
    return `<g transform="translate(${x} 0)"><circle cx="0" cy="115" r="47" fill="${c.panel2}" fill-opacity="${dark?'.55':'.75'}" stroke="${c.line}" stroke-width=".7"/><circle cx="0" cy="115" r="53" fill="none" stroke="${color}" stroke-width=".7" stroke-dasharray="24 18" opacity=".35"><animateTransform attributeName="transform" type="rotate" from="0 0 115" to="360 0 115" dur="${18+i}s" repeatCount="indefinite"/></circle>${icon(mdi,item[0],-23,92,46,color,.95)}<text x="0" y="190" text-anchor="middle" fill="${c.text}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600">${item[1]}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 250" width="1200" height="250" role="img" aria-label="Technology stack">${defs(c,'s')}<rect width="1200" height="250" rx="28" fill="${c.bg}"/><text x="64" y="47" fill="${c.muted}" font-family="'JetBrains Mono',monospace" font-size="9" letter-spacing="4">ENGINEERING STACK</text><line x1="64" y1="63" x2="1136" y2="63" stroke="url(#s-duo)" stroke-width=".7" opacity=".7"/>${cells}</svg>`;
}

function product(c,dark=false){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" width="1200" height="350" role="img" aria-label="Meu Salão product">${defs(c,'m')}
    <rect width="1200" height="350" rx="30" fill="${c.bg}"/><rect x="42" y="34" width="1116" height="282" rx="24" fill="${c.panel}" fill-opacity="${dark?'.70':'.95'}" stroke="${c.line}" stroke-width=".7" filter="url(#m-shadow)"/>
    <text x="82" y="87" fill="${c.copper}" font-family="'JetBrains Mono',monospace" font-size="10" letter-spacing="5">PRIVATE PRODUCT · LIVE DEMO</text>
    <text x="80" y="175" fill="${c.text}" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="73" font-weight="600">Meu Salão</text>
    <text x="83" y="216" fill="${c.muted}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="17">Integrated management for beauty businesses.</text>
    <text x="83" y="248" fill="${c.muted}" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14">Scheduling · CRM · Finance · Inventory · Team · Analytics · Permissions</text>
    <g transform="translate(780 103)"><rect width="300" height="142" rx="18" fill="${c.panel2}" fill-opacity="${dark?'.50':'.70'}" stroke="url(#m-duo)" stroke-width=".7"/><text x="24" y="33" fill="${c.muted}" font-family="'JetBrains Mono',monospace" font-size="9" letter-spacing="3">PLATFORMS</text><text x="24" y="73" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="600">Web</text><text x="126" y="73" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="600">Android</text><text x="24" y="111" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="600">iOS</text><text x="126" y="111" fill="${c.text}" font-family="Arial,sans-serif" font-size="18" font-weight="600">SaaS</text></g>
    <rect x="82" y="278" width="430" height="2" rx="1" fill="url(#m-duo)"><animate attributeName="width" values="120;430;120" dur="10s" repeatCount="indefinite"/></rect>
  </svg>`;
}

function activity(c,dark=false){
  const x0=106,x1=1094,y=250,filled=x0+(x1-x0)*progress;
  const ticks=[0,.25,.5,.75,1].map(t=>{const x=x0+(x1-x0)*t;return `<line x1="${x}" y1="${y-7}" x2="${x}" y2="${y+7}" stroke="${c.line}" stroke-width=".6"/><text x="${x}" y="${y+31}" text-anchor="middle" fill="${c.muted}" font-family="monospace" font-size="10">${fmt(Math.round(milestone*t))}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 430" width="1200" height="430" role="img" aria-label="Overall commit activity">${defs(c,'a')}
    <rect width="1200" height="430" rx="30" fill="${c.bg}"/><rect x="42" y="34" width="1116" height="352" rx="24" fill="${c.panel}" fill-opacity="${dark?'.72':'.96'}" stroke="${c.line}" stroke-width=".7" filter="url(#a-shadow)"/>
    <text x="80" y="86" fill="${c.muted}" font-family="'JetBrains Mono',monospace" font-size="10" letter-spacing="5">OVERALL ENGINEERING ACTIVITY</text>
    <text x="80" y="166" fill="url(#a-duo)" font-family="'Bodoni Moda','Playfair Display',Georgia,serif" font-size="80" font-weight="600">${fmt(totalCommits)}+</text>
    <text x="80" y="198" fill="${c.text}" font-family="Arial,sans-serif" font-size="17" font-weight="600" letter-spacing="2">TOTAL COMMITS TRACKED</text>
    <text x="1090" y="108" text-anchor="end" fill="${c.muted}" font-family="monospace" font-size="10">NEXT MILESTONE</text><text x="1090" y="145" text-anchor="end" fill="${c.text}" font-family="Arial,sans-serif" font-size="27" font-weight="650">${fmt(milestone)}</text>
    <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${c.line}" stroke-width="7" stroke-linecap="round"/><line x1="${x0}" y1="${y}" x2="${filled}" y2="${y}" stroke="url(#a-duo)" stroke-width="7" stroke-linecap="round"><animate attributeName="x2" from="${x0}" to="${filled}" dur="1.8s" fill="freeze"/></line><circle cx="${filled}" cy="${y}" r="8" fill="${c.panel}" stroke="${c.copper}" stroke-width="2.5"><animate attributeName="r" values="7;10;7" dur="4s" repeatCount="indefinite"/></circle>${ticks}
    <line x1="80" y1="318" x2="1120" y2="318" stroke="${c.line}" stroke-width=".7"/>
    <text x="80" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="2">PUBLIC CONTRIBUTIONS</text><text x="278" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(publicContribs)}</text>
    <text x="440" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="2">ACTIVE DAYS</text><text x="573" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(activeDays)}</text>
    <text x="720" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="2">PULL REQUESTS</text><text x="878" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(prs)}</text>
    <text x="960" y="355" fill="${c.muted}" font-family="monospace" font-size="9" letter-spacing="2">REVIEWS</text><text x="1070" y="355" fill="${c.text}" font-family="Arial,sans-serif" font-size="20" font-weight="650">${fmt(reviews)}</text>
  </svg>`;
}

function heatColor(n,max,c){if(!n)return c.panel2;const r=n/max;return r<.25?c.copper2:r<.5?c.copper:r<.75?c.blue2:c.blue}
function heatmap(c,dark=false){
  const max=Math.max(1,...days.map(d=>d.contributionCount||0));
  const cells=days.map((d,i)=>{const week=Math.floor(i/7),row=i%7,x=112+week*17,y=111+row*17,fill=heatColor(d.contributionCount,max,c);return `<rect x="${x}" y="${y}" width="13" height="13" rx="3" fill="${fill}">${d.contributionCount?`<animate attributeName="opacity" values=".72;1;.72" dur="${3.4+(week%7)*.15}s" repeatCount="indefinite"/>`:''}<title>${esc(d.date)}: ${d.contributionCount}</title></rect>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 285" width="1200" height="285" role="img" aria-label="Public contribution calendar">${defs(c,'h')}<rect width="1200" height="285" rx="28" fill="${c.bg}"/><rect x="42" y="30" width="1116" height="220" rx="22" fill="${c.panel}" fill-opacity="${dark?'.70':'.95'}" stroke="${c.line}" stroke-width=".7"/><text x="80" y="72" fill="${c.muted}" font-family="monospace" font-size="10" letter-spacing="4">PUBLIC CONTRIBUTION CALENDAR</text><line x1="80" y1="87" x2="1120" y2="87" stroke="url(#h-duo)" stroke-width=".7"/>${cells}<text x="1110" y="231" text-anchor="end" fill="${c.muted}" font-family="Arial,sans-serif" font-size="12">${fmt(publicContribs)} visible contributions</text></svg>`;
}

function roadmap(c,dark=false){
  const steps=['Production','Web','Android','iOS','Multi-tenant','SaaS','Scale'];
  const nodes=steps.map((s,i)=>{const x=92+i*169,tone=i<3?c.copper:c.blue;return `<circle cx="${x}" cy="133" r="${i<3?6:4.5}" fill="${tone}"/><circle cx="${x}" cy="133" r="12" fill="none" stroke="${tone}" stroke-opacity=".28" stroke-width=".7"><animate attributeName="r" values="10;13;10" dur="${4+i*.25}s" repeatCount="indefinite"/></circle><text x="${x}" y="177" text-anchor="middle" fill="${c.text}" font-family="Arial,sans-serif" font-size="13" font-weight="600">${s}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 235" width="1200" height="235" role="img" aria-label="Meu Salão roadmap">${defs(c,'r')}<rect width="1200" height="235" rx="28" fill="${c.bg}"/><rect x="42" y="30" width="1116" height="170" rx="22" fill="${c.panel}" fill-opacity="${dark?'.70':'.95'}" stroke="${c.line}" stroke-width=".7"/><text x="80" y="68" fill="${c.muted}" font-family="monospace" font-size="10" letter-spacing="4">MEU SALÃO · PRODUCT ROADMAP</text><line x1="92" y1="133" x2="1106" y2="133" stroke="${c.line}" stroke-width="1"/><line x1="92" y1="133" x2="430" y2="133" stroke="url(#r-duo)" stroke-width="2"/>${nodes}</svg>`;
}

for(const [name,c,dark] of [['light',LIGHT,false],['dark',DARK,true]]){
  await fs.writeFile(`assets/premium/wordmark-${name}.svg`,wordmark(c,dark));
  await fs.writeFile(`assets/premium/divider-${name}.svg`,divider(c));
  await fs.writeFile(`assets/premium/stack-${name}.svg`,stack(c,dark));
  await fs.writeFile(`assets/premium/product-${name}.svg`,product(c,dark));
  await fs.writeFile(`assets/premium/roadmap-${name}.svg`,roadmap(c,dark));
  await fs.writeFile(`assets/stats/overall-activity-${name}.svg`,activity(c,dark));
  await fs.writeFile(`assets/stats/heatmap-premium-${name}.svg`,heatmap(c,dark));
}

console.log({user:USER,profileCommits,totalCommits,publicContribs,activeDays,prs,reviews,issues,milestone});
