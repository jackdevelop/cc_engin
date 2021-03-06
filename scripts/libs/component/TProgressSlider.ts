const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("framework/TProgressSlider")
export default class TProgressSlider extends cc.Component {
  @property({ type: cc.Integer, tooltip: "倍率" }) num: cc.Integer = 1;
  @property({ type: cc.Label, tooltip: "值" }) txt_value: cc.Label = null;
  onLoad() {
    let slider = this.getComponent(cc.Slider);
    let progressbar = this.getComponent(cc.ProgressBar);
    if (slider == null || progressbar == null) {
      return;
    }
    progressbar.progress = slider.progress;
    let self = this;
    slider.node.on(
      "slide",
      function (event) {
        cc.log("slide 触发了进度条事件");
        let progress = slider.progress;
        self.setProgress(progress);
      },
      this
    );
  }
  setProgress(progress) {
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
  getSlider() {
    let slider = this.getComponent(cc.Slider);
    return slider;
  }
  setTxtValue() {
    let self = this;
    if (self.txt_value) {
      let slider = this.getComponent(cc.Slider);
      let progress = slider.progress;
      self.txt_value.string = Math.floor(progress * 10) * self.num + 10 + "";
    }
  }
}
