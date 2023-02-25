const vite = require('vite');
const fs = require('fs');

(async function() {
    await vite.build();
    const files = fs.readdirSync("dist/assets");
    const f = files[0];
    fs.renameSync("dist/assets/" + f, "dist/assets/main.js");
    const content = fs.readFileSync("dist/assets/main.js").toString("utf-8");
    fs.writeFileSync("dist/assets/main.js", `(function(){${content}})()`);
    fs.copyFileSync("dist/assets/main.js", "main.js");
})();


