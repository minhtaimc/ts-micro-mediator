import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const distIndex = join(projectRoot, 'dist', 'index.js');
let buildPromise = null;

export async function ensureBuild() {
  const [distExists, distMtime, srcMtime] = await Promise.all([
    fileExists(distIndex),
    getMTime(distIndex),
    getLatestSourceMTime(join(projectRoot, 'src'))
  ]);

  if (distExists && distMtime >= srcMtime) {
    return;
  }

  if (!buildPromise) {
    buildPromise = runBuild().finally(() => {
      buildPromise = null;
    });
  }

  await buildPromise;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getMTime(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtimeMs;
  } catch {
    return 0;
  }
}

async function getLatestSourceMTime(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const mtimes = await Promise.all(entries.map(async entry => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return getLatestSourceMTime(fullPath);
    }
    return getMTime(fullPath);
  }));
  return mtimes.reduce((latest, time) => Math.max(latest, time), 0);
}

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm run build exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}
