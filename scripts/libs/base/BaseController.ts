import { BaseScene } from './BaseScene';
import { GameNotify } from '../utils/GameNotify';

export class BaseController {
  //当前的场景
  private _scene: BaseScene;

  // /**
  //  *  连接网络
  //  *   并存储
  //  */
  // public constructor() {
  //   var self = this;
  //   this.init();
  // }

  // init() {
  //   return true;
  // }

  // //添加事件
  // m__addEventHandle() {
  //   var self = this;
  //   // if (self.__eventHandle == null) {
  //   //     self.__eventHandle = function(event) {
  //   //         var eventData = event.data;
  //   //         self.m__eventHandle(event);
  //   //     };
  //   //     GameNotify.getInstance().removeAllEventListenersForHandle(self.__eventHandle);
  //   //     GameNotify.getInstance().addEventListener("CMD", self.__eventHandle);
  //   // }
  //   return true;
  // }
  // m__eventHandle(event) {
  // var ret = event.data;
  // var cmd = ret.cmd || ret.p || ret.n || ret.name;
  // switch (cmd) {
  //     case "server_game_start":
  //         let game_id = ret.game_id;
  //         model_hash[game_id+""].getInstance().server_game_start(ret);
  //         break;
  //
  //     default:
  //         break;
  // }
  //   return true;
  // }

  //获取当前的场景
  public getScene(): BaseScene {
    return this._scene;
  }

  /**
   * 只能由 对应的场景  调用
   */
  __onStarted__(scene: BaseScene, ...params) {
    this._scene = scene;
    // this.onStarted(...params);
    // this.m__addEventHandle();
  }

  /**
   * 只能由 对应的场景  调用
   */
  __beforeDestroy__() {
    //清楚事件
    // var GameNotify = require("GameNotify");
    // GameNotify.getInstance().removeAllEventListenersForHandle(
    //   this.__eventHandle
    // );
    // self.__eventHandle = null;
    // this.beforeDestroy();
    this._scene = null;
  }

  // /**
  //  * 场景start方法后调用
  //  */
  // onStarted(...params) {
  //   return true;
  // }

  // /**
  //  * 场景onDestroy方法前调用
  //  */
  // beforeDestroy() {
  //   return true;
  // }
}
