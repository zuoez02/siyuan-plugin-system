import * as serverApi from '../worker/server-api';

export const apiGenerate = () => ({
    addToolbarLeft: () => {
        console.log('add toolbar left');
    },
    addToolbarRight: () => {
        console.log('add toolbar right');
    },
    serverApi,
});