import { AspectWindowProps } from './viewport.service';

export class UtilsService {
    public static instance(): UtilsService {
        if (UtilsService._instance == null) {
            UtilsService._instance = new UtilsService();
        }
        return this._instance;
    }
    private static _instance: UtilsService;

    protected constructor() { }

    private _aspect = 1;
    private _aspectScreen: AspectWindowProps;

    public setAspectRatio(rate: number) {
        this._aspect = rate;
    }

    public setAspectScreen(screen: AspectWindowProps) {
        this._aspectScreen = screen;
    }

    public getAspectScreen(): AspectWindowProps {
        return this._aspectScreen;
    }

    public toAspectSize(size: number): number {
        return size * this._aspect;
    }

    public getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    public noEase(t: number, b: number, c: number, d: number): number {
        t /= d;
        return b + c * (t);
    }
}