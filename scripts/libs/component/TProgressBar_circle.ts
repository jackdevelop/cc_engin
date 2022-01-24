/**
 *  扇形进度条 
 * 
 */

import TProgressBar from "./TProgressBar";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('framework/TProgressBar_circle')
export default class TProgressBar_circle extends TProgressBar {
 

  //设置当前进度
  setProgress(progress, is_ani = true) {
    //cc.log("触发了setProgress")

    let self = this;
    if (progress > 1) {
      progress = 1;
    }
    if (progress < 0) {
      progress = 0;
    }

    // let progressbar = this.getComponent(cc.ProgressBar);

    // //上次的
    // let last_progress = progressbar.progress; //上一次的进度
    // let last_size = progressbar.barSprite.node.getContentSize();

    //当前的
    // progressbar.progress = progress;
    // let size = progressbar.barSprite.node.getContentSize();


    this.node.getComponent(cc.Sprite).fillRange = progress;
    // if (this.node.getComponent(cc.Sprite).fillRange <= 0) {
    //     this.unschedule(this.changeProgressBar);
    // }
  }

  /**
   *  获取当前进度
   * @returns {cc.Component}
   */
  getProgress() {
    let progressbar = this.node.getComponent(cc.Sprite).fillRange
    return progressbar;
  }

}
