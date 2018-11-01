import { AspectWindowProps } from './viewport.service';
import { UtilsService } from './utils.service';
import { TweenService } from './tween.service';

export class Tween {
    private _utils: UtilsService = UtilsService.instance();
    private _tweens: TweenService = TweenService.instance();
    private _object: PIXI.Sprite;
    private _targetValue: {
        x: number,
        y: number,
    };
    private _startValue: {
        x: number,
        y: number,
    };
    private _isActive = false;
    private _currentFrame: number;
    private _endFrame: number;
    private handleOnComplete: Function;
    private _onCompleteParams: {
        x: number,
        y: number,
    };
    private easing: Function;
    public constructor(
        object: PIXI.Sprite,
        to: {
            x: number,
            y: number,
        },
        frames: number
    ) {
        this._object = object;
        this._targetValue = to;
        this._isActive = true;
        this._currentFrame = 0;
        this._endFrame = frames;
        this.easing = this._utils.noEase;
        this._tweens.register(this);
    }

    public onComplete(fn: Function) {
        this.handleOnComplete = fn;
    }

    public update() {
        if (!this._isActive) {
            return false;
        }
        if (this._currentFrame == 0) {
            this.initIterations();
        }
        this._currentFrame++;
        if (this._currentFrame <= this._endFrame) {
            let newValues = {
                x: this.easing(this._currentFrame, this._startValue.x, this._targetValue.x, this._endFrame),
                y: this.easing(this._currentFrame, this._startValue.y, this._targetValue.y, this._endFrame),
            }
            this._object.position.x = newValues.x;
            this._object.position.y = newValues.y;
            return false;
        } else {
            this._isActive = false;
            if (this.handleOnComplete != null) {
                this.handleOnComplete();
            }
            return true;
        }
    }

    private initIterations() {
        this._startValue = {
            x: this._object.position.x,
            y: this._object.position.y
        };
        this._targetValue = {
            x: this._targetValue.x - this._object.x,
            y: this._targetValue.y - this._object.y,
        };
    }
}