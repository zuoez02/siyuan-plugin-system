import { Container, interfaces } from "inversify";
import { StorageManager } from './plugin/storage-manager';
import { PluginSystem } from "./plugin";
import { TYPES } from "./config";
import { SystemManager } from "./plugin/system-manager";
import { PluginLoader } from "./plugin/loader";
import { PluginFileManager } from "./plugin/plugin-file-manager";

const container = new Container();
container.bind<StorageManager>(TYPES.StorageManager).to(StorageManager).inSingletonScope();
container.bind<interfaces.Provider<StorageManager>>(TYPES.StorageManagerProvider).toProvider<StorageManager>((context) => {
    return () => {
        return new Promise<StorageManager>((resolve) => {
            const storageManger = context.container.get<StorageManager>(TYPES.StorageManager);
            storageManger.initStorage().then(() => {
                resolve(storageManger);
            })
        })
    }
});
container.bind<SystemManager>(TYPES.PluginSystemLocalManager).to(SystemManager).inSingletonScope();
container.bind<PluginSystem>(TYPES.PluginSystem).to(PluginSystem).inSingletonScope();
container.bind<PluginLoader>(TYPES.PluginLoader).to(PluginLoader).inSingletonScope();
container.bind<PluginFileManager>(TYPES.PluginFileManager).to(PluginFileManager).inSingletonScope();


export { container };