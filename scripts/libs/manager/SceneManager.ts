import { GameConfig } from '../../../../cc_own/config/GameConfig';
import FGUIManager from '../../../fguilib/FGUIManager';
import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
import { BaseScene } from '../base/BaseScene';
import { MWindow } from '../component/MWindow';
import { MWindow_fgui } from '../component/MWindow_fgui';
import { GameEventConstants } from '../constants/GameEventConstants';
import { GameNotify } from '../utils/GameNotify';

var _ = require('Underscore');

export class SceneManager {
	//当前正在加载的场景名称
	private _loadingSceneName: string;
	//当前的场景名称   //获取当前场景
	private _currSceneName: string;
	private _currScene: BaseScene;
	get currScene() {
		return this._currScene;
	}

	/** 所有加载过的场景 **/
	private _history = [];
	private _history_param = new Object();
	private set_history(sceneName: string, ...params) {
		//吧新的排序
		let _history = this._history;
		_history.unshift(sceneName);
		_history = _.uniq(_history);
		this._history = _history;

		//参数存储起来
		this._history_param[sceneName] = params;
	}
	// //上一个场景名称
	// private _lastSceneName: string;
	// public getLastSceneName() {
	//   return this._lastSceneName;
	// }

	/**单例实例**/
	private static instance: SceneManager = null;
	public static getInstance(): SceneManager {
		if (this.instance == null) {
			this.instance = new SceneManager();
			this.instance._init();
		}
		return this.instance;
	}

	private _init() {
		// 加载新场景之前
		//EVENT_BEFORE_SCENE_LOADING
		//运行新场景之前
		// cc.director.on(
		//   cc.Director.EVENT_BEFORE_SCENE_LAUNCH,
		//   this.onSceneWillLaunch,
		//   this
		// );
		//运行新场景之后所触发的事件。
		//EVENT_AFTER_SCENE_LAUNCH String
		this._history = [];
	}

	/**
	 *  预加载场景
	 *
	 * @param sceneName
	 * @param onprogress
	 * @param onLoaded
	 */
	public preloadScene(
		sceneName: string,
		onprogress: Function,
		onLoaded: Function
	) {
		let self = this;
		cc.director.preloadScene(
			sceneName,
			(completedCount, totalCount, item) => {
				//cc.log("preloadScene:",completedCount/totalCount,item)
				// var perent = Math.abs(
				//   Math.floor((completedCount / totalCount).toFixed(2) * 100) / 100
				// );
				// this.perent_lable.string=Math.floor(perent*100)+'%';

				if (onprogress) {
					onprogress(completedCount, totalCount, item);
				}
			},
			(error: Error) => {
				if (error) {
					// cc.log('preloadScene 加载出错:', error);
					self.preloadScene(sceneName, onprogress, onLoaded);
				} else {
					// cc.log('preloadScene 加载完毕:', error);

					if (onLoaded) {
						onLoaded();
					}
				}
			}
		);
	}

	/**
	 *  切换场景
	 * @param sceneName
	 * @param params
	 */
	private _loadScene(sceneName: string, onLoadedHandle: Function, ...params) {
		this.set_history(sceneName, ...params);

		//reload current scene
		if (this._currSceneName == sceneName) {
			if (onLoadedHandle) {
				onLoadedHandle();
			}

			if (this._currScene && cc.isValid(this._currScene.node)) {
				// this.closeAllView();
				this._currScene.__beforeDestroy__();
				this._currScene.__onStarted__(...params);
				// event_mgr.get_inst().fire(Event_Name.SCENE_CHANGED, sceneName);
			}
			return;
		}

		if (this._loadingSceneName) {
			return;
		}

		//上一个的加载场景
		// this._lastSceneName = this._currSceneName;
		this._loadingSceneName = sceneName;
		// this.preloadScene(sceneName);
		// return await new Promise((resolve, reject) => {
		// cc.log('加载场景：', sceneName);
		cc.director.loadScene(sceneName, (err, scene: cc.Scene) => {
			this._loadingSceneName = null;
			if (!cc.isValid(scene)) {
				// cc.log(`SceneMgr, loadScene scene = null`);
				// resolve(null)
				// return;
			} else {
				//destroy old scene
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

				// resolve(scene) // TODO 返回数据
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

		//加载新场景完毕
		var event = {
			name: GameEventConstants.SCENE_CHANGE_START,
			data: {
				sceneName: sceneName,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);

		//已经进入场景加载完成
		let onLoadedCallback = function () {
			LoadingChrysanthemum.hide();
			if (onLoaded) {
				onLoaded();
			}
			// cc.log('加载场景完毕：', cc.sys.now());

			//加载新场景完毕
			var event = {
				name: GameEventConstants.SCENE_CHANGE_END,
				data: {
					sceneName: sceneName,
				},
			};
			GameNotify.getInstance().dispatchEvent(event);
		};

		//onPreLoadedCallback 加载完成
		let onPreLoadedCallback = function () {
			//隐藏所有的 fgui
			FGUIManager.getInstance().onDestory();
			// 清空已经销毁的数据
			MWindow_fgui.init();
			MWindow.init();
			// cc.log('加载场景开始：', cc.sys.now());
			self._loadScene(sceneName, onLoadedCallback, ...params);
		};

		//如果是有 onPreloaded 抛出预加载完成
		let _temp_onPreloaded = function () {
			if (onPreloaded) {
				onPreloaded(onPreLoadedCallback);
			} else {
				onPreLoadedCallback();
			}
		};
		if (is_preloaded) {
			// cc.log('预加载场景开始：', is_preloaded, cc.sys.now());
			this.preloadScene(sceneName, onprogress, _temp_onPreloaded);
		} else {
			_temp_onPreloaded();
		}
	}

	/**
	 *  返回到之前的场景
	 */
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
		// this.backScene(params);//backScene
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////// 内部方法 ///////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//收集依赖
	private onSceneWillLaunch(newScene: cc.Scene) {
		//收集新场景依赖的资源
		// const excludeMap = new Object();
		// const newSceneAssets = newScene.dependAssets;
		// if (newSceneAssets) {
		//   newSceneAssets.forEach((a) => {
		//     excludeMap[a] = true;
		//   });
		// }
		// //收集持久节点依赖的资源
		// const toast = newScene.getChildByName("toast");
		// if(toast) {
		//     cc.log("toast in current scene");
		//     const deps = cc.loader.getDependsRecursively(Toast.resPath);
		//     deps.forEach(d => {
		//         excludeMap[d] = true;
		//         // cc.log("prefabs/misc/toast deps=" + d);
		//     });
		// }
		//激活新场景前释放旧场景资源
		// Toast.clear();
		// AudioPlayer.getInst().clear_cache();
		// DragonBoneFactory.getInst().releaseAll();
		// ParticleFactory.getInst().releaseAll();
		// LoadingQueue.getInst().clear();
		// loader_mgr.getInstance().releaseAll(excludeMap);
	}
	// private closeAllView() {
	//   return true;
	//   //旧场景destroy前关闭所有已打开的界面
	//   // pop_mgr.getInstance().clear();
	//   // pool_mgr.getInstance().clear();
	// }
	//场景即将销毁
	private onSceneWillDestroy() {
		if (this._currScene && cc.isValid(this._currScene.node)) {
			// this.closeAllView();
			this._currScene.__beforeDestroy__();
			this._currScene = null;
			this._currSceneName = null;
		}
	}
}
