import { AspectWindowProps } from './viewport.service';
import { Tween } from './tween';
import { ScenesManager } from '../scenes/scene.manager';

export class TweenService {
    public static instance(): TweenService {
        if (TweenService._instance == null) {
            TweenService._instance = new TweenService();
        }
        return this._instance;
    }
    private static _instance: TweenService;

    protected constructor() { }

    private _sceneManager: ScenesManager = ScenesManager.instance();
    private _register = new Set<Tween>();

    public register(tween: Tween) {
        this._register.add(tween);
    }

    public update() {
        this._register.forEach((tween: Tween) => {
            if (tween.update()) {
                this._register.delete(tween);
            }
        });
    }

    public terminate() {
        this._register.forEach((tween: Tween) => {
            this._register.delete(tween);
        });
    }
}