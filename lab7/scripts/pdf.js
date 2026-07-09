// Renders report/report.html -> report/lab7-report.pdf using a headless
// Chromium browser (Edge or Chrome). Zero npm dependencies.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = path.join(ROOT, 'report', 'report.html');
const pdf = path.join(ROOT, 'report', 'lab7-report.pdf');

if (!fs.existsSync(html)) { console.error('Run "node scripts/report.js" first (report/report.html missing).'); process.exit(1); }

function findBrowser() {
  const env = process.env;
  const candidates = [
    env.BROWSER,
    `${env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${env.ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
    `${env['ProgramFiles(x86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].filter(Boolean);
  for (const c of candidates) { try { if (fs.existsSync(c)) return c; } catch {} }
  // search EdgeCore / EdgeWebView (Windows ships these even without full Edge)
  for (const base of [env['ProgramFiles(x86)'], env.ProgramFiles].filter(Boolean)) {
    for (const sub of ['Microsoft\\EdgeCore', 'Microsoft\\EdgeWebView\\Application']) {
      const dir = path.join(base, sub);
      try {
        const stack = [dir];
        while (stack.length) {
          const d = stack.pop();
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, e.name);
            if (e.isDirectory()) stack.push(full);
            else if (e.name === 'msedge.exe') return full;
          }
        }
      } catch {}
    }
  }
  return null;
}

const browser = findBrowser();
if (!browser) { console.error('No Chromium browser found. Set BROWSER=<path to chrome/msedge>.'); process.exit(1); }

const fileUrl = 'file:///' + html.replace(/\\/g, '/');
console.log('browser:', browser);
execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  `--print-to-pdf=${pdf}`, fileUrl,
], { stdio: 'ignore' });
console.log('wrote', path.relative(ROOT, pdf), '(' + (fs.statSync(pdf).size / 1024).toFixed(0) + ' KB)');
