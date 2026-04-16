const fs = require('fs');
const { generatedRoot } = require('./report-paths');

fs.rmSync(generatedRoot, { recursive: true, force: true });
console.log(`Cleaned report output: ${generatedRoot}`);
