import { TTime_Tips_CutDown } from './TTime_Tips_CutDown';
import { moment_util } from '../utils/moment_util';
import TimeUtil from '../util/TimeUtil';
var _ = require('Underscore');

const {
  ccclass,
  property,
  requireComponent,
  executeInEditMode,
  menu,
} = cc._decorator;

@ccclass
@menu('framework/TTime_Tips_CutDown_moment')
export class TTime_Tips_CutDown_moment extends TTime_Tips_CutDown {
  

  
  init(time: number, end_callback: Function, inval_callback) {
    var self = this;
    this.unscheduleAllCallbacks();

    
    
    
    
    
    
    
    let t = time;
    
    let { time_str } = TimeUtil.getHHmmss(t);
    self.setTxtTimeString(time_str + '');

    
    this.schedule(function () {
      

      
      
      
      
      
      

      t = t - 1;
      let { time_str } = TimeUtil.getHHmmss(t);
      self.setTxtTimeString(time_str + '');

      if (t <= 0) {
        self.unscheduleAllCallbacks();

        if (end_callback) {
          end_callback();
        }
      } else {
        if (inval_callback) {
          inval_callback(t);
        }
      }
    }, 1);
  }
}
