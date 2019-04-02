const compare = require('compare-versions');
const current = process.versions.node;

/**
 * Polyfill console.table if node is less than v10
 */
if (compare(current, '10.0.0') === -1) {
  console.table = null;
  require('konsole.table');
}

/**
 * Polyfill console.clear if node is less than v8.3
 */
if (compare(current, '8.3.0') === -1) {
  console.clear = require('clear');
}