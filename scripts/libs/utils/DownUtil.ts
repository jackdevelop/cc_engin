import { GameLoader } from "./GameLoader";

var _ = require('Underscore');

export class DownUtil {
  // 请求标记,递增
  private static _seq: number = 1;


  /**
   *  判断 resources 目录下 是否有这个文件  
   * @param url 
   * @returns 
   */
  public static async getInfoWithPath(url){
    // let is_hav = cc.resources.getInfoWithPath(url);
    let is_hav = await GameLoader.load(url,null);

    return is_hav
  }

  /**
   * 下载文件
   */
  public static HttpDownload(
    url: string,
    fileName: string,
    handler: Function,
    overwrite: boolean = false
  ) {
    if (CC_JSB) {
      fileName = jsb.fileUtils.getWritablePath() + fileName;
      // 文件保存路径
      if (jsb.fileUtils.isFileExist(fileName) && !overwrite) {
        // 是否需要重复下载
        handler && handler(null, fileName);
        return;
      }
    }
    let seq = this._seq++;
    let self = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    if (CC_JSB) {
      xhr.responseType = 'arraybuffer';
    } else {
      xhr.responseType = 'blob';
    }
    xhr.onload = function (e) {
      if (this.status == 200) {
        !CC_JSB && self.saveFileInBrowser(this.response, fileName);
        CC_JSB &&
          self.saveFileInNative(this.response, fileName, handler, overwrite);
        CC_DEBUG &&
          cc.log(
            `[S->C] [Download.${seq}] -> ${url}%c success`,
            `color:#19A316;`
          );
      } else {
        CC_DEBUG &&
          cc.log(`%c[S->C] [Download.${seq}] -> ${url} failed`, `color:#f00;`);
        handler && handler('error', null);
      }
    };
    xhr.send();
    CC_DEBUG && cc.log(`[C->S] [Download.${seq}] -> ${url}`);
  }

  /**
   * 下载文件 In Native
   */
  public static saveFileInNative(
    arrayBuffer: ArrayBuffer,
    fullPath: string,
    handler: Function,
    overwrite: boolean
  ) {
    overwrite &&
      jsb.fileUtils.isFileExist(fullPath) &&
      jsb.fileUtils.removeFile(fullPath);
    let success = jsb.fileUtils.writeDataToFile(
      new Uint8Array(arrayBuffer),
      fullPath
    );
    if (success) {
      cc.log('save file data success!', fullPath);
      handler && handler(null, fullPath);
    } else {
      cc.log('save file data failed!', fullPath);
      handler && handler('error', null);
    }
  }

  /**
   * 下载文件 In Browser
   */
  public static saveFileInBrowser(blob: Blob, fileName: string) {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let URL = window.URL || window[`webkitURL`];
      let objectUrl = URL.createObjectURL(blob);
      if (fileName) {
        var a = document.createElement('a');
        if (typeof a.download === 'undefined') {
          window.location = objectUrl;
        } else {
          a.href = objectUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } else {
        window.location = objectUrl;
      }
      URL.revokeObjectURL(objectUrl);
    }
  }
}
