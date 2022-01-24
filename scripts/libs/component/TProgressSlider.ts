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
@menu('framework/TProgressSlider')
export default class TProgressSlider extends cc.Component {
  @property({ type: cc.Integer, tooltip: '倍率' })
  num: cc.Integer = 1;

  @property({ type: cc.Label, tooltip: '值' })
  txt_value: cc.Label = null;

  onLoad() {
    let slider = this.getComponent(cc.Slider);
    let progressbar = this.getComponent(cc.ProgressBar);

    if (slider == null || progressbar == null) {
      return;
    }

    progressbar.progress = slider.progress;

    let self = this;
    slider.node.on(
      'slide',
      function (event) {
        cc.log('slide 触发了进度条事件');
        let progress = slider.progress;
        self.setProgress(progress);
      },
      this
    );
  }

  //设置当前进度
  setProgress(progress) {
    //cc.log("触发了setProgress")

    let self = this;
    if (progress > 1) {
      progress = 1;
    }
    if (progress < 0) {
      progress = 0;
    }

    let slider = this.getComponent(cc.Slider);
    slider.progress = progress;

    let progressbar = this.getComponent(cc.ProgressBar);
    progressbar.progress = progress;

    self.setTxtValue();

    return progress;
  }

  /**
   *  获取当前进度
   * @returns {cc.Component}
   */
  getSlider() {
    let slider = this.getComponent(cc.Slider);
    return slider;
  }

  setTxtValue() {
    let self = this;
    if (self.txt_value) {
      let slider = this.getComponent(cc.Slider);
      let progress = slider.progress;

      self.txt_value.string = Math.floor(progress * 10) * self.num + 10 + '';
    }
  }
}
