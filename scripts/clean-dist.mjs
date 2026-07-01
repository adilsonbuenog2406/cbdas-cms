import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, '../dist');
const LOG_ENDPOINT =
  'http://127.0.0.1:7615/ingest/e1503208-6096-42e6-82f7-77583d7d4b9e';
const SESSION_ID = '254193';

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

function listDistSnapshot() {
  if (!existsSync(distDir)) {
    return { exists: false, entries: [] };
  }

  try {
    const stat = statSync(distDir);
    const entries = readdirSync(distDir, { withFileTypes: true }).map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
    }));

    return {
      exists: true,
      isDirectory: stat.isDirectory(),
      mode: stat.mode,
      entries,
      entryCount: entries.length,
    };
  } catch (error) {
    return {
      exists: true,
      readError: error instanceof Error ? error.message : String(error),
    };
  }
}

// #region agent log
debugLog('A', 'scripts/clean-dist.mjs:start', 'clean start', {
  distDir,
  snapshot: listDistSnapshot(),
  platform: process.platform,
  nodeVersion: process.version,
});
// #endregion

if (!existsSync(distDir)) {
  // #region agent log
  debugLog('E', 'scripts/clean-dist.mjs:skip', 'dist missing, nothing to clean', {
    distDir,
  });
  // #endregion
  process.exit(0);
}

const attempts = [
  { maxRetries: 5, retryDelay: 200 },
  { maxRetries: 10, retryDelay: 500 },
];

let lastError = null;

for (let i = 0; i < attempts.length; i += 1) {
  const options = { recursive: true, force: true, ...attempts[i] };

  // #region agent log
  debugLog('D', `scripts/clean-dist.mjs:attempt-${i + 1}`, 'rmSync attempt', {
    attempt: i + 1,
    options,
    snapshot: listDistSnapshot(),
  });
  // #endregion

  try {
    rmSync(distDir, options);

    // #region agent log
    debugLog('D', `scripts/clean-dist.mjs:attempt-${i + 1}:success`, 'rmSync succeeded', {
      attempt: i + 1,
      stillExists: existsSync(distDir),
    });
    // #endregion

    process.exit(0);
  } catch (error) {
    lastError = error;
    const err = error instanceof Error ? error : new Error(String(error));

    // #region agent log
    debugLog('B', `scripts/clean-dist.mjs:attempt-${i + 1}:error`, 'rmSync failed', {
      attempt: i + 1,
      code: 'code' in err ? err.code : undefined,
      errno: 'errno' in err ? err.errno : undefined,
      syscall: 'syscall' in err ? err.syscall : undefined,
      message: err.message,
      snapshot: listDistSnapshot(),
    });
    // #endregion
  }
}

// #region agent log
debugLog('C', 'scripts/clean-dist.mjs:failed', 'clean failed after retries', {
  distDir,
  lastError:
    lastError instanceof Error
      ? {
          code: 'code' in lastError ? lastError.code : undefined,
          errno: 'errno' in lastError ? lastError.errno : undefined,
          syscall: 'syscall' in lastError ? lastError.syscall : undefined,
          message: lastError.message,
        }
      : String(lastError),
  snapshot: listDistSnapshot(),
});
// #endregion

if (lastError instanceof Error) {
  console.error(lastError.message);
}

process.exit(1);
