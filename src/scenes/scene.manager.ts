import * as PIXI from 'pixi.js';
import { Scene } from './scene';
import MainScene from './main.scene';
import CardsScene from './cards.scene';
import WordsScene from './words.scene';
import ParticlesScene from './particles.scene';
type AppState = 'MAIN' | 'CARDS' | 'WORDS' | 'PARTICLES'

export class ScenesManager {
    public static instance(app?: PIXI.Application): ScenesManager {
        if (ScenesManager._instance == null && app != null) {
            ScenesManager._instance = new ScenesManager(app);
        }
        return ScenesManager._instance;
    }
    private static _instance: ScenesManager;

    protected constructor(app: PIXI.Application) {
        this._app = app;
        this._renderer = this._app.renderer;
    }

    private _app: PIXI.Application;
    private _pixiContainer: HTMLDivElement;
    private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private _scenes = new Map<AppState, Scene>();
    private _state: AppState;

    public setScene(nextState: AppState) {
        if (!this._scenes.has(nextState)) {
            this._scenes.set(nextState, this.createScene(nextState));
        }
        if (this._state != null) {
            this._scenes.get(this._state).pause();
        }
        this._state = nextState;
        this._scenes.get(this._state).resume();
        this._app.stage = this._scenes.get(this._state);
        this._renderer.render(this._scenes.get(this._state));
    }

    public redraw() {
        if (this._state == null || !this._scenes.has(this._state)) {
            return;
        }
        this._scenes.get(this._state).redraw();
        this._renderer.render(this._scenes.get(this._state));
    }

    private createScene(name: AppState): Scene {
        switch (name) {
            case 'MAIN': {
                return new MainScene();
                break;
            };
            case 'CARDS': {
                return new CardsScene();
                break;
            }
            case 'WORDS': {
                return new WordsScene();
                break;
            }
            case 'PARTICLES': {
                return new ParticlesScene();
                break;
            }
        }
    }
}