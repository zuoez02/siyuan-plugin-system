import * as serverApi from '../api/server-api';
import * as clientApi from '../api/client-api';
import * as internal from '../internal';

export const apiGenerate = () => ({
    clientApi,
    serverApi,
    ...internal,
});