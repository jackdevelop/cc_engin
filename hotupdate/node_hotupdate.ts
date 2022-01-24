// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { HotUpdateModule } from './HotUpdateModule';
import HotUpdate from './HotUpdate';
import { GameLocalStorageConstants } from '../../cc_own/constants/GameLocalStorageConstants';
import TProgressBar from '../scripts/libs/component/TProgressBar';
import BaseComponent from '../scripts/libs/base/BaseComponent';
import { GameEventConstants } from '../scripts/libs/constants/GameEventConstants';
import { GameConfigFromServer } from '../../cc_own/config/GameConfigFromServer';
import { LoginService } from '../../app/login/scripts/LoginService';
import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { PromiseUtil } from '../scripts/libs/util/PromiseUtil';

const { ccclass, property } = cc._decorator;

@ccclass
export default class node_hotupdate extends BaseComponent {
	@property({ tooltip: '热更新进度条', type: TProgressBar })
	TProgressBar_hotupdate: TProgressBar = null;
	// @property ({tooltip: "project.manifest", url: cc.RawAsset})
	// manifest:cc.RawAsset = null;
	@property({ tooltip: '版本号', type: cc.Label })
	txt_version: cc.Label = null;

	@property({
		tooltip: '外部设置,是否允许热更',
	})
	allow_hot_update: boolean = false;

	// @property ({tooltip: "project.manifest",type: cc.Asset})
	// manifest:cc.Asset = null;

	@property({ tooltip: '热更脚本', type: HotUpdate })
	script_HotUpdate: HotUpdate = null;

	@property({ tooltip: '延迟几秒成功', type: cc.Integer })
	delay_time: number = 0;

	//监听的事件
	private m_event_name_hash: Array<string> = [
		HotUpdateModule.OnUpdateVersion_SUCCESS,
		HotUpdateModule.OnUpdateVersionResult_FAILED,
		HotUpdateModule.OnUpdateProgress,
		HotUpdateModule.OnUpdateVersion_CanRetry,
	];
	// _getMsgList() {
	//     return [
	//         HotUpdateModule.OnGetVersionInfo,
	//         HotUpdateModule.OnTipUpdateVersion,
	//         HotUpdateModule.OnUpdateProgress,
	//         HotUpdateModule.OnUpdateVersionResult,
	//     ];
	// }

	//最后更新完毕后的回调
	private m_endCallFun = null;
	// properties: {
	//     manifest: {displayName: "project.manifest", url: cc.RawAsset},
	//     versionLabel: {default: null, displayName: "版本号", type: cc.Label},
	//     updateProgress: {displayName: "热更新进度条", type: cc.ProgressBar},
	//     tipsLabel: {displayName: "消息提示", type: cc.Label},
	//     addNode: {displayName: "添加节点", type: cc.Node},
	// },
	onLoad() {
		// this._initMsg();
		let version = cc.sys.localStorage.getItem(
			GameLocalStorageConstants.LOCALSTORAGE_Login_VERSION
		);
		// this.txt_version.string = version || "v0.0.1"
		this.txt_version.string = version || 'v0.0.1';

		// this.updateProgress.progress = 0;
		this.TProgressBar_hotupdate.setProgress(0);
		let str = '';
		this.TProgressBar_hotupdate.setTxtValue(str);
		// this._checkUpdate();
		// this._initVersionFlag();
		// HotUpdate.showSearchPath();
		this.m__addEventHandle(this.m_event_name_hash, null);
	}

	m__eventHandle(event) {
		var self = this;
		var data = event.data;
		cc.log(event.name);
		if (event.name == HotUpdateModule.OnUpdateVersion_SUCCESS) {
			let str = '热更完成';
			this.TProgressBar_hotupdate.setTxtValue(str);

			//延迟
			if (this.delay_time > 0) {
				PromiseUtil.wait_time(this.delay_time, this);
			}

			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		} else if (event.name == HotUpdateModule.OnUpdateVersionResult_FAILED) {
			let str = '热更失败，请稍后重试';
			this.TProgressBar_hotupdate.setTxtValue(str);
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		} else if (event.name == HotUpdateModule.OnUpdateProgress) {
			this.TProgressBar_hotupdate.setProgress(data.fileProgress - 0.1);
			let str = '正在更新中,请耐心等待';
			this.TProgressBar_hotupdate.setTxtValue(str);
		} else if (event.name == HotUpdateModule.OnUpdateVersion_CanRetry) {
			this.script_HotUpdate.retry();
		}
	}

