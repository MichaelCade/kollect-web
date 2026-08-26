// Kollect download-stats page.
//
// Fetches release + per-asset download counts live from the GitHub API for the
// public kollect-web repo (where the private repo's binaries are synced) and
// renders summary cards, bar charts, and a per-release breakdown. No build step
// and no committed data file — the numbers are always current. Anonymous GitHub
// requests are rate-limited (60/hr per IP); the catch block explains that case.
const STATS_REPO = 'MichaelCade/kollect-web';

document.addEventListener('DOMContentLoaded', loadStats);

async function loadStats() {
    const content = document.getElementById('stats-content');
    try {
        const releases = await fetchAllReleases(STATS_REPO);
        render(releases.map(mapRelease));
    } catch (err) {
        content.innerHTML =
            '<div class="stats-error"><strong>Could not load download stats.</strong><br>' +
            esc(err.message) +
            '<br><br>The GitHub API limits anonymous requests to 60 per hour per IP — ' +
            'if you just refreshed a few times, wait a little and try again, or view the ' +
            '<a href="https://github.com/' + STATS_REPO + '/releases" target="_blank" rel="noopener">releases page</a> directly.</div>';
    }
}

// Page through the releases endpoint so every historical release is counted.
async function fetchAllReleases(repo) {
    const all = [];
    for (let page = 1; page <= 5; page++) {
        const resp = await fetch(
            'https://api.github.com/repos/' + repo + '/releases?per_page=100&page=' + page,
            { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!resp.ok) throw new Error('GitHub API returned ' + resp.status + ' ' + resp.statusText);
        const batch = await resp.json();
        all.push(...batch);
        if (batch.length < 100) break;
    }
    return all;
}

// GitHub release -> the {release, date, assets:[{name, downloads}]} shape used below.
function mapRelease(r) {
    return {
        release: r.tag_name || r.name || '',
        date: r.published_at || '',
        assets: (r.assets || []).map(a => ({ name: a.name, downloads: a.download_count || 0 }))
    };
}

// ---- helpers ----
const fmt = n => n.toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function releaseTotal(r) {
    return (r.assets || []).reduce((s, a) => s + (a.downloads || 0), 0);
}

// Sort tags like 0.1.2, 0.1.10 numerically, newest first.
function cmpVersionDesc(a, b) {
    const pa = String(a).split('.').map(n => parseInt(n, 10) || 0);
    const pb = String(b).split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
        const d = (pb[i] || 0) - (pa[i] || 0);
        if (d) return d;
    }
    return 0;
}

// "kollect-windows-amd64.exe" -> { os: "windows", arch: "amd64" }
function splitAsset(name) {
    const clean = String(name).replace(/^kollect-/, '').replace(/\.exe$/, '');
    const dash = clean.indexOf('-');
    return dash === -1 ? { os: clean, arch: '' } : { os: clean.slice(0, dash), arch: clean.slice(dash + 1) };
}

// ---- render ----
function render(releases) {
    const content = document.getElementById('stats-content');

    releases = releases.filter(r => r.release);
    if (!releases.length) {
        content.innerHTML = '<div class="stats-error">No releases found for <code>' + esc(STATS_REPO) + '</code>.</div>';
        return;
    }

    releases.sort((a, b) => cmpVersionDesc(a.release, b.release));

    const grandTotal = releases.reduce((s, r) => s + releaseTotal(r), 0);

    const byAsset = new Map();
    for (const r of releases)
        for (const a of (r.assets || []))
            byAsset.set(a.name, (byAsset.get(a.name) || 0) + (a.downloads || 0));
    const assetNames = [...byAsset.keys()].sort();

    const byOS = new Map();
    for (const [name, dl] of byAsset) {
        const os = name.includes('darwin') ? 'macOS'
            : name.includes('linux') ? 'Linux'
            : name.includes('windows') ? 'Windows' : 'Other';
        byOS.set(os, (byOS.get(os) || 0) + dl);
    }

    const topRelease = releases.reduce((best, r) => (releaseTotal(r) > releaseTotal(best) ? r : best), releases[0]);
    const latestDate = fmtDate(releases[0].date);

    let html = '<div class="stats-cards">';
    html += card('Total downloads', fmt(grandTotal));
    html += card('Releases tracked', fmt(releases.length));
    html += card('Latest release', esc(releases[0].release) + ' · ' + fmt(releaseTotal(releases[0])) + ' dl' +
        (latestDate ? '<span class="stat-sub">' + esc(latestDate) + '</span>' : ''), true);
    html += card('Most downloaded', esc(topRelease.release) + ' · ' + fmt(releaseTotal(topRelease)) + ' dl', true);
    html += '</div>';

    html += '<section class="stats-section"><h2>Downloads by platform</h2><div class="stats-panel">';
    html += barChart([...byOS.entries()].sort((a, b) => b[1] - a[1]));
    html += '</div></section>';

    html += '<section class="stats-section"><h2>Downloads by binary</h2><div class="stats-panel">';
    html += barChart(assetNames.map(n => [n.replace(/^kollect-/, ''), byAsset.get(n)]).sort((a, b) => b[1] - a[1]));
    html += '</div></section>';

    html += '<section class="stats-section"><h2>Downloads by release</h2><div class="stats-panel">';
    html += barChart(releases.map(r => [r.release, releaseTotal(r)]));
    html += '</div></section>';

    html += '<section class="stats-section"><h2>Per-release breakdown</h2><div class="stats-panel stats-table-scroll">';
    html += '<table class="stats-table"><thead><tr><th>Release</th><th>Date</th>';
    for (const n of assetNames) {
        const { os, arch } = splitAsset(n);
        html += '<th><span class="os">' + esc(os) + '</span>' + (arch ? '<span class="arch">' + esc(arch) + '</span>' : '') + '</th>';
    }
    html += '<th>Total</th></tr></thead><tbody>';
    for (const r of releases) {
        const lookup = new Map((r.assets || []).map(a => [a.name, a.downloads || 0]));
        html += '<tr><td>' + esc(r.release) + '</td><td>' + esc(fmtDate(r.date)) + '</td>';
        for (const n of assetNames) {
            const v = lookup.get(n) || 0;
            html += '<td class="' + (v ? '' : 'zero') + '">' + fmt(v) + '</td>';
        }
        html += '<td class="total">' + fmt(releaseTotal(r)) + '</td></tr>';
    }
    html += '</tbody></table></div>';
    html += '<p class="stats-note">Column headers omit the <code>kollect-</code> prefix. Counts come live from the GitHub Releases API.</p>';
    html += '</section>';

    content.innerHTML = html;
}

function card(label, value, small) {
    return '<div class="stat-card"><div class="stat-label">' + esc(label) + '</div>' +
        '<div class="stat-value' + (small ? ' small' : '') + '">' + value + '</div></div>';
}

function barChart(entries) {
    const max = Math.max(1, ...entries.map(e => e[1]));
    let h = '';
    for (const [name, val] of entries) {
        const pct = (val / max) * 100;
        h += '<div class="bar-row">' +
            '<div class="bar-name">' + esc(String(name)) + '</div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="bar-num">' + fmt(val) + '</div>' +
            '</div>';
    }
    return h;
}
