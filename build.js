const vite = require('vite');
const fs = require('fs');

(async function() {
    await vite.build();
    const files = fs.readdirSync("dist/assets");
    const f = files[0];
    fs.renameSync("dist/assets/" + f, "dist/assets/main.js");
    fs.copyFileSync("dist/assets/main.js", "main.js");
})();


