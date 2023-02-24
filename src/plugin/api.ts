import * as serverApi from '../worker/server-api';
import * as clientApi from '../worker/client-api';

export const apiGenerate = () => ({
    clientApi,
    serverApi,
});