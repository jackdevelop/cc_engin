import BaseComponent from '../base/BaseComponent';

/**
 *  计时器
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class TimeManager extends BaseComponent {
  /**单例实例**/
  private static instance: TimeManager = null;
  public static getInstance(): TimeManager {
    if (this.instance == null) {
      return null;
    }
    return this.instance;
  }

  //所有的计时器
  private listeners_ = null;
  private listenerHandleIndex_: number = 0;

  onLoad() {
    TimeManager.instance = this;
    this.removeAllTime();
  }

  /**
   *  添加计时器
   * @param listener
   * @param time
   * @param priority
   */
  addTime(listener, time, priority) {
    if (!priority) {
      priority = 1;
    }

    //存储起来
    this.listeners_ = listener;
    this.listenerHandleIndex_ = this.listenerHandleIndex_ + 1;
    var handle = priority + '_' + 'HANDLE_' + this.listenerHandleIndex_;
    this.listeners_[handle] = listener;

    this.schedule(listener, time);

    return handle;
  }

  /**
   *  移除计时器计时器
   * @param key
   */
  removeTime(key) {
    let self = this;
    var allListener = this.listeners_;
    for (var handle in allListener) {
      var listener = allListener[handle];
      if (key == handle || key == listener) {
        self.listeners_[handle] = null;
      }
    }
  }

  /**
   *  移除所有计时器
   */
  removeAllTime() {
    this.unscheduleAllCallbacks();
    this.listeners_ = new Object();
    this.listenerHandleIndex_ = 0;
  }

  //销毁
  onDestroy() {
    this.unscheduleAllCallbacks();
    this.removeAllTime();
  }
}
