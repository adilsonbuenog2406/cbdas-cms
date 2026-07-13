import { appendFileSync } from 'fs';
import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOG_PATH = resolve(projectRoot, '.cursor/debug-3ee1c4.log');
const DEBUG_ENDPOINT = 'http://127.0.0.1:7518/ingest/60af46bd-a9d9-461f-8498-d4bf9d98495d';
const DEBUG_SESSION = '3ee1c4';

function writeLog(payload) {
  const line = `${JSON.stringify(payload)}\n`;
  appendFileSync(LOG_PATH, line);
  fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': DEBUG_SESSION },
    body: line.trimEnd(),
  }).catch(() => {});
}

const startedAt = Date.now();
writeLog({
  sessionId: DEBUG_SESSION,
  location: 'scripts/measure-install.mjs:start',
  message: 'npm install started',
  data: { startedAt },
  hypothesisId: 'H1',
  timestamp: startedAt,
  runId: process.env.DEBUG_RUN_ID ?? 'verify',
});

const child = spawn('npm', ['install', '--no-fund', '--no-audit'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
});

child.on('close', (code) => {
  const finishedAt = Date.now();
  writeLog({
    sessionId: DEBUG_SESSION,
    location: 'scripts/measure-install.mjs:finish',
    message: 'npm install finished',
    data: { code, elapsedMs: finishedAt - startedAt },
    hypothesisId: 'H1',
    timestamp: finishedAt,
    runId: process.env.DEBUG_RUN_ID ?? 'verify',
  });
  process.exit(code ?? 1);
});
