import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as cheerio from 'cheerio';
import { line, area, curveCatmullRom } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

const require = createRequire(import.meta.url);
const lucide = require('@iconify-json/lucide/icons.json');
const mdi = require('@iconify-json/mdi/icons.json');

const USER = process.env.GITHUB_USER || 'Inosuke-Company';
const token = process.env.PROFILE_STATS_TOKEN || process.env.GITHUB_TOKEN || '';
const hasPrivateToken = Boolean(process.env.PROFILE_STATS_TOKEN);
const CONTRIBUTION_FLOOR = 538;
const CORE_COMMIT_FLOOR = 523;
const CORE_REPO = 'lolla-gest-o-beauty-salon-manager';

const C = {
  bg: '#07090f', panel: '#0d111a', panel2: '#111827', border: '#263244',
  text: '#edf2f7', muted: '#8b9bb4', aqua: '#67e8f9', cyan: '#22d3ee',
  blue: '#38bdf8', steel: '#94a3b8', violet: '#a78bfa', rose: '#fb7185',
  green: '#5eead4', amber: '#fbbf24', white: '#ffffff'
};

const now = new Date();
const to = now.toISOString();
const fromDate = new Date(now);
fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
const from = fromDate.toISOString();
const ymd = d => d.toISOString().slice(0, 10);

const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
const fmt = n => new Intl.NumberFormat('en-US').format(Number(n || 0));

function icon(collection, name, x, y, size, color, delay = 0) {
  const source = collection.icons[name] || lucide.icons['circle'];
  const w = source.width || collection.width || 24;
  const h = source.height || collection.height || 24;
  const scale = size / Math.max(w, h);
  return `<g transform="translate(${x} ${y}) scale(${scale})" color="${color}" opacity="0.92">${source.body}<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 -4;0 0" dur="${3.2 + delay}s" begin="${delay}s" repeatCount="indefinite"/></g>`;
}

async function graphqlData() {
  if (!token) return null;
  const query = `query Profile($login:String!, $from:DateTime!, $to:DateTime!) {
    user(login:$login) {
      followers { totalCount }
      repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
      contributionsCollection(from:$from, to:$to) {
        totalCommitContributions totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions restrictedContributionsCount
        contributionCalendar { totalContributions weeks { contributionDays { date contributionCount weekday } } }
      }
    }
  }`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'inosuke-profile-engine' },
      body: JSON.stringify({ query, variables: { login: USER, from, to } })
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.user || null;
  } catch { return null; }
}

async function scrapePublicContributions() {
  try {
    const url = `https://github.com/users/${encodeURIComponent(USER)}/contributions?from=${ymd(fromDate)}&to=${ymd(now)}`;
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 InosukeProfile/1.0' } });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const tooltips = new Map();
    $('tool-tip[for]').each((_, el) => {
      const text = $(el).text().trim();
      const m = text.match(/([\d,]+)\s+contribution/i);
      tooltips.set($(el).attr('for'), m ? Number(m[1].replace(/,/g, '')) : 0);
    });
    const days = [];
    $('.ContributionCalendar-day[data-date]').each((_, el) => {
      const id = $(el).attr('id');
      const date = $(el).attr('data-date');
      let count = id && tooltips.has(id) ? tooltips.get(id) : Number($(el).attr('data-count') || 0);
      if (!Number.isFinite(count)) count = 0;
      days.push({ date, contributionCount: count, weekday: new Date(`${date}T00:00:00Z`).getUTCDay() });
    });
    const text = $.text();
    const totalMatch = text.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : days.reduce((s, d) => s + d.contributionCount, 0);
    return { total, days };
  } catch { return null; }
}

async function privateCoreCommits() {
  if (!hasPrivateToken) return null;
  try {
    const url = `https://api.github.com/repos/${USER}/${CORE_REPO}/commits?author=${USER}&since=${encodeURIComponent(from)}&until=${encodeURIComponent(to)}&per_page=1`;
    const res = await fetch(url, { headers: { authorization: `Bearer ${process.env.PROFILE_STATS_TOKEN}`, accept: 'application/vnd.github+json', 'user-agent': 'inosuke-profile-engine' } });
    if (!res.ok) return null;
    const link = res.headers.get('link') || '';
    const last = [...link.matchAll(/[?&]page=(\d+)>; rel="last"/g)].at(-1);
    if (last) return Number(last[1]);
    const body = await res.json();
    return Array.isArray(body) ? body.length : null;
  } catch { return null; }
}

