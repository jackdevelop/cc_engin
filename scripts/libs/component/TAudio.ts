// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import BaseCache from "../base/BaseCache";
import { AudioManager } from "../manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TAudio extends BaseCache {

    // @property({ type:  cc.AudioClip, tooltip: '' })
    // click = null;

    // @property({ type:  cc.AudioClip, tooltip: '' })
    // swap = null;

    // @property({ type:  [cc.AudioClip], tooltip: '' })
    // eliminate = [];

    // @property({ type:  [cc.AudioClip], tooltip: '' })
    // continuousMatch = [];




    @property({ type: [cc.AudioClip], override: true })
    obj_arr: Array<cc.AudioClip> = [];


    /**单例实例**/
    private static instance: TAudio = null;

    onLoad() {
        TAudio.instance = this;
        super.onLoad();
    }







    // start () {
    // // }
    // playClick(){
    //     // cc.audioEngine.play(this.click, false, 1);

    //     let audio = TAudio.getOne("click.bubble")
    //     AudioManager.getInstance().playSFX(audio,null);
    // }
    // playSwap(){
    //     // cc.audioEngine.play(this.swap, false, 1);

    //     let audio = TAudio.getOne("swap")
    //     AudioManager.getInstance().playSFX(audio,null);
    // }
    // playEliminate(step){
    //     // step = Math.min(this.eliminate.length - 1, step);
    //     //cc.audioEngine.play(this.eliminate[step], false, 1);

    //     step = Math.min(7, step) + 1;
    //     let audio = TAudio.getOne("eliminate"+step)
    //     AudioManager.getInstance().playSFX(audio,null);
    // }

    // playContinuousMatch(step){
    //     console.log("step = ", step);
    //     step = Math.min(step, 11);
    //     if(step < 2){
    //         return 
    //     }

    //     // let idx = Math.floor(step/2) - 1
    //     // cc.audioEngine.play(this.continuousMatch[idx], false, 1);

    //     //3 5 7 9 11 
    //     let idx = Math.floor(step/2) 
    //     let audio = TAudio.getOne("contnuousMatch"+idx)
    //     AudioManager.getInstance().playSFX(audio,null);
    // }


}
