import { AudioManager } from '../manager/AudioManager';
import menu = cc._decorator.menu;
import disallowMultiple = cc._decorator.disallowMultiple;
import GameManger from '../../../gamemanager/GameManger';

const { ccclass, property } = cc._decorator;

@ccclass
@menu('framework/TAudioButton')
@disallowMultiple()
export default class TAudioButton extends cc.Component {
  // @property({ tooltip: '禁止连续点击' })
  // noContinuousClicks: boolean = false;

  //按钮音效
  @property({ type: cc.AudioClip, tooltip: '禁止连续点击' })
  SOUND_STR_BUTTON: cc.AudioClip = null; //"sound_click";

  onLoad() {
    // if (!this.SOUND_STR_BUTTON){
    //   this.SOUND_BUTTON = 'sound_click';
    // }

    this._registerEvent();
  }

  _registerEvent() {
    // this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    // this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

    // this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    // this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
  }
  // touch event handler
  // _onTouchBegan(event) {
  //   // cc.log('_onTouchBegan');
  // }
  // _onTouchMove(event) {
  //   // cc.log('_onTouchMove');
  // }
  _onTouchEnded(event) {
    var self = this;

    // //禁止连续点击
    // if (this.noContinuousClicks == true) {
    //   // this.node.getComponent(cc.Button).interactable = false;
    //   // return;
    //   self.scheduleOnce(function () {
    //     this.node.getComponent(cc.Button).interactable = false;
    //   }, 0.01);
    //   self.scheduleOnce(function () {
    //     this.node.getComponent(cc.Button).interactable = true;
    //   }, 0.5);
    // }

    // if (this.SOUND_BUTTON) {
    let str = self.SOUND_STR_BUTTON;
    if (!str && GameManger.instance) {
      str = GameManger.instance.sound_click;
    }

    AudioManager.getInstance().playSFX(str, null);
    // }
    // AudioManager.playBGM(this.SOUND_SCENE, false);
  }
  // _onTouchCancel(event) {
  //   cc.log('_onTouchCancel');
  // }
  // _onMouseMoveIn(event) {
  //   cc.log('_onMouseMoveIn');
  // }
  // _onMouseMoveOut(event) {
  //   cc.log('_onMouseMoveOut');
  // }

  onDestroy() {
    this.unscheduleAllCallbacks();
    // this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    // this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    // this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    // this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

    // this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    // this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);

    this.node.targetOff(this);
  }
}
