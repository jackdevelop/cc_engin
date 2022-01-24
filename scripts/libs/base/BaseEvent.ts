/**
 * 事件触发器

    使用方法：

    var EventProtocol = require("EventProtocol");
    EventProtocol.extend(NetNotify);

 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BaseEvent {
  private listeners_: any = new Object(); //最后的结构就是 {eventName:[handle,handle,handle]}
  private listenerHandleIndex_: number = 0;

  public addEventListener(eventName: string, listener: any, target: any, priority: number) {
    //        eventName = string.upper(eventName)
    if (this.listeners_[eventName] == null) {
      this.listeners_[eventName] = [];
    }

    // var _ = require('Underscore');

    // priority = _.random(0, 100);
    if (!priority) {
      priority = 1;
    }
    this.listenerHandleIndex_ = this.listenerHandleIndex_ + 1;
    var handle = priority + '_' + 'HANDLE_' + this.listenerHandleIndex_;
    this.listeners_[eventName][handle] = listener;

    // // 做一个优先级排序 start
    // let allkeys = _.allKeys(this.listeners_[eventName]);
    // let new_allkeys = _.sortBy(allkeys, function (v, k) {
    //   let one_k = v.split('_');
    //   let one_priority = _.first(one_k);
    //   return Number(one_priority);
    // });
    //展示
    // let old_all = this.listeners_[eventName];
    // console.log(old_all);
    // let new_all = old_all.sort(function (a, b) {
    //   return b - a;
    // });
    // console.log(new_all);
    // 做一个优先级排序 end

    return handle;
  }

  public dispatchEvent(event: { name: string; data?: any; target?: any; }) {
    var self = this;
    var eventName = event.name;
    if (!this.listeners_) return;
    if (this.listeners_[eventName] == null) return;
    event.target = this;

    var allListener = this.listeners_[eventName];
    for (var handle in allListener) {
      var listener = allListener[handle];
      if (listener) {
        var ret = listener(event);
        if (ret == false) break;
        else if (ret == '__REMOVE__') self.listeners_[eventName][handle] = null;
      }
    }
  }

  public removeEventListener(eventName: string, key: any) {
    var self = this;
    //        eventName = eventName.toUpperCase();
    if (this.listeners_[eventName] == null) return;
    var allListener = this.listeners_[eventName];
    for (var handle in allListener) {
      var listener = allListener[handle];
      if (key == handle || key == listener) {
        self.listeners_[eventName][handle] = null;
      }
    }
  }

  public removeAllEventListenersForEvent(eventName: string) {
    this.listeners_[eventName] = null;
  }

  public removeAllEventListenersForHandle(handle: any) {
    var self = this;
    if (handle == null) return;
    var _ = require('Underscore');
    var findOne = _.each(self.listeners_, function (v: any, k: string) {
      if (v) {
        self.removeEventListener(k, handle);
      }
    });
  }

  public removeAllEventListeners() {
    this.listeners_ = new Object();
  }
}

// if (module) module.exports = EventProtocol;
