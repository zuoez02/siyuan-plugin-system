import * as serverApi from './api/server-api';
import * as clientApi from './api/client-api';
import { Menu } from './internal/classes/menu';
import { Dialog } from './internal/classes/dialog';
import { Plugin } from './api/plugin';

export { clientApi, serverApi, Menu, Dialog, Plugin };

export default {
    clientApi,
    serverApi,
    Plugin,
    Menu,
    Dialog,
};
