export abstract class BaseComponent {
    app: any;
    el: HTMLElement;

    onload: () => Promise<any>;

    onunload: () => Promise<any>;
}

export class ButtonComponent extends BaseComponent {
    constructor() {
        super();
    }
}