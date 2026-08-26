import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as cheerio from 'cheerio';
import { arc, pie } from 'd3-shape';

const require = createRequire(import.meta.url);
const lucide = require('@iconify-json/lucide/icons.json');
const mdi = require('@iconify-json/mdi/icons.json');

const USER = process.env.GITHUB_USER || 'Inosuke-Company';
const PROFILE_REPO = USER;
const CORE_REPO = 'lolla-gest-o-beauty-salon-manager';
const token = process.env.PROFILE_STATS_TOKEN || process.env.GITHUB_TOKEN || '';
const hasPrivateToken = Boolean(process.env.PROFILE_STATS_TOKEN);

// Verified repository floors supplied on 2026-08-26.
const CORE_COMMIT_FLOOR = 704;
const PROFILE_COMMIT_FLOOR = 60;

// Palette sampled from the Inosuke banner/reference: fire, indigo hair, skin, steel and eye green.
const C = {
  paper: '#FFF7E8', paper2: '#F5E4C4', paper3: '#EED0A3', ink: '#181519',
  navy: '#1D2338', navy2: '#29385C', blue: '#315EA8', blue2: '#5E8FD8', ice: '#D4DFF2',
  orange: '#C0531B', orange2: '#E77A24', ember: '#8F3214', brown: '#612C0C',
  skin: '#ECCD A9'.replace(' ', ''), tan: '#DBA153', steel: '#B1B5B8', steel2: '#D9DEE3',
  green: '#9BBE3B', green2: '#C8E66A', white: '#FFFFFF'
};

const now = new Date();
const to = now.toISOString();
const fromDate = new Date(now);
fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
const from = fromDate.toISOString();
const ymd = d => d.toISOString().slice(0, 10);
const fmt = n => new Intl.NumberFormat('en-US').format(Number(n || 0));

function getIcon(collection, name) {
  return collection.icons[name] || lucide.icons[name] || mdi.icons[name] || lucide.icons.circle;
}
function iconSvg(collection, name, x, y, size, color, opts = {}) {
  const source = getIcon(collection, name);
  const w = source.width || collection.width || 24;
  const h = source.height || collection.height || 24;
  const s = size / Math.max(w, h);
  const pulse = opts.pulse !== false
    ? `<animateTransform attributeName="transform" additive="sum" type="scale" values="1;1.08;1" dur="${opts.duration || 3.4}s" begin="${opts.delay || 0}s" repeatCount="indefinite"/>`
    : '';
  return `<g transform="translate(${x} ${y}) scale(${s})" color="${color}">${source.body}${pulse}</g>`;
}

