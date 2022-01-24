// import GamePluginManager from "../../../../plugin/scripts/GamePluginManager";

export class DeplinkHelp {
  //获取 deplink_data
  public static get_deplink_data() {
    let s: string = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = null;
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/DeplinkUtil',
          'get_deplink_data',
          '()Ljava/lang/String;'
        );
      } else {
        s = jsb.reflection.callStaticMethod('GameHelper', 'get_deplink_data');
      }
    } else {
      if (cc.sys.isBrowser) {
        s = null;
      }
    }
    return s;
  }
  //设置  deplink_data
  public static set_deplink_data() {
    let s: string = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = null;
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/util/DeplinkUtil',
          'set_deplink_data',
          '()V'
        );
      } else {
        s = jsb.reflection.callStaticMethod('GameHelper', 'set_deplink_data');
      }
    } else {
      if (cc.sys.isBrowser) {
        s = null;
      }
    }
    return s;
  }

  //第一次启动调用
  public static init() {
    let s = this.get_deplink_data();
    if (s) {
      this.onResp(s);
    }
  }

  /**
   *  deplik 传输的参数
   * @param value
   */
  public static onResp(ret_str: string) {
    this.set_deplink_data(); //清空dplink

    if (!ret_str) {
      return;
    }

    let ret_arr = ret_str.split('_');
    let uri = ret_arr[0]; // uri参数
    let data = ret_arr[1]; //put出来的 data参数

    this.analysis_data(data);
    this.analysis_uri(uri);
  }

  private static analysis_uri(uri) {
    return true;
  }
  private static analysis_data(data) {
    if (data) {
      let data_arr = data.split('&');
      let packagename = data_arr[0];
      let device = data_arr[1];

      if (device) {
        // GamePluginManager.getInstance().is_show_plugin_icon = true;
        // GamePluginManager.getInstance().plugin_deviceID = device;
        return;
      }

      // //可以启动 显示攻城狮图标
      // let mydevice = GameHelp.getDevice(null,null);
      //cc.log("两边的："+mydevice+"|"+device)
      //cc.log(device == mydevice)
      // if(device == mydevice){
      //     GamePluginManager.getInstance().is_show_plugin_icon = true;
      //     GamePluginManager.getInstance().plugin_deviceID = device;
      //     return
      // }
    }
    // GamePluginManager.getInstance().is_show_plugin_icon = false ;
  }
}
