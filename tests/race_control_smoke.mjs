import http from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const projectRoot = resolve(__dirname, '..');
console.log('[server] root', projectRoot);

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

function createServer() {
  return new Promise(done => {
    const server = http.createServer(async (req, res) => {
      let filePath;
      let pathname;
      try {
        const url = new URL(req.url, 'http://localhost');
        pathname = url.pathname === '/' ? '/index.html' : url.pathname;
        filePath = resolve(projectRoot, `.${pathname}`);
        const data = await readFile(filePath);
        const mime = MIME_MAP[extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      } catch (error) {
        console.warn('[server] 404', req.url, '->', pathname, filePath, error?.message);
        console.warn(error);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      done({ server, port: address.port });
    });
  });
}

async function run() {
  const { server, port } = await createServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseUrl = `http://127.0.0.1:${port}/index.html`;
  page.on('console', msg => console.log(`[browser] ${msg.text()}`));
  page.on('pageerror', error => console.log(`[browser-error] ${error.message}`));
  page.on('requestfailed', request => console.log(`[request-failed] ${request.url()} ${request.failure()?.errorText}`));
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof window.spacerxDiagnostics === 'object');
    await page.evaluate(() => window.spacerxDiagnostics?.reset?.());
    await page.evaluate(() => window.spacerxDiagnostics?.goToRaceScreen?.());
    await page.waitForSelector('#raceScreen.active');

    const started = await page.evaluate(() => window.spacerxDiagnostics?.fastStartQuickRace?.());
    if (!started) {
      throw new Error('Failed to fast-start race via diagnostics');
    }

    await page.waitForFunction(() => {
      const state = window.spacerxDiagnostics?.getControlState?.();
      return state?.pause && state.pause.disabled === false;
    }, { timeout: 5000 });

    const phases = await page.evaluate(async () => {
      const expected = ['GREEN', 'YELLOW', 'SAFETY', 'RESTART', 'GREEN'];
      await window.spacerxDiagnostics.runPhaseSequence(expected.slice(1));
      return window.spacerxDiagnostics.getPhaseTimeline().map(entry => entry.phase);
    });

    const sequenceOk = (() => {
      const expected = ['GREEN', 'YELLOW', 'SAFETY', 'RESTART', 'GREEN'];
      let searchIndex = 0;
      return expected.every(phase => {
        const idx = phases.indexOf(phase, searchIndex);
        if (idx === -1) return false;
        searchIndex = idx + 1;
        return true;
      });
    })();

    if (!sequenceOk) {
      throw new Error(`Unexpected phase timeline: ${phases.join(' → ')}`);
    }

    await page.evaluate(() => window.spacerxDiagnostics?.finishRaceNow?.());

    await page.waitForFunction(() => {
      const state = window.spacerxDiagnostics?.getControlState?.();
      return state?.start && state.start.disabled === false;
    }, { timeout: 5000 });

    const controlState = await page.evaluate(() => window.spacerxDiagnostics.getControlState());
    if (controlState.start?.disabled) {
      throw new Error('Start button should be re-enabled after diagnostics finish.');
    }

    console.log('Race-control smoke passed:', phases.join(' → '));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
