export interface IPlugin {
    onload(): void;
    onunload(): void;
}

export interface PluginConstructor {
    new(): IPlugin
}

export interface PluginManifest {
    key: string;
    name: string;
    script?: string;
    enabled?: boolean;
    hidden?: boolean;
    description?: string;
    plugin?: new (...args: any) => IPlugin;
}

export interface IStorageManager {
    get(key: string): any;
    set(key: string, val: any): Promise<void>;
    initStorage(): Promise<IStorageManager>;
    getPlugins(): PluginManifest[];
    getInternalPlugins(): PluginManifest[];
    getThirdPartyPlugins(): PluginManifest[];
    getPluginByKey(key: string): PluginManifest | undefined;
    setPluginEnabled(key: string, enabled: boolean): Promise<void>;
    savePluginsEnabled(): Promise<void>;
    setSafeModeEnabled(enabled: boolean): Promise<void>;
}

export interface ISystemManager {
    saveToLocal(p: string, content: string): Promise<void>;
    createFile(p: string): Promise<string>;
    localCacheInit(): Promise<void>
    delayAutoUpgrade(): void;
    tryUpgrade(): Promise<void>
    getOnlineVersion(): Promise<string>;
    upgrade(): Promise<void>;
}

export interface IPluginSystem {
    init(): Promise<IPluginSystem>;
    loadPlugin(key: string): Promise<void>;
    unloadPlugin(key: string): Promise<void>;
    turnOffSafeMode(): Promise<void>;
    turnOnSafeMode(): Promise<void>;
}

export interface IPluginLoader {
    loadEnabledPlugins(plugins: PluginManifest[]): Promise<void>;
    loadAllInternalPlugins(): Promise<void>;
    loadAllLocalPlugins(): Promise<void>;
    loadPlugin(plugin: PluginManifest): Promise<void>;
    unloadPlugin(key: string): Promise<void>;
    generateRequiredModules(): void;
    unloadThirdPartyPlugins(plugins: PluginManifest[]): Promise<void>;
    loadThirdPartyEnabledPlugins(plugins: PluginManifest[]): Promise<void>;
}

export interface IPluginFileManager {
    scanPlugins(pluginFolder: string): Promise<string[]>;
    getFileContent(f: string): Promise<string>;
    getManifest(f: string): Promise<any>;
    getScript(f: string): Promise<string>;
    getAllPlugins(): Promise<PluginManifest[]>;
}

export interface ISettingTab {
    key: string
    name: string;
    settings: ISetting[];
}

export interface ISetting<T extends ISettingType = any> {
    key: string;
    name: string;
    type: T;
    value: T extends 'boolean' ? boolean : T extends 'string' ? string : T extends 'array' ? Array<any> : T extends 'number' ? number : any;
}

export enum ISettingType {
    BOOLEAN = 'boolean',
    STRING = 'string',
    ARRAY = 'array',
    NUMBER = 'number',
}

export interface PluginEnableConfig {
    key: string;
    enabled: boolean;
}

export interface PluginConfig {
    PLUGIN_SYSTEM_SAFE_MODE_ENABLED: boolean;
    PLUGIN_SYSTEM_AUTO_UPDATE: boolean;
    PLUGIN_SYSTEM_PLUGIN: Array<PluginEnableConfig>;
    PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN: Array<PluginEnableConfig>;
}