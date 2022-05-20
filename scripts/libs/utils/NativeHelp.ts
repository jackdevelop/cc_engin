import { NetWork } from '../server/NetWork';
import { code_constants } from '../../../../cc_own/constants/code_constants';
import BrowserUtil from '../util/BrowserUtil';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');

/**
 *  NativeHelp 类
 */
@ccclass
export class NativeHelp {
  /**
   *  获取用户的 deviceID
   * @param {string} phone
   * @returns {any}
   */
  public static getDevice(userid: string, phone: string) {
    let last_login_device = '';

    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        last_login_device = cc.sys.platform + '_';
      } else if (cc.sys.platform == cc.sys.MACOS) {
        last_login_device = cc.sys.platform + '_';
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        last_login_device = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/DeviceUtil',
          'getUniqueID',
          '()Ljava/lang/String;'
        ); //org.cocos2dx.sscq.util;
      } else {
        last_login_device = jsb.reflection.callStaticMethod(
          'GameHelper',
          'getUniqueID'
        );
      }

      // cc.log(cc.sys.WIN32, cc.sys.OS_WINDOWS, last_login_device, '第二次');
    } else {
      if (cc.sys.isBrowser) {
        last_login_device =
          cc.sys.platform +
          '_' +
          cc.sys.browserType +
          '_' +
          cc.sys.browserVersion +
          '_' +
          userid +
          '_' +
          phone;
      }
    }

    // cc.log(last_login_device);
    if (!last_login_device) {
      last_login_device = 'unkonw';
    }

    return last_login_device;
  }

  /**
   *  获取手机名称
   *
   * @returns {any}   HUAWEI-IM1750
   */
  public static getDeviceName() {
    let s: string = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = cc.sys.platform + '_';
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/DeviceUtil',
          'getSystemModel',
          '()Ljava/lang/String;'
        );
      } else {
        s = jsb.reflection.callStaticMethod('DeviceUtil', 'getSystemModel');
      }
    } else {
      if (cc.sys.isBrowser) {
        s =
          cc.sys.platform +
          '_' +
          cc.sys.browserType +
          '_' +
          cc.sys.browserVersion +
          '_'; //+ userid + "_" + phone
      }
    }

    if (!s) {
      s = 'unkonw';
    }
    return s;
  }

  /**
   *  获取用户的  经纬度
   * @param {string} phone
   * @returns {any}
   */
  public static getLocation() {
    let str = '0_0';
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        str = '0_0'; // "121.47_31.23" // str =  "上海"
      } else if (cc.sys.platform == cc.sys.MACOS) {
        str = '0_0'; //"121.47_31.23" // str =  "上海"
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        str = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'getLocation',
          '()Ljava/lang/String;'
        ); //org.cocos2dx.sscq.util;
      } else {
        str = jsb.reflection.callStaticMethod('GameHelper', 'getLocation');
      }
    } else {
      if (cc.sys.isBrowser) {
        str = '0_0';
      }
    }
    // cc.log(str + ' ============ 获取出经纬度');
    if (!str) {
      str = 'unkonw';
    }
    return str;
  }

  /**
   *  复制剪贴板
   **/
  public static copyTextToClipboard(str) {
    if (cc.sys.isNative) {
      return jsb.copyTextToClipboard(str);
    } else {
      BrowserUtil.copy(str);
      // if (window.clipboardData) {
      //   // 浏览器
      //   window.clipboardData.setData('Text', str);
      // } else {
      //   var input = str;
      //   const el = document.createElement('textarea');
      //   el.value = input;
      //   el.setAttribute('readonly', '');
      //   el.style.contain = 'strict';
      //   el.style.position = 'absolute';
      //   el.style.left = '-9999px';
      //   el.style.fontSize = '12pt'; // Prevent zooming on iOS
      //   const selection = getSelection();
      //   var originalRange = false;
      //   if (selection.rangeCount > 0) {
      //     originalRange = selection.getRangeAt(0);
      //   }
      //   document.body.appendChild(el);
      //   el.select();
      //   el.selectionStart = 0;
      //   el.selectionEnd = input.length;
      //   var success = false;
      //   try {
      //     success = document.execCommand('copy');
      //   } catch (err) {
      //     cc.log('err');
      //   }
      //   document.body.removeChild(el);
      //   if (originalRange) {
      //     selection.removeAllRanges();
      //     selection.addRange(originalRange);
      //   }
      //   return success;
      // }
    }
  }

  //获取剪贴板内容
  public static getCopyTextToClipboard(txtinpute) {
    let result = '';
    if (cc.sys.isNative) {
      // jsb.reflection.callStaticMethod("com/sscq/util/GameHelper", "getCopyTextToClipboard", "(Ljava/lang/String;)V", "this is a message from js");
      if (cc.sys.platform == cc.sys.WIN32) {
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        result = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'getCopyTextToClipboard',
          '()Ljava/lang/String;'
        );
      } else {
        result = jsb.reflection.callStaticMethod(
          'GameHelper',
          'getCopyTextToClipboard'
        );
      }
      // cc.log(result);
      return result;
      //cc.log(getSelection().toString());
      // jsb.copyTextToClipboard(str);
    } else {
      // return  document.execCommand('copy')

      // return getSelection().toString()

      // var input = str;
      // const el = document.createElement("textarea");
      // el.value = input;
      // el.setAttribute("readonly", "");
      // el.style.contain = "strict";
      // el.style.position = "absolute";
      // el.style.left = "-9999px";
      // el.style.fontSize = "12pt"; // Prevent zooming on iOS

      // const selection = getSelection();
      // var originalRange = false;
      // if (selection.rangeCount > 0) {
      //     originalRange = selection.getRangeAt(0);
      // }
      // document.body.appendChild(el);
      // el.select();
      // el.selectionStart = 0;
      // el.selectionEnd = input.length;

      var success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        cc.log('error');
      }

      // cc.log(success);
      // cc.log(getSelection().toString());
      cc.log(success, getSelection().toString(), window.getSelection());

      // document.body.removeChild(el);

      // if (originalRange) {
      //     selection.removeAllRanges();
      //     selection.addRange(originalRange);
      // }
    }
  }

  /**
   *  获取包名
   */
  public static getPackName() {
    let s = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = null;
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'getPackName',
          '()Ljava/lang/String;'
        ); //org.cocos2dx.sscq.util;
      } else {
        s = jsb.reflection.callStaticMethod('GameHelper', 'getPackName');
      }
    } else {
      if (cc.sys.isBrowser) {
        s = null;
      }
    }
    return s;
  }

  /**
   *  隐藏启动页
   */
  public static hideLauncher() {
    if (cc.sys.isNative) {
      // jsb.reflection.callStaticMethod("com/sscq/util/GameHelper", "getCopyTextToClipboard", "(Ljava/lang/String;)V", "this is a message from js");
      if (cc.sys.platform == cc.sys.ANDROID) {
        jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'hideLauncher',
          '()V'
        );
      } else {
        //result = jsb.reflection.callStaticMethod("GameHelper","getCopyTextToClipboard");
      }
      //cc.log(getSelection().toString());
      // jsb.copyTextToClipboard(str);
    }
  }

  /**
   *  通过IP、获取当前用户所在的城市
   * @param ip
   */
  public static async getCityByIp(ip: string) {
    let url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip;
    if (cc.sys.isNative) {
      let ret = await NetWork.getInstance().request_http(url, null);
      //cc.log(  JSON.stringify(ret_str))

      // let ret_str = await NetHttp.xhr_get_json(url);
      // let ret = JSON.parse(ret_str)
      // {"code":0,"data":{"ip":"119.139.196.127","country":"中国","area":"",
      //     "region":"广东",
      //     "city":"深圳","county":"XX",
      //     "isp":"电信","country_id":"CN","area_id":"","region_id":"440000","city_id":"440300","county_id":"xx","isp_id":"100017"}}
      if (ret && ret.code == code_constants.SUCCESS) {
        return ret.data;
      }
    }

    return null;
  }
}
