import * as academyRuins from './images/academy-ruins.jpg';
import * as xD from './images/xD.png';
import * as particle from './images/particle.png';
import * as fire from './images/fire.png';

export default class RData {
    public storage: {[key:string]: any} = {
        ['academy_ruins']: academyRuins,
        [':xD:']: xD,
        ['particle']: particle,
        ['fire']: fire
    }
}