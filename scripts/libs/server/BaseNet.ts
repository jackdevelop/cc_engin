// 父类
// var GameNotify = require("GameNotify");
// var EventProtocol = require("EventProtocol");
// var moment_util = require("moment_util");

import { BaseEvent } from '../base/BaseEvent';
import TimeUtil from '../util/TimeUtil';
import { GameNotify } from '../utils/GameNotify';

export class BaseNet extends BaseEvent {
  //服务ip
  protected _server_ip: string = null;
  protected _server_port: int = null;
  protected _netName: string = null;
  protected _serverUrl: string = null;

  protected _sessionId: int = 0; //记录当前的sessionid
  protected _sessionIdHandlers: any = null; // 服务器消息消息函数

  protected _dispatchEvent: boolean = true; //是否抛送任何事件  默认为抛送

  constructor() {
    this._sessionId = 0;
    this._sessionIdHandlers = new Object();
    // this._dispatchEvent = true;
  }

  protected prepareWebSocket(
    server_ip: string,
    server_port: int,
    netName: string,
    param,
    fun
  ) {
    this._server_ip = server_ip;
    this._server_port = server_port;
    this._netName = netName;
  }

  /**
   *  判断当前是否已经连接
   * @param json
   * @returns {boolean}
   */
  isConnect() {
    return true;
  }

  /**
   *
   * 发送数据
   * @param json
   */
  public send(cmd, param, callback, channel_name) {
    this._sessionId += 1;

    this._sessionIdHandlers[`${this._sessionId}`] = callback;

    return this._sessionId;
  }

  /**
   *
   * 关闭
   */
  public close(dispatchEvent = true) {
    return true;
  }

  /*******************************  private  function  **********************************************************************************************/
  /**
   *  收到数据
   * @param name
   * @param message
   * @private
   */
  protected _handleMessage_req(name, message) {
    if (!message) message = new Object();
    var name = name || message.cmd
    cc.log(
      '服务器主动回调：',
      name,
      message,
      // JSON.stringify(message),
      ',time:' + TimeUtil.msToHMS(null, null, null)
    );

    message.cmd = name;
    GameNotify.getInstance().serverToClientHandle(message);
  }

  protected _handleMessage_rsp(sessionId, message) {
    cc.log(
      '客户端请求的回调：',
      sessionId,
      message,
      // JSON.stringify(message),
      ',time:' + TimeUtil.msToHMS(null, null, null),
      ',连接名称:' + this._netName
    );

    const messageHandler = this._sessionIdHandlers[`${sessionId}`];
    if (messageHandler && typeof messageHandler == 'function') {
      messageHandler(message);
    }
    this._sessionIdHandlers[`${sessionId}`] = null;
  }

  //连接成功
  protected _onConnection(event) {
    var e = { name: 'CONNECTION', data: this };
    GameNotify.getInstance().onConnection(e);

    //这里主要为了 当同时连接几个socket时 抛出连接成功事件  然后取最快的那个
    // 这里是当前抛出事件  并不是 GameNotify
    this.dispatchEvent(e);
  }
  //连接失败
  protected _onConnectionLost(event) {
    if (this._dispatchEvent) GameNotify.getInstance().onConnectionLost(event);
  }
  //关闭
  protected _onClose(event) {
    if (this._dispatchEvent) {
      GameNotify.getInstance().onConnectionClose(event);
    }
  }
  //错误
  protected _onError(event) {
    if (this._dispatchEvent) GameNotify.getInstance().onConnectionError(event);
  }
  /*******************************  心跳的相关处理  **********************************************************************************************/
  // HearbeatTimer
}
