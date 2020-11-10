var _ = require("Underscore");
export class DownUtil {
  private static _seq: number = 1;
  public static HttpDownload(
    url: string,
    fileName: string,
    handler: Function,
    overwrite: boolean = false
  ) {
    if (CC_JSB) {
      fileName = jsb.fileUtils.getWritablePath() + fileName;
      if (jsb.fileUtils.isFileExist(fileName) && !overwrite) {
        handler && handler(null, fileName);
        return;
      }
    }
    let seq = this._seq++;
    let self = this;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    if (CC_JSB) {
      xhr.responseType = "arraybuffer";
    } else {
      xhr.responseType = "blob";
    }
    xhr.onload = function (e) {
      if (this.status == 200) {
        !CC_JSB && self.saveFileInBrowser(this.response, fileName);
        CC_JSB &&
          self.saveFileInNative(this.response, fileName, handler, overwrite);
        CC_DEBUG &&
          cc.log(
            `[S->C] [Download.${seq}] ->${url}%c success`,
            `color:#19a316;`
          );
      } else {
        CC_DEBUG &&
          cc.log(`%c[S->C] [Download.${seq}] ->${url}failed`, `color:red;`);
        handler && handler("error", null);
      }
    };
    xhr.send();
    CC_DEBUG && cc.log(`[C->S] [Download.${seq}] ->${url}`);
  }
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
      cc.log("save file data success!", fullPath);
      handler && handler(null, fullPath);
    } else {
      cc.log("save file data failed!", fullPath);
      handler && handler("error", null);
    }
  }
  public static saveFileInBrowser(blob: Blob, fileName: string) {
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let url = window.URL || window[`webkitURL`];
      let objectUrl = url.createObjectURL(blob);
      if (fileName) {
        var a = document.createElement("a");
        if (typeof a.download === "undefined") {
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
      url.revokeObjectURL(objectUrl);
    }
  }
}
