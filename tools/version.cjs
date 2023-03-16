const version = process.argv[2]
// replace in VERSION
const fs = require('fs');
const path = require('path');

fs.writeFileSync(path.join(__dirname, '..', 'VERSION'), version);
// replace in package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));

packageJson.version = version;

fs.writeFileSync(path.join(__dirname, '..', 'package.json'), JSON.stringify(packageJson, null, 2));