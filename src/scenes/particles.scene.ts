import * as Particles from 'pixi-particles';
import * as config from '../resources/fire.particle.json';
import { Scene } from './scene';
import { Loader } from '../resources/loader';
import { UtilsService } from '../services/utils.service';
import { BorderActor } from '../actors/border.actor';
import { ButtonActor } from '../actors/button.actor';
import { ScenesManager } from './scene.manager';

export default class ParticlesScene extends Scene {
    private _res: Loader = Loader.instance();
    private _utils: UtilsService = UtilsService.instance();
    private _sceneManger: ScenesManager = ScenesManager.instance();

    private _border: BorderActor;
    private _buttonBack: ButtonActor;
    private _ticker: PIXI.ticker.Ticker;
    private _emitterContainer: PIXI.Container;
    private _emitter: Particles.Emitter;

    private readonly images = ['images/particle.png', 'images/Fire.png'];

    constructor() {
        super();

        this.initialize();
    }

    private initialize() {
        this._res.loadGroup('particles', this.drawScene.bind(this));
    }

    private drawScene() {
        this._border = new BorderActor();
        this.addChild(this._border);

        this._buttonBack = new ButtonActor(600, 140, 'BACK');
        this._buttonBack.onButtonPressed(() => {
            this._sceneManger.setScene('MAIN');
        });
        this.addChild(this._buttonBack);
        this._emitterContainer = new PIXI.Container();
        this.addChild(this._emitterContainer);
        this._emitter = new Particles.Emitter(
            this._emitterContainer,
            [this._res.getTextureByName('particle'), this._res.getTextureByName('fire')],
            config
        );
        this._emitter.emit = true;
        this.redraw();
        this.startTicker();
    }

    public startTicker() {
        this._ticker = new PIXI.ticker.Ticker();
        this._ticker.stop();
        this._ticker.add((deltaTime) => {
            this._emitter.update(deltaTime);
        });
        this._ticker.start();
    }

    public redraw() {
        let aspect = this._utils.getAspectScreen();
        this.pivot.x = -aspect.x;
        this.pivot.y = -aspect.y;
        this._emitterContainer.x = this._utils.toAspectSize(414);
        this._emitterContainer.y = this._utils.toAspectSize(1100);
        this._emitterContainer.scale.x = aspect.width / 414;
        this._emitterContainer.scale.y = aspect.width / 414;
        this._border.redraw();
        this._buttonBack.redraw();
        this._buttonBack.x = aspect.width / 2 - this._buttonBack.width / 2;
        this._buttonBack.y = this._utils.toAspectSize(1250);
    }

    public pause() {
        this.paused = true;
        if (this._ticker != null) {
            this._ticker.stop();
        }
    }

    public resume() {
        this.paused = false;
        if (this._ticker != null) {
            this.redraw();
            this._ticker.start();
        }
    }
}