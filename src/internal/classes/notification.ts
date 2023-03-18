import { serverApi } from "@/api";
import { INoticationOption } from "@/types";

export class Notification {
    constructor(private option: INoticationOption) {
        
    }

    show() {
        if (this.option.type === 'error') {
            serverApi.pushErrMsg(null, this.option.message, this.option.timeout);
        } else {
            serverApi.pushMsg(null, this.option.message, this.option.timeout);
        }
    }
}