
const { ccclass, property } = cc._decorator;

@ccclass
export class BaseEvent {
  private listeners_: any = new Object(); 
  private listenerHandleIndex_: number = 0;

  public addEventListener(eventName: string, listener: any, target: any, priority: number) {
    
    if (this.listeners_[eventName] == null) {
      this.listeners_[eventName] = [];
    }

    

    
    if (!priority) {
      priority = 1;
    }
    this.listenerHandleIndex_ = this.listenerHandleIndex_ + 1;
    var handle = priority + '_' + 'HANDLE_' + this.listenerHandleIndex_;
    this.listeners_[eventName][handle] = listener;

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

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


