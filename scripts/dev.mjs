import { execSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOG_ENDPOINT =
  'http://127.0.0.1:7615/ingest/e1503208-6096-42e6-82f7-77583d7d4b9e';
const SESSION_ID = '92786d';
const PORT = 5173;
const HOST = '127.0.0.1';
const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const viteBin = resolve(projectRoot, 'node_modules/.bin/vite');

// #region agent log
function debugLog(hypothesisId, location, message, data = {}, runId = 'pre-fix') {
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

function isPortInUse(port, host = HOST) {
  return new Promise((resolvePort) => {
    const server = createServer();
    server.once('error', () => resolvePort(true));
    server.once('listening', () => {
      server.close(() => resolvePort(false));
    });
    server.listen(port, host);
  });
}

function getPidsOnPort(port) {
  try {
    const output = execSync(`lsof -iTCP:${port} -sTCP:LISTEN -t`, {
      encoding: 'utf8',
    }).trim();
    return output ? output.split('\n').map((value) => Number(value)) : [];
  } catch {
    return [];
  }
}

function getProcessCommand(pid) {
  try {
    return execSync(`ps -p ${pid} -o command=`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function isStaleProjectVite(pid) {
  const command = getProcessCommand(pid);
  return command.includes('vite') && command.includes(projectRoot);
}

async function freePortIfStale() {
  const portBusy = await isPortInUse(PORT);

  // #region agent log
  debugLog('A', 'dev.mjs:port-check', 'initial port check', { port: PORT, portBusy });
  // #endregion

  if (!portBusy) {
    return true;
  }

  const pids = getPidsOnPort(PORT);

  // #region agent log
  debugLog('B', 'dev.mjs:port-occupants', 'processes listening on port', {
    port: PORT,
    pids,
  });
  // #endregion

  let clearedStale = false;

  for (const pid of pids) {
    const command = getProcessCommand(pid);
    const staleVite = isStaleProjectVite(pid);

    // #region agent log
    debugLog('C', 'dev.mjs:occupant', 'port occupant details', {
      pid,
      staleVite,
      command,
    });
    // #endregion

    if (staleVite) {
      try {
        process.kill(pid, 'SIGTERM');
        clearedStale = true;

        // #region agent log
        debugLog('A', 'dev.mjs:kill-stale', 'terminated stale vite process', { pid });
        // #endregion
      } catch (error) {
        // #region agent log
        debugLog('D', 'dev.mjs:kill-failed', 'failed to terminate stale vite', {
          pid,
          error: String(error),
        });
        // #endregion
      }
      continue;
    }

    console.error(`Erro: a porta ${PORT} já está em uso por outro processo (PID ${pid}).`);
    console.error(command);
    console.error('Encerre esse processo e tente novamente.');
    return false;
  }

  if (clearedStale) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      if (!(await isPortInUse(PORT))) {
        // #region agent log
        debugLog('A', 'dev.mjs:port-freed', 'port available after cleanup', {
          port: PORT,
          attempt,
        });
        // #endregion
        return true;
      }
      await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    }
  }

  const stillBusy = await isPortInUse(PORT);

  // #region agent log
  debugLog('D', 'dev.mjs:port-still-busy', 'port still unavailable', {
    port: PORT,
    stillBusy,
    clearedStale,
  });
  // #endregion

  return !stillBusy;
}

async function main() {
  const portReady = await freePortIfStale();
  if (!portReady) {
    process.exit(1);
  }

  // #region agent log
  debugLog('E', 'dev.mjs:spawn-vite', 'starting vite dev server', {
    port: PORT,
    host: HOST,
  });
  // #endregion

  const vite = spawn(viteBin, ['--port', String(PORT), '--host', HOST, '--strictPort'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  vite.on('exit', (code, signal) => {
    // #region agent log
    debugLog('E', 'dev.mjs:vite-exit', 'vite process ended', { code, signal });
    // #endregion
    process.exit(code ?? (signal ? 1 : 0));
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
