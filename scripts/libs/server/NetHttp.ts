// import sys = cc.sys;
var _ = require('Underscore');

/**
 *NetHttp.js
 *
 */
export class NetHttp {
  // baseURL:"http://192.168.1.155",
  // wsURL : "http://192.168.1.155:9081",
  // public static  authorization: null

  /**
   * fetch+get+json
   * @param url
   */
  static async fetch_get_json(url: string): Promise<object> {
    try {
      let response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      // FMLog.error(error)
      return null;
    }
  }

  /**
   * fetch+post+json
   * @param url
   * @param body
   */
  static async fetch_post_json(url: string, body: object): Promise<object> {
    try {
      let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      // FMLog.error(error)
      return null;
    }
  }

  /**
   * XMLHttpRequest+get+json
   * @param url
   */
  static xhr_get_json(
    url: string,
    param,
    header_data: object
  ): Promise<object> {
    let new_url = url + '?';
    for (var key in param) {
      if (param[key]) {
        new_url += key + '=' + param[key] + '&';
      }
    }

    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', new_url, true);
        // xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          throw new Error('xhr-on-timeout');
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            res(xhr.response);
          } else {
            throw new Error('xhr-status-not-200-400');
          }
        };
        xhr.send();
      } catch (error) {
        cc.log('xhr_get_json:' + error);
        // FMLog.error(error)
        res(null);
      }
    });
  }

  /**
   * XMLHttpRequest+post+json
   * @param url
   * @param body
   */
  static async xhr_post_json(
    url: string,
    body: object,
    header_data: object
  ): Promise<object> {
    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', url, true);

        // xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
        // // xhr.setRequestHeader('Access-Control-Allow-Headers', "x-requested-with,Authorization，Content-Type");
        // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
        // xhr.setRequestHeader("Access-Control-Allow-Methods", "*");
        // // xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
        // xhr.setRequestHeader("Access-Control-Expose-Headers", "*");
        // xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, " +
        // "WG-App-Version, WG-Device-Id, WG-Network-Type, WG-Vendor, WG-OS-Type, WG-OS-Version, WG-Device-Model, WG-CPU, WG-Sid, WG-App-Id, WG-Token");
        // xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET");

        _.each(header_data, function (v, k) {
          xhr.setRequestHeader(k, v);
        });

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          res(null);
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          res(null);
          throw new Error('xhr-on-timeout');
        };
        // xhr.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            cc.log(JSON.stringify(xhr));
            res(xhr.response);
          } else {
            res(null);
            // throw new Error("xhr-status-not-200-400")
          }
        };
        xhr.send(JSON.stringify(body));
      } catch (error) {
        cc.log('xhr_post_json:' + error);
        // FMLog.error(error)
        res(null);
      }
    });
  }

  /**
   * XMLHttpRequest+put+json
   * @param url
   * @param body
   */
  static async xhr_put_json(url: string, body: object): Promise<object> {
    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('PUT', url, true);
        // xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          throw new Error('xhr-on-timeout');
        };
        // xhr.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            res(xhr.response);
          } else {
            res(null);
            throw new Error('xhr-status-not-200-400');
          }
        };
        xhr.send(JSON.stringify(body));
      } catch (error) {
        // FMLog.error(error)
        res(null);
      }
    });
  }

  // /**
  //  *  get 请求
  //  * @param url
  //  * @param success
  //  * @param error
  //  * @param object
  //  */
  //
  // private static encodeFormData(data) {
  //     var pairs = [];
  //     var regexp = /%20/g;
  //
  //     for (var name in data) {
  //         if (data[name]) {
  //             var value = data[name].toString();
  //             var pair =
  //                 encodeURIComponent(name).replace(regexp, '+') +
  //                 '=' +
  //                 encodeURIComponent(value).replace(regexp, '+');
  //             pairs.push(pair);
  //         }
  //     }
  //     return pairs.join('&');
  // }
  // public static httpGet(url:string, success, error, object) {
  //   var xhr = cc.loader.getXMLHttpRequest();
  //   xhr.responseType = 'arraybuffer';
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status >= 200 && xhr.status < 300) {
  //         var respone = xhr.responseText;
  //         if (success) {
  //           success(respone, object);
  //         }
  //       } else {
  //         if (error) {
  //           error(object);
  //         }
  //       }
  //     }
  //   };
  //
  //   xhr.open('GET', url, true);
  //   if (this.authorization != null) {
  //     xhr.setRequestHeader('authorization', this.authorization);
  //   }
  //   if (cc.sys.isNative) {
  //     xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
  //   }
  //
  //   xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  //   // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
  //   // xhr.setRequestHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  //   // xhr.setRequestHeader("X-Powered-By",' 3.2.1')
  //   // xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  //
  //   //超时回调
  //   xhr.ontimeout = function(event) {
  //     if (error) error(object);
  //   };
  //   xhr.onerror = function(event) {
  //     if (error) error(object);
  //   };
  //
  //   // note: In Internet Explorer, the timeout property may be set only after calling the open()
  //   // method and before calling the send() method.
  //   xhr.timeout = 3000; // 5 seconds for timeout
  //
  //   xhr.send();
  // }
  //
  //
  // /**
  //  *  post 方法
  //  *
  //  * @param url
  //  * @param params
  //  * @param success
  //  * @param error
  //  * @param object
  //  */
  // public static httpPost(
  //   url:string,
  //   params:any ,
  //   success,
  //   error,
  //   object,
  //   isshowerror = true,
  // ) {
  //
  //   var xhr = new XMLHttpRequest(); //cc.loader.getXMLHttpRequest();
  //
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status >= 200 && xhr.status < 400) {
  //         var respone = xhr.responseText;
  //        cc.log('http.post 返回数据：' + respone);
  //         if (success) {
  //           success(respone, object);
  //         }
  //       } else {
  //         if (isshowerror == true) {
  //           // var ToolTips = require('ToolTips');
  //           // const i18n = require('LanguageData');
  //           // ToolTips.show(i18n.t('label.21'));
  //         }
  //         // var LoadingChrysanthemum = require('LoadingChrysanthemum');
  //         // LoadingChrysanthemum.hide();
  //         if (error) {
  //           error(object);
  //         }
  //       }
  //     }
  //   };
  //   xhr.open('POST', url, true);
  //   if (this.authorization !== null) {
  //     xhr.setRequestHeader('authorization', this.authorization);
  //   }
  //   if (cc.sys.isNative) {
  //     xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
  //   }
  //   // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  //   var Content_Type =  'application/json';
  //   xhr.setRequestHeader('Content-Type', Content_Type);
  //   // xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  //   // xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
  //   // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  //   // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
  //   // xhr.setRequestHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  //   // xhr.setRequestHeader("X-Powered-By",' 3.2.1')
  //
  //   // note: In Internet Explorer, the timeout property may be set only after calling the open()
  //   // method and before calling the send() method.
  //   xhr.timeout = 5000; // 5 seconds for timeout
  //
  //   xhr.send(JSON.stringify(params));
  //   // xhr.send( this.encodeFormData(params));
  // }

  // /**
  //  * fetch+post+json
  //  * @param url
  //  * @param body 建议前后端使用interface规定类型
  //  */
  // static async fetch_post_json(url: string, body): Promise<object> {
  //     try {
  //      let response = await fetch(url, {
  //       method: "POST",
  //       mode: "cors",
  //       headers: new Headers({ 'Content-Type': 'application/json' }),
  //       body: JSON.stringify(body),
  //     })
  //     let json = await response.json()
  //
  //        cc.log("发送http请求 url:",url,"请求数据：",JSON.stringify(body),"返回数据：",json)
  //     return json
  //   } catch (error) {
  //      cc.log("网络连接异常");
  //       LogWrap.err(error)
  //     return null
  //   }
  // }
}
