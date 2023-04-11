import * as serverApi from './api/server-api';
import * as clientApi from './api/client-api';
import { Menu, MenuItem, MenuSeparator } from './internal/classes/menu';
import { Dialog } from './internal/classes/dialog';
import { Notification } from './internal/classes/notification';
import { Plugin } from './api/plugin';

export { clientApi, serverApi, Menu, MenuItem, MenuSeparator, Notification, Dialog, Plugin };

export default {
    clientApi,
    serverApi,
    Plugin,
    Menu,
    MenuItem,
    MenuSeparator,
    Notification,
    Dialog,
};
