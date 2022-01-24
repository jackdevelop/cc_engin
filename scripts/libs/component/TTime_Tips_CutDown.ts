const {
  ccclass,
  property,
  requireComponent,
  executeInEditMode,
  menu,
} = cc._decorator;

@ccclass
@menu('framework/TTime_Tips_CutDown')
export class TTime_Tips_CutDown extends cc.Component {
  @property(cc.Label)
  txt_time: cc.Label = null;

  @property(cc.Label)
  txt_tips: cc.Label = null;

  private repeat: number = null;
  private dt: number = 0;

  //设置文本提示
  setTxtTipsString(str: string) {
    this.txt_tips.string = str;
  }
  //设置 时间
  setTxtTimeString(str: string) {
    this.txt_time.string = str;
  }
  setActive(childname: string, active: boolean) {
    let childnode: cc.Node = this.node.getChildByName(childname);
    if (childnode) {
      childnode.active = active;
    }
  }

  //init 初始化
  init(
    repeat: number,
    end_callback: Function,
    Function,
    inval_callback,
    delay: number,
    interval: number
  ) {
    var self = this;
    this.unscheduleAllCallbacks();

    if (!interval) {
      interval = 1;
    }

    if (!delay) {
      delay = 0;
    }

    //总次数
    this.repeat = repeat;
    this.dt = 0;

    self.setTxtTimeString(repeat + '');

    // 以秒为单位的时间间隔
    // 重复次数
    // 开始延时
    this.schedule(
      function () {
        // 这里的 this 指向 component
        self.dt = self.dt + 1;
        // self.tick();

        let cut = self.repeat - self.dt;
        self.setTxtTimeString(cut + '');

        if (self.dt == self.repeat) {
          self.unscheduleAllCallbacks();

          if (end_callback) {
            end_callback(self.dt, self.repeat);
          }
        }
      },
      interval,
      repeat,
      delay
    );
  }

  //销毁
  onDestroy() {
    this.onStop();
    // this.unscheduleAllCallbacks();
  }

  //关闭
  onStop() {
    this.unscheduleAllCallbacks();
  }
}
