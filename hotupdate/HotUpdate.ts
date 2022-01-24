// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import {GameNotify} from "../utils/GameNotify";
import { HotUpdateModule } from './HotUpdateModule';
import { GameNotify } from '../scripts/libs/utils/GameNotify';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HotUpdate extends cc.Component {
  // panel: UpdatePanel,

  @property({ tooltip: 'project.manifest', type: cc.Asset })
  manifestUrl: cc.Asset = null;

  _updating = false;
  _canRetry = false;
  _storagePath = ''; //本地存储目录

  checkCb(event) {
    cc.log('Code: ' + event.getEventCode());
    let code = event.getEventCode();
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        // this.panel.info.string = "No local manifest file found, hot update skipped.";
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        // this.panel.info.string = "Fail to download manifest file, hot update skipped.";
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        // this.panel.info.string = "Already up to date with the latest remote version.";
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        // this.panel.info.string = 'New version found, please try to update.';
        // this.panel.checkBtn.active = false;
        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
        break;
      default:
        return;
    }

    this._am.setEventCallback(null);
    this._checkListener = null;
    this._updating = false;

    //跑送事件
    var event1 = {
      name: HotUpdateModule.OnTipUpdateVersion,
      data: code,
    };
    GameNotify.getInstance().dispatchEvent(event1);
  }

  updateCb(event) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        // this.panel.info.string = 'No local manifest file found, hot update skipped.';
        cc.log('没有发现本地的manifest, 跳过热更新.');
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        // this.panel.byteProgress.progress = event.getPercent();
        // this.panel.fileProgress.progress = event.getPercentByFile();
        //
        // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
        // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

        // var msg = null
        // if (event.getMessage) {
        //     msg = event.getMessage();
        //    cc.log("进度");
        //    cc.log(msg)
        //    cc.log(event.getPercent())
        //     // this.panel.info.string = 'Updated file: ' + msg;
        //     // cc.log(event.getPercent()/100 + '% : ' + msg);
        // }

        //进度
        let data = new Object();
        // let filePro = event.getPercentByFile();
        // if (!filePro) {
        //     filePro = 0;
        // }
        // data.fileProgress = filePro.toFixed(2) || 1;
        data.byteProgress = event.getPercent().toFixed(2);
        // data.msg = msg;
        let event1 = {
          name: HotUpdateModule.OnUpdateProgress,
          data: data,
        };
        GameNotify.getInstance().dispatchEvent(event1);
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.log('下载 manifest 失败, 跳过热更新.');
        // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.log('已经和远程版本一致');
        // this.panel.info.string = 'Already up to date with the latest remote version.';
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        cc.log('更新完成 ');
        // this.panel.info.string = 'Update finished. ' + event.getMessage();
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        cc.log('更新失败.jsb.EventAssetsManager.UPDATE_FAILED: ');
        // this.panel.info.string = 'Update failed. ' + event.getMessage();
        // this.panel.retryBtn.active = true;
        this._updating = false;
        this._canRetry = true;

        let e = {
          name: HotUpdateModule.OnUpdateVersion_CanRetry,
          data: true,
        };
        GameNotify.getInstance().dispatchEvent(e);
        // failed = true;
        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        cc.log('资源更新发生错误:jsb.EventAssetsManager.ERROR_UPDATING ');
        // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
        failed = true;
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        cc.log('更新失败 jsb.EventAssetsManager.ERROR_DECOMPRESS:');
        // this.panel.info.string = event.getMessage();
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

    //更新完成
    if (needRestart) {
      this._am.setEventCallback(null);
      this._updateListener = null;
      // Prepend the manifest's search path
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();
      cc.log(JSON.stringify(newPaths));
      Array.prototype.unshift.apply(searchPaths, newPaths);
      // This value will be retrieved and appended to the default search path during game startup,
      // please refer to samples/js-tests/main.js for detailed usage.
      // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
      cc.sys.localStorage.setItem(
        'HotUpdateSearchPaths',
        JSON.stringify(searchPaths)
      );
      jsb.fileUtils.setSearchPaths(searchPaths);

      cc.audioEngine.stopAll();
      cc.game.restart();

      // let event = {
      //     name: HotUpdateModule.OnUpdateVersion_SUCCESS,
      //     data:true
      // };
      // GameNotify.getInstance().dispatchEvent(event)
    }
  }

  loadCustomManifest() {
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      let customManifestStr = null;
      var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
      this._am.loadLocalManifest(manifest, this._storagePath);
      // this.panel.info.string = 'Using custom manifest';
    }
  }

  retry() {
    if (!this._updating && this._canRetry) {
      // this.panel.retryBtn.active = false;
      this._canRetry = false;

      // this.panel.info.string = 'Retry failed Assets...';
      this._am.downloadFailedAssets();

      return true;
    }

    return false;
  }

  checkUpdate() {
    cc.log('检查热更新 checkUpdate');
    if (this._updating) {
      // this.panel.info.string = 'Checking or updating ...';
      return;
    }

    if (!this.manifestUrl) {
      return
    }

    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      // Resolve md5 url
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
      // this.panel.info.string = 'Failed to load local manifest ...';
      return;
    }
    this._am.setEventCallback(this.checkCb.bind(this));

    this._am.checkUpdate();
    this._updating = true;

    return true;
  }

  hotUpdate() {
    cc.log('开始更新：hotUpdate');
    if (!this.manifestUrl) {
      return
    }


    if (this._am && !this._updating) {
      this._am.setEventCallback(this.updateCb.bind(this));
      //cc.log("进来了")
      if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        // Resolve md5 url
        var url = this.manifestUrl.nativeUrl;
        if (cc.resources.md5Pipe) {
          url = cc.resources.md5Pipe.transformURL(url);
        }
        this._am.loadLocalManifest(url);
      }

      this._failCount = 0;
      this._am.update();
      // this.panel.updateBtn.active = false;
      this._updating = true;

      return true
    }

    return false
  }

  // show () {
  // if (this.updateUI.active === false) {
  //     this.updateUI.active = true;
  // }
  // }

  // use this for initialization
  onLoad() {
    // Hot update is only available in Native build
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath =
      (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') +
      'blackjack-remote-asset';
    cc.log('Storage path for remote asset : ' + this._storagePath);

    // Setup your own version compare handler, versionA and B is versions in string
    // if the return value greater than 0, versionA is greater than B,
    // if the return value equals 0, versionA equals to B,
    // if the return value smaller than 0, versionA is smaller than B.
    this.versionCompareHandle = function (versionA, versionB) {
      cc.log(
        'JS Custom Version Compare: version A is ' +
        versionA +
        ', version B is ' +
        versionB
      );
      var vA = versionA.split('.');
      var vB = versionB.split('.');
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

    // Init with empty manifest url for testing custom manifest
    this._am = new jsb.AssetsManager(
      '',
      this._storagePath,
      this.versionCompareHandle
    );
    //cc.log("onLoad》》》》")
    // cc.log(this._am)
    // var panel = this.panel;
    // Setup the verification callback, but we don't have md5 check function yet, so only print some message
    // Return true if the verification passed, otherwise return false
    this._am.setVerifyCallback(function (path, asset) {
      // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
      var compressed = asset.compressed;
      // Retrieve the correct md5 value.
      var expectedMD5 = asset.md5;
      // asset.path is relative path and path is absolute.
      var relativePath = asset.path;
      // The size of asset file, but this value could be absent.
      var size = asset.size;
      //cc.log("检查文件")
      //cc.log(compressed)
      //cc.log(path)
      //cc.log(relativePath)
      if (compressed) {
        // panel.info.string = "Verification passed : " + relativePath;
        return true;
      } else {
        // panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
        return true;
      }
    });

    // this.panel.info.string = 'Hot update is ready, please check or directly update.';

    if (cc.sys.os === cc.sys.OS_ANDROID) {
      // Some Android device may slow down the download process when concurrent tasks is too much.
      // The value may not be accurate, please do more test and find what's most suitable for your game.
      this._am.setMaxConcurrentTask(2);
      // this.panel.info.string = "Max concurrent tasks count have been limited to 2";
    }

    // this.panel.fileProgress.progress = 0;
    // this.panel.byteProgress.progress = 0;
  }

  onDestroy() {
    if (this._updateListener) {
      this._am.setEventCallback(null);
      this._updateListener = null;
    }
  }
}
