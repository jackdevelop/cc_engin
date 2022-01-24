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
  // private timing_standard = null

  /**
   *
   * @param time   秒
   * @param end_callback  结束回调
   * @param inval_callback  中间回调
   */
  init(time: number, end_callback: Function, inval_callback) {
    var self = this;
    this.unscheduleAllCallbacks();

    // this.timing_standard = 0
    // //总次数
    // let now = _.now();
    // let t =  Math.abs(time - now)    // self.setTxtTimeString(str+"");
    // 以秒为单位的时间间隔
    // 重复次数
    // 开始延时
    let t = time;
    //首先设置下
    let { time_str } = TimeUtil.getHHmmss(t);
    self.setTxtTimeString(time_str + '');

    //开启倒计时
    this.schedule(function () {
      // this.timing_standard = this.timing_standard + 1

      // if(this.timing_standard >= 60){
      //     if(callback){
      //       callback(m_heroId);
      //       this.timing_standard = 0
      //   }
      // }

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
