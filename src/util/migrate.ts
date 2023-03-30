export const migrate = async () => {
    const SNIPPET_NAME = 'plugin-system-bazzar';
    const content = `(async () => {
        window.pluginSystemSource = 'bazzar';
        const response = await fetch('/api/file/getFile', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({ path: '/data/widgets/插件系统/plugin.js' }),
        });
        const js = await response.text();
        eval(js);
    })()`;

    const request = async (url, body) => {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body),
        });
        return response.json();
    };

    const res = await request('/api/snippet/getSnippet', { enabled: 2, type: 'all' });

    const snippets = res.data.snippets;

    for (const snippet of snippets) {
        if (snippet.type !== 'js') {
            continue;
        }
        if (snippet.content.indexOf('https://gitee.com/zuoez02/siyuan-plugin-system/raw/main/main.js') !== -1) {
            snippet.enabled = false;
        }
        if (snippet.name === SNIPPET_NAME) {
            snippet.enabled = true;
            snippet.content = content;
            await request('/api/snippet/setSnippet', { snippets });
            return;
        }
    }

    snippets.splice(0, 0, {
        id: '20230324100959-plugind',
        name: SNIPPET_NAME,
        type: 'js',
        enabled: true,
        content,
    });
    await request('/api/snippet/setSnippet', { snippets });
    setTimeout(() => window.parent.location.reload(), 1000);
};
