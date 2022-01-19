import { NetWork } from '../server/NetWork';
import { code_constants } from '../../../../cc_own/constants/code_constants';
import BrowserUtil from '../util/BrowserUtil';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');


@ccclass
export class NativeHelp {
  
  public static getDevice(user_code: string, phone: string) {
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
        ); 
      } else {
        last_login_device = jsb.reflection.callStaticMethod(
          'GameHelper',
          'getUniqueID'
        );
      }

      
    } else {
      if (cc.sys.isBrowser) {
        last_login_device =
          cc.sys.platform +
          '_' +
          cc.sys.browserType +
          '_' +
          cc.sys.browserVersion +
          '_' +
          user_code +
          '_' +
          phone;
      }
    }

    
    if (!last_login_device) {
      last_login_device = 'unkonw';
    }

    return last_login_device;
  }

  
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
          '_'; 
      }
    }

    if (!s) {
      s = 'unkonw';
    }
    return s;
  }

  
  public static getLocation() {
    let str = '0_0';
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        str = '0_0'; 
      } else if (cc.sys.platform == cc.sys.MACOS) {
        str = '0_0'; 
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        str = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'getLocation',
          '()Ljava/lang/String;'
        ); 
      } else {
        str = jsb.reflection.callStaticMethod('GameHelper', 'getLocation');
      }
    } else {
      if (cc.sys.isBrowser) {
        str = '0_0';
      }
    }
    
    if (!str) {
      str = 'unkonw';
    }
    return str;
  }

  
  public static copyTextToClipboard(str) {
    if (cc.sys.isNative) {
      return jsb.copyTextToClipboard(str);
    } else {
      BrowserUtil.copy(str);
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    }
  }

  
  public static getCopyTextToClipboard(txtinpute) {
    let result = '';
    if (cc.sys.isNative) {
      
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
      
      return result;
      
      
    } else {
      

      

      
      
      
      
      
      
      
      

      
      
      
      
      
      
      
      
      

      var success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        cc.log('error');
      }

      
      
      cc.log(success, getSelection().toString(), window.getSelection());

      

      
      
      
      
    }
  }

  
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
        ); 
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

  
  public static hideLauncher() {
    if (cc.sys.isNative) {
      
      if (cc.sys.platform == cc.sys.ANDROID) {
        jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/GameHelper',
          'hideLauncher',
          '()V'
        );
      } else {
        
      }
      
      
    }
  }

  
  public static async getCityByIp(ip: string) {
    let url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip;
    if (cc.sys.isNative) {
      let ret = await NetWork.getInstance().request_http(url, null);
      

      
      
      
      
      
      
      if (ret && ret.code == code_constants.SUCCESS) {
        return ret.data;
      }
    }

    return null;
  }
}
