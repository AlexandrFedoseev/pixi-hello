import * as PIXI from 'pixi.js';
import * as cfg from './default.thm.json';

import Resources from './resources';

interface ResConfig {
    [key:string]: string[]
};

export class Loader {
    private _loadedGroups = new Set<string>();

    public static instance(): Loader {
        if (Loader._instance == null) {
            Loader._instance = new Loader();
        }
        return this._instance;
    }
    private static _instance: Loader;

    protected constructor() {
        this._resConfig = <ResConfig>cfg;
    }

    private _resConfig: ResConfig;
    private _resBindings = new Resources();

    public loadGroup(name: string, cb: () => void) {
        if (!this._resConfig.hasOwnProperty(name)) {
            return;
        }
        if (this._loadedGroups.has(name)) {
            cb();
            return;
        }
        this._loadedGroups.add(name);
        PIXI.loader
            .add(...this._resConfig[name]
                .filter(key => this._resBindings.storage.hasOwnProperty(key))
                .map(key => this._resBindings.storage[key]))
            .load(cb);
    };

    public getTextureByName(name: string): PIXI.Texture {
        if (!this._resBindings.storage.hasOwnProperty(name)) {
            return null;
        }
        if (!PIXI.loader.resources.hasOwnProperty(this._resBindings.storage[name])) {
            return null;
        }
        return PIXI.loader.resources[this._resBindings.storage[name]].texture;
    }
}