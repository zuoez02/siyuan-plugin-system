const path = require('path');
const fs = require('fs');

const SNIPPET_CONF_PATH = '';

const content = fs.readFileSync(SNIPPET_CONF_PATH);

const snippets = JSON.parse(content);

for (const snippet of snippets) {
    if (snippet.name === 'pluginTest' && snippet.type === 'js') {
        snippet.enabled = true;
        snippet.content = fs.readFileSync(path.join(__dirname, '..', 'main.js'));
        break;
    }
}

fs.writeFileSync(SNIPPET_CONF_PATH, JSON.stringify(snippets, null, 2));