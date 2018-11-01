import * as PIXI from 'pixi.js';
import { UtilsService } from '../services/utils.service';

export class ButtonActor extends PIXI.Container {
    private _background: PIXI.Graphics;
    private _label: PIXI.Text;

    private _width: number;
    private _height: number;

    private _isDown = false;
    private _isOver = false;

    private _utils: UtilsService = UtilsService.instance();

    private handleButtonPressed: () => void;

    constructor(width: number, height: number, label: string) {
        super();
        this._width = width;
        this._height = height;
        this.initialize();
        this.create(label);
        this.redraw();
    }

    public onButtonPressed(fn: () => void) {
        this.handleButtonPressed = fn;
    }

    private initialize() {
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', this.onButtonDown);
        this.on('pointerup', this.onButtonUp);
        this.on('pointerupoutside', this.onButtonUp);
        this.on('pointerover', this.onButtonOver);
        this.on('pointerout', this.onButtonOut);
    }

    private create(label: string) {
        this._background = new PIXI.Graphics();
        this.addChild(this._background);
        this._label = new PIXI.Text();
        this._label.text = label;
        this.addChild(this._label);
    }

    public redraw() {
        this._background.clear();
        let buttonColor = 0x565254;
        if (this._isDown) {
            buttonColor = 0xa6808c;
        } else if (this._isOver) {
            buttonColor = 0x776677;
        }
        this._background.beginFill(buttonColor);
        this._background.drawRoundedRect(0,0, this._utils.toAspectSize(this._width),
            this._utils.toAspectSize(this._height), this._utils.toAspectSize(34));
        this._background.endFill();
        this._label.style = new PIXI.TextStyle({
            fill: 0xccb7ae,
            fontSize: this._utils.toAspectSize(54)
        });
        this._label.x = this._utils.toAspectSize(this._width) / 2 - this._label.width / 2;
        this._label.y = this._utils.toAspectSize(this._height) / 2 - this._label.height / 2;
    }

    private onButtonDown() {
        this._isDown = true;
        this.redraw();
    }
    
    private onButtonUp() {
        if (this._isDown) {
            this.handleButtonPressed();
        }
        this._isDown = false;
        this.redraw();
    }
    
    private onButtonOver() {
        this._isOver = true;
        this.redraw();
    }
    
    private onButtonOut() {
        this._isOver = false;
        if (this._isDown) {
            this._isDown = false;
            return;
        }
        this.redraw();
    }
}