/* SiYuanPluginSystem */
(function () {
    const path = require('path');
    const getCrossPlatformAppDataFolder = () => {
        let configFilePath;
        if (process.platform === "darwin") {
            configFilePath = path.join(
                process.env.HOME,
                "/Library/Application Support"
            );
        } else if (process.platform === "win32") {
            // Roaming包含在APPDATA中了
            configFilePath = process.env.APPDATA;
        } else if (process.platform === "linux") {
            configFilePath = process.env.HOME;
        }
        return configFilePath;
    };
    try {
        const data = require('fs').readFileSync(path.join(getCrossPlatformAppDataFolder(), '.siyuan', 'plugin.js'));
        const script = data.toString('utf8');
        console.log('local plugin system found, loading...');
        eval(script);

    } catch (e) {
        console.log('local plugin system not found, load online');
        return fetch('https://gitee.com/zuoez02/siyuan-plugin-system/raw/main/main.js', { cache: 'no-cache' }).then((res) => res.text()).then((sc) => {
            window.siyuanPluginScript = sc;
            eval(sc);
        });
    }
})();
