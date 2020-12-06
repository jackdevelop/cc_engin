String.prototype.format = function (...param) {
  
  var args = Array.prototype.slice.call(arguments);
  var count = 0;
  
  return this.replace(/%s/g, function (s, i) {
    return args[count++];
  });
};

export class StringExtension {
  
  public static trim(str, is_global) {
    var ret = str;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    } else {
      ret = str.replace(/(^\s*)|(\s*$)/g, '');

      
      if (is_global && is_global.toLowerCase() == 'g') {
        ret = ret.replace(/\s/g, '');
      }
    }

    return ret;
  }

  
  public static isAllNumber(str) {
    var patrn = /^[0-9]*$/;
    if (patrn.test(str)) {
      
      return true;
    }
    return false;
  }

  
  static random_string(length: number): string {
    
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
}