const [gql, scraped, exactCore] = await Promise.all([graphqlData(), scrapePublicContributions(), privateCoreCommits()]);
const gqlDays = gql?.contributionsCollection?.contributionCalendar?.weeks?.flatMap(w => w.contributionDays) || [];
const days = scraped?.days?.some(d => d.contributionCount > 0) ? scraped.days : gqlDays;
const rawTotal = Math.max(scraped?.total || 0, gql?.contributionsCollection?.contributionCalendar?.totalContributions || 0);
const totalContrib = Math.max(rawTotal, CONTRIBUTION_FLOOR);
const totalLabel = `${fmt(totalContrib)}${rawTotal < CONTRIBUTION_FLOOR ? '+' : ''}`;
const coreCommits = Math.max(exactCore || 0, CORE_COMMIT_FLOOR);
const coreLabel = `${fmt(coreCommits)}${!exactCore || exactCore < CORE_COMMIT_FLOOR ? '+' : ''}`;
const publicCommits = gql?.contributionsCollection?.totalCommitContributions || 0;
const prs = gql?.contributionsCollection?.totalPullRequestContributions || 0;
const issues = gql?.contributionsCollection?.totalIssueContributions || 0;
const reviews = gql?.contributionsCollection?.totalPullRequestReviewContributions || 0;
const privateActivity = gql?.contributionsCollection?.restrictedContributionsCount || 0;

function streaks(input) {
  const sorted = [...input].sort((a,b) => a.date.localeCompare(b.date));
  let longest = 0, current = 0, run = 0;
  for (const d of sorted) { run = d.contributionCount > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].contributionCount > 0) current++;
    else if (current > 0) break;
  }
  return { longest, current };
}
const streak = streaks(days);
const activeDays = days.filter(d => d.contributionCount > 0).length;

const months = new Map();
for (const d of days) {
  const key = d.date?.slice(0,7);
  if (key) months.set(key, (months.get(key) || 0) + Number(d.contributionCount || 0));
}
const monthEntries = [...months.entries()].slice(-12);
if (!monthEntries.length) {
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now); d.setUTCMonth(d.getUTCMonth() - i);
    monthEntries.push([d.toISOString().slice(0,7), 0]);
  }
}

await fs.mkdir('assets/inosuke', { recursive: true });
await fs.mkdir('assets/stats', { recursive: true });

function defs() {
  return `<defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dbeafe"/><stop offset=".42" stop-color="#64748b"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient>
    <linearGradient id="aqua" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#164e63"/><stop offset=".5" stop-color="${C.aqua}"/><stop offset="1" stop-color="#0e7490"/></linearGradient>
    <linearGradient id="purple" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#312e81"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="${C.aqua}" stop-opacity=".38"/><stop offset="1" stop-color="${C.aqua}" stop-opacity="0"/></radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="micro"><feGaussianBlur stdDeviation="2.5"/></filter>
  </defs>`;
}

function titleSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="180" viewBox="0 0 1200 180">${defs()}
    <rect width="1200" height="180" fill="${C.bg}" rx="22"/>
    <circle cx="600" cy="90" r="150" fill="url(#glow)" opacity=".7"><animate attributeName="r" values="125;165;125" dur="6s" repeatCount="indefinite"/></circle>
    <path d="M90 120 C260 45 410 150 565 76 S910 26 1110 95" fill="none" stroke="${C.cyan}" stroke-width="2" opacity=".45" stroke-dasharray="8 14"><animate attributeName="stroke-dashoffset" values="0;-220" dur="7s" repeatCount="indefinite"/></path>
    <text x="600" y="83" text-anchor="middle" fill="${C.text}" font-family="Arial,Helvetica,sans-serif" font-size="48" font-weight="800" letter-spacing="13">INOSUKE</text>
    <text x="600" y="119" text-anchor="middle" fill="${C.aqua}" font-family="monospace" font-size="17" letter-spacing="5">FULL STACK ENGINEERING // BEAST MODE</text>
    <path d="M260 143 H500 L520 135 L540 151 L560 139 L580 148 H620 L640 135 L660 151 L680 139 L700 143 H940" fill="none" stroke="url(#steel)" stroke-width="2.4" opacity=".8"><animate attributeName="opacity" values=".45;1;.45" dur="3.2s" repeatCount="indefinite"/></path>
  </svg>`;
}

function dividerSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="72" viewBox="0 0 1200 72">${defs()}
    <rect width="1200" height="72" fill="transparent"/>
    <path d="M40 38 H470 L490 29 L505 45 L520 31 L535 42 H665 L680 29 L695 45 L710 31 L730 38 H1160" fill="none" stroke="${C.border}" stroke-width="2"/>
    <path d="M40 38 H470" stroke="${C.aqua}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="40 470"><animate attributeName="stroke-dashoffset" values="510;-510" dur="4.6s" repeatCount="indefinite"/></path>
    <path d="M730 38 H1160" stroke="${C.violet}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="40 470"><animate attributeName="stroke-dashoffset" values="-510;510" dur="4.6s" repeatCount="indefinite"/></path>
    <circle cx="600" cy="38" r="14" fill="${C.panel}" stroke="${C.aqua}" opacity=".9"><animate attributeName="r" values="11;15;11" dur="3s" repeatCount="indefinite"/></circle>
    <path d="M592 38 l8 -8 8 8 -8 8z" fill="${C.aqua}"/>
  </svg>`;
}

