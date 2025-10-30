import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.json': 'application/json; charset=UTF-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function createStaticServer(rootDir) {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://localhost');
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (!pathname || pathname === '/') {
        pathname = '/index.html';
      }
      const safePath = pathname.replace(/^\/+/, '');
      let filePath = resolve(rootDir, safePath);
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      let fileStat;
      try {
        fileStat = await stat(filePath);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`Static 404: ${pathname}`);
          res.writeHead(404).end('Not found');
          return;
        }
        throw error;
      }
      if (fileStat.isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
      const data = await readFile(filePath);
      const contentType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    } catch (error) {
      console.error('Static server error:', error);
      res.writeHead(500).end('Internal Server Error');
    }
  });

  await new Promise((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(0, '127.0.0.1', () => resolvePromise());
  });
  const address = server.address();
  if (!address || typeof address.port !== 'number') {
    throw new Error('Failed to start static server');
  }
  return { server, port: address.port };
}

async function closeServer(server) {
  await new Promise(resolvePromise => server.close(resolvePromise));
}

async function waitForControlState(page, description, predicate, timeout = 20000, ...args) {
  try {
    await page.waitForFunction(predicate, { timeout }, ...args);
  } catch (error) {
    const lastState = await page.evaluate(() => window.spacerxDiagnostics?.getControlState?.());
    throw new Error(
      `Timeout while waiting for ${description}. Last control state: ${JSON.stringify(lastState, null, 2)}\n${error.message}`
    );
  }
}

async function getControlState(page) {
  const state = await page.evaluate(() => window.spacerxDiagnostics?.getControlState?.());
  if (!state) {
    throw new Error('spacerxDiagnostics.getControlState() is unavailable');
  }
  return state;
}

async function dismissPodiumIfVisible(page) {
  const podiumVisible = await page.evaluate(() => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.overlays?.podium === true;
  });
  if (podiumVisible) {
    const button = await page.$('#podiumCloseBtn');
    if (button) {
      await button.click();
      await page.waitForTimeout(200);
    }
  }
}

async function runQuickRace(page) {
  console.log('▶ Running quick race…');
  await waitForControlState(page, 'main menu', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'mainMenu';
  });

  const initialState = await getControlState(page);
  assert(initialState.buttons?.newRace?.enabled, 'Expected "Schnelles Rennen" to be enabled on load');

  await page.click('#newRaceBtn');
  await waitForControlState(page, 'race screen', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'raceScreen';
  });

  const raceScreenState = await getControlState(page);
  assert(raceScreenState.buttons?.startRace?.enabled, 'Start button should be active after entering race screen');

  await page.click('#startRaceBtn');

  await waitForControlState(page, 'race to arm', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.race?.countdown === true || diagnostics?.race?.active === true;
  }, 10000);

  await waitForControlState(page, 'green flag', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.race?.active === true && diagnostics?.race?.phase !== 'COUNTDOWN';
  }, 20000);

  await waitForControlState(page, 'race finish', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.race?.finished === true;
  }, 120000);

  await dismissPodiumIfVisible(page);

  const finalState = await getControlState(page);
  assert(finalState.buttons?.startRace?.enabled, 'Start button should re-enable after race completion');
  console.log('✔ Quick race completed');
}

async function runGrandPrixRound(page) {
  console.log('▶ Running first GP round…');
  await page.click('#backToMenuFromRace');
  await waitForControlState(page, 'return to main menu', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'mainMenu';
  });

  await page.click('#grandPrixBtn');
  await waitForControlState(page, 'GP race screen', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'raceScreen';
  });

  await page.click('#startRaceBtn');

  await waitForControlState(page, 'GP race active', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.race?.active === true;
  }, 20000);

  await waitForControlState(page, 'GP race finish', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.race?.finished === true;
  }, 130000);

  await dismissPodiumIfVisible(page);

  const gpState = await getControlState(page);
  assert(gpState.gp?.raceIndex === 1, 'Grand Prix should advance to race index 1 after first event');
  assert(gpState.buttons?.nextRace?.visible, 'Next race button should be visible after finishing first GP event');
  assert(/Rennen\s*2/.test(gpState.buttons?.startRace?.text || ''), 'Start button should show "Rennen 2 starten"');
  console.log('✔ GP round advanced');
}

async function runManagerWeek(page) {
  console.log('▶ Simulating manager week…');
  await page.click('#backToMenuFromRace');
  await waitForControlState(page, 'return to main menu from GP', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'mainMenu';
  });

  const menuState = await getControlState(page);
  assert(menuState.buttons?.resumeGrandPrix?.enabled, 'Resume GP button should be enabled after completing first race');

  await page.click('#managerBtn');
  await waitForControlState(page, 'manager screen', () => {
    const diagnostics = window.spacerxDiagnostics?.getControlState?.();
    return diagnostics?.screen === 'managerScreen';
  });

  const managerState = await getControlState(page);
  const currentWeek = managerState.manager?.week;
  assert(Number.isInteger(currentWeek), 'Manager week should be an integer value');

  await page.click('#advanceManagerWeekBtn');
  await waitForControlState(
    page,
    'manager week increment',
    expectedWeek => {
      const diagnostics = window.spacerxDiagnostics?.getControlState?.();
      return diagnostics?.manager?.week === expectedWeek;
    },
    20000,
    currentWeek + 1
  );

  const updatedManagerState = await getControlState(page);
  assert(
    updatedManagerState.manager?.week === currentWeek + 1,
    'Manager week counter should increment after simulating a week'
  );
  console.log('✔ Manager week simulated');
}

async function main() {
  const { server, port } = await createStaticServer(ROOT_DIR);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  page.setDefaultNavigationTimeout(45000);
  page.on('console', message => {
    console.log(`[browser:${message.type()}] ${message.text()}`);
  });
  page.on('pageerror', error => {
    console.error('Browser error:', error && error.stack ? error.stack : error);
  });
  page.on('dialog', dialog => dialog.accept());

  try {
    const targetUrl = `http://127.0.0.1:${port}/index.html`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle0' });

    const scriptProbe = await page.evaluate(async () => {
      const response = await fetch('script.js');
      const body = await response.text();
      return { ok: response.ok, status: response.status, length: body.length, tail: body.slice(-32) };
    });
    console.log('script.js probe', scriptProbe);

    await waitForControlState(page, 'diagnostics bootstrap', () => {
      return Boolean(window.spacerxDiagnostics?.getControlState);
    });

    await page.select('#lapsSetting', '10').catch(() => {});
    await page.evaluate(() => {
      const toggle = document.getElementById('toggleBroadcastIntro');
      if (toggle && !toggle.checked) {
        toggle.click();
      }
    });

    await runQuickRace(page);
    await runGrandPrixRound(page);
    await runManagerWeek(page);

    console.log('✅ Spacer-X smoke test completed successfully.');
  } finally {
    await browser.close();
    await closeServer(server);
  }
}

main().catch(error => {
  console.error('Smoke test failed:', error);
  process.exitCode = 1;
});
