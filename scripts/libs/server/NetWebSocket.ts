

import { BaseNet } from './BaseNet';
import { Util } from '../utils/Util';
import GameManger from '../../../gamemanager/GameManger';

const PROTOCAL_CORE = require('PROTOCAL_CORE');







export class NetWebSocket extends BaseNet {
  
  private _webSocket = null;
  
  public _isJson = true;

  
  public prepareWebSocket(ip, port, netName, param, fun) {
    if (!param) param = new Object();
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
      port +
      '/' +
      ws_mark +
      '?param=' +
      JSON.stringify(param)
      

    let default_protocol = null;
    if (cc.sys.isNative) {
      default_protocol = ['default-protocol', 'protocol'];
      default_protocol = 'default-protocol';
      default_protocol = []; 
    }

    

    cc.log('请求socket连接：serverUrl=' + serverUrl);
    var _webSocket = this._webSocket;
    if (_webSocket) {
      
      if (_webSocket.readyState === WebSocket.OPEN) {
        
        if (serverUrl != this._serverUrl) {
          
          _webSocket.close(); 
          
        }
      } else {
        
        
      }
    } else {
      
      
    }

    
    
    
    _webSocket = new WebSocket(
      serverUrl,
      default_protocol,
      
    ); 
    _webSocket.binaryType = 'arraybuffer';
    this._serverUrl = serverUrl;
    this._webSocket = _webSocket;

    
    _webSocket.onopen = function (event) {
      cc.log('连接成功' + event);
      
      self._onConnection(event);

      if (fun) {
        fun();
      }
    };
    
    _webSocket.onmessage = function (event) {
      
      var data = event.data;

      
      if (self._isJson == true) {
        var uint8Array = new Uint8Array(data);
        var newdata = Util.Utf8ArrayToStr(uint8Array);
        
        var msg = JSON.parse(newdata);
        cc.log('_webSocket.onmessage:>', newdata);
        if (msg.sessionId) {
          self._handleMessage_rsp(msg.sessionId, msg);
        } else {
          self._handleMessage_req(null, msg);
        }
      } else {
        cc.log('_webSocket.onmessage:>', data);
        
        PROTOCAL_CORE.getRecvPackage(
          data,
          Util.proxy(self._handleMessage_req, self),
          Util.proxy(self._handleMessage_rsp, self)
        );
      }
    };
    
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
    
    _webSocket.onerror = function (event) {
      cc.log('错误发生' + JSON.stringify(event), this._dispatchEvent);
      
      if (event == null) event = new Object();
      event.data = { netName: self._netName };
      self._onError(event);
    };

    return _webSocket;
  }

  
  public isConnect() {
    if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN) {
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

    
    if (this._webSocket.readyState === WebSocket.OPEN) {
      var sessionId = super.send(cmd, param, callback,channel_name);

      cc.log(
        '全部消息发送 start => cmd: ' +
          cmd +
          ',param:' +
          param +
          
          ', sessionId : ' +
          sessionId
      );
      
      if (self._isJson == true) {
        if (param == null) param = new Object();
        param.cmd = cmd;
        param.sessionId = sessionId;
        var str = JSON.stringify(param);
        self._webSocket.send(str);
      } else {
        var str = PROTOCAL_CORE.getSendPackage(cmd, param, sessionId);
        
        
        self._webSocket.send(str);
      }
    }
    
    
    
    
    
    
    
    
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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
