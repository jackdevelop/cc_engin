/**
 * Created by Administrator on 2016/12/2.
 */

import { ToolTips } from '../../../tooltips/ToolTips';
import { BaseNet } from './BaseNet';
// import { Socket } from "./phoenix/phoenix.js";
// import { Socket }  = require("phoenix");

export class NetPhoenix extends BaseNet {
  //保存的websocket
  private _webSocket = null;
  //json
  public _isJson = true;

  // 所有的 chanel 
  private m_all_channel = null

  /**
   *  连接websocket
   *
   * @param serverUrl
   * @returns {*}
   */
  public prepareWebSocket(ip, port, netName, param, fun) {
    if (!param) param = new Object();
    this.m_all_channel = new Object();

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
      port
    // +
    // '/' +
    // ws_mark +
    // '?param=' +
    // JSON.stringify(param)
    // window.btoa(JSON.stringify(param));

    cc.log('请求socket连接：serverUrl=' + serverUrl);


    let _webSocket = new Socket(`${serverUrl}/socket`, {
      params: param,
    });
    _webSocket.connect();
    this._serverUrl = serverUrl;
    this._webSocket = _webSocket;

    //自动加入大厅服务 
    this.join_channel(null)

    //绑定连接成功的回调方法
    _webSocket.onOpen(function (event) {
      cc.log('连接成功' + event);
      self._onConnection(event);

      if (fun) {
        fun();
      }
    })
    //绑定消息接收的回调方法
    // _webSocket.onMessage ( function (event) {
    //   cc.log("onMessage >> ",event);
    //   var payload = event.payload;
    //   var data  = payload.response;

    //   //json格式
    //   if (self._isJson == true) {
    //     var msg = data ;
    //     if (msg.sessionId) {
    //       self._handleMessage_rsp(msg.sessionId, msg);
    //     } else {
    //       self._handleMessage_req(null, msg);
    //     }
    //   } else {
    //     cc.log('_webSocket.onmessage:>', data);
    //   }
    // })
    //绑定断开连接的回调方法
    _webSocket.onClose(function (event) {
      self._webSocket = null;
      var BaseScene = require('BaseScene');
      cc.log(
        '断开连接',
        event + ',' + self._netName,
        'BaseScene.__sceneName:' +
        BaseScene.__sceneName +
        'this._dispatchEvent:',
        self._dispatchEvent
      );

      if (!event) event = {}

      event.data = { netName: self._netName };
      self._onClose(event);
    })
    //绑定错误发生的回调方法
    _webSocket.onError(function (event) {
      cc.log('错误发生' + JSON.stringify(event), this._dispatchEvent);
      if (event == null) event = new Object();
      event.data = { netName: self._netName };
      self._onError(event);
    })

    return _webSocket;
  }

  /**
   *  判断当前是否已经连接
   * @param json
   * @returns {boolean}
   */
  public isConnect() {
    if (this._webSocket && this._webSocket.isConnected()) {
      return true;
    }
    return false;
  }

  // 发送数据
  public send(cmd, param, callback, channel_name) {
    var self = this;
    cc.log(cmd, this._webSocket);
    if (cmd == null) {
      return;
    }

    if (!this._webSocket) {
      return;
    }

    // if (this._webSocket.readyState === WebSocket.OPEN) {
    var sessionId = super.send(cmd, param, null, channel_name);


    if (self._isJson == true) {

      if (param == null) param = new Object();
      param.cmd = cmd;
      param.sessionId = sessionId;

      if (!channel_name) channel_name = "game_center:hall"
      let channel = self.m_all_channel[channel_name];
      if (channel) {
        cc.log(
          '全部消息发送 start => cmd: ' +
          cmd +
          ',param:' +
          param +
          // JSON.stringify(param) +
          ', sessionId : ' +
          sessionId
        );

        channel.push(cmd, param)
          .receive("ok", (payload) => {
            cc.log("回调消息成功：", payload)
            payload.cmd = cmd
            if (callback) callback(payload);
          })
          .receive("error", (err) => {
            cc.log("发送消息错误", err)
            ToolTips.show("发送消息错误");
          })
          .receive("timeout", () => {
            cc.log("发送消息超时")
            ToolTips.show("发送消息超时");
          });
      }

    } else {

      // var str = PROTOCAL_CORE.getSendPackage(cmd, param, sessionId);
      // self._webSocket.send(str);
    }
    // }
  }

  /**
   *
   * 关闭
   */
  public close(dispatchEvent = true) {
    this._dispatchEvent = dispatchEvent;

    cc.log('NetWebSocket.js 断开连接', this._netName, dispatchEvent, this._webSocket);
    if (!this._webSocket) {
      return;
    }
    if (this._webSocket.conn) {
      this._webSocket.conn.onclose();
      // this._webSocket.disconnect();
    }
    super.close();

    return true;
  }






  //////////////////////////////////////////////////////////
  //////////// channel 相关 //////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //channel 加入
  public join_channel(channel_name) {
    let self = this
    if (!channel_name) channel_name = "game_center:hall"

    let _webSocket = this._webSocket
    // 【API】设置游戏中心频道并加入
    const channel = _webSocket.channel(channel_name);



    return new Promise((resolve, reject) => {


      channel.join()
        .receive("ok", ({ messages }) => {
          cc.log("加入频道成功", messages)

          self.m_all_channel[channel_name] = channel;


          resolve(channel);
        })
        .receive("error", ({ reason }) => {
          cc.log("加入失败", reason)
          ToolTips.show("加入失败" + reason);

          resolve(null);
        })
        .receive("timeout", () => {
          cc.log("加入频道超时...")
          ToolTips.show("超时");
        });

      channel.on("cmd", (msg) => {
        cc.log("主动接收到服务器消息：", JSON.stringify(msg))
        let data = msg.data
        data.code = msg.code
        data.code_str = msg.code_str
        self._handleMessage_req(null, data);
      })


    });
  }
  //退出频道 
  public leave_channel(channel_name) {
    let self = this
    if (!channel_name) channel_name = "game_center:hall"

    // let _webSocket = this._webSocket
    // 【API】设置游戏中心频道并加入
    const channel = this.m_all_channel[channel_name];
    channel.leave()
      .receive("ok", ({ messages }) => {
        cc.log("退出频道成功", messages)

        self.m_all_channel[channel_name] = channel;
      })
      .receive("error", ({ reason }) => {
        cc.log("退出失败", reason)
        ToolTips.show("退出失败" + reason);
      })
      .receive("timeout", () => {
        cc.log("退出频道超时...")
        ToolTips.show("超时");
      });
    // channel.on("cmd", (data) => {
    //     cc.log("主动接收到服务器消息：",data)
    //     self._handleMessage_req(null, data);
    // })
  }
}
