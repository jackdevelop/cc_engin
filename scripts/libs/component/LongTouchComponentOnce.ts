import LongTouchComponent from './LongTouchComponent';

/**
 * @classdesc 长按监听组件
 * @author caizhitao
 * @version 0.1.0
 * @since 2018-11-24
 * @description
 *
 * 1. 将本组件挂载在节点上
 * 2. 在属性检查器上设置对应的回调事件
 * 3. 长按挂载的节点，那么就会一直回调第2步中设置的事件
 *
 * @example
 *
 * ```
 *      // 假设第二步回调接受函数为 onTouch() 那么在这个函数的参数如下：
 *
 *      @param touchCounter 本次触摸次数
 *      @param customEventData 在属性检查器中传入进来的 CustomEventData
 *
 *      onTouch(touchCounter: number, customEventData?: any) { }
 *  ```
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/LongTouchComponentOnce')
export default class LongTouchComponentOnce extends LongTouchComponent {
  @property({
    tooltip: '长按多久以后回调 ${longTouchEvents} 事件数组',
  })
  delay: number = 1;

  protected _onTouchStart(event: cc.Event.EventTouch) {
    // 这是为了不支持多点触控
    // if (!this.enableMultiTouching) {
    if (this._isTouching) {
      return;
    }

    //点击
    // let touch = event.getLocation();
    // let camera = cc.Camera.main;
    // let pp = camera.getScreenToWorldPoint(touch, cc.Vec2.ZERO);

    // let ret = this.node.getBoundingBoxToWorld();

    // if (ret.contains(cc.v2(pp.x, pp.y))) {
    //   // if (this.node.getBoundingBoxToWorld().contains(event.getLocation())) {
    //   this._isTouching = true;
    // } else {
    //   this._isTouching = false;
    // }

    this._isTouching = true;
    // if (this._isTouching) {
    // 然后开启计时器，计算后续的长按相当于触摸了多少次
    this.scheduleOnce(this._touchCounterCallback, this.delay);
    // }
    // }
  }

  private _onTouchEnd(event: cc.Event.EventTouch) {
    if (this._touchCounter > 0) {
      event.stopPropagation();
    }

    super._onTouchEnd(event);
  }
  // private _onTouchEnd(event: cc.Event.EventTouch) {
  //   if (this._touchCounter > 0) {
  //     event.stopPropagation();
  //   }

  //   this._isTouching = false;
  //   this._touchCounter = 0;
  //   this.unschedule(this._touchCounterCallback);
  // }
}
