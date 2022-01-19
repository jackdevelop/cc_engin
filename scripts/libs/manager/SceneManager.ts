import { GameConfig } from '../../../../cc_own/config/GameConfig';
import FGUIManager from '../../../fguilib/FGUIManager';
import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
import { BaseScene } from '../base/BaseScene';
import { GameEventConstants } from '../constants/GameEventConstants';
import { GameNotify } from '../utils/GameNotify';

var _ = require('Underscore');

export class SceneManager {
	
	private _loadingSceneName: string;
	
	private _currSceneName: string;
	private _currScene: BaseScene;
	get currScene() {
		return this._currScene;
	}

	
	private _history = [];
	private _history_param = new Object();
	private set_history(sceneName: string, ...params) {
		
		let _history = this._history;
		_history.unshift(sceneName);
		_history = _.uniq(_history);
		this._history = _history;

		
		this._history_param[sceneName] = params;
	}
	
	
	
	
	

	
	private static instance: SceneManager = null;
	public static getInstance(): SceneManager {
		if (this.instance == null) {
			this.instance = new SceneManager();
			this.instance._init();
		}
		return this.instance;
	}

	private _init() {
		
		
		
		
		
		
		
		
		
		
		this._history = [];
	}

	
	public preloadScene(
		sceneName: string,
		onprogress: Function,
		onLoaded: Function
	) {
		let self = this;
		cc.director.preloadScene(
			sceneName,
			(completedCount, totalCount, item) => {
				
				
				
				
				

				if (onprogress) {
					onprogress(completedCount, totalCount, item);
				}
			},
			(error: Error, asset: cc.SceneAsset) => {
				if (error) {
					cc.log('preloadScene 加载出错:', error, asset);
					self.preloadScene(sceneName, onprogress, onLoaded);
				} else {
					cc.log('preloadScene 加载完毕:', error, asset);

					if (onLoaded) {
						onLoaded();
					}
				}
			}
		);
	}

	
	private _loadScene(sceneName: string, onLoadedHandle: Function, ...params) {
		this.set_history(sceneName, ...params);

		
		if (this._currSceneName == sceneName) {
			if (onLoadedHandle) {
				onLoadedHandle();
			}

			if (this._currScene && cc.isValid(this._currScene.node)) {
				
				this._currScene.__beforeDestroy__();
				this._currScene.__onStarted__(...params);
				
			}
			return;
		}

		if (this._loadingSceneName) {
			return;
		}

		
		this._lastSceneName = this._currSceneName;
		this._loadingSceneName = sceneName;
		
		
		cc.log('加载场景：', sceneName);
		cc.director.loadScene(sceneName, (err, scene: cc.Scene) => {
			this._loadingSceneName = null;
			if (!cc.isValid(scene)) {
				
				
				
			} else {
				
				const oldDestroy = scene.destroy;
				scene.destroy = () => {
					this.onSceneWillDestroy();
					return oldDestroy.call(scene);
				};

				const baseScene = scene
					.getChildByName(sceneName)
					.getComponent(sceneName);
				if (baseScene && cc.isValid(baseScene.node)) {
					this._currScene = baseScene;
					this._currSceneName = sceneName;
					baseScene.setName(sceneName);
					baseScene.__onStarted__(...params);
				}

				
				if (onLoadedHandle) {
					onLoadedHandle();
				}
			}
		});
	}
	public loadScene(
		sceneName: string,
		is_preloaded: Boolean = true,
		onprogress: Function,
		onLoaded: Function,
		onPreloaded: Function,
		...params
	) {
		var self = this;

		LoadingChrysanthemum.show();

		
		var event = {
			name: GameEventConstants.SCENE_CHANGE_START,
			data: {
				sceneName: sceneName,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);

		
		let onLoadedCallback = function () {
			LoadingChrysanthemum.hide();
			if (onLoaded) {
				onLoaded();
			}
			cc.log('加载场景完毕：', cc.sys.now());
			
			FGUIManager.getInstance().onDestory();

			
			var event = {
				name: GameEventConstants.SCENE_CHANGE_END,
				data: {
					sceneName: sceneName,
				},
			};
			GameNotify.getInstance().dispatchEvent(event);
		};

		
		let onPreLoadedCallback = function () {
			cc.log('加载场景开始：', cc.sys.now());
			self._loadScene(sceneName, onLoadedCallback, ...params);
		};

		
		let _temp_onPreloaded = function () {
			if (onPreloaded) {
				onPreloaded(onPreLoadedCallback);
			} else {
				onPreLoadedCallback();
			}
		};
		if (is_preloaded) {
			cc.log('预加载场景开始：', is_preloaded, cc.sys.now());
			this.preloadScene(sceneName, onprogress, _temp_onPreloaded);
		} else {
			_temp_onPreloaded();
		}
	}

	
	public backScene() {
		let _history = this._history;
		if (_history && _history.length > 1) {
			let back_history = _history[1];
			let back_history_param = this._history_param[back_history];

			this.loadScene(back_history, null, null, null, null, back_history_param);
		} else {
			let currScene = this._currScene;
			currScene.backScene(null);
		}
	}
	public backToHallOrLobbyScene() {
		
	}

	
	
	
	
	private onSceneWillLaunch(newScene: cc.Scene) {
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}
	
	
	
	
	
	
	
	private onSceneWillDestroy() {
		if (this._currScene && cc.isValid(this._currScene.node)) {
			
			this._currScene.__beforeDestroy__();
			this._currScene = null;
			this._currSceneName = null;
		}
	}
}