async function graphqlData() {
  if (!token) return null;
  const query = `query Profile($login:String!, $from:DateTime!, $to:DateTime!) {
    user(login:$login) {
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
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 InosukeProfile/2.0' } });
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
    const m = text.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    return { total: m ? Number(m[1].replace(/,/g, '')) : days.reduce((s, d) => s + d.contributionCount, 0), days };
  } catch { return null; }
}

function parseLastPage(link) {
  const last = [...String(link || '').matchAll(/[?&]page=(\d+)>; rel="last"/g)].at(-1);
  return last ? Number(last[1]) : null;
}
async function repoCommitCount(owner, repo, authToken = '') {
  try {
    const headers = { accept: 'application/vnd.github+json', 'user-agent': 'inosuke-profile-engine' };
    if (authToken) headers.authorization = `Bearer ${authToken}`;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
    if (!res.ok) return null;
    const page = parseLastPage(res.headers.get('link'));
    if (page) return page;
    const body = await res.json();
    return Array.isArray(body) ? body.length : null;
  } catch { return null; }
}

const [gql, scraped, profileExact, coreExact] = await Promise.all([
  graphqlData(),
  scrapePublicContributions(),
  repoCommitCount(USER, PROFILE_REPO),
  hasPrivateToken ? repoCommitCount(USER, CORE_REPO, process.env.PROFILE_STATS_TOKEN) : Promise.resolve(null)
]);

const gqlDays = gql?.contributionsCollection?.contributionCalendar?.weeks?.flatMap(w => w.contributionDays) || [];
const days = scraped?.days?.some(d => d.contributionCount > 0) ? scraped.days : gqlDays;
const publicContributionTotal = Math.max(scraped?.total || 0, gql?.contributionsCollection?.contributionCalendar?.totalContributions || 0);
const coreCommits = Math.max(coreExact || 0, CORE_COMMIT_FLOOR);
const profileCommits = Math.max(profileExact || 0, PROFILE_COMMIT_FLOOR);
const trackedCommits = coreCommits + profileCommits;
const prs = gql?.contributionsCollection?.totalPullRequestContributions || 0;
const issues = gql?.contributionsCollection?.totalIssueContributions || 0;
const reviews = gql?.contributionsCollection?.totalPullRequestReviewContributions || 0;

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

await fs.mkdir('assets/inosuke', { recursive: true });
await fs.mkdir('assets/stats', { recursive: true });

function defs() {
  return `<defs>
    <linearGradient id="fire" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${C.ember}"/><stop offset=".45" stop-color="${C.orange}"/><stop offset="1" stop-color="${C.orange2}"/></linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${C.navy}"/><stop offset=".48" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.blue2}"/></linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#72767C"/><stop offset=".45" stop-color="${C.steel2}"/><stop offset=".62" stop-color="#8E949B"/><stop offset="1" stop-color="#50545A"/></linearGradient>
    <linearGradient id="paperGlow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${C.paper}"/><stop offset="1" stop-color="${C.paper2}"/></linearGradient>
    <radialGradient id="eye"><stop stop-color="${C.green2}"/><stop offset=".5" stop-color="${C.green}"/><stop offset="1" stop-color="#496510"/></radialGradient>
    <pattern id="paperPattern" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 24 Q12 10 24 24 T48 24" fill="none" stroke="${C.tan}" stroke-opacity=".10" stroke-width="1.2"/><path d="M0 34 Q12 20 24 34 T48 34" fill="none" stroke="${C.blue}" stroke-opacity=".07" stroke-width="1"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="${C.brown}" flood-opacity=".18"/></filter>
  </defs>`;
}

function serratedBlade(x1, y1, x2, y2, flip = 1) {
  const len = x2 - x1;
  const teeth = 16;
  let d = `M${x1} ${y1} `;
  for (let i = 0; i <= teeth; i++) {
    const x = x1 + (len * i / teeth);
    const y = y1 + (i % 2 ? 6 * flip : 0);
    d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  d += `L${x2} ${y2 + 13*flip} L${x1} ${y1 + 13*flip} Z`;
  return d;
}

function titleSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="250" viewBox="0 0 1200 250">${defs()}
    <rect width="1200" height="250" rx="28" fill="url(#paperGlow)"/><rect width="1200" height="250" rx="28" fill="url(#paperPattern)"/>
    <path d="M0 208 C130 122 220 224 330 150 S560 110 650 160 S880 225 1200 125 V250 H0Z" fill="url(#fire)" opacity=".20"><animate attributeName="d" dur="8s" repeatCount="indefinite" values="M0 208 C130 122 220 224 330 150 S560 110 650 160 S880 225 1200 125 V250 H0Z;M0 190 C150 150 225 198 350 135 S570 145 700 172 S920 192 1200 138 V250 H0Z;M0 208 C130 122 220 224 330 150 S560 110 650 160 S880 225 1200 125 V250 H0Z"/></path>
    <path d="M0 50 C155 128 265 20 390 84 S610 112 720 54 S970 20 1200 92" fill="none" stroke="url(#water)" stroke-width="16" opacity=".22" stroke-linecap="round" stroke-dasharray="90 22"><animate attributeName="stroke-dashoffset" values="0;-224" dur="7s" repeatCount="indefinite"/></path>
    <g opacity=".9" filter="url(#shadow)"><path d="${serratedBlade(218, 183, 555, 173, -1)}" fill="url(#steel)" transform="rotate(-8 386 180)"/><path d="${serratedBlade(646, 173, 983, 183, 1)}" fill="url(#steel)" transform="rotate(8 814 180)"/></g>
    <ellipse cx="566" cy="178" rx="19" ry="11" fill="url(#eye)"/><ellipse cx="634" cy="178" rx="19" ry="11" fill="url(#eye)"/><circle cx="566" cy="178" r="5" fill="${C.ink}"/><circle cx="634" cy="178" r="5" fill="${C.ink}"/>
    <text x="600" y="94" text-anchor="middle" fill="${C.navy}" font-family="Impact,Arial Black,Arial,sans-serif" font-size="65" font-weight="900" letter-spacing="10">INOSUKE</text>
    <text x="600" y="133" text-anchor="middle" fill="${C.orange}" font-family="Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="5">BEAST BREATHING · FULL STACK ENGINEERING</text>
    <text x="600" y="157" text-anchor="middle" fill="${C.navy2}" font-family="monospace" font-size="13" letter-spacing="2.6">WEB · ANDROID · iOS · SAAS · CLOUD · SECURITY · CI/CD</text>
  </svg>`;
}

function dividerSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="110" viewBox="0 0 1200 110">${defs()}
    <path d="M45 73 C210 32 330 95 486 56" fill="none" stroke="url(#fire)" stroke-width="9" stroke-linecap="round" opacity=".8" stroke-dasharray="68 22"><animate attributeName="stroke-dashoffset" values="0;-180" dur="4s" repeatCount="indefinite"/></path>
    <path d="M715 56 C870 95 990 32 1155 73" fill="none" stroke="url(#water)" stroke-width="9" stroke-linecap="round" opacity=".8" stroke-dasharray="68 22"><animate attributeName="stroke-dashoffset" values="0;180" dur="4s" repeatCount="indefinite"/></path>
    <path d="${serratedBlade(410, 60, 603, 60, -1)}" fill="url(#steel)" transform="rotate(18 510 60)" filter="url(#shadow)"/><path d="${serratedBlade(596, 60, 789, 60, 1)}" fill="url(#steel)" transform="rotate(-18 692 60)" filter="url(#shadow)"/>
    <circle cx="600" cy="60" r="24" fill="${C.paper}" stroke="${C.orange}" stroke-width="4"/><ellipse cx="591" cy="60" rx="7" ry="4" fill="url(#eye)"/><ellipse cx="609" cy="60" rx="7" ry="4" fill="url(#eye)"/><circle cx="591" cy="60" r="2" fill="${C.ink}"/><circle cx="609" cy="60" r="2" fill="${C.ink}"/>
  </svg>`;
}

function iconCard({ x, y, label, collection, icon, color, secondary, delay }) {
  return `<g filter="url(#shadow)"><path d="M${x+12} ${y} H${x+148} Q${x+168} ${y} ${x+168} ${y+20} V${y+138} Q${x+168} ${y+158} ${x+148} ${y+158} H${x+18} Q${x} ${y+158} ${x} ${y+138} V${y+28} Z" fill="${C.paper}" stroke="${color}" stroke-width="3"/><path d="M${x+4} ${y+26} C${x+55} ${y-8} ${x+98} ${y+18} ${x+164} ${y+3}" fill="none" stroke="${secondary}" stroke-width="10" opacity=".18"/><circle cx="${x+84}" cy="${y+65}" r="40" fill="${color}" opacity=".12" stroke="${color}" stroke-width="3"/><circle cx="${x+84}" cy="${y+65}" r="50" fill="none" stroke="${secondary}" stroke-width="2" stroke-dasharray="8 10"><animateTransform attributeName="transform" type="rotate" from="0 ${x+84} ${y+65}" to="360 ${x+84} ${y+65}" dur="${8+delay}s" repeatCount="indefinite"/></circle>${iconSvg(collection, icon, x+58, y+39, 52, color, { delay, duration: 3.2 + delay })}<text x="${x+84}" y="${y+129}" text-anchor="middle" fill="${C.navy}" font-family="Arial,sans-serif" font-size="16" font-weight="900">${label}</text></g>`;
}

function iconStripSvg() {
  const items = [
    ['TypeScript', mdi, 'language-typescript', C.blue, C.orange], ['React', mdi, 'react', C.blue2, C.navy],
    ['PostgreSQL', mdi, 'database', C.navy2, C.tan], ['Supabase', lucide, 'database-zap', C.green, C.orange],
    ['Android', mdi, 'android', C.green, C.blue], ['iOS', mdi, 'apple', C.navy, C.steel],
    ['Cloudflare', mdi, 'cloud', C.orange2, C.blue], ['GitHub Actions', mdi, 'github', C.ink, C.orange]
  ];
  const cards = items.map((it,i) => iconCard({ x: 32 + (i%4)*290, y: 35 + Math.floor(i/4)*190, label: it[0], collection: it[1], icon: it[2], color: it[3], secondary: it[4], delay: i*.15 })).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="430" viewBox="0 0 1200 430">${defs()}<rect width="1200" height="430" rx="28" fill="url(#paperGlow)"/><rect width="1200" height="430" rx="28" fill="url(#paperPattern)"/>${cards}</svg>`;
}

