











import { GameConfig } from '../../cc_own/config/GameConfig';

import { GameNotify } from '../scripts/libs/utils/GameNotify';
import { GameEventConstants } from '../scripts/libs/constants/GameEventConstants';


import { moment_util } from '../scripts/libs/utils/moment_util';
import { GameWallow } from '../../cc_own/tool/GameWallow';
import PhysicalUtil from '../scripts/libs/util/PhysicalUtil';
import { zh } from '../../resources/i18n/localized-language/zh';
import { en } from '../../resources/i18n/localized-language/en';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManger extends cc.Component {
	
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

		
		cc.game.addPersistRootNode(this.node);
		
		if (cc.sys.isNative) {
			jsb.Device.setKeepScreenOn(true);
		}
		
		
		
		
		

		
		

		
		

		
		
		
		

		

		
		
		

		
		

		this.initLanguageData(GameConfig.language);
		this.initSproto();
		this.addListener();

		
		var EXCEL_TO_DB = require('EXCEL_TO_DB');
		EXCEL_TO_DB.loadAll();
		GameWallow.getInstance();
	}

	start() {
		
		PhysicalUtil.openPhysical();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	

	
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
		
		cc.log(i18n.t('label.id_1'));
	}

	
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

	
	
	
	

	private addListener() {
		let self = this;
		
		if (self.__eventHandle == null) {
			self.__eventHandle = function (data) {
				self.m__eventHandle(data);
			};
			
			GameNotify.getInstance().removeAllEventListenersForHandle(
				self.__eventHandle
			);
			
			
			
			
			
			

			cc.systemEvent.on(
				cc.SystemEvent.EventType.KEY_DOWN,
				this.onKeyDown,
				this
			);
			cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
			cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
			cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
			cc.view.setResizeCallback(function (event) {
				
				
				self.onGameResize(null);
			});
		}
	}

	
	
	

	private m__eventHandle(event) {
		var self = this;
		var data = event.data;
		
		
		
		
	}
	private onGameHide(event) {
		
		
		cc.log('游戏进入后台', moment_util.get_server_time());
		GameConfig.is_game_hide = true;

		var event = {
			name: cc.game.EVENT_HIDE,
		};
		GameNotify.getInstance().dispatchEvent(event);
		
	}
	private onGameShow(e) {
		
		
		
		cc.log('游戏进入前台', moment_util.get_server_time());
		GameConfig.is_game_hide = false;
		var event = {
			name: cc.game.EVENT_SHOW,
		};
		GameNotify.getInstance().dispatchEvent(event);
		
	}
	private onGameResize(e) {
		
		
		var event = {
			name: GameEventConstants.onGameResize,
		};
		GameNotify.getInstance().dispatchEvent(event);
		
	}
	private onKeyDown(event) {
		let self = this;
		cc.log('Press  key : ' + event.keyCode);
		switch (event.keyCode) {
			case cc.macro.KEY.back:
				
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

	
	
	
	
	
	public getPrefab(name: string) {
		
		let self = this;
		for (var i = 0; i < this.ARR_Prefab___.length; i++) {
			var one = this.ARR_Prefab___[i];
			if (one) {
				let current_name = one.name;
				if (name == current_name) {
					return one;
				}
			}
			
		}
	}
}
