export class DeplinkHelp {
  public static get_deplink_data() {
    let s: string = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = null;
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          "org/cocos2dx/sscq/util/DeplinkUtil",
          "get_deplink_data",
          "()Ljava/lang/String;"
        );
      } else {
        s = jsb.reflection.callStaticMethod("GameHelper", "get_deplink_data");
      }
    } else {
      if (cc.sys.isBrowser) {
        s = null;
      }
    }
    return s;
  }
  public static set_deplink_data() {
    let s: string = null;
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
        s = null;
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        s = jsb.reflection.callStaticMethod(
          "org/cocos2dx/sscq/util/DeplinkUtil",
          "set_deplink_data",
          "()V"
        );
      } else {
        s = jsb.reflection.callStaticMethod("GameHelper", "set_deplink_data");
      }
    } else {
      if (cc.sys.isBrowser) {
        s = null;
      }
    }
    return s;
  }
  public static init() {
    let s = this.get_deplink_data();
    if (s) {
      this.onResp(s);
    }
  }
  public static onResp(ret_str: string) {
    this.set_deplink_data();
    if (!ret_str) {
      return;
    }
    let ret_arr = ret_str.split("_");
    let uri = ret_arr[0];
    let data = ret_arr[1];
    this.analysis_data(data);
    this.analysis_uri(uri);
  }
  private static analysis_uri(uri) {
    return true;
  }
  private static analysis_data(data) {
    if (data) {
      let data_arr = data.split("&");
      let packagename = data_arr[0];
      let device = data_arr[1];
      if (device) {
        return;
      }
    }
  }
}