function techOrbitSvg() {
  const nodes = [
    [600,80,'language-typescript','TS',C.blue],[860,132,'react','React',C.blue2],[1030,245,'database','PostgreSQL',C.navy2],[900,355,'shield-lock','RLS',C.orange],
    [600,398,'cellphone','Android / iOS',C.green],[300,355,'cloud','Cloudflare',C.orange2],[170,245,'github','Actions',C.ink],[335,132,'layers-triple','SaaS',C.tan]
  ];
  const circles = nodes.map((n,i)=>`<g filter="url(#shadow)"><circle cx="${n[0]}" cy="${n[1]}" r="48" fill="${C.paper}" stroke="${n[4]}" stroke-width="4"/><circle cx="${n[0]}" cy="${n[1]}" r="58" fill="none" stroke="${i%2?C.blue:C.orange}" stroke-opacity=".24" stroke-width="2" stroke-dasharray="8 12"><animateTransform attributeName="transform" type="rotate" from="0 ${n[0]} ${n[1]}" to="${i%2?-360:360} ${n[0]} ${n[1]}" dur="${12+i}s" repeatCount="indefinite"/></circle>${iconSvg(mdi,n[2],n[0]-20,n[1]-20,40,n[4],{delay:i*.12})}<text x="${n[0]}" y="${n[1]+78}" text-anchor="middle" fill="${C.navy}" font-family="Arial,sans-serif" font-size="14" font-weight="800">${n[3]}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500">${defs()}<rect width="1200" height="500" rx="28" fill="url(#paperGlow)"/><rect width="1200" height="500" rx="28" fill="url(#paperPattern)"/><ellipse cx="600" cy="245" rx="430" ry="175" fill="none" stroke="url(#fire)" stroke-width="5" stroke-dasharray="24 18"><animate attributeName="stroke-dashoffset" values="0;-168" dur="8s" repeatCount="indefinite"/></ellipse><ellipse cx="600" cy="245" rx="345" ry="125" fill="none" stroke="url(#water)" stroke-width="4" stroke-dasharray="14 17"><animate attributeName="stroke-dashoffset" values="0;155" dur="7s" repeatCount="indefinite"/></ellipse><circle cx="600" cy="245" r="106" fill="${C.navy}" opacity=".96" filter="url(#shadow)"/><circle cx="600" cy="245" r="91" fill="none" stroke="${C.orange}" stroke-width="5" stroke-dasharray="22 11"><animateTransform attributeName="transform" type="rotate" from="0 600 245" to="360 600 245" dur="12s" repeatCount="indefinite"/></circle><ellipse cx="568" cy="226" rx="19" ry="12" fill="url(#eye)"/><ellipse cx="632" cy="226" rx="19" ry="12" fill="url(#eye)"/><circle cx="568" cy="226" r="5" fill="${C.ink}"/><circle cx="632" cy="226" r="5" fill="${C.ink}"/><text x="600" y="280" text-anchor="middle" fill="${C.paper}" font-family="Impact,Arial Black,sans-serif" font-size="31" letter-spacing="2">BEAST STACK</text><text x="600" y="307" text-anchor="middle" fill="${C.orange2}" font-family="monospace" font-size="13">MEU SALÃO ENGINE</text>${circles}</svg>`;
}

function metricSeal(x, y, label, value, sub, color, iconName, collection = lucide) {
  return `<g filter="url(#shadow)"><path d="M${x} ${y+18} Q${x} ${y} ${x+20} ${y} H${x+238} Q${x+260} ${y} ${x+260} ${y+22} V${y+178} Q${x+260} ${y+200} ${x+238} ${y+200} H${x+20} Q${x} ${y+200} ${x} ${y+178} V${y+28} Z" fill="${C.paper}" stroke="${color}" stroke-width="3"/><path d="M${x+6} ${y+28} C${x+65} ${y-12} ${x+150} ${y+22} ${x+252} ${y+2}" fill="none" stroke="${color}" stroke-width="11" opacity=".16"/><circle cx="${x+62}" cy="${y+78}" r="42" fill="${color}" opacity=".12"/><circle cx="${x+62}" cy="${y+78}" r="50" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="210 105" transform="rotate(-90 ${x+62} ${y+78})"><animate attributeName="stroke-dashoffset" values="315;0" dur="2.4s" fill="freeze"/></circle>${iconSvg(collection,iconName,x+39,y+55,46,color,{delay:.1})}<text x="${x+126}" y="${y+62}" fill="${C.navy2}" font-family="Arial,sans-serif" font-size="13" font-weight="800">${label}</text><text x="${x+126}" y="${y+105}" fill="${C.navy}" font-family="Impact,Arial Black,sans-serif" font-size="35" letter-spacing="1">${value}</text><text x="${x+22}" y="${y+166}" fill="${C.brown}" font-family="monospace" font-size="11">${sub}</text></g>`;
}

function dashboardSvg() {
  const totalLabel = `${fmt(trackedCommits)}${(!coreExact || !profileExact) ? '+' : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">${defs()}<rect width="1200" height="520" rx="30" fill="url(#paperGlow)"/><rect width="1200" height="520" rx="30" fill="url(#paperPattern)"/><path d="M0 0 H1200 V78 C1030 122 875 26 705 72 C540 116 366 26 190 79 C120 101 58 97 0 79Z" fill="url(#fire)" opacity=".92"/><path d="M0 40 C190 105 324 15 498 61 S850 104 1200 38" fill="none" stroke="${C.blue2}" stroke-width="11" opacity=".65" stroke-dasharray="55 22"><animate attributeName="stroke-dashoffset" values="0;-154" dur="6s" repeatCount="indefinite"/></path><text x="55" y="51" fill="${C.paper}" font-family="Impact,Arial Black,sans-serif" font-size="29" letter-spacing="1.5">BEAST ACTIVITY LEDGER</text><text x="55" y="73" fill="${C.ice}" font-family="monospace" font-size="11">PRIVATE PRODUCT CODE STAYS HIDDEN · ACTIVITY IS AGGREGATED</text>${metricSeal(55,115,'MEU SALÃO COMMITS',`${fmt(coreCommits)}${!coreExact?'+' : ''}`,'private product repository',C.orange,'flame')}${metricSeal(330,115,'PROFILE COMMITS',`${fmt(profileCommits)}${!profileExact?'+' : ''}`,'public profile repository',C.blue,'git-commit-horizontal')}${metricSeal(605,115,'TRACKED COMMITS',totalLabel,'minimum verified engineering activity',C.navy2,'swords')}${metricSeal(880,115,'VISIBLE CONTRIBUTIONS',fmt(publicContributionTotal),'GitHub public contribution calendar',C.green,'activity')}<g transform="translate(55 355)"><rect width="1090" height="115" rx="24" fill="${C.navy}" opacity=".97"/><path d="M0 83 C190 35 330 104 505 58 S785 40 1090 82" fill="none" stroke="url(#fire)" stroke-width="12" opacity=".8"/><path d="M0 63 C180 102 325 19 520 67 S845 98 1090 44" fill="none" stroke="url(#water)" stroke-width="8" opacity=".85" stroke-dasharray="31 16"><animate attributeName="stroke-dashoffset" values="0;-94" dur="5s" repeatCount="indefinite"/></path><text x="34" y="37" fill="${C.paper}" font-family="Arial,sans-serif" font-size="18" font-weight="900">MEU SALÃO</text><text x="34" y="62" fill="${C.tan}" font-family="monospace" font-size="12">Web · Android · iOS foundation · SaaS roadmap</text><text x="1028" y="62" text-anchor="end" fill="${C.green2}" font-family="Impact,Arial Black,sans-serif" font-size="35">${fmt(coreCommits)}+</text></g></svg>`;
}

function contributionCurrentSvg() {
  const values = [coreCommits, profileCommits];
  const p = pie().sort(null)(values);
  const ring = arc().innerRadius(118).outerRadius(190).cornerRadius(12);
  const arcs = p.map((d,i)=>`<path d="${ring(d)}" transform="translate(330 250)" fill="${i===0 ? C.orange : C.blue}" opacity=".92" stroke="${C.paper}" stroke-width="5"><animate attributeName="opacity" values=".78;1;.78" dur="${3.5+i}s" repeatCount="indefinite"/></path>`).join('');
  const share = trackedCommits ? (coreCommits/trackedCommits*100).toFixed(1) : '0.0';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500">${defs()}<rect width="1200" height="500" rx="30" fill="url(#paperGlow)"/><rect width="1200" height="500" rx="30" fill="url(#paperPattern)"/><text x="55" y="58" fill="${C.navy}" font-family="Impact,Arial Black,sans-serif" font-size="30" letter-spacing="1.5">ENGINEERING COMMIT DISTRIBUTION</text><text x="55" y="86" fill="${C.brown}" font-family="monospace" font-size="12">KNOWN ACTIVITY SPLIT · MEU SALÃO VS PROFILE ENGINEERING</text>${arcs}<circle cx="330" cy="250" r="90" fill="${C.navy}"/><ellipse cx="305" cy="228" rx="13" ry="8" fill="url(#eye)"/><ellipse cx="355" cy="228" rx="13" ry="8" fill="url(#eye)"/><text x="330" y="279" text-anchor="middle" fill="${C.paper}" font-family="Impact,Arial Black,sans-serif" font-size="36">${fmt(trackedCommits)}+</text><text x="330" y="303" text-anchor="middle" fill="${C.orange2}" font-family="monospace" font-size="11">TRACKED COMMITS</text><g transform="translate(590 145)"><rect width="520" height="220" rx="28" fill="${C.paper}" stroke="${C.steel}" stroke-width="2" filter="url(#shadow)"/><path d="M28 65 H470" stroke="${C.steel}" stroke-width="18" stroke-linecap="round"/><path d="M28 65 H${28+442*(coreCommits/Math.max(1,trackedCommits))}" stroke="url(#fire)" stroke-width="18" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0 500" to="500 0" dur="1.8s" fill="freeze"/></path><text x="28" y="42" fill="${C.navy}" font-family="Arial,sans-serif" font-size="16" font-weight="900">Meu Salão · ${fmt(coreCommits)}+</text><text x="470" y="42" text-anchor="end" fill="${C.orange}" font-family="Impact,sans-serif" font-size="18">${share}%</text><path d="M28 145 H470" stroke="${C.steel}" stroke-width="18" stroke-linecap="round"/><path d="M28 145 H${28+442*(profileCommits/Math.max(1,trackedCommits))}" stroke="url(#water)" stroke-width="18" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0 500" to="500 0" dur="1.8s" fill="freeze"/></path><text x="28" y="122" fill="${C.navy}" font-family="Arial,sans-serif" font-size="16" font-weight="900">Profile · ${fmt(profileCommits)}+</text><text x="28" y="195" fill="${C.brown}" font-family="monospace" font-size="11">Private code remains private; only activity totals are presented.</text></g><path d="M45 448 C210 392 360 478 520 420 S820 388 1155 452" fill="none" stroke="url(#water)" stroke-width="9" opacity=".55" stroke-dasharray="44 20"><animate attributeName="stroke-dashoffset" values="0;-128" dur="5s" repeatCount="indefinite"/></path></svg>`;
}

function heatColor(n, max) {
  if (!n) return C.paper2;
  const r = n/max;
  if (r < .25) return '#E8A05F';
  if (r < .5) return C.orange2;
  if (r < .75) return C.blue2;
  return C.navy2;
}
function heatmapSvg() {
  const max = Math.max(1, ...days.map(d => Number(d.contributionCount || 0)));
  const cell = 14, gap = 4, x0 = 104, y0 = 132;
  const origin = new Date(`${days[0]?.date || ymd(fromDate)}T00:00:00Z`);
  const cells = days.map((d,i)=>{ const dt = new Date(`${d.date}T00:00:00Z`); const week = Math.floor((dt-origin)/(7*86400000)); return `<rect x="${x0+week*(cell+gap)}" y="${y0+d.weekday*(cell+gap)}" width="${cell}" height="${cell}" rx="4" fill="${heatColor(d.contributionCount,max)}" stroke="${C.paper}" stroke-width="1"><animate attributeName="opacity" values=".72;1;.72" dur="${2.4+(i%9)*.12}s" begin="${(i%11)*.05}s" repeatCount="indefinite"/><title>${d.date}: ${d.contributionCount}</title></rect>`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360">${defs()}<rect width="1200" height="360" rx="30" fill="url(#paperGlow)"/><rect width="1200" height="360" rx="30" fill="url(#paperPattern)"/><path d="M0 0 H1200 V70 C1030 115 835 17 685 69 C525 120 300 25 0 83Z" fill="url(#water)" opacity=".92"/><text x="55" y="47" fill="${C.paper}" font-family="Impact,Arial Black,sans-serif" font-size="29">BREATHING CALENDAR</text><text x="55" y="68" fill="${C.ice}" font-family="monospace" font-size="11">PUBLIC GITHUB CALENDAR · PRIVATE MEU SALÃO VOLUME IS AGGREGATED ABOVE</text>${cells}<g transform="translate(104 286)"><text x="0" y="15" fill="${C.brown}" font-family="monospace" font-size="11">LOW</text><rect x="40" y="2" width="18" height="18" rx="4" fill="${C.paper2}"/><rect x="66" y="2" width="18" height="18" rx="4" fill="#E8A05F"/><rect x="92" y="2" width="18" height="18" rx="4" fill="${C.orange2}"/><rect x="118" y="2" width="18" height="18" rx="4" fill="${C.blue2}"/><rect x="144" y="2" width="18" height="18" rx="4" fill="${C.navy2}"/><text x="172" y="15" fill="${C.brown}" font-family="monospace" font-size="11">HIGH</text></g><text x="1095" y="302" text-anchor="end" fill="${C.navy}" font-family="Arial,sans-serif" font-size="15" font-weight="900">${activeDays} visible active days · longest streak ${streak.longest}d</text></svg>`;
}

const outputs = {
  'assets/inosuke/title.svg': titleSvg(), 'assets/inosuke/divider.svg': dividerSvg(),
  'assets/inosuke/icon-strip.svg': iconStripSvg(), 'assets/inosuke/tech-orbit.svg': techOrbitSvg(),
  'assets/stats/beast-dashboard.svg': dashboardSvg(), 'assets/stats/contribution-current.svg': contributionCurrentSvg(),
  'assets/stats/breathing-heatmap.svg': heatmapSvg()
};
for (const [file, content] of Object.entries(outputs)) await fs.writeFile(file, content, 'utf8');
console.log({ user: USER, coreCommits, profileCommits, trackedCommits, publicContributionTotal, activeDays, prs, reviews, issues, hasPrivateToken });
