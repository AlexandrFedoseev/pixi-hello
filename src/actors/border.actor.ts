import * as PIXI from 'pixi.js';
import { UtilsService } from '../services/utils.service';

export class BorderActor extends PIXI.Graphics {
    private _utils: UtilsService = UtilsService.instance();

    public redraw() {
        let aspect = this._utils.getAspectScreen();
        this.clear();
        this.lineStyle(1, 0xccb7ae);
        this.drawRect(0, 0, aspect.width, aspect.height);
    }
}