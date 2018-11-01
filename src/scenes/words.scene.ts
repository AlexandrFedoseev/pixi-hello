import { Scene } from './scene';
import { Loader } from '../resources/loader';
import { UtilsService } from '../services/utils.service';
import { BorderActor } from '../actors/border.actor';
import { ButtonActor } from '../actors/button.actor';
import { ScenesManager } from './scene.manager';
import { EmojiService } from '../services/emoji.service';
import { AspectWindowProps } from '../services/viewport.service';

const LIST_OF_TELL_PHRASES = [
    'A strict upgrade over the cinder hatchet :xD:',
    'For the first time :xD: :xD: in his life, Grakk felt a little :xD: warm and fuzzy inside.',
    'Of course you should fight fire with fire. :xD: :xD: :xD: :xD: You should fight everything with fire.',
    'Day 31: I have succeeded in my time reversal experiment. Day 30: I might have a problem here. :xD: :xD: :xD: :xD:',
    ':xD: :xD: :xD: :xD: Someday, someone will best me. But it won\'t be today, and it won\'t be you.',
    'He raged at the world, at his family, at his life. But mostly he just raged. :xD: :xD: :xD:',
    ':xD: :xD: :xD: :xD: :xD: :xD:',
    'I come looking for demons and I find a plane full of angels. I hate angels :xD:',
    'It is not that you will go mad. :xD: :xD: It is that you will beg for madness.',
    'Sun follows Moon :xD: until she tires, then :xD: carries :xD: her :xD: until she\'s strong / and runs ahead of him again.',
    ':xD: :xD: :xD: :xD: With great power comes great risk of getting yourself killed. :xD: :xD: :xD: :xD:',
    'Sorry I burned down your village. Here\'s some gold.',
    'Do the innocent pay for the crimes of the guilty? Of course they do. That\'s the fate of the weak. :xD:',
    'Cry to the sun and watch as even your tears forsake you.'
];

const PADDINGS = 20;

export default class WordsScene extends Scene {
    private _res: Loader = Loader.instance();
    private _utils: UtilsService = UtilsService.instance();
    private _sceneManger: ScenesManager = ScenesManager.instance();
    private _emoji: EmojiService = EmojiService.instance();
    private _rowAddTimeout: any;
    private _border: BorderActor;
    private _buttonBack: ButtonActor;
    private _aspect: AspectWindowProps;

    private _cursor = 0;

    constructor() {
        super();

        this.initialize();
    }

    private initialize() {
        this._res.loadGroup('emoji', this.drawScene.bind(this));
    }

    private drawScene() {
        this._border = new BorderActor();
        this.addChild(this._border);

        this._buttonBack = new ButtonActor(600, 140, 'BACK');
        this._buttonBack.onButtonPressed(() => {
            this._sceneManger.setScene('MAIN');
        });
        this.addChild(this._buttonBack);

        this.redraw();
        this.loopUpdates();
    }

    public loopUpdates() {
        this._rowAddTimeout = setTimeout(() => {
            this._rowAddTimeout = 0;
            this.updateHandler();
        }, 2000);
    }

    public redraw() {
        this.removeChildren();
        this.addChild(this._border);
        this.addChild(this._buttonBack);
        this._aspect = this._utils.getAspectScreen();
        this.pivot.x = -this._aspect.x;
        this.pivot.y = -this._aspect.y;
        this._border.redraw();
        this._buttonBack.redraw();
        this._buttonBack.x = this._aspect.width / 2 - this._buttonBack.width / 2;
        this._buttonBack.y = this._utils.toAspectSize(1250);
    }

    private placeY: number;

    private updateHandler() {
        if (this._aspect == null) {
            this._aspect = this._utils.getAspectScreen();
        }
        if (this.placeY == null) {
            this.placeY = this._utils.toAspectSize(PADDINGS);
        }
        let fontSize = this._utils.getRndInteger(16, 86);
        let container = this._emoji.convert(
            LIST_OF_TELL_PHRASES[this._cursor],
            this._aspect.width - this._utils.toAspectSize(PADDINGS * 2),
            fontSize,
            fontSize / 3
        );
        this.addChild(container);
        container.y = this.placeY;
        container.x = this._utils.toAspectSize(PADDINGS);
        this.placeY = this.placeY + container.height + this._utils.toAspectSize(20);
        if (this.placeY > this._utils.toAspectSize(1150)) {
            this.redraw();
            this.addChild(container);
            this.placeY = this._utils.toAspectSize(PADDINGS);
            container.x = this._utils.toAspectSize(PADDINGS);
            container.y = this.placeY;
            this.placeY = this.placeY + container.height + this._utils.toAspectSize(20);
        }
        this._cursor += 1;
        this._cursor = this._cursor === LIST_OF_TELL_PHRASES.length ? 0 : this._cursor;
        this.loopUpdates();
    }

    public pause() {
        this.paused = true;
        if (this._rowAddTimeout != null) {
            clearTimeout(this._rowAddTimeout);
        }
    }

    public resume() {
        this.paused = false;
        if (this._rowAddTimeout != null) {
            this.redraw();
            this.loopUpdates();
        }
    }
}