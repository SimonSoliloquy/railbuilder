// Copies the train engine from a Train of Thought checkout into src/engine/.
//
//   npm run sync-engine -- ../train-of-thought
//
// It starts from the engine modules Rail Builder imports and follows their relative imports, so
// only the files actually used come across. src/engine/ is replaced wholesale: never edit it
// here; change the file in Train of Thought and sync again.
import fs from 'node:fs';
import path from 'node:path';

const upstream = path.resolve(process.argv[2] || '../train-of-thought', 'src');
const target = path.resolve('src/engine');
const entries = ['config.js', 'hex.js', 'world/index.js', 'sim/index.js', 'render/index.js'];

if (!fs.existsSync(path.join(upstream, 'world/index.js'))) {
  console.error(`No Train of Thought source at ${upstream}`);
  process.exit(1);
}

const seen = new Set();
const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
function walk(file) {
  if (seen.has(file)) return;
  seen.add(file);
  for (const m of fs.readFileSync(file, 'utf8').matchAll(IMPORT)) {
    const spec = m[1] || m[2] || m[3];
    if (spec.startsWith('.')) walk(path.resolve(path.dirname(file), spec));
  }
}
for (const e of entries) walk(path.join(upstream, e));
walk(path.join(upstream, 'types.js')); // the shared contract, for reading

fs.rmSync(target, { recursive: true, force: true });
for (const file of [...seen].sort()) {
  const rel = path.relative(upstream, file);
  if (rel.startsWith('..')) throw new Error(`${rel} is outside the engine`);
  fs.mkdirSync(path.join(target, path.dirname(rel)), { recursive: true });
  fs.copyFileSync(file, path.join(target, rel));
}
console.log(`Copied ${seen.size} files from ${upstream} into src/engine/`);
