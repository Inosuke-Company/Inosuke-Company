import fs from 'node:fs/promises';

const user = process.env.GITHUB_USER || 'gestao-quiroz';
const token = process.env.PROFILE_STATS_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error('GitHub token not available');

const now = new Date();
const to = now.toISOString();
const fromDate = new Date(now);
fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
const from = fromDate.toISOString();

const query = `
query Profile($login:String!, $from:DateTime!, $to:DateTime!) {
  user(login:$login) {
    name
    login
    followers { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
    contributionsCollection(from:$from, to:$to) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
  }
}`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    authorization: `bearer ${token}`,
    'content-type': 'application/json',
    'user-agent': 'quiroz-profile-metrics'
  },
  body: JSON.stringify({ query, variables: { login: user, from, to } })
});
if (!response.ok) throw new Error(`GitHub GraphQL HTTP ${response.status}`);
const payload = await response.json();
if (payload.errors) throw new Error(JSON.stringify(payload.errors));
const u = payload.data.user;
const c = u.contributionsCollection;
const days = c.contributionCalendar.weeks.flatMap(w => w.contributionDays);

await fs.mkdir('assets/stats', { recursive: true });

const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
const fmt = n => new Intl.NumberFormat('pt-BR').format(n || 0);
const total = c.contributionCalendar.totalContributions || 0;
const activeDays = days.filter(d => d.contributionCount > 0).length;
const bestDay = days.reduce((a,b) => b.contributionCount > a.contributionCount ? b : a, {contributionCount:0,date:'-'});
const privateActivity = c.restrictedContributionsCount || 0;
const exactPrivate = Boolean(process.env.PROFILE_STATS_TOKEN);

const metrics = [
  ['Contribuições', fmt(total), '#39d353'],
  [exactPrivate ? 'Commits (incl. privados)' : 'Commits visíveis', fmt(c.totalCommitContributions), '#58a6ff'],
  ['Atividade privada', fmt(privateActivity), '#a371f7'],
  ['Pull Requests', fmt(c.totalPullRequestContributions), '#f0883e'],
  ['Issues', fmt(c.totalIssueContributions), '#d2a8ff'],
  ['Reviews', fmt(c.totalPullRequestReviewContributions), '#56d364']
];

