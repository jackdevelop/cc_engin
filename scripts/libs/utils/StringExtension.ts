String.prototype.format = function (...param) {
  //将arguments转化为数组（ES5中并非严格的数组）
  var args = Array.prototype.slice.call(arguments);
  var count = 0;
  //通过正则替换%s
  return this.replace(/%s/g, function (s, i) {
    return args[count++];
  });
};

export class StringExtension {
  //去掉字符串两端的空格
  public static trim(str, is_global) {
    var ret = str;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    } else {
      ret = str.replace(/(^\s*)|(\s*$)/g, '');

      //中间也替换
      if (is_global && is_global.toLowerCase() == 'g') {
        ret = ret.replace(/\s/g, '');
      }
    }

    return ret;
  }

  /**
   *  判断是否为纯数字
   * @param str
   */
  public static isAllNumber(str) {
    var patrn = /^[0-9]*$/;
    if (patrn.test(str)) {
      //mui.toast('不能为纯数字');
      return true;
    }
    return false;
  }

  /**
   * 随机字符串
   * @param length
   */
  static random_string(length: number): string {
    // 默认去掉了容易混淆的字符oO,9gq,Vv,Uu,LlI1
    let random_string_list = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let result = [];
    for (let i = 0; i < length; i += 1) {
      result.push(
        random_string_list[
          Math.trunc(Math.random() * random_string_list.length)
        ]
      );
    }
    return result.join('');
  }



  /**
   *  返回get的一个组装参数 
   * @param path 
   * @param param 
   * @returns 
   */
  public static appendGetPathParams(path: string, param = {},addStr:string = "/") {
    path = path.replace(/(\/+)$/, '');
    for (var key in param) {
        let value = param[key];
        if (value != null && value != undefined) {
            path = path + addStr + value;
        }
    }
    return path;
 }
 public static appendGetPathParams2(path: string, param = {},addStr:string = "&") {
    path = path.replace(/(\/+)$/, '');
    for (var key in param) {
        let value = param[key];
        if (value != null && value != undefined) {
            path = path  + key + "="+ value  +addStr;
        }
    }
    return path;
 }



}
