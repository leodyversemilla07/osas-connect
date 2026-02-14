import { readdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const root = 'resources/js';
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reactExtensions = new Set(['.tsx', '.jsx']);
const violations = [];

function walk(dir, relativeParts = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      const nextParts = [...relativeParts, entry];
      if (!kebabCase.test(entry)) {
        violations.push(`DIR  ${join(root, ...nextParts)}`);
      }
      walk(fullPath, nextParts);
      continue;
    }

    const { name, ext } = parse(entry);
    if (!reactExtensions.has(ext)) {
      continue;
    }

    if (!kebabCase.test(name)) {
      violations.push(`FILE ${join(root, ...relativeParts, entry)}`);
    }
  }
}

walk(root);

if (violations.length > 0) {
  console.error('React files/directories must use kebab-case:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('React kebab-case naming check passed.');