function overviewSvg() {
  const cards = metrics.map((m,i) => {
    const col=i%3,row=Math.floor(i/3),x=45+col*375,y=112+row*92;
    return `<rect x="${x}" y="${y}" width="345" height="72" rx="14" fill="#161b22" stroke="#30363d"/><text x="${x+18}" y="${y+28}" fill="#8b949e" font-family="Arial,sans-serif" font-size="15">${esc(m[0])}</text><text x="${x+18}" y="${y+57}" fill="${m[2]}" font-family="Arial,sans-serif" font-size="26" font-weight="700">${m[1]}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0d1117"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="1200" height="330" rx="22" fill="url(#bg)" stroke="#30363d"/><text x="45" y="55" fill="#58a6ff" font-family="Arial,sans-serif" font-size="30" font-weight="700">Quiroz · GitHub Metrics</text><text x="45" y="84" fill="#8b949e" font-family="Arial,sans-serif" font-size="15">últimos 12 meses · atualizado automaticamente no próprio repositório</text>${cards}<text x="45" y="310" fill="#8b949e" font-family="Arial,sans-serif" font-size="13">${exactPrivate ? 'Token privado habilitado: métricas com acesso autorizado a repositórios privados.' : 'Contribuições privadas seguem a visibilidade pública configurada no GitHub; detalhes privados permanecem ocultos.'}</text></svg>`;
}

const months = new Map();
for (const d of days) {
  const key=d.date.slice(0,7);
  months.set(key,(months.get(key)||0)+d.contributionCount);
}
const monthEntries=[...months.entries()].slice(-12);
function activitySvg(){
  const max=Math.max(1,...monthEntries.map(([,v])=>v));
  const x0=70,y0=300,w=1060,h=205,gap=18;
  const bw=(w-gap*(monthEntries.length-1))/Math.max(1,monthEntries.length);
  const bars=monthEntries.map(([k,v],i)=>{
    const bh=(v/max)*h,x=x0+i*(bw+gap),y=y0-bh;
    const label=k.slice(5)+'/'+k.slice(2,4);
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(3,bh).toFixed(1)}" rx="6" fill="#8957e5"><animate attributeName="opacity" values="0.55;1;0.55" dur="${3+i*0.12}s" repeatCount="indefinite"/></rect><text x="${(x+bw/2).toFixed(1)}" y="326" text-anchor="middle" fill="#8b949e" font-family="Arial,sans-serif" font-size="12">${label}</text><text x="${(x+bw/2).toFixed(1)}" y="${Math.max(92,y-8).toFixed(1)}" text-anchor="middle" fill="#c9d1d9" font-family="Arial,sans-serif" font-size="12">${v}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360"><rect width="1200" height="360" rx="22" fill="#0d1117" stroke="#30363d"/><text x="55" y="55" fill="#58a6ff" font-family="Arial,sans-serif" font-size="28" font-weight="700">Atividade por mês</text><text x="55" y="80" fill="#8b949e" font-family="Arial,sans-serif" font-size="14">${fmt(total)} contribuições no período · ${activeDays} dias ativos · melhor dia: ${esc(bestDay.date)} (${bestDay.contributionCount})</text><line x1="70" y1="300" x2="1130" y2="300" stroke="#30363d"/>${bars}</svg>`;
}

function heatColor(n,max){
  if(!n) return '#161b22';
  const r=n/max;
  if(r<0.25) return '#0e4429';
  if(r<0.5) return '#006d32';
  if(r<0.75) return '#26a641';
  return '#39d353';
}
function heatmapSvg(){
  const max=Math.max(1,...days.map(d=>d.contributionCount));
  const cell=13,gap=4,x0=70,y0=95;
  const weeks=c.contributionCalendar.weeks;
  const cells=weeks.flatMap((week,wi)=>week.contributionDays.map(d=>`<rect x="${x0+wi*(cell+gap)}" y="${y0+d.weekday*(cell+gap)}" width="${cell}" height="${cell}" rx="3" fill="${heatColor(d.contributionCount,max)}"><title>${d.date}: ${d.contributionCount}</title></rect>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="250" viewBox="0 0 1200 250"><rect width="1200" height="250" rx="22" fill="#0d1117" stroke="#30363d"/><text x="55" y="55" fill="#58a6ff" font-family="Arial,sans-serif" font-size="28" font-weight="700">Contribution Heatmap</text><text x="55" y="78" fill="#8b949e" font-family="Arial,sans-serif" font-size="14">Gerado diretamente dos dados de contribuição do GitHub</text>${cells}<text x="55" y="228" fill="#8b949e" font-family="Arial,sans-serif" font-size="13">Less</text><rect x="95" y="216" width="13" height="13" rx="3" fill="#161b22"/><rect x="113" y="216" width="13" height="13" rx="3" fill="#0e4429"/><rect x="131" y="216" width="13" height="13" rx="3" fill="#006d32"/><rect x="149" y="216" width="13" height="13" rx="3" fill="#26a641"/><rect x="167" y="216" width="13" height="13" rx="3" fill="#39d353"/><text x="190" y="228" fill="#8b949e" font-family="Arial,sans-serif" font-size="13">More</text></svg>`;
}

await fs.writeFile('assets/stats/overview.svg', overviewSvg());
await fs.writeFile('assets/stats/activity.svg', activitySvg());
await fs.writeFile('assets/stats/heatmap.svg', heatmapSvg());
console.log({ user, total, commits:c.totalCommitContributions, privateActivity, activeDays, exactPrivate });
