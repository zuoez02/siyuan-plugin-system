import * as serverApi from '../worker/server-api';
import * as clientApi from '../worker/client-api';
import * as internal from '../internal';

export const apiGenerate = () => ({
    clientApi,
    serverApi,
    ...internal,
});