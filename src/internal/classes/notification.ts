import * as serverApi from '../../api/server-api';
import { INoticationOption, INotification } from '../../types';

export class Notification implements INotification {
    constructor(private option: INoticationOption) {}

    show() {
        if (this.option.type === 'error') {
            serverApi.pushErrMsg(null, this.option.message, this.option.timeout);
        } else {
            serverApi.pushMsg(null, this.option.message, this.option.timeout);
        }
    }
}
