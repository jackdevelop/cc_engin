// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import { LogWrap } from '../scripts/libs/utils/LogWrap';
// import { MWindow } from '../scripts/libs/component/MWindow';
import { GameConfig } from '../../cc_own/config/GameConfig';
// import { ListenerManager } from '../scripts/libs/manager/ListenerManager';
import { GameNotify } from '../scripts/libs/utils/GameNotify';
import { GameEventConstants } from '../scripts/libs/constants/GameEventConstants';
// import { zh } from '../../cc_own/localized-language/zh';
// import { en } from '../../cc_own/localized-language/en';
import { moment_util } from '../scripts/libs/utils/moment_util';
import { GameWallow } from '../../cc_own/tool/GameWallow';
import PhysicalUtil from '../scripts/libs/util/PhysicalUtil';
import { zh } from '../../resources/i18n/localized-language/zh';
import { en } from '../../resources/i18n/localized-language/en';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManger extends cc.Component {
	/**单例实例**/
	public static instance: GameManger = null;

	@property([cc.Prefab])
	ARR_Prefab___: Array<cc.Prefab> = [];

	@property(cc.TTFFont)
	public game_font: cc.TTFFont = null;

	@property({ type: cc.Asset, tooltip: 'wssCacert' })
	wssCacert: cc.Asset = null;

	@property({ type: cc.AudioClip, tooltip: '按钮点击的声音' })
	sound_click: cc.AudioClip = null;

	private __eventHandle;

	onLoad() {
		cc.log(' GameManger >> onLoad');
		GameManger.instance = this;

		//设置永久不删除
		cc.game.addPersistRootNode(this.node);
		//设置不锁屏
		if (cc.sys.isNative) {
			jsb.Device.setKeepScreenOn(true);
		}
		//cc.log(isAntiAliasEnabled);
		//cc.log(cc.view.resizeWithBrowserSize);
		// cc.view.resizeWithBrowserSize = true;
		// cc.view.enableRetina(true);
		// cc.view.resizeWithBrowserSize(true);

		// cc.macro.CLEANUP_IMAGE_CACHE = false;
		// cc.dynamicAtlasManager.enabled = true;

		// cc.view.enableAntiAlias(true);
		// cc.Texture2D.setFilters(true);

		// LogWrap.log('test log');
		// LogWrap.info('test info');
		// LogWrap.warn('test warn');
		// LogWrap.err('test err');

		// this.adjust_screen();

		// cc.view.enableRetina = true;
		// cc.view.resizeWithBrowserSize = true;
		// cc.view.enableAntiAlias = true;

		// var isAntiAliasEnabled = cc.view.isAntiAliasEnabled();
		// cc.log('当前是否坑剧场', isAntiAliasEnabled);

		this.initLanguageData(GameConfig.language);
		this.initSproto();
		this.addListener();

		// //加载所有的excel
		var EXCEL_TO_DB = require('EXCEL_TO_DB');
		EXCEL_TO_DB.loadAll();
		GameWallow.getInstance();
	}

	start() {
		//是否开启物理引擎
		PhysicalUtil.openPhysical();
	}
	// /** 调整屏幕适配 */
	// private adjust_screen() {
	//   // 注意cc.winSize只有在适配后(修改fitHeight/fitWidth后)才能获取到正确的值,因此使用cc.getFrameSize()来获取初始的屏幕大小
	//   const screen_size =
	//     cc.view.getFrameSize().width / cc.view.getFrameSize().height;
	//   const design_size =
	//     cc.Canvas.instance.designResolution.width /
	//     cc.Canvas.instance.designResolution.height;
	//   const f = screen_size >= design_size;
	//   cc.Canvas.instance.fitHeight = f;
	//   cc.Canvas.instance.fitWidth = !f;
	//   // cc.Canvas.instance["alignWithScreen"]() // 注意本方法不在文档中,下版本会修复,在fitHeight/fitWidth修改时自动调用
	// }

	/**
     1 ： 初始化语言包
     https://github.com/cocos-creator-packages/i18n
     使用： this.txt_label.string = i18n.t('label.hello');
     如果切换后需要马上更新当前场景，可以调用 i18n.updateSceneRenderers()。
     注意运行时必须保证 i18n.init(language) 在包含有 LocalizedLabel 组件的场景加载前执行，否则将会因为组件上无法加载到数据而报错。
     **/
	private initLanguageData(language: string) {
		if (!window.i18n) window.i18n = new Object();
		if (!window.i18n.languages) window.i18n.languages = new Object();
		window.i18n.languages.zh = { label: zh };
		window.i18n.languages.en = { label: en };

		if (language == null) {
			language = GameConfig.language;
		}

		let i18n = require('LanguageData');
		i18n.init(language);
		// i18n.updateSceneRenderers();//马上刷新当前的界面的于洋 包
		cc.log(i18n.t('label.id_1'));
	}

	//初始化协议
	private initSproto() {
		const PROTOCAL_CORE = require('PROTOCAL_CORE');
		var newpath = 'SPROTO/sproto_64';
		GameConfig.index_navigation_data = JSON.parse(
			cc.sys.localStorage.getItem('index_navigation_data')
		);
		var b64 = require('base64js');
		PROTOCAL_CORE.loadSproto_by_url(newpath, b64, function (data) {
			cc.log(' 加载远程sproto文件成功！！ ');
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////事件监听 //////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////

	private addListener() {
		let self = this;
		//在常驻节点上挂载的js中加入这段代码就可以。
		if (self.__eventHandle == null) {
			self.__eventHandle = function (data) {
				self.m__eventHandle(data);
			};
			// ListenerManager.getInstance().removeAll(this);
			GameNotify.getInstance().removeAllEventListenersForHandle(
				self.__eventHandle
			);
			// GameNotify.getInstance().addEventListener(
			//   'CONNECTION',
			//   self.__eventHandle,
			//   null,
			//   null
			// );

			cc.systemEvent.on(
				cc.SystemEvent.EventType.KEY_DOWN,
				this.onKeyDown,
				this
			);
			cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
			cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
			cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
			cc.view.setResizeCallback(function (event) {
				// cc.log("监听尺寸变化");
				// cc.log(cc.winSize.height);
				self.onGameResize(null);
			});
		}
	}

	// start() {
	// this.node.opacity = 0;
	// }

	private m__eventHandle(event) {
		var self = this;
		var data = event.data;
		// if (event.name == "CONNECTION") {
		// var node_scene_progressBar = require("node_scene_progressBar");
		// node_scene_progressBar.hide();
		// }
	}
	private onGameHide(event) {
		//cc.game.pause()
		// var Util_client = require("Util_client");
		cc.log('游戏进入后台', moment_util.get_server_time());
		GameConfig.is_game_hide = true;

		var event = {
			name: cc.game.EVENT_HIDE,
		};
		GameNotify.getInstance().dispatchEvent(event);
		// ListenerManager.getInstance().trigger(cc.game.EVENT_HIDE)
	}
	private onGameShow(e) {
		// cc.game.resume()
		//cc.log("游戏进入前台");
		// var Util_client = require("Util_client");
		cc.log('游戏进入前台', moment_util.get_server_time());
		GameConfig.is_game_hide = false;
		var event = {
			name: cc.game.EVENT_SHOW,
		};
		GameNotify.getInstance().dispatchEvent(event);
		// ListenerManager.getInstance().trigger(cc.game.EVENT_SHOW)
	}
	private onGameResize(e) {
		// cc.log("onGameResize");
		// cc.log(cc.winSize.width);
		var event = {
			name: GameEventConstants.onGameResize,
		};
		GameNotify.getInstance().dispatchEvent(event);
		// ListenerManager.getInstance().trigger(ListenerType.onGameResize)
	}
	private onKeyDown(event) {
		let self = this;
		cc.log('Press  key : ' + event.keyCode);
		switch (event.keyCode) {
			case cc.macro.KEY.back:
				// this.__back();
				break;
		}

		var e = {
			name: GameEventConstants.onKeyDown,
			data: event,
		};
		GameNotify.getInstance().dispatchEvent(e);
	}
	private onKeyUp(event) {
		cc.log('release  key : ' + event.keyCode);
		switch (event.keyCode) {
			case cc.macro.KEY.back:
				break;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////事件监听 //////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 *  获取prefab
	 * @param name
	 */
	public getPrefab(name: string) {
		// var self = PopUpManager.instance;
		let self = this;
		for (var i = 0; i < this.ARR_Prefab___.length; i++) {
			var one = this.ARR_Prefab___[i];
			if (one) {
				let current_name = one.name;
				if (name == current_name) {
					return one;
				}
			}
			// this._Prefab_hash[one.name] = one;
		}
	}
}
