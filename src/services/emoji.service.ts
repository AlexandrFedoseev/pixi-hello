import { AspectWindowProps } from './viewport.service';
import { Tween } from './tween';
import { ScenesManager } from '../scenes/scene.manager';
import { Loader } from '../resources/loader';
import { UtilsService } from './utils.service';

export class EmojiService {
    private _res: Loader = Loader.instance();
    private _utils: UtilsService = UtilsService.instance();

    public static instance(): EmojiService {
        if (EmojiService._instance == null) {
            EmojiService._instance = new EmojiService();
        }
        return this._instance;
    }
    private static _instance: EmojiService;

    protected constructor() { };

    public convert(text: string, textWidth: number, fontSize = 32, lineSpacing: number = 4): PIXI.Container {
        let textBlock = new PIXI.Container();
        let stringAsActors: Array<PIXI.Text | PIXI.Sprite> = this.textToActorsArray(text);
        for (let actor of stringAsActors) {
            textBlock.addChild(actor);
        }
        this.applyProps(textBlock, textWidth, fontSize, lineSpacing)
        return textBlock;
    }

    public applyProps(container: PIXI.Container, textWidth: number, fontSize: number, lineSpacing: number) {
        let cursorX = 0;
        let cursorY = 0;
        container.children.forEach((actor: PIXI.Text | PIXI.Sprite) => {
            if ( actor instanceof PIXI.Text) {
               actor.style = new PIXI.TextStyle({
                   fontSize: this._utils.toAspectSize(fontSize)
               })
               
            } else if ( actor instanceof PIXI.Sprite) {
                actor.width = this._utils.toAspectSize(fontSize);
                actor.height = this._utils.toAspectSize(fontSize);
            }
            actor.x = cursorX;
            cursorX = cursorX + actor.width + this._utils.toAspectSize(fontSize / 3.5);
            if (cursorX >= textWidth) {
                actor.x = 0;
                cursorY = cursorY + actor.height + this._utils.toAspectSize(lineSpacing);
                cursorX = actor.width + this._utils.toAspectSize(fontSize / 3.5);
            }
            actor.y = cursorY;
        })
    }

    private textToActorsArray(text: string): Array<PIXI.Text | PIXI.Sprite> {
        let arr = text
            .replace(/\s+/g,' ')
            .replace(/^\s+|\s+$/,'')
            .split(' ');
        let result = [];
        for (let word of arr) {
            result.push(this.wordToActor(word));
        }
        return result;
    }

    private wordToActor(word: string): PIXI.Text | PIXI.Sprite {
        if (word[0] === ':' && this._res.getTextureByName(word) != null) {
            return new PIXI.Sprite(this._res.getTextureByName(word));
        }
        let text = new PIXI.Text();
        text.text = word;
        return text;
    }

}