import { Scene } from './scene';
import { Loader } from '../resources/loader';
import { ButtonActor } from '../actors/button.actor';
import { UtilsService } from '../services/utils.service';
import { ScenesManager } from './scene.manager';
import { BorderActor } from '../actors/border.actor';

export default class MainScene extends Scene {
    private _border: BorderActor;
    private _buttonCards: ButtonActor;
    private _buttonWords: ButtonActor;
    private _buttonParticles: ButtonActor;
    private _utils: UtilsService = UtilsService.instance();
    private _sceneManger: ScenesManager = ScenesManager.instance();
    constructor() {
        super();
        this.onUpdate(this.updateHandler);
        this.drawScene();
        this.redraw();
    }

    private drawScene() {
        this._border = new BorderActor();
        this.addChild(this._border);

        this._buttonCards = new ButtonActor(600, 140, 'Cards');
        this._buttonCards.onButtonPressed(() => {
            this._sceneManger.setScene('CARDS');
        });
        this.addChild(this._buttonCards);

        this._buttonWords = new ButtonActor(600, 140, 'Words');
        this._buttonWords.onButtonPressed(() => {
            this._sceneManger.setScene('WORDS');
        });
        this.addChild(this._buttonWords);

        this._buttonParticles = new ButtonActor(600, 140, 'Particles');
        this._buttonParticles.onButtonPressed(() => {
            this._sceneManger.setScene('PARTICLES');
        });
        this.addChild(this._buttonParticles);
    }

    public resume() {
        this.paused = false;
        if (this._border != null) {
            this.redraw();
        }
    }

    public redraw() {
        let aspect = this._utils.getAspectScreen();
        this.pivot.x = -aspect.x;
        this.pivot.y = -aspect.y;
        this._border.redraw();
        this._buttonCards.redraw();
        this._buttonCards.x = aspect.width / 2 - this._buttonCards.width / 2;
        this._buttonCards.y = this._utils.toAspectSize(700);
        this._buttonWords.redraw();
        this._buttonWords.x = aspect.width / 2 - this._buttonWords.width / 2;
        this._buttonWords.y = this._utils.toAspectSize(900);
        this._buttonParticles.redraw();
        this._buttonParticles.x = aspect.width / 2 - this._buttonParticles.width / 2;
        this._buttonParticles.y = this._utils.toAspectSize(1100);
    }

    updateHandler() {

    }
}