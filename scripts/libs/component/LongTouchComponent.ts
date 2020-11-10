const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("engin/LongTouchComponent")
export default class LongTouchComponent extends cc.Component {
  @property({
    tooltip:
      "触摸回调间隔（秒）。假如为0.1，那么1秒内会回调10次 ${longTouchEvents} 事件数组",
  })
  touchInterval: number = 0.1;
  @property({
    type: [cc.Component.EventHandler],
    tooltip: "回调事件数组，每间隔 ${toucheInterval}s 回调一次",
  })
  longTouchEvents: cc.Component.EventHandler[] = [];
  @property({ tooltip: "是否能触摸" }) is_touch: cc.Boolean = true;
  protected _touchCounter: number = 0;
  protected _isTouching: cc.Boolean = false;
  private m_temp_event = null;
  onEnable() {
    if (this.is_touch) {
      this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
      this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
      this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }
  }
  onDisable() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  }
  protected _onTouchStart(event: cc.Event.EventTouch) {
    this.m_temp_event = event;
    if (this._isTouching) {
      return;
    }
    this._isTouching = true;
    this.publishOneTouch();
    this.schedule(this._touchCounterCallback, this.touchInterval);
  }
  protected _onTouchEnd(event: cc.Event.EventTouch) {
    this._isTouching = false;
    this._touchCounter = 0;
    this.unschedule(this._touchCounterCallback);
  }
  private _onTouchCancel(event: cc.Event.EventTouch) {
    this._isTouching = false;
    this._touchCounter = 0;
    this.unschedule(this._touchCounterCallback);
  }
  protected _touchCounterCallback() {
    if (this._isTouching) {
      this.publishOneTouch();
    } else {
      this.unschedule(this._touchCounterCallback);
    }
  }
  private publishOneTouch() {
    let slef = this;
    if (!this._isTouching) {
      return;
    }
    this._touchCounter++;
    this.longTouchEvents.forEach((eventHandler: cc.Component.EventHandler) => {
      eventHandler.emit([
        this._touchCounter,
        slef.m_temp_event,
        this._touchCounter,
      ]);
    });
  }
}
