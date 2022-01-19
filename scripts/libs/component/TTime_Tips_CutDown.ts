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

  
  setTxtTipsString(str: string) {
    this.txt_tips.string = str;
  }
  
  setTxtTimeString(str: string) {
    this.txt_time.string = str;
  }
  setActive(childname: string, active: boolean) {
    let childnode: cc.Node = this.node.getChildByName(childname);
    if (childnode) {
      childnode.active = active;
    }
  }

  
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

    
    this.repeat = repeat;
    this.dt = 0;

    self.setTxtTimeString(repeat + '');

    
    
    
    this.schedule(
      function () {
        
        self.dt = self.dt + 1;
        

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

  
  onDestroy() {
    this.onStop();
    
  }

  
  onStop() {
    this.unscheduleAllCallbacks();
  }
}