	// _onMsg(msg, data) {
	//    cc.log("热更:" +msg)
	//    cc.log(JSON.stringify(data))
	//     if (msg === HotUpdateModule.OnUpdateVersionResult) {// 热更新结果
	//         if (data) {
	//             let str = "更新成功";
	//             this.TProgressBar_hotupdate.setTxtValue(str);
	//             cc.log("更新成功");
	//             this._onShowDownLoadUpdateVersionResult(true);
	//         } else {
	//             let str = "更新失败";
	//             this.TProgressBar_hotupdate.setTxtValue(str);
	//             cc.log("热更新失败");
	//             this._onShowDownLoadUpdateVersionResult(false);
	//         }
	//     } else if (msg === HotUpdateModule.OnUpdateProgress) {// 热更新进度
	//        cc.log("[update]: 进度=" + data.fileProgress);
	//         this.TProgressBar_hotupdate.setProgress( data.fileProgress);
	//         // data.msg;
	//         let  str = "正在更新中,请耐心等待";
	//         this.TProgressBar_hotupdate.setTxtValue(str);
	//         //cc.log(data.msg);
	//     } else if (msg === HotUpdateModule.OnTipUpdateVersion) {// 提示更新版本
	//         if (data === jsb.EventAssetsManager.NEW_VERSION_FOUND) {
	//             this._onShowNoticeUpdateLayer();
	//         } else if (data === jsb.EventAssetsManager.ALREADY_UP_TO_DATE) {// 版本一致,无需更新
	//             cc.log("版本一致,无需更新,进入游戏中...");
	//             this._enterGame();
	//         } else {
	//             this._onShowNoticeCheckVersionFailed();
	//         }
	//     } else if (msg === HotUpdateModule.OnGetVersionInfo) {// 获取到版本信息
	//         // GameLocalStorage.setVersion(data.curVer, data.newVersion);
	//         this._updateVersionView(data.curVer, data.newVersion);
	//     }
	// }
	// _updateVersionView(curVer, newVer) {
	//     this.versionLabel.string = "服务器版本号: " + newVer + ",本地版本:" + curVer;
	// }

	// _initView() {
	//
	//     // this.addNode.destroyAllChildren();
	// }
	// start() {
	//     // require('InspectorScript').inspectorSupport();
	// }
	// _initVersionFlag() {
	//     /*if (GameCfg.isDebugVersion) {
	//         cc.log("debug version");
	//         this.debugLabel.string = "Debug";
	//         this.debugLabel.node.active = true;
	//     } else {
	//         cc.log("release version");
	//         this.debugLabel.string = "";
	//         this.debugLabel.node.active = false;
	//     }*/
	// }
	// _onShowNoticeUpdateLayer() {
	//     cc.log("提示更新");
	//     Alert.show("提示","检测到新版本,点击确定开始更新", function () {
	//         HotUpdate.hotUpdate();
	//     }.bind(this));
	// }
	// _onShowNoticeCheckVersionFailed() {
	//     cc.log('检查更新失败');
	//     Alert.show("提示","检查更新失败,点击重试", function () {
	//         HotUpdate.checkUpdate();
	//     }.bind(this));
	// }
	// _onShowDownLoadUpdateVersionResult(result) {
	//     if (result) {
	//         Alert.show("提示","更新成功,点击确定重启游戏", function () {
	//             cc.audioEngine.stopAll();
	//             cc.game.restart();
	//         }.bind(this));
	//     } else {
	//         Alert.show("提示","更新失败,点击重试", function () {
	//             HotUpdate.checkUpdate();
	//         }.bind(this));
	//     }
	// }

	// 检查更新
	// _checkUpdate() {
	//     if (cc.sys.isNative) {
	//        cc.log("热更1111");
	//         cc.log(this.manifest);
	//         if (this.manifest) {
	//             let str = "正在获取版本...";
	//             // this.tipsLabel.string = str;
	//            cc.log(str)
	//             this.TProgressBar_hotupdate.setTxtValue(str);
	//             cc.log(str);
	//
	//
	//             HotUpdate.init(this.manifest);
	//            cc.log("热更开始 ");
	//             HotUpdate.checkUpdate();
	//         }
	//     } else {
	//        cc.log("web 平台不需要热更新");
	//         this._enterGame();
	//     }
	// }
	//
	// _enterGame() {
	//     cc.log("进入游戏成功");
	//     // this.updateProgress.node.active = false;
	//     this.TProgressBar_hotupdate.node.active = false
	//
	//    cc.log("更新成功");
	//     // DialogMgr.showTipsWithOkBtn("更新成功", function () {
	//     //     cc.director.loadScene("IndexScene");
	//     //     // cc.director.loadScene("TestGameScene");
	//     // }.bind(this));
	//
	//     if(this.m_endCallFun){
	//         this.m_endCallFun()
	//     }
	// }

	//检测更新
	public checkUpdate() {
		return this.script_HotUpdate.checkUpdate();
	}
	//热更
	public hotUpdate() {
		let is_update = this.script_HotUpdate.hotUpdate();
		if (!is_update) {
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		}
	}

	/**
	 * 重新启动游戏
	 */
	public onBtnClickReStart() {
		cc.log('软启动游戏！！');
		if (cc.sys.isNative) {
			cc.game.restart();
		} else {
			cc.log("don't reStart");
		}
	}

	/**
	 *  检测更新
	 */
	async onBtnClickUpdate(endCallFun) {
		this.m_endCallFun = endCallFun;
		// let allow_hot_update =  GameConfigFromServer.system_info.allow_hot_update
		let allow_hot_update =
			await LoginService.getInstance().get_system_info_by_key(
				'allow_hot_update'
			);

		// this._checkUpdate();
		if (
			this.allow_hot_update &&
			cc.sys.isNative &&
			allow_hot_update + '' == '1'
		) {
			//判断热更不热更
			this.hotUpdate();
		} else {
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		}
	}
}
