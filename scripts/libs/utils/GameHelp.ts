import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameLocalStorageConstants } from '../../../../cc_own/constants/GameLocalStorageConstants';
import { NetWork } from '../server/NetWork';
import { code_constants } from '../../../../cc_own/constants/code_constants';
import { GameConfig } from '../../../../cc_own/config/GameConfig';
import { PromiseUtil } from '../util/PromiseUtil';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');


@ccclass
export class GameHelp {
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  

  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

  

  
  
  
  

  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  

  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

  
  
  

  

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  

  
  public static getVersion() {
    let version =
      cc.sys.localStorage.getItem(
        GameLocalStorageConstants.LOCALSTORAGE_Login_VERSION
      ) || GameConfig.VERSION;

    return version;
  }

  
  public static loadFromFileBy_EXCEL_TO_DB(name: string, dir: string) {
    var EXCEL_TO_DB = require('EXCEL_TO_DB');
    return new Promise((resolve, reject) => {
      EXCEL_TO_DB.loadFromFile(name, dir, function (data) {
        resolve(data);
      });
    });
  }
  
  public static getFromFileBy_EXCEL_TO_DB(name: string) {
    var EXCEL_TO_DB = require('EXCEL_TO_DB');

    return EXCEL_TO_DB.getFromFile(name);
  }

  
  private static get_template_string(template: string, params) {
    
    return template.replace(
      /\%{(\S)+?\}/g,
      (match, key, beginIdx, endIdx, s) => {
        
        
        let one = match.slice(2, -1);
        
        return params[one]; 
      }
    );
  }

  
  static get_i18n_str(id, params) {
    if (!id) {
      return '';
    }

    let LanguageConfig = this.getFromFileBy_EXCEL_TO_DB('LanguageConfig');
    let one_LanguageConfig = LanguageConfig[id];

    if (one_LanguageConfig) {
      
      let current_LanguageConfig =
        one_LanguageConfig[GameConfig.language] || one_LanguageConfig.zn;
      if (current_LanguageConfig) {
        
        return this.get_template_string(current_LanguageConfig, params);
      }
    }
    return null;
  }

  
  
  
  
  
  
  
  
  

  
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

  
  public static getLayerBySceneLayerName(parentLayerName: string): cc.Node {
    
    var canvas = cc.find('Canvas');
    var currentLayer = canvas.getChildByName(parentLayerName);
    return currentLayer;
  }

  
  
  
  
  
  
  

  
  public static setTopZOrder(child, zorder: number) {
    let node = child.node || child;

    
    if (_.isNumber(zorder)) {
      
      node.setSiblingIndex(zorder);
      
    } else {
      
      node.setSiblingIndex(GameConstants.DEFAULT_OBJECT_ZORDER);
      
    }
    
    
  }

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  

  
  public static async imageLoadTool(url: string) {
    if (!cc.sys.isNative && cc.sys.isMobile) {
      return;
    }

    var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
    cc.log('dirpath ->', dirpath);

    
    
    let md5URL = window.btoa(url);
    var filepath = dirpath + md5URL + '.jpg';

    cc.log('filepath ->', filepath);
    if (jsb.fileUtils.isFileExist(filepath)) {
      cc.log('Remote is find' + filepath);
      

      let tex = await GameHelp.load(filepath, 'jpg');
      var spriteFrame = new cc.SpriteFrame(
        tex
        
      );
      
      return spriteFrame;
    }

    let response = await NetWork.getInstance().request_http(url, null);
    if (typeof response !== 'undefined') {
      if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
      } else {
        cc.log('路径exist');
      }

      
      if (jsb.fileUtils.writeDataToFile(new Uint8Array(response), filepath)) {
        cc.log('Remote write file succeed.');
        
        
        let tex = await GameHelp.load(filepath, null);
        var spriteFrame = new cc.SpriteFrame(
          tex
          
        );
        
        return spriteFrame;
      } else {
        cc.log('Remote write file failed.');
      }
    } else {
      cc.log('Remote download file failed.');
    }
  }
}
