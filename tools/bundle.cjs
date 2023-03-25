const dts = require('dts-bundle');
const path = require('path');

dts.bundle({
    name: 'siyuan',
    main: path.resolve(__dirname, '..', 'temp/api.d.ts'),
    out: path.resolve(__dirname, '..', 'type/siyuan.d.ts'),
});
