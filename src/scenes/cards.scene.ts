import { Scene } from './scene';
import { Loader } from '../resources/loader';
import { BorderActor } from '../actors/border.actor';
import { UtilsService } from '../services/utils.service';
import { ButtonActor } from '../actors/button.actor';
import { ScenesManager } from './scene.manager';
import { Tween } from '../services/tween';
import { TweenService } from '../services/tween.service';

const BASE_PILE_X = 100;
const BASE_PILE_Y = 300;

const SECOND_PILE_X = 450;
const SECOND_PILE_Y = 300;

export default class CardsScene extends Scene {
    private _res: Loader = Loader.instance();
    private _utils: UtilsService = UtilsService.instance();
    private _tweens: TweenService = TweenService.instance();
    private _sceneManger: ScenesManager = ScenesManager.instance();
    private _border: BorderActor;
    private _buttonBack: ButtonActor;
    private _cards: PIXI.Sprite[] = [];
    private _secondPile: PIXI.Sprite[] = [];
    private _inAnimation: PIXI.Sprite;
    private _ticker: PIXI.ticker.Ticker;
    private _fpsText: PIXI.Text;

    private _container: PIXI.particles.ParticleContainer;
    constructor() {
        super();
        this.initialize();
    }

    private initialize() {
        this._res.loadGroup('preload', this.drawScene.bind(this));
    }

    private drawScene() {
        this._border = new BorderActor();
        this.addChild(this._border);

        this._fpsText = new PIXI.Text();
        this.addChild(this._fpsText);

        this._container = new PIXI.particles.ParticleContainer(1000, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        this.addChild(this._container)
        for (let i = 0; i < 144; i++) {
            let academyRuins = new PIXI.Sprite(this._res.getTextureByName('academy_ruins'));
            this._container.addChild(academyRuins);
            this._cards.push(academyRuins);
        }

        this._buttonBack = new ButtonActor(600, 140, 'BACK');
        this._buttonBack.onButtonPressed(() => {
            this._sceneManger.setScene('MAIN');
        });
        this.addChild(this._buttonBack);

        this.redraw();
        this.startTicker();
        this.animate();
    }

    public startTicker() {
        this._ticker = new PIXI.ticker.Ticker();
        this._ticker.stop();
        this._ticker.add((deltaTime) => {
            this.updateHandler();
        });
        this._ticker.start();
    }

    public redraw() {
        let shouldAnimate = false;
        if (this._inAnimation != null) {
            shouldAnimate = true;
            this._tweens.terminate();
            this._cards.push(this._inAnimation);
            this._inAnimation = null;
        }
        let aspect = this._utils.getAspectScreen();
        this.pivot.x = -aspect.x;
        this.pivot.y = -aspect.y;
        this._border.redraw();
        this._buttonBack.redraw();
        this._buttonBack.x = aspect.width / 2 - this._buttonBack.width / 2;
        this._buttonBack.y = this._utils.toAspectSize(1250);
        this._fpsText.y = this._utils.toAspectSize(50);
        this._fpsText.x = this._utils.toAspectSize(600);
        this._fpsText.style = new PIXI.TextStyle({
            fill: 0x221122,
            fontSize: this._utils.toAspectSize(32)
        });
        for (let i = 0; i < this._secondPile.length; i++) {
            let card = this._secondPile[i];
            card.width = this._utils.toAspectSize(297);
            card.height = this._utils.toAspectSize(413);
            card.position.x = this._utils.toAspectSize(SECOND_PILE_X - i * 0.5);
            card.position.y = this._utils.toAspectSize(SECOND_PILE_Y - i * 0.5);
        }
        for (let i = 0; i < this._cards.length; i++) {
            let card = this._cards[i];
            card.width = this._utils.toAspectSize(297);
            card.height = this._utils.toAspectSize(413);
            card.position.x = this._utils.toAspectSize(BASE_PILE_X - i * 0.5);
            card.position.y = this._utils.toAspectSize(BASE_PILE_Y - i * 0.5);
        }
        if (shouldAnimate) {
            this.animate();
        }
    }

    public animate() {
        this._inAnimation = this._cards.pop();
        let to = {
            x: this._utils.toAspectSize(SECOND_PILE_X - this._secondPile.length * 0.5),
            y: this._utils.toAspectSize(SECOND_PILE_Y - this._secondPile.length * 0.5)
        }
        let move = new Tween(this._inAnimation, to, 60);
        move.onComplete(() => {
            this._secondPile.push(this._inAnimation);
            this._container.setChildIndex(this._inAnimation, this._secondPile.length);
            if (this._cards.length > 0) {
                this.animate();
            } else {
                this._inAnimation = null;
                this._ticker.stop();
            }
        })
    }

    public pause() {
        this.paused = true;
        if (this._ticker != null) {
            this._ticker.stop();
        }
    }

    public resume() {
        this.paused = false;
        if (this._ticker != null && this._inAnimation != null) {
            this._ticker.start();
            this.redraw();
        }
    }

    private updateHandler() {
        this._fpsText.text = `FPS: ${this._ticker.FPS.toFixed()}`;
        this._tweens.update();
    }
}