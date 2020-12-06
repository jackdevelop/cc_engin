

import { ToolTips } from '../../../tooltips/ToolTips';
import { BaseNet } from './BaseNet';
import { Socket } from "./phoenix/phoenix.js";


export class NetPhoenix extends BaseNet {
  
  private _webSocket = null;
  
  public _isJson = true;

  
  private m_all_channel = null

  
  public prepareWebSocket(ip, port, netName, param, fun) {
    if (!param) param = new Object();
    this.m_all_channel= new Object();

    var self = this;
    if (!window.WebSocket) {
      cc.log('您的浏览器不支持websocket');
      return false;
    }
    super.prepareWebSocket(ip, port, netName, null, null);

    
    var ws_mark = 'ws';
    var serverUrl =
      ws_mark +
      '://' +
      ip +
      ':' +
      port 
      
      
      
      
      
      

    cc.log('请求socket连接：serverUrl=' + serverUrl);
   

    let _webSocket = new Socket(`${serverUrl}/socket`, {
      params: param,
    });
    _webSocket.connect();
    this._serverUrl = serverUrl;
    this._webSocket = _webSocket;

    
    this.join_channel(null)

    
    _webSocket.onOpen(function (event) {
      cc.log('连接成功' + event);
      self._onConnection(event);

      if (fun) {
        fun();
      }
    })
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    _webSocket.onClose (function (event) {
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
    })
    
    _webSocket.onError ( function (event) {
      cc.log('错误发生' + JSON.stringify(event), this._dispatchEvent);
      if (event == null) event = new Object();
      event.data = { netName: self._netName };
      self._onError(event);
    })

    return _webSocket;
  }

  
  public isConnect() {
    if (this._webSocket && this._webSocket.isConnected()) {
      return true;
    }
    return false;
  }

  
  public send(cmd, param, callback,channel_name) {
    var self = this;
    cc.log(cmd, this._webSocket);
    if (cmd == null) {
      return;
    }

    if (!this._webSocket) {
      return;
    }

    
      var sessionId = super.send(cmd, param, null,channel_name);

      
      if (self._isJson == true) {

        if (param == null) param = new Object();
        param.cmd = cmd;
        param.sessionId = sessionId;

        if (!channel_name) channel_name = "game_center:hall"
        let channel = self.m_all_channel[channel_name] ;
        if(channel){
          cc.log(
            '全部消息发送 start => cmd: ' +
              cmd +
              ',param:' +
              param +
              
              ', sessionId : ' +
              sessionId
          );

            channel.push(cmd,param)
            .receive("ok", (payload) =>{
              cc.log("回调消息成功：", payload) 
              if (callback) callback(payload);
            })
            .receive("error", (err) =>{ 
              cc.log("发送消息错误", err)
              ToolTips.show("发送消息错误");
            })
            .receive("timeout", () => {
              cc.log("发送消息超时")
              ToolTips.show("发送消息超时");
            });
        }

      } else {
        
        
        
      }
    
  }

  
  public close(dispatchEvent = true) {
    this._dispatchEvent = dispatchEvent;

    cc.log('NetWebSocket.js 断开连接', this._netName, dispatchEvent);
    if (!this._webSocket) {
      return;
    }
    this._webSocket.close();
    this._webSocket.disconnect();
    super.close();

    return true ;
  }






  
  
  
  
  
  public join_channel (channel_name){
    let self = this 
    if (!channel_name) channel_name = "game_center:hall"

    let _webSocket = this._webSocket
    
    const channel = _webSocket.channel(channel_name);
    channel.join()
    .receive("ok", ({ messages }) =>{ 
      cc.log("加入频道成功", messages)

      self.m_all_channel[channel_name] = channel;
    })
    .receive("error", ({ reason }) => {
      cc.log("加入失败", reason)
      ToolTips.show("加入失败" + reason);
    })
    .receive("timeout", () =>{ 
        cc.log("加入频道超时...")
        ToolTips.show("超时");
    });

    channel.on("cmd", (data) => {
        cc.log("主动接收到服务器消息：",data)
        self._handleMessage_req(null, data);
    })
  }
  
  public leave_channel (channel_name){
    let self = this 
    if (!channel_name) channel_name = "game_center:hall"

    
    
    const channel =this.m_all_channel[channel_name];
    channel.leave()
    .receive("ok", ({ messages }) =>{ 
      cc.log("退出频道成功", messages)

      self.m_all_channel[channel_name] = channel;
    })
    .receive("error", ({ reason }) => {
      cc.log("退出失败", reason)
      ToolTips.show("退出失败" + reason);
    })
    .receive("timeout", () =>{ 
        cc.log("退出频道超时...")
        ToolTips.show("超时");
    });
    
    
    
    
  }
}
