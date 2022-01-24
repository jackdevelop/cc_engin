import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameLocalStorageConstants } from '../../../../cc_own/constants/GameLocalStorageConstants';
import { NetWork } from '../server/NetWork';
import { code_constants } from '../../../../cc_own/constants/code_constants';
import { GameConfig } from '../../../../cc_own/config/GameConfig';
import { PromiseUtil } from '../util/PromiseUtil';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');

/**
 *  GameHelp 类
 */
@ccclass
export class GameHelp {
  // /**
  //  *  获取用户的 deviceID
  //  * @param {string} phone
  //  * @returns {any}
  //  */
  // public static getDevice(user_code: string, phone: string) {
  //   let last_login_device = '';

  //   if (cc.sys.isNative) {
  //     if (cc.sys.platform == cc.sys.WIN32) {
  //       last_login_device = cc.sys.platform + '_';
  //     } else if (cc.sys.platform == cc.sys.MACOS) {
  //       last_login_device = cc.sys.platform + '_';
  //     } else if (cc.sys.platform == cc.sys.ANDROID) {
  //       last_login_device = jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/DeviceUtil',
  //         'getUniqueID',
  //         '()Ljava/lang/String;'
  //       ); //org.cocos2dx.sscq.util;
  //     } else {
  //       last_login_device = jsb.reflection.callStaticMethod(
  //         'GameHelper',
  //         'getUniqueID'
  //       );
  //     }

  //     // cc.log(cc.sys.WIN32, cc.sys.OS_WINDOWS, last_login_device, '第二次');
  //   } else {
  //     if (cc.sys.isBrowser) {
  //       last_login_device =
  //         cc.sys.platform +
  //         '_' +
  //         cc.sys.browserType +
  //         '_' +
  //         cc.sys.browserVersion +
  //         '_' +
  //         user_code +
  //         '_' +
  //         phone;
  //     }
  //   }

  //   // cc.log(last_login_device);
  //   if (!last_login_device) {
  //     last_login_device = 'unkonw';
  //   }

  //   return last_login_device;
  // }

  // /**
  //  *  获取手机名称
  //  *
  //  * @returns {any}   HUAWEI-IM1750
  //  */
  // public static getDeviceName() {
  //   let s: string = null;
  //   if (cc.sys.isNative) {
  //     if (cc.sys.platform == cc.sys.WIN32) {
  //       s = cc.sys.platform + '_';
  //     } else if (cc.sys.platform == cc.sys.ANDROID) {
  //       s = jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/DeviceUtil',
  //         'getSystemModel',
  //         '()Ljava/lang/String;'
  //       );
  //     } else {
  //       s = jsb.reflection.callStaticMethod('DeviceUtil', 'getSystemModel');
  //     }
  //   } else {
  //     if (cc.sys.isBrowser) {
  //       s =
  //         cc.sys.platform +
  //         '_' +
  //         cc.sys.browserType +
  //         '_' +
  //         cc.sys.browserVersion +
  //         '_'; //+ user_code + "_" + phone
  //     }
  //   }

  //   if (!s) {
  //     s = 'unkonw';
  //   }
  //   return s;
  // }

  // /**
  //  *  获取用户的  经纬度
  //  * @param {string} phone
  //  * @returns {any}
  //  */
  // public static getLocation() {
  //   let str = '0_0';
  //   if (cc.sys.isNative) {
  //     if (cc.sys.platform == cc.sys.WIN32) {
  //       str = '0_0'; // "121.47_31.23" // str =  "上海"
  //     } else if (cc.sys.platform == cc.sys.MACOS) {
  //       str = '0_0'; //"121.47_31.23" // str =  "上海"
  //     } else if (cc.sys.platform == cc.sys.ANDROID) {
  //       str = jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/GameHelper',
  //         'getLocation',
  //         '()Ljava/lang/String;'
  //       ); //org.cocos2dx.sscq.util;
  //     } else {
  //       str = jsb.reflection.callStaticMethod('GameHelper', 'getLocation');
  //     }
  //   } else {
  //     if (cc.sys.isBrowser) {
  //       str = '0_0';
  //     }
  //   }
  //   // cc.log(str + ' ============ 获取出经纬度');
  //   if (!str) {
  //     str = 'unkonw';
  //   }
  //   return str;
  // }

