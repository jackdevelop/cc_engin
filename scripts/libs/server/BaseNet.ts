import { BaseEvent } from "../base/BaseEvent";
import TimeUtil from "../util/TimeUtil";
import { GameNotify } from "../utils/GameNotify";
export class BaseNet extends BaseEvent {
  protected _server_ip: string = null;
  protected _server_port: int = null;
  protected _netName: string = null;
  protected _serverUrl: string = null;
  protected _sessionId: int = 0;
  protected _sessionIdHandlers: any = null;
  protected _dispatchEvent: boolean = true;
  constructor() {
    this._sessionId = 0;
    this._sessionIdHandlers = new Object();
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
  isConnect() {
    return true;
  }
  public send(cmd, param, callback) {
    this._sessionId += 1;
    this._sessionIdHandlers[`${this._sessionId}`] = callback;
    return this._sessionId;
  }
  public close(dispatchEvent = true) {
    return true;
  }
  private _handleMessage_req(name, message) {
    if (!message) message = new Object();
    var name = name || message.cmd;
    cc.log(
      "服务器主动回调：",
      name,
      message,
      ",time:" + TimeUtil.msToHMS(null, null, null)
    );
    message.cmd = name;
    GameNotify.getInstance().serverToClientHandle(message);
  }
  private _handleMessage_rsp(sessionId, message) {
    cc.log(
      "客户端请求的回调：",
      sessionId,
      message,
      ",time:" + TimeUtil.msToHMS(null, null, null),
      ",连接名称:" + this._netName
    );
    const messageHandler = this._sessionIdHandlers[`${sessionId}`];
    if (messageHandler && typeof messageHandler == "function") {
      messageHandler(message);
    }
    this._sessionIdHandlers[`${sessionId}`] = null;
  }
  private _onConnection(event) {
    var e = { name: "CONNECTION", data: this };
    GameNotify.getInstance().onConnection(e);
    this.dispatchEvent(event);
  }
  private _onConnectionLost(event) {
    if (this._dispatchEvent) GameNotify.getInstance().onConnectionLost(event);
  }
  private _onClose(event) {
    if (this._dispatchEvent) {
      GameNotify.getInstance().onConnectionClose(event);
    }
  }
  private _onError(event) {
    if (this._dispatchEvent) GameNotify.getInstance().onConnectionError(event);
  }
}
