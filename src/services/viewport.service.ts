import { UtilsService } from './utils.service';

interface WindowProps {
    width: number;
    height: number;
    ratio: number;
}
export interface AspectWindowProps {
    width: number;
    height: number;
    x: number;
    y: number;
    ratio: number;
}

export class ViewportService {
    private readonly APP_CONTENT_HEIGHT = 1472;
    private readonly APP_CONTENT_WIDTH = 828;
    private readonly APP_ASPECT_RATIO = this.APP_CONTENT_WIDTH / this.APP_CONTENT_HEIGHT;

    private _window: WindowProps;
    private _aspectScreen: AspectWindowProps = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        ratio: 0
    };
    private _utils = UtilsService.instance();

    public updateAspect() {
        this._window = this.getWindowProps();

        if (this._window.ratio < this.APP_ASPECT_RATIO) {
            this._aspectScreen.width = this._window.width;
            this._aspectScreen.height = this._window.width / this.APP_ASPECT_RATIO;
            this._aspectScreen.x = 0;
            this._aspectScreen.y = (this._window.height - this._aspectScreen.height) / 2;
            this._aspectScreen.ratio = this._aspectScreen.width / this._aspectScreen.height;
            this._utils.setAspectRatio(this._aspectScreen.width / this.APP_CONTENT_WIDTH);
            return;
        }
        this._aspectScreen.width = this._window.height * this.APP_ASPECT_RATIO;
        this._aspectScreen.height = this._window.height;
        this._aspectScreen.x = (this._window.width - this._aspectScreen.width) / 2;
        this._aspectScreen.y = 0;
        this._aspectScreen.ratio = this._aspectScreen.width / this._aspectScreen.height;
        this._utils.setAspectRatio(this._aspectScreen.height / this.APP_CONTENT_HEIGHT);
        this._utils.setAspectScreen(this._aspectScreen);
    }

    private getWindowProps(): WindowProps {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        };
    }
}