  // /**
  //  *  复制剪贴板
  //  **/
  // public static copyTextToClipboard(str) {
  //   if (cc.sys.isNative) {
  //     return jsb.copyTextToClipboard(str);
  //   } else {
  //     if (window.clipboardData) {
  //       // 浏览器
  //       window.clipboardData.setData('Text', str);
  //     } else {
  //       var input = str;
  //       const el = document.createElement('textarea');
  //       el.value = input;
  //       el.setAttribute('readonly', '');
  //       el.style.contain = 'strict';
  //       el.style.position = 'absolute';
  //       el.style.left = '-9999px';
  //       el.style.fontSize = '12pt'; // Prevent zooming on iOS

  //       const selection = getSelection();
  //       var originalRange = false;
  //       if (selection.rangeCount > 0) {
  //         originalRange = selection.getRangeAt(0);
  //       }
  //       document.body.appendChild(el);
  //       el.select();
  //       el.selectionStart = 0;
  //       el.selectionEnd = input.length;

  //       var success = false;
  //       try {
  //         success = document.execCommand('copy');
  //       } catch (err) {
  //         cc.log('err');
  //       }

  //       document.body.removeChild(el);

  //       if (originalRange) {
  //         selection.removeAllRanges();
  //         selection.addRange(originalRange);
  //       }

  //       return success;
  //     }
  //   }
  // }

  // //获取剪贴板内容
  // public static getCopyTextToClipboard(txtinpute) {
  //   let result = '';
  //   if (cc.sys.isNative) {
  //     // jsb.reflection.callStaticMethod("com/sscq/util/GameHelper", "getCopyTextToClipboard", "(Ljava/lang/String;)V", "this is a message from js");
  //     if (cc.sys.platform == cc.sys.WIN32) {
  //     } else if (cc.sys.platform == cc.sys.ANDROID) {
  //       result = jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/GameHelper',
  //         'getCopyTextToClipboard',
  //         '()Ljava/lang/String;'
  //       );
  //     } else {
  //       result = jsb.reflection.callStaticMethod(
  //         'GameHelper',
  //         'getCopyTextToClipboard'
  //       );
  //     }
  //     // cc.log(result);
  //     return result;
  //     //cc.log(getSelection().toString());
  //     // jsb.copyTextToClipboard(str);
  //   } else {
  //     // return  document.execCommand('copy')

  //     // return getSelection().toString()

  //     // var input = str;
  //     // const el = document.createElement("textarea");
  //     // el.value = input;
  //     // el.setAttribute("readonly", "");
  //     // el.style.contain = "strict";
  //     // el.style.position = "absolute";
  //     // el.style.left = "-9999px";
  //     // el.style.fontSize = "12pt"; // Prevent zooming on iOS

  //     // const selection = getSelection();
  //     // var originalRange = false;
  //     // if (selection.rangeCount > 0) {
  //     //     originalRange = selection.getRangeAt(0);
  //     // }
  //     // document.body.appendChild(el);
  //     // el.select();
  //     // el.selectionStart = 0;
  //     // el.selectionEnd = input.length;

  //     var success = false;
  //     try {
  //       success = document.execCommand('copy');
  //     } catch (err) {
  //       cc.log('error');
  //     }

  //     // cc.log(success);
  //     // cc.log(getSelection().toString());
  //     cc.log(success, getSelection().toString(), window.getSelection());

  //     // document.body.removeChild(el);

  //     // if (originalRange) {
  //     //     selection.removeAllRanges();
  //     //     selection.addRange(originalRange);
  //     // }
  //   }
  // }

