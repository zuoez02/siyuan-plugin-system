import { IEventBus, Listener } from '@/types';
import { injectable } from 'inversify';

@injectable()
export class EventBus implements IEventBus {
    private eventListeners: { [key: string]: Listener[] };

    constructor() {
        this.eventListeners = {};
    }

    destroy() {
        delete this.eventListeners;
    }

    on(eventName: string, callback: Listener) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
        return () => this.off(eventName, callback);
    }

    off(eventName: string, callback?: Listener) {
        if (!callback) {
            delete this.eventListeners[eventName];
            return;
        }
        for (let i = 0; i < this.eventListeners[eventName].length; i++) {
            if (this.eventListeners[eventName][i] === callback) {
                this.eventListeners[eventName].splice(i, 1);
                return;
            }
        }
    }

    emit(eventName: string, ...args: any) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach((cb) => {
                cb(...args);
            });
        }
    }
}
