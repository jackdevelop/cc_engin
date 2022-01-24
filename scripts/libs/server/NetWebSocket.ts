/**
 * Created by Administrator on 2016/12/2.
 */

import { BaseNet } from './BaseNet';
import { Util } from '../utils/Util';
import GameManger from '../../../gamemanager/GameManger';

const PROTOCAL_CORE = require('PROTOCAL_CORE');
// var moment_util = require("moment_util");
// var Util = require("Util");
// var GameConfig = require("GameConfig");
// var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

// var BaseNet = require("BaseNet");
// var NetWebSocket = cc.Class({
export class NetWebSocket extends BaseNet {
  //保存的websocket
  private _webSocket = null;
  //json
  public _isJson = true;

  /**
   *  连接websocket
   *
   * @param serverUrl
   * @returns {*}
   */
  public prepareWebSocket(ip, port, netName, param, fun) {
    if (!param) param = new Object();
    var self = this;
    if (!window.WebSocket) {
      cc.log('您的浏览器不支持websocket');
      return false;
    }

    super.prepareWebSocket(ip, port, netName, null, null);

    //标记是ws 还是 wss
    var ws_mark = 'ws';

    var serverUrl =
      ws_mark +
      '://' +
      ip +
      ':' +
      port +
      '/' +
      ws_mark +
      '?param=' +
      JSON.stringify(param)
      // window.btoa(JSON.stringify(param));

    let default_protocol = null;
    if (cc.sys.isNative) {
      default_protocol = ['default-protocol', 'protocol'];
      default_protocol = 'default-protocol';
      default_protocol = []; //protocol
    }

    // serverUrl="ws://192.168.2.2:8950/ws?uid=10058&auth_token=p1CMyR4eW13&room_type=undefined&game_id=undefined&arena_room_id=undefined"

    cc.log('请求socket连接：serverUrl=' + serverUrl);
    var _webSocket = this._webSocket;
    if (_webSocket) {
      //对象存在
      if (_webSocket.readyState === WebSocket.OPEN) {
        //已连接上服务器
        if (serverUrl != this._serverUrl) {
          //服务器地址不同
          _webSocket.close(); //断开连接
          // _webSocket = new WebSocket(serverUrl,default_protocol); //重新创建连接
        }
      } else {
        //还没有连接上服务器
        // _webSocket = new WebSocket(serverUrl,default_protocol);
      }
    } else {
      //对象不存在，创建对象
      // _webSocket = new WebSocket(serverUrl,default_protocol);
    }

    // cc.log('lianjie==========');
    // cc.log(GameManger.instance.wssCacert);
    // serverUrl = "ws://echo.websocket.org"
    _webSocket = new WebSocket(
      serverUrl,
      default_protocol,
      // GameManger.instance.wssCacert
    ); //重新创建连接
    _webSocket.binaryType = 'arraybuffer';
    this._serverUrl = serverUrl;
    this._webSocket = _webSocket;

    //绑定连接成功的回调方法
    _webSocket.onopen = function (event) {
      cc.log('连接成功' + event);
      // self.send("test",{"i":1,"s":"aaaa","f":2.23,"ai":[1,2,3],"si":["a","b","c"]})
      self._onConnection(event);

      if (fun) {
        fun();
      }
    };
    //绑定消息接收的回调方法
    _webSocket.onmessage = function (event) {
      //var str = JSON.stringify(event["data"]);
      var data = event.data;

      //json格式
      if (self._isJson == true) {
        var uint8Array = new Uint8Array(data);
        var newdata = Util.Utf8ArrayToStr(uint8Array);
        //var sz = newdata.length;
        var msg = JSON.parse(newdata);
        cc.log('_webSocket.onmessage:>', newdata);
        if (msg.sessionId) {
          self._handleMessage_rsp(msg.sessionId, msg);
        } else {
          self._handleMessage_req(null, msg);
        }
      } else {
        cc.log('_webSocket.onmessage:>', data);
        //sproto格式;
        PROTOCAL_CORE.getRecvPackage(
          data,
          Util.proxy(self._handleMessage_req, self),
          Util.proxy(self._handleMessage_rsp, self)
        );
      }
    };
    //绑定断开连接的回调方法
    _webSocket.onclose = function (event) {
      this._webSocket = null;
      var BaseScene = require('BaseScene');
      cc.log(
        '断开连接',
        event + ',' + self._netName,
        'BaseScene.__sceneName:' +
          BaseScene.__sceneName +
          'this._dispatchEvent:',
        this._dispatchEvent
      );
      event.data = { netName: self._netName };
      self._onClose(event);
    };
    //绑定错误发生的回调方法
    _webSocket.onerror = function (event) {
      cc.log('错误发生' + JSON.stringify(event), this._dispatchEvent);
      // cc.log(JSON.stringify(event));
      if (event == null) event = new Object();
      event.data = { netName: self._netName };
      self._onError(event);
    };

    return _webSocket;
  }

  /**
   *  判断当前是否已经连接
   * @param json
   * @returns {boolean}
   */
  public isConnect() {
    if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN) {
      return true;
    }
    return false;
  }

  // 发送数据
  public send(cmd, param, callback,channel_name) {
    var self = this;
    cc.log(cmd, this._webSocket);
    if (cmd == null) {
      // var LoadingChrysanthemum = require("LoadingChrysanthemum");
      // LoadingChrysanthemum.hide();
      return;
    }

    if (!this._webSocket) {
      // var LoadingChrysanthemum = require("LoadingChrysanthemum");
      // LoadingChrysanthemum.hide();
      return;
    }

    // cc.log(this._webSocket.readyState);
    if (this._webSocket.readyState === WebSocket.OPEN) {
      var sessionId = super.send(cmd, param, callback,channel_name);

      cc.log(
        '全部消息发送 start => cmd: ' +
          cmd +
          ',param:' +
          param +
          // JSON.stringify(param) +
          ', sessionId : ' +
          sessionId
      );
      //cc.log(JSON.stringify(param));
      if (self._isJson == true) {
        if (param == null) param = new Object();
        param.cmd = cmd;
        param.sessionId = sessionId;
        var str = JSON.stringify(param);
        self._webSocket.send(str);
      } else {
        var str = PROTOCAL_CORE.getSendPackage(cmd, param, sessionId);
        // cc.log(str);
        // cc.log(self._webSocket);
        self._webSocket.send(str);
      }
    }
    // else {
    // var LoadingChrysanthemum = require("LoadingChrysanthemum");
    // LoadingChrysanthemum.hide();
    //this.websocket.string = "xin tiao
    //this.scheduleOnce(function () {
    //    this.sendWebSocketBinary(json);
    //}, 1);
    // }
  }

  // sendPing: function() {
  //   if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN) {
  //    cc.log("发送 ping");
  //     var Buffer = require("Buffer");
  //     this._webSocket.send(Buffer.from(["0x89", "0x0"]));
  //   }
  // },
  // sendPong: function() {
  //   if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN) {
  //    cc.log("发送 pong");
  //     var Buffer = require("Buffer");
  //     this._webSocket.send(Buffer.from(["0x8A", "0x0"]));
  //   }
  // },
  /**
   *
   * 关闭
   */
  public close(dispatchEvent = true) {
    this._dispatchEvent = dispatchEvent;

    cc.log('NetWebSocket.js 断开连接', this._netName, dispatchEvent);
    if (!this._webSocket) {
      return;
    }
    this._webSocket.close();
    super.close();
  }
}