  // /**
  //  *  获取包名
  //  */
  // public static getPackName() {
  //   let s = null;
  //   if (cc.sys.isNative) {
  //     if (cc.sys.platform == cc.sys.WIN32) {
  //       s = null;
  //     } else if (cc.sys.platform == cc.sys.ANDROID) {
  //       s = jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/GameHelper',
  //         'getPackName',
  //         '()Ljava/lang/String;'
  //       ); //org.cocos2dx.sscq.util;
  //     } else {
  //       s = jsb.reflection.callStaticMethod('GameHelper', 'getPackName');
  //     }
  //   } else {
  //     if (cc.sys.isBrowser) {
  //       s = null;
  //     }
  //   }
  //   return s;
  // }

  // /**
  //  *  隐藏启动页
  //  */
  // public static hideLauncher() {
  //   if (cc.sys.isNative) {
  //     // jsb.reflection.callStaticMethod("com/sscq/util/GameHelper", "getCopyTextToClipboard", "(Ljava/lang/String;)V", "this is a message from js");
  //     if (cc.sys.platform == cc.sys.ANDROID) {
  //       jsb.reflection.callStaticMethod(
  //         'org/cocos2dx/sscq/util/GameHelper',
  //         'hideLauncher',
  //         '()V'
  //       );
  //     } else {
  //       //result = jsb.reflection.callStaticMethod("GameHelper","getCopyTextToClipboard");
  //     }
  //     //cc.log(getSelection().toString());
  //     // jsb.copyTextToClipboard(str);
  //   }
  // }

  //++++++++++++++++++=================================================================================================================
  //========== 基本的静态方法 ===========================================================================================================================
  //=====================================================================================================================================

  /**
   *  获取本机版本号
   * @returns {any}
   */
  public static getVersion() {
    let version =
      cc.sys.localStorage.getItem(
        GameLocalStorageConstants.LOCALSTORAGE_Login_VERSION
      ) || GameConfig.VERSION;

    return version;
  }

  /**
   *  加载文件 从  EXCEL_TO_DB 中
   * @param name
   */
  public static loadFromFileBy_EXCEL_TO_DB(name: string, dir: string) {
    var EXCEL_TO_DB = require('EXCEL_TO_DB');
    return new Promise((resolve, reject) => {
      EXCEL_TO_DB.loadFromFile(name, dir, function (data) {
        resolve(data);
      });
    });
  }
  //在登录开始 已经加载了全部的资源  直接获取
  public static getFromFileBy_EXCEL_TO_DB(name: string) {
    var EXCEL_TO_DB = require('EXCEL_TO_DB');

    return EXCEL_TO_DB.getFromFile(name);
  }

  /**
    *  使用方法 ： 
    *  
       let str = "fdsafdsaf%{name},adafds{1}";
       let ret1 = GameHelp.get_template_string(str,{name:123});

    * 
    * 显示一个多参数的模板字符串
    * @param template 伪模板字符串,使用{index}来表示参数,index表示参数序号;如果参数不存在,则使用undefined代替
    * @param params 多个参数;注意排序
    */
  private static get_template_string(template: string, params) {
    // return template.replace(/\{([0-9]+?)\}/g,((match, index) =>{
    return template.replace(
      /\%{(\S)+?\}/g,
      (match, key, beginIdx, endIdx, s) => {
        // return template.replace(/\{(?)\}/g,((match, index) =>{
        //cc.log("aaaaaaaaaaa",match,key,s)
        let one = match.slice(2, -1);
        // cc.log('aaaaaaaaaaa', one, match, key, s);
        return params[one]; //|| '' || `\{${one}\}`
      }
    );
  }

  /**
   *  获取  表中配置的语言包
   * @param id
   * @param params
   */
  static get_i18n_str(id, params) {
    if (!id) {
      return '';
    }

    let LanguageConfig = this.getFromFileBy_EXCEL_TO_DB('LanguageConfig');
    let one_LanguageConfig = LanguageConfig[id];

    if (one_LanguageConfig) {
      //cc.log(one_LanguageConfig, GameConfig.language);
      let current_LanguageConfig =
        one_LanguageConfig[GameConfig.language] || one_LanguageConfig.zn;
      if (current_LanguageConfig) {
        // cc.log(current_LanguageConfig);
        return this.get_template_string(current_LanguageConfig, params);
      }
    }
    return null;
  }

