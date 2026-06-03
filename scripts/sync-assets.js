'use strict';

const fs = require('fs');
const path = require('path');

const DOC_DIR = path.resolve(__dirname, '../doc');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const MEDIA_EXTENSIONS = new Set(['.mov', '.webm', '.png']);

function getAllFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function shouldInclude(filePath) {
  const name = path.basename(filePath);
  if (name.endsWith('.webm.xmp')) return false;
  const ext = path.extname(name).toLowerCase();
  return MEDIA_EXTENSIONS.has(ext);
}

function stripTemplatePrefix(base) {
  if (base.startsWith('ANIM_')) return base.slice(5);
  if (base.startsWith('SANS_NOM_')) return base.slice(9);
  return base;
}

function getGroupKey(filePath) {
  const name = path.basename(filePath);
  const ext = path.extname(name);
  let base = name.slice(0, -ext.length);
  if (ext.toLowerCase() === '.png' && base.endsWith('0')) {
    base = base.slice(0, -1);
  }
  return stripTemplatePrefix(base);
}

function getDestName(filePath) {
  const name = path.basename(filePath);
  const ext = path.extname(name);
  const base = name.slice(0, -ext.length);
  if (ext.toLowerCase() === '.png' && base.endsWith('0')) {
    return base.slice(0, -1) + ext;
  }
  return name;
}

const allFiles = getAllFiles(DOC_DIR).filter(shouldInclude);

const groups = new Map();
for (const filePath of allFiles) {
  const key = getGroupKey(filePath);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(filePath);
}

let copied = 0;
for (const [groupKey, files] of groups) {
  const destDir = path.join(PUBLIC_DIR, groupKey);
  fs.mkdirSync(destDir, { recursive: true });
  for (const src of files) {
    const destName = getDestName(src);
    const dest = path.join(destDir, destName);
    fs.copyFileSync(src, dest);
    console.log(`  ${groupKey}/${destName}`);
    copied++;
  }
}

console.log(`\nDone: ${copied} files copied into ${groups.size} groups.`);
