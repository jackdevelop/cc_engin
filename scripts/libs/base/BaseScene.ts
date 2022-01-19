




import { AudioManager } from '../manager/AudioManager';
import { SceneManager } from '../manager/SceneManager';
import { BaseController } from './BaseController';
import BaseComponent from './BaseComponent';
import { GameHelp } from '../utils/GameHelp';
import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');

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
	

	
	private _name: string;
	
	protected _controller: BaseController;

	
	

	
	

	
	
	

	onLoad() {
		cc.log('BaseScene:onLoad()');

		
		var safeArea = cc.sys.getSafeAreaRect();
		let winSize = cc.winSize;
		let safe_height = Math.ceil(winSize.height - safeArea.height);
		

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
		
		
		
		
		
		
		
		

		
		this._playBgSound();

		
		if (this.m_game_name_future) {
			
			SceneManager.getInstance().preloadScene(
				this.m_game_name_future,
				null,
				null
			);
		}
	}

	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	

	setName(value: string) {
		this._name = value;
	}
	getName() {
		return this._name;
	}
	getGameId() {
		return this.m_game_id;
	}

	
	async __onStarted__(...params) {
		cc.log(`scene<${this._name}> __onStarted__`, ...params);
		this.onStarted(...params);
		
		this.enabled = true;
		if (this._controller) {
			this._controller.__onStarted__(this);
		}
	}
	
	__beforeDestroy__() {
		cc.log(`scene<${this._name}> __beforeDestroy__`);
		this.enabled = false;
		AudioManager.getInstance().stopAll();
		
		this.unscheduleAllCallbacks();
		
		
		
		
		
		
		this.beforeDestroy();

		if (this._controller) {
			this._controller.__beforeDestroy__();
		}
	}

	
	onStarted(...params) {
		return true;
		
		
	}
	
	beforeDestroy() {
		cc.log('beforeDestroy');
		return true;
	}

	
	
	backScene(json) {
		if (!json) {
			json = this.m_back_scene_param;
		}
		
		
		
		
		
		
		
		
		
		
		let isstr = _.isString(json);
		if (isstr) {
			json = JSON.parse(json);
		}

		let sceneName = 'HallScene'; 
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	async _playBgSound() {
		
		
		AudioManager.getInstance().stopAll();
		if (this.SOUND_SCENE && this.SOUND_SCENE.length > 1) {
			let clip = await GameLoader.load(
				GameConstants.AUDIO_DIR + this.SOUND_SCENE,
				cc.AudioClip
			);
			
			AudioManager.getInstance().playBGM(clip);
			
		}
	}

	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
