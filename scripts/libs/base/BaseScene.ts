// var GameConstants = require("GameConstants");
// var NetWork = require("NetWork");
// var network_name = require("network_name");
// var AudioManager = require("AudioManager");

import { AudioManager } from '../manager/AudioManager';
import { SceneManager } from '../manager/SceneManager';
import { BaseController } from './BaseController';
import BaseComponent from './BaseComponent';
import { GameHelp } from '../utils/GameHelp';
import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');
/**
 * BaseScene
 *
 * @type {Function}
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/BaseScene')
export abstract class BaseScene extends BaseComponent {
	@property({ tooltip: '返回场景的各种参数' })
	m_back_scene_param: string = '';
	@property({ tooltip: '当前场景的 game_id', type: cc.Integer })
	m_game_id: number = 0;
	@property({ tooltip: '当前场景的游戏名称' })
	m_game_name: string = '';
	@property({ tooltip: '当前场景的 音乐' })
	SOUND_SCENE: string = '';

	@property({
		tooltip: '即将要进入的场景的游戏名称 用来预加载',
	})
	m_game_name_future: string = '';

	@property({ tooltip: '适配流海的层级', type: [cc.String] })
	arr_safeAreaRect: Array<string> = [];
	// getSafeAreaRect

	//当前场景的名字
	private _name: string;
	//当前对应的 constroller
	protected _controller: BaseController;

	// @property([cc.SpriteAtlas])
	// SA_SHEET:Array< cc.SpriteAtlas> = null;

	// @property([cc.Prefab])
	// ARR_Prefab___: Array<cc.Prefab> = [];

	// //当前的场景
	// public static scene:any =  null
	// public static  __sceneName:string =  null

	onLoad() {
		cc.log('BaseScene:onLoad()');

		//适配流海
		var safeArea = cc.sys.getSafeAreaRect();
		let winSize = cc.winSize;
		let safe_height = Math.ceil(winSize.height - safeArea.height);
		// let sate_width = Math.ceil(v2.width - safeArea.width) / 2;

		let arr_safeAreaRect = this.arr_safeAreaRect;
		if (arr_safeAreaRect && safe_height > 0) {
			for (let i = 0; i < arr_safeAreaRect.length; i++) {
				let name = arr_safeAreaRect[i];
				let layer = GameHelp.getLayerBySceneLayerName(name);
				if (layer) {
					let widget = layer.getComponent(cc.Widget);
					widget.top = safe_height;
				}
			}
		}
	}

	start() {
		// GameHelp.wait_time(1, this);
		// var event = {
		//   name: 'SCENE_CHANGE_START_END',
		//   data: {
		//     sceneName: this.node.name,
		//   },
		// };
		// GameNotify.getInstance().dispatchEvent(event);

		// 播放声音
		this._playBgSound();

		//预载场景
		if (this.m_game_name_future) {
			// GameHelp.wait_time(1, this);
			SceneManager.getInstance().preloadScene(
				this.m_game_name_future,
				null,
				null
			);
		}
	}

	// m__addEventHandle(event_name_hash: Array<string>) {
	//   if (!event_name_hash) {
	//     event_name_hash = [];
	//   }

	//   //场景中 都需要监听 键盘的按下事件
	//   event_name_hash.push(GameEventConstants.onKeyDown);
	//   super.m__addEventHandle(event_name_hash);
	// }
	// m__eventHandle(event) {
	//   var self = this;
	//   var data = event.data;
	//   // cc.log(event.name);
	//   if (event.name == GameEventConstants.onKeyDown) {
	//     this.m_onKeyDown(data);
	//   }
	// }
	// private m_onKeyDown(event) {
	//   switch (event.keyCode) {
	//     case cc.macro.KEY.back:
	//       this.onClickBackscene(event, null, null);
	//       break;
	//   }
	// }

	// init_unred_emails() {
	//   return true;
	//   // throw new Error("Method not implemented.");
	// }
	// initUserInfo() {
	//   return true;
	//   // throw new Error("Method not implemented.");
	// }

	// /**
	//  *  初始化
	//  * @param params
	//  */
	// init(params) {
	// cc.log(
	//   "BaseScene 中：=> BaseScene.name = " +
	//     this +
	//     ",params = " +
	//     (this.name || "") +
	//     "," +
	//     BaseScene.name
	// );
	// }

	// /**
	//  *   通过key 获取 所有的 frame
	//  * @param sheetname
	//  * @param key
	//  * @returns {*}
	//  */
	// getSpriteFrame(sheetname, key) {
	//   var frame = null;
	//   if (sheetname == null) {
	//     for (var i = 0; i < this.SA_SHEET.length; i++) {
	//       var oneSheet = this.SA_SHEET[i];
	//       frame = oneSheet.getSpriteFrame(key);
	//       if (frame) {
	//         break;
	//       }
	//     }
	//   } else {
	//     frame = this.SA_SHEET.getSpriteFrame(key);
	//   }
	//
	//   return frame;
	// }

	// onDestroy() {
	//   var self = this;
	//   if (AudioManager) AudioManager.stopAll();
	//   this.unscheduleAllCallbacks();
	//   if (this._Scritp_FightModel_) {
	//     this._Scritp_FightModel_ = null;
	//   }
	//   //清楚事件
	//   // var GameNotify = require("GameNotify");
	//   GameNotify.getInstance().removeAllEventListenersForHandle(this.__eventHandle);
	//   // self.__eventHandle = null;
	// }

	setName(value: string) {
		this._name = value;
	}
	getName() {
		return this._name;
	}
	getGameId() {
		return this.m_game_id;
	}

	/**
	 * 只能由 SceneManager 调用
	 */
	async __onStarted__(...params) {
		cc.log(`scene<${this._name}> __onStarted__`, ...params);
		this.onStarted(...params);
		// GamePluginManager.getInstance().show_plugin_icon()
		this.enabled = true;
		if (this._controller) {
			this._controller.__onStarted__(this);
		}
	}
	/**
	 * 只能由 SceneManager 调用
	 */
	__beforeDestroy__() {
		cc.log(`scene<${this._name}> __beforeDestroy__`);
		this.enabled = false;
		AudioManager.getInstance().stopAll();
		// AudioManager.getInstance().pauseOrResume();
		this.unscheduleAllCallbacks();
		//清楚事件
		// var GameNotify = require("GameNotify");
		// GameNotify.getInstance().removeAllEventListenersForHandle(
		//   this.__eventHandle
		// );
		// self.__eventHandle = null;
		this.beforeDestroy();

		if (this._controller) {
			this._controller.__beforeDestroy__();
		}
	}

	/**
	 * 场景start方法后调用
	 *  每个场景都必须调用  需要吧 this._controller 依赖注册过去
	 */
	onStarted(...params) {
		return true;
		// this._controller = Controller1200.getInstance();
		// NetWork.getInstance().request("test", { "i": 1, "f": 2.23, "s": "aaaa", "ai": [1, 2, 3], "si": ["a", "b", "c"] })
	}
	/**
	 * 场景onDestroy方法前调用
	 */
	beforeDestroy() {
		cc.log('beforeDestroy');
		return true;
	}

	//////// 内部方法 /////////////////////////////////////////////////////////
	//返回上个场景
	backScene(json) {
		if (!json) {
			json = this.m_back_scene_param;
		}
		// let json = null;
		// if (json) {
		//   // json = JSON.parse(params);
		//   // sceneName = json.sceneName;
		// } else if (params) {
		//   json = JSON.parse(params);
		// } else {
		//   json = JSON.parse(this.m_back_scene);
		//   // sceneName = json.sceneName;
		// }
		let isstr = _.isString(json);
		if (isstr) {
			json = JSON.parse(json);
		}

		let sceneName = 'HallScene'; //LoginScene
		if (json) {
			sceneName = json.sceneName;
		}
		SceneManager.getInstance().loadScene(
			sceneName,
			null,
			null,
			null,
			null,
			json
		);
	}
	// async onClickBackscene(event, params, json, is_preload) {
	// let json = null ;
	// if(params ){
	//     json = JSON.parse(params);
	//     // sceneName = json.sceneName;
	// }else{
	//     json = JSON.parse(this.m_back_scene);
	//     // sceneName = json.sceneName;
	// }
	// let ret = awaitRoomService.getInstance().game_quit_room();
	// if (ret) {
	// this._backscene(event, params, json, is_preload);
	// }
	// }

	//播放音乐
	async _playBgSound() {
		// GameHelp.wait_time(2, this);
		//播放音乐
		AudioManager.getInstance().stopAll();
		if (this.SOUND_SCENE && this.SOUND_SCENE.length > 1) {
			let clip = await GameLoader.load(
				GameConstants.AUDIO_DIR + this.SOUND_SCENE,
				cc.AudioClip
			);
			// if (this.enabled) {
			AudioManager.getInstance().playBGM(clip);
			// }
		}
	}

	// /**
	//  *  获取当前场景
	//  * @returns {*}
	//  * @private
	//  */
	// _getFightMode() {
	//   var self = this;

	// var RoomModel = require("RoomModel");
	//
	// var model = null;
	//
	// var RoomModel = require("RoomModel");
	// var room = RoomModel.getRoomByRoomId(RoomModel.meId);
	// if (room && room.getConfig) {
	//   var config = room.getConfig();
	//
	//   if (config.game_id_sr) {
	//     model = require("FightModel" + "_" + config.game_id_sr);
	//   }
	// }
	//
	// var game_id =RoomService.get_game_id();
	// if (model == null && game_id) {
	//   model = require("FightModel_" + game_id);
	// }
	//
	// if (model == null) {
	//   model = require("FightModel_PAOPAI");
	// }
	//
	// this._Scritp_FightModel_ = model;
	// return model;
	// }
}