  // /**
  //  * 验证目标类的ins实例是否唯一
  //  * @todo 可能考虑使用装饰器实现
  //  * @param target
  //  */
  // static check_ins(target: any) {
  //   target.instance &&
  //     cc.error(`@${target.name}: repeat init instance, please check`);
  // }

  /**
   * 手动刷新widget1次,并在刷新完毕后置于false
   * @param node
   */
  static check_widget(node: cc.Node) {
    let w: cc.Widget = node.getComponent(cc.Widget);
    if (w && w.enabled) {
      w.updateAlignment();
      if (
        w.alignMode == cc.Widget.AlignMode.ONCE ||
        w.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE
      ) {
        w.enabled = false;
      }
    }
  }

  /**
     通过制定的layerName获取层
     **/
  public static getLayerBySceneLayerName(parentLayerName: string): cc.Node {
    // var Canvas = this.getCanvas();
    var canvas = cc.find('Canvas');
    var currentLayer = canvas.getChildByName(parentLayerName);
    return currentLayer;
  }

  // /**
  //    获取canvas
  //    **/
  // public static getCanvas(): cc.Node {
  //   var canvas = cc.find('Canvas');
  //   return canvas;
  // }

  /**
   *  设置层级
   * @param child
   */
  public static setTopZOrder(child, zorder: number) {
    let node = child.node || child;

    // cc.log("层级：", zorder);
    if (_.isNumber(zorder)) {
      // child.node.zIndex = zorder;
      node.setSiblingIndex(zorder);
      // child.node.zIndex = zorder;
    } else {
      // child.node.zIndex = GameConstants.DEFAULT_OBJECT_ZORDER;
      node.setSiblingIndex(GameConstants.DEFAULT_OBJECT_ZORDER);
      // child.node.zIndex = GameConstants.DEFAULT_OBJECT_ZORDER;
    }
    // if (child.node.setLocalZOrder)
    //   child.node.setLocalZOrder(GameConstants.DEFAULT_OBJECT_ZORDER);
  }

  // static wait_time(time: number, node: cc.Component) {
  //   PromiseUtil.wait_time(time, node);
  // }
  //++++++++++++++++++=================================================================================================================
  //======= 加载 ==============================================================================================================================
  //=====================================================================================================================================

  // public static _load<T extends typeof cc.Asset>(
  //   prefab_url: string,
  //   type: T
  // ): Promise<InstanceType<T>> {
  //   return new Promise((resolve, reject) => {
  //     // cc.resources.load({ url: prefab_url, type: type }, function (
  //     cc.resources.load(prefab_url, type, function (err, resObj) {
  //       if (err) {
  //         return reject(false);
  //       }
  //       return resolve(resObj);
  //     });
  //   });
  // }

  // /**
  //  *  加载 本地 resource 下的 图片
  //  *
  //  * @param prefab_url
  //  * @param type
  //  */
  // public static async load<T extends typeof cc.Asset>(
  //   prefab_url: string,
  //   type: T
  // ): Promise<InstanceType<T>> {
  //   try {
  //     const res = await this._load(prefab_url, type);
  //     return res;
  //   } catch (err) {
  //     return null; //await this.load(prefab_url, type);
  //   }
  // }

  // /**
  //  * 载入dir资源
  //  * - [注意] 编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
  //  * @param path
  //  * @param type
  //  */
  // static load_res_dir<T extends typeof cc.Asset>(
  //   path: string,
  //   type: T
  // ): Promise<InstanceType<T>[]> {
  //   return new Promise((res) => {
  //     cc.resources.loadDir(path, type, (err, resource) => {
  //       err && cc.warn(`load res dir fail, path=${path}, err=${err}`);
  //       err ? res(null) : res(resource);
  //     });
  //   });
  // }

