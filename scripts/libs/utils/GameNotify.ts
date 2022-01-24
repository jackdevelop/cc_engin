/**
 * GameNotify.js
 * 游戏的消息发送  处理一些全局的事件消息
 *
 * 发送消息的同事 ，还会通过EventProtocol dispath一个event

 */

import { BaseEvent } from '../base/BaseEvent';

// import {BaseEvent} from "../base/BaseEvent";

export class GameNotify extends BaseEvent {
  /**单例实例**/
  private static instance: GameNotify = null;
  public static getInstance(): GameNotify {
    if (this.instance == null) {
      this.instance = new GameNotify();
    }
    return this.instance;
  }

  /**************** 客户端 网络的消息处理 *****************************************************************************************************************************/
  public serverToClientHandle(msg) {
    // var cmd = msg.cmd;
    // params.cmd = cmd;
    // var code = msg.code;// 返回代码(0=成功，其他=失败时的错误代码（待定）)
    // var err = msg.err // success
    // var sn = msg.sn;
    var self = GameNotify.getInstance();
    var event = { name: 'CMD', data: msg };
    self.dispatchEvent(event);
  }

  /**************** 客户端单机的消息处理 *****************************************************************************************************************************/

  //连接失败
  public onConnectionLost(event) {
    var self = GameNotify.getInstance();

    var event = { name: 'CONNECTION_LOST', data: event.data };
    self.dispatchEvent(event);
  }
  //连接关闭
  public onConnectionClose(event) {
    var self = GameNotify.getInstance();

    cc.log('GameNotify.onConnectionClose');
    var event = { name: 'CONNECTION_CLOSE', data: event.data };
    self.dispatchEvent(event);
  }
  //连接错误
  public onConnectionError(event) {
    var self = GameNotify.getInstance();

    cc.log('GameNotify.onConnectionError');
    var event = { name: 'CONNECTION_ERROR', data: event.data };
    self.dispatchEvent(event);
  }
  //连接成功
  public onConnection(event) {
    var self = GameNotify.getInstance();

    var e = { name: 'CONNECTION', data: event.data };
    self.dispatchEvent(e);
  }

  //// 发送命令给客户端。
  //sendCmdResponse: function(event){//event结构 {cmd:CardUtil.ServerNotify.onNewRound,data:{result:1,}}
  //    var cmd = event.cmd;
  //    var data = event.data;
  //
  //    //pomelo 网络消息处理 todo
  //    //1发给自己
  //    //2发给其他人
  //
  //
  //
  //    //广播给所有人
  //    var event = {name:"CMD",data:event};
  //    this.dispatchEvent(event);
  //},
  //// 发送命令给客户端的某一个房间 。
  //sendCmdResponseByRoom: function(event,room){//event结构 {cmd:CardUtil.ServerNotify.onNewRound,data:{result:1,}}
  //    var cmd = event.cmd;
  //    var data = event.data;
  //
  //    //pomelo 网络消息处理 todo
  //    //1发给自己
  //    //2发给其他人
  //
  //    var event = {name:"CMD",data:event};
  //    this.dispatchEvent(event);
  //},
  //
  //// 发送命令给客户端的某一个桌子  。
  //sendCmdResponseByRound: function(event,round){//event结构 {cmd:CardUtil.ServerNotify.onNewRound,data:{result:1,}}
  //    var cmd = event.cmd;
  //    var data = event.data;
  //
  //    //pomelo 网络消息处理 todo
  //    //1发给自己
  //    //2发给其他人
  //
  //    var event = {name:"CMD",data:event};
  //    this.dispatchEvent(event);
  //},
  //
  ////公聊
  //sendAdminMessage: function(event){
  //
  //},
  ////私聊
  //sendPrivateMessage: function(event){
  //
  //}
}
