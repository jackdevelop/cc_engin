import LongTouchComponent from "./LongTouchComponent";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("engin/LongTouchComponentOnce")
export default class LongTouchComponentOnce extends LongTouchComponent {
  @property({ tooltip: "长按多久以后回调 ${longTouchEvents} 事件数组" })
  delay: number = 1;
  protected _onTouchStart(event: cc.Event.EventTouch) {
    if (this._isTouching) {
      return;
    }
    this._isTouching = true;
    this.scheduleOnce(this._touchCounterCallback, this.delay);
  }
  private _onTouchEnd(event: cc.Event.EventTouch) {
    if (this._touchCounter > 0) {
      event.stopPropagation();
    }
    super._onTouchEnd(event);
  }
}