  // /**
  //  *  加载spine 动画
  //  * @param path
  //  * @param type
  //  */
  // static load_spine<T extends typeof cc.Asset>(
  //   path: string
  // ): Promise<InstanceType<T>[]> {
  //   return new Promise((res) => {
  //     cc.resources.load(
  //       path,
  //       sp.SkeletonData,
  //       (completeCount, totalCount, item) => {
  //         // cc.log('');
  //       },
  //       (err, resource) => {
  //         err && cc.warn(`load res dir fail, path=${path}, err=${err}`);
  //         err ? res(null) : res(resource);
  //       }
  //     );
  //   });
  // }

  // /**
  //  * 远程加载 或者 本地磁盘加载
  //  * @param prefab_url
  //  * @param type
  //  */
  // private static _load_net<T extends typeof cc.Asset>(
  //   prefab_url: string,
  //   type: T //{ext: '.png'}
  // ): Promise<InstanceType<T>> {
  //   return new Promise((resolve, reject) => {
  //     if (type) {
  //       cc.assetManager.loadRemote(prefab_url, type, function (err, resObj) {
  //         if (err) {
  //           return reject(false);
  //         }
  //         // resObj.addRef();
  //         return resolve(resObj);
  //       });
  //     } else {
  //       cc.assetManager.loadRemote(prefab_url, function (err, resObj) {
  //         if (err) {
  //           return reject(false);
  //         }
  //         // resObj.addRef();
  //         return resolve(resObj);
  //       });
  //     }
  //   });
  // }
  // public static async load_net<T extends typeof cc.Asset>(
  //   prefab_url: string,
  //   type: T
  // ): Promise<InstanceType<T>> {
  //   try {
  //     const res = await this._load_net(prefab_url, type);
  //     // cc.assetManager.releaseAsset(res);
  //     return res;
  //   } catch (err) {
  //     return null; //await this.load(prefab_url, type);
  //   }
  // }

  //++++++++++++++++++=================================================================================================================
  //======= imageLoadTool ==============================================================================================================================
  //=====================================================================================================================================

  /**
   *  这是在真机上的调试显示
   *
   * @param {*} url
   */
  public static async imageLoadTool(url: string) {
    if (!cc.sys.isNative && cc.sys.isMobile) {
      return;
    }

    var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
    cc.log('dirpath ->', dirpath);

    // var md5Sign = require('signMd5').md5Sign;
    // let md5URL = md5Sign(url);
    let md5URL = window.btoa(url);
    var filepath = dirpath + md5URL + '.jpg';

    cc.log('filepath ->', filepath);
    if (jsb.fileUtils.isFileExist(filepath)) {
      cc.log('Remote is find' + filepath);
      // loadEnd();

      let tex = await GameHelp.load(filepath, 'jpg');
      var spriteFrame = new cc.SpriteFrame(
        tex
        // cc.Rect(0, 0, tex.width, tex.height)
      );
      // spriteFrame.retain();
      return spriteFrame;
    }

    let response = await NetWork.getInstance().request_http(url, null);
    if (typeof response !== 'undefined') {
      if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
      } else {
        cc.log('路径exist');
      }

      // new Uint8Array(data) writeDataToFile  writeStringToFile
      if (jsb.fileUtils.writeDataToFile(new Uint8Array(response), filepath)) {
        cc.log('Remote write file succeed.');
        // loadEnd();
        // let tex = await GameHelp.load(filepath, 'jpg');
        let tex = await GameHelp.load(filepath, null);
        var spriteFrame = new cc.SpriteFrame(
          tex
          // cc.Rect(0, 0, tex.width, tex.height)
        );
        // spriteFrame.retain();
        return spriteFrame;
      } else {
        cc.log('Remote write file failed.');
      }
    } else {
      cc.log('Remote download file failed.');
    }
  }
}
