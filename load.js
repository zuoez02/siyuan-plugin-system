/* SiYuanPluginSystem */
(function () {
    const path = require('path');
    try {
        const data = require('fs').readFileSync(path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, '.siyuan', 'plugin.js'));
        const script = data.toString('utf8');
        console.log('local plugin system found, loading...');
        eval(script);

    } catch (e) {
        console.log('local plugin system not found, load online');
        return fetch('https://gitee.com/zuoez02/siyuan-plugin-system/raw/main/main.js', { cache: 'no-cache'}).then((res) => res.text()).then((sc) => {
            window.siyuanPluginScript = sc;
            eval(sc);
        });
    }
})();
