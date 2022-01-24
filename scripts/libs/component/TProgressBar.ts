// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 方法一：动态计算，slider上增加背景图，根据滑动的进度动态计算背景图的大小；
 方法二：slider+progress，根据slider滑动的进度，动态改变progress的显示进度；
 方法三：slider+mask，根据slider的滑动进度，动态该表mask显示区域大小；

 如果滑动条显示用的是九宫格，推荐方法一和二
 如果滑动条显示是一张图，推荐方法三
 **/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('framework/TProgressBar')
export default class TProgressBar extends cc.Component {
  @property({ type: cc.Label, tooltip: '提示' })
  txt_tips: cc.Label = null;

  @property({ type: cc.Node, tooltip: '播放进度变化动画的node' })
  ani_bar_opacity: cc.Node = null;
  // @property({ type: Boolean, tooltip: '是否播放进度变化动画' })
  // is_change_ani: Boolean = false;

  // onLoad() {
  //   // this.setProgress(0, false);
  //   // let progressbar = this.getComponent(cc.ProgressBar);
  // }

  //添加进度
  addProgress(add_progress, is_ani = true) {
    let progress = this.getProgress();
    let total = progress + add_progress;
    this.setProgress(total, is_ani);
  }
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

    let progressbar = this.getComponent(cc.ProgressBar);

    //上次的
    let last_progress = progressbar.progress; //上一次的进度
    let last_size = progressbar.barSprite.node.getContentSize();

    //当前的
    progressbar.progress = progress;
    let size = progressbar.barSprite.node.getContentSize();

    self.playProgressCgAni(is_ani, last_progress, last_size, progress, size);
    // self.setTxtValue(null);
  }

  //设置bar的spriteframe
  setBarSprite(sp) {
    this.node.getChildByName('bar').getComponent(cc.Sprite).spriteFrame = sp;
    let ani_bar_opacity = this.ani_bar_opacity;
    if (ani_bar_opacity) {
      ani_bar_opacity.getComponent(cc.Sprite).spriteFrame = sp;
    }
  }
  //血条变化
  playProgressCgAni(is_ani, last_progress, last_size, progress, size) {
    let progressbar = this.getComponent(cc.ProgressBar);

    let ani_bar_opacity = this.ani_bar_opacity;

    if (ani_bar_opacity) {
      cc.tween(ani_bar_opacity).stopAll;
      // var fade_action = cc.fadeOut(0.2);
      // var fade_in_action = cc.fadeIn(0.2);
      // var fade_action1 = cc.fadeOut(0.2);
      // var fade_in_action1 = cc.fadeIn(0.2);
      // var callfunc_action_1 = cc.callFunc(function (target) {
      //   ani_bar_opacity.setContentSize(size);
      //   ani_bar_opacity.active = false;
      // }, self);
      // var endAction = cc.sequence(
      //   fade_action,
      //   fade_in_action,
      //   fade_action1,
      //   fade_in_action1,
      //   callfunc_action_1
      // );
      // ani_bar_opacity.active = true;
      // ani_bar_opacity.runAction(endAction);

      if (is_ani) {
        cc.tween(ani_bar_opacity)
          .to(1, { width: size.width }, { easing: 'sineOut' }) // node.scale === 2  //sineOut
          .start();
      } else {
        ani_bar_opacity.setContentSize(size);
      }
    }
  }
  /**
   *  获取当前进度
   * @returns {cc.Component}
   */
  getProgress() {
    let progressbar = this.getComponent(cc.ProgressBar);
    return progressbar.progress;
  }

  /**
   * 设置文本
   */
  setTxtValue(tips: string) {
    let self = this;
    if (tips) {
      this.txt_tips.string = tips;
    } else {
      this.txt_tips.string = '';
    }
  }
}
