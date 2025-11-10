const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'data.ts');
let src = fs.readFileSync(filePath, 'utf8');

const entriesStart = src.indexOf('entries: [');
if (entriesStart === -1) {
  console.error('Could not find entries block');
  process.exit(1);
}
// find the closing of the entries array by searching for '\n  ],\n  monthlyRecaps:' pattern
const entriesEndMarker = '\n  ],\n  monthlyRecaps:';
const entriesEndIndex = src.indexOf(entriesEndMarker, entriesStart);
if (entriesEndIndex === -1) {
  console.error('Could not find end of entries block');
  process.exit(1);
}
const entriesBlockStart = src.indexOf('[', entriesStart); // position of '['
const entriesBlockEnd = entriesEndIndex + 3; // position right before '],\n  monthlyRecaps:'
const before = src.slice(0, entriesBlockStart + 1);
const entriesContent = src.slice(entriesBlockStart + 1, entriesBlockEnd);
const after = src.slice(entriesBlockEnd);

let counter = 0;
const newEntriesContent = entriesContent.replace(/id:\s*"\d+"/g, () => `id: "${counter++}"`);

const out = before + newEntriesContent + after;
fs.writeFileSync(filePath, out, 'utf8');
console.log('Renumbered', counter, 'ids');
