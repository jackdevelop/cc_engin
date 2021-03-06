import { HotUpdateModule } from "./HotUpdateModule";
import { GameNotify } from "../scripts/libs/utils/GameNotify";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HotUpdate extends cc.Component {
  @property({ tooltip: "project.manifest", type: cc.Asset })
  manifestUrl: cc.Asset = null;
  _updating = false;
  _canRetry = false;
  _storagePath = "";
  checkCb(event) {
    cc.log("Code: " + event.getEventCode());
    let code = event.getEventCode();
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        break;
      default:
        return;
    }
    this._am.setEventCallback(null);
    this._checkListener = null;
    this._updating = false;
    var event1 = { name: HotUpdateModule.OnTipUpdateVersion, data: code };
    GameNotify.getInstance().dispatchEvent(event1);
  }
  updateCb(event) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        cc.log("没有发现本地的manifest, 跳过热更新.");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        let data = new Object();
        data.byteProgress = event.getPercent().toFixed(2);
        let event1 = { name: HotUpdateModule.OnUpdateProgress, data: data };
        GameNotify.getInstance().dispatchEvent(event1);
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.log("下载 manifest 失败, 跳过热更新.");
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.log("已经和远程版本一致");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        cc.log("更新完成 ");
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        cc.log("更新失败.jsb.EventAssetsManager.UPDATE_FAILED: ");
        this._updating = false;
        this._canRetry = true;
        let e = { name: HotUpdateModule.OnUpdateVersion_CanRetry, data: true };
        GameNotify.getInstance().dispatchEvent(e);
        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        cc.log("资源更新发生错误:jsb.EventAssetsManager.ERROR_UPDATING ");
        failed = true;
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        cc.log("更新失败 jsb.EventAssetsManager.ERROR_DECOMPRESS:");
        failed = true;
        break;
      default:
        break;
    }
    if (failed) {
      this._am.setEventCallback(null);
      this._updateListener = null;
      this._updating = false;
      let e = {
        name: HotUpdateModule.OnUpdateVersionResult_FAILED,
        data: true,
      };
      GameNotify.getInstance().dispatchEvent(e);
    }
    if (needRestart) {
      this._am.setEventCallback(null);
      this._updateListener = null;
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();
      cc.log(JSON.stringify(newPaths));
      Array.prototype.unshift.apply(searchPaths, newPaths);
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      jsb.fileUtils.setSearchPaths(searchPaths);
      cc.audioEngine.stopAll();
      cc.game.restart();
    }
  }
  loadCustomManifest() {
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      let customManifestStr = null;
      var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
      this._am.loadLocalManifest(manifest, this._storagePath);
    }
  }
  retry() {
    if (!this._updating && this._canRetry) {
      this._canRetry = false;
      this._am.downloadFailedAssets();
      return true;
    }
    return false;
  }
  checkUpdate() {
    cc.log("检查热更新 checkUpdate");
    if (this._updating) {
      return;
    }
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      var url = this.manifestUrl.nativeUrl;
      if (cc.resources.md5Pipe) {
        url = cc.resources.md5Pipe.transformURL(url);
      }
      this._am.loadLocalManifest(url);
    }
    if (
      !this._am.getLocalManifest() ||
      !this._am.getLocalManifest().isLoaded()
    ) {
      return;
    }
    this._am.setEventCallback(this.checkCb.bind(this));
    this._am.checkUpdate();
    this._updating = true;
    return true;
  }
  hotUpdate() {
    cc.log("开始更新：hotUpdate");
    if (this._am && !this._updating) {
      this._am.setEventCallback(this.updateCb.bind(this));
      if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        var url = this.manifestUrl.nativeUrl;
        if (cc.resources.md5Pipe) {
          url = cc.resources.md5Pipe.transformURL(url);
        }
        this._am.loadLocalManifest(url);
      }
      this._failCount = 0;
      this._am.update();
      this._updating = true;
    }
  }
  onLoad() {
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath =
      (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
      "blackjack-remote-asset";
    cc.log("Storage path for remote asset : " + this._storagePath);
    this.versionCompareHandle = function (versionA, versionB) {
      cc.log(
        "JS Custom Version Compare: version A is " +
          versionA +
          ", version B is " +
          versionB
      );
      var vA = versionA.split(".");
      var vB = versionB.split(".");
      for (var i = 0; i < vA.length; ++i) {
        var a = parseInt(vA[i]);
        var b = parseInt(vB[i] || 0);
        if (a === b) {
          continue;
        } else {
          return a - b;
        }
      }
      if (vB.length > vA.length) {
        return -1;
      } else {
        return 0;
      }
    };
    this._am = new jsb.AssetsManager(
      "",
      this._storagePath,
      this.versionCompareHandle
    );
    this._am.setVerifyCallback(function (path, asset) {
      var compressed = asset.compressed;
      var expectedMD5 = asset.md5;
      var relativePath = asset.path;
      var size = asset.size;
      if (compressed) {
        return true;
      } else {
        return true;
      }
    });
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      this._am.setMaxConcurrentTask(2);
    }
  }
  onDestroy() {
    if (this._updateListener) {
      this._am.setEventCallback(null);
      this._updateListener = null;
    }
  }
}
