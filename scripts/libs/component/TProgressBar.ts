const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("framework/TProgressBar")
export default class TProgressBar extends cc.Component {
  @property({ type: cc.Label, tooltip: "提示" }) txt_tips: cc.Label = null;
  @property({ type: cc.Node, tooltip: "播放进度变化动画的node" })
  ani_bar_opacity: cc.Node = null;
  addProgress(add_progress, is_ani = true) {
    let progress = this.getProgress();
    let total = progress + add_progress;
    this.setProgress(total, is_ani);
  }
  setProgress(progress, is_ani = true) {
    let self = this;
    if (progress > 1) {
      progress = 1;
    }
    if (progress < 0) {
      progress = 0;
    }
    let progressbar = this.getComponent(cc.ProgressBar);
    let last_progress = progressbar.progress;
    let last_size = progressbar.barSprite.node.getContentSize();
    progressbar.progress = progress;
    let size = progressbar.barSprite.node.getContentSize();
    self.playProgressCgAni(is_ani, last_progress, last_size, progress, size);
  }
  setBarSprite(sp) {
    this.node.getChildByName("bar").getComponent(cc.Sprite).spriteFrame = sp;
    let ani_bar_opacity = this.ani_bar_opacity;
    if (ani_bar_opacity) {
      ani_bar_opacity.getComponent(cc.Sprite).spriteFrame = sp;
    }
  }
  playProgressCgAni(is_ani, last_progress, last_size, progress, size) {
    let progressbar = this.getComponent(cc.ProgressBar);
    let ani_bar_opacity = this.ani_bar_opacity;
    if (ani_bar_opacity) {
      cc.tween(ani_bar_opacity).stopAll;
      if (is_ani) {
        cc.tween(ani_bar_opacity)
          .to(1, { width: size.width }, { easing: "sineOut" })
          .start();
      } else {
        ani_bar_opacity.setContentSize(size);
      }
    }
  }
  getProgress() {
    let progressbar = this.getComponent(cc.ProgressBar);
    return progressbar.progress;
  }
  setTxtValue(tips: string) {
    let self = this;
    if (tips) {
      this.txt_tips.string = tips;
    } else {
      this.txt_tips.string = "";
    }
  }
}