function iconStripSvg() {
  const items = [
    ['code-2','Frontend'],['database','Data'],['shield-check','Security'],['smartphone','Mobile'],['cloud','Cloud'],['git-branch','CI/CD']
  ];
  const chunks = items.map((it,i) => {
    const x = 98 + i * 182;
    return `<g>
      <rect x="${x}" y="55" width="150" height="150" rx="26" fill="${C.panel}" stroke="${i%2 ? C.violet : C.aqua}" stroke-opacity=".28"/>
      <circle cx="${x+75}" cy="111" r="36" fill="${i%2 ? '#181633' : '#0a2830'}" stroke="${i%2 ? C.violet : C.aqua}" stroke-opacity=".5"/>
      ${icon(lucide, it[0], x+56, 92, 38, i%2 ? C.violet : C.aqua, i*.19)}
      <text x="${x+75}" y="177" text-anchor="middle" fill="${C.text}" font-family="Arial,sans-serif" font-size="16" font-weight="700">${it[1]}</text>
      <circle cx="${x+128}" cy="78" r="3" fill="${i%2 ? C.violet : C.aqua}"><animate attributeName="opacity" values=".15;1;.15" dur="${2.4+i*.15}s" repeatCount="indefinite"/></circle>
    </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="255" viewBox="0 0 1200 255">${defs()}<rect width="1200" height="255" rx="22" fill="${C.bg}"/>${chunks}</svg>`;
}

function dashboardSvg() {
  const metrics = [
    {label:'Contributions',value:totalLabel,sub:'last 12 months',color:C.aqua,icon:'activity'},
    {label:'Core commits',value:coreLabel,sub:hasPrivateToken?'private + verified':'private snapshot floor',color:C.blue,icon:'git-commit-horizontal'},
    {label:'Active days',value:fmt(activeDays),sub:`longest streak ${streak.longest}d`,color:C.violet,icon:'calendar-check-2'},
    {label:'Pull requests',value:fmt(prs),sub:`${fmt(reviews)} reviews · ${fmt(issues)} issues`,color:C.rose,icon:'git-pull-request'}
  ];
  const cards = metrics.map((m,i) => {
    const x=55+i*285, y=125;
    const r=49, circ=2*Math.PI*r;
    const pct = [0.88,0.82,Math.min(.95,activeDays/180),Math.min(.95,(prs+reviews+1)/25)][i];
    const dash = circ*pct;
    return `<g>
      <rect x="${x}" y="${y}" width="255" height="220" rx="26" fill="${C.panel}" stroke="${m.color}" stroke-opacity=".22"/>
      <circle cx="${x+72}" cy="${y+78}" r="${r}" fill="none" stroke="#1f2937" stroke-width="8"/>
      <circle cx="${x+72}" cy="${y+78}" r="${r}" fill="none" stroke="${m.color}" stroke-width="8" stroke-linecap="round" transform="rotate(-90 ${x+72} ${y+78})" stroke-dasharray="${dash.toFixed(1)} ${(circ-dash).toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}"><animate attributeName="stroke-dashoffset" from="${circ.toFixed(1)}" to="0" dur="1.8s" fill="freeze"/></circle>
      ${icon(lucide,m.icon,x+57,y+63,30,m.color,i*.2)}
      <text x="${x+138}" y="${y+74}" fill="${C.muted}" font-family="Arial,sans-serif" font-size="14">${m.label}</text>
      <text x="${x+138}" y="${y+110}" fill="${C.text}" font-family="Arial,sans-serif" font-size="30" font-weight="800">${m.value}</text>
      <line x1="${x+28}" x2="${x+227}" y1="${y+146}" y2="${y+146}" stroke="${C.border}"/>
      <text x="${x+28}" y="${y+180}" fill="${C.muted}" font-family="monospace" font-size="12">${esc(m.sub)}</text>
      <circle cx="${x+224}" cy="${y+28}" r="3" fill="${m.color}"><animate attributeName="opacity" values=".2;1;.2" dur="2.7s" repeatCount="indefinite"/></circle>
    </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="405" viewBox="0 0 1200 405">${defs()}<rect width="1200" height="405" rx="24" fill="${C.bg}" stroke="${C.border}"/><text x="55" y="58" fill="${C.text}" font-family="Arial,sans-serif" font-size="29" font-weight="800">Activity Breathing Dashboard</text><text x="55" y="86" fill="${C.muted}" font-family="monospace" font-size="13">SELF-HOSTED // GENERATED BY GITHUB ACTIONS // PRIVATE REPOSITORY DETAILS REMAIN HIDDEN</text>${cards}</svg>`;
}

function activitySvg() {
  const W=1200,H=430,left=75,right=70,top=100,bottom=80;
  const vals=monthEntries.map(([,v])=>v);
  const max=Math.max(1,...vals);
  const x=(i)=>left+i*((W-left-right)/(monthEntries.length-1 || 1));
  const sy=scaleLinear().domain([0,max]).range([H-bottom,top]);
  const pts=monthEntries.map(([k,v],i)=>({x:x(i),y:sy(v),v,k}));
  const l=line().x(d=>d.x).y(d=>d.y).curve(curveCatmullRom.alpha(.65));
  const a=area().x(d=>d.x).y0(H-bottom).y1(d=>d.y).curve(curveCatmullRom.alpha(.65));
  const dots=pts.map((p,i)=>`<g><circle cx="${p.x}" cy="${p.y}" r="5.5" fill="${i%2?C.violet:C.aqua}" stroke="${C.bg}" stroke-width="3"><animate attributeName="r" values="4;7;4" dur="${2.8+i*.08}s" repeatCount="indefinite"/></circle><text x="${p.x}" y="${H-43}" text-anchor="middle" fill="${C.muted}" font-family="monospace" font-size="11">${p.k.slice(5)}/${p.k.slice(2,4)}</text></g>`).join('');
  const grid=[0,.25,.5,.75,1].map(t=>{const y=sy(max*t);return `<line x1="${left}" x2="${W-right}" y1="${y}" y2="${y}" stroke="#1f2937"/><text x="${left-18}" y="${y+4}" text-anchor="end" fill="${C.muted}" font-family="monospace" font-size="11">${Math.round(max*t)}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="430" viewBox="0 0 1200 430">${defs()}<rect width="1200" height="430" rx="24" fill="${C.bg}" stroke="${C.border}"/><text x="55" y="54" fill="${C.text}" font-family="Arial,sans-serif" font-size="28" font-weight="800">Contribution Current</text><text x="55" y="80" fill="${C.muted}" font-family="monospace" font-size="13">MONTHLY FLOW // ${totalLabel} RECORDED CONTRIBUTIONS</text>${grid}<path d="${a(pts)}" fill="url(#purple)" opacity=".22"/><path d="${l(pts)}" fill="none" stroke="url(#aqua)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="2.1s" fill="freeze"/></path>${dots}<path d="M1030 62 l28 12 -28 12 12 -12z" fill="${C.aqua}" opacity=".75"><animateTransform attributeName="transform" type="translate" values="0 0;22 0;0 0" dur="3.7s" repeatCount="indefinite"/></path></svg>`;
}

function heatColor(n,max) { if(!n) return '#111827'; const r=n/max; if(r<.25) return '#164e63'; if(r<.5) return '#0e7490'; if(r<.75) return '#06b6d4'; return '#67e8f9'; }
function heatmapSvg() {
  const sorted=[...days].sort((a,b)=>a.date.localeCompare(b.date));
  const max=Math.max(1,...sorted.map(d=>d.contributionCount));
  const byWeek=[]; let current=[];
  for(const d of sorted){ if(current.length && d.weekday===0){byWeek.push(current);current=[];} current.push(d);} if(current.length)byWeek.push(current);
  const x0=78,y0=110,cell=13,gap=4;
  const cells=byWeek.flatMap((week,wi)=>week.map(d=>`<rect x="${x0+wi*(cell+gap)}" y="${y0+d.weekday*(cell+gap)}" width="${cell}" height="${cell}" rx="3.5" fill="${heatColor(d.contributionCount,max)}" opacity=".92"><title>${esc(d.date)}: ${d.contributionCount} contributions</title><animate attributeName="opacity" values=".65;1;.65" dur="${4+(wi%9)*.08}s" begin="${(wi%12)*.03}s" repeatCount="indefinite"/></rect>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280">${defs()}<rect width="1200" height="280" rx="24" fill="${C.bg}" stroke="${C.border}"/><text x="55" y="55" fill="${C.text}" font-family="Arial,sans-serif" font-size="28" font-weight="800">Breathing Heatmap</text><text x="55" y="80" fill="${C.muted}" font-family="monospace" font-size="13">DAILY ACTIVITY // ${activeDays} ACTIVE DAYS</text>${cells}<path d="M80 242 H1110" stroke="${C.border}"/><path d="M80 242 H380" stroke="${C.aqua}" stroke-width="2.3" stroke-dasharray="70 260"><animate attributeName="stroke-dashoffset" values="330;-330" dur="4s" repeatCount="indefinite"/></path><text x="1110" y="248" text-anchor="end" fill="${C.muted}" font-family="monospace" font-size="12">current streak ${streak.current}d · longest ${streak.longest}d</text></svg>`;
}

function orbitSvg() {
  const tech=[['language-typescript','TypeScript'],['react','React'],['database','PostgreSQL'],['shield-check','RLS'],['smartphone','Android/iOS'],['cloud','Cloudflare'],['git-branch','Actions'],['layers-3','SaaS']];
  const centerX=600,centerY=145,rx=440,ry=82;
  const nodes=tech.map((t,i)=>{const ang=(Math.PI*2*i/tech.length)-Math.PI/2;const x=centerX+Math.cos(ang)*rx,y=centerY+Math.sin(ang)*ry;const color=i%2?C.violet:C.aqua;return `<g>${icon(lucide,t[0],x-18,y-18,36,color,i*.14)}<text x="${x}" y="${y+39}" text-anchor="middle" fill="${C.muted}" font-family="Arial,sans-serif" font-size="12">${t[1]}</text></g>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="310" viewBox="0 0 1200 310">${defs()}<rect width="1200" height="310" rx="24" fill="${C.bg}" stroke="${C.border}"/><ellipse cx="600" cy="145" rx="440" ry="82" fill="none" stroke="${C.border}" stroke-dasharray="5 12"><animate attributeName="stroke-dashoffset" values="0;-160" dur="8s" repeatCount="indefinite"/></ellipse><circle cx="600" cy="145" r="64" fill="${C.panel}" stroke="${C.aqua}" stroke-opacity=".5"/><text x="600" y="137" text-anchor="middle" fill="${C.text}" font-family="monospace" font-size="24" font-weight="700">&lt;/&gt;</text><text x="600" y="164" text-anchor="middle" fill="${C.aqua}" font-family="monospace" font-size="12">STACK CORE</text>${nodes}</svg>`;
}

await Promise.all([
  fs.writeFile('assets/inosuke/title.svg', titleSvg()),
  fs.writeFile('assets/inosuke/divider.svg', dividerSvg()),
  fs.writeFile('assets/inosuke/icon-strip.svg', iconStripSvg()),
  fs.writeFile('assets/inosuke/tech-orbit.svg', orbitSvg()),
  fs.writeFile('assets/stats/beast-dashboard.svg', dashboardSvg()),
  fs.writeFile('assets/stats/contribution-current.svg', activitySvg()),
  fs.writeFile('assets/stats/breathing-heatmap.svg', heatmapSvg())
]);

console.log({ USER, totalContrib, coreCommits, publicCommits, activeDays, prs, issues, reviews, privateActivity, hasPrivateToken });
