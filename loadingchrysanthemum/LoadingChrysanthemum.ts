/**
 *  LoadingChrysanthemum.js
 *  菊花loading 进度条
 *
 *  使用：

   var LoadingChrysanthemum  = require('LoadingChrysanthemum');
   LoadingChrysanthemum.show()

 *
 */

import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';
import { GameConfig } from '../../cc_own/config/GameConfig';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingChrysanthemum extends cc.Component {
	/**单例实例**/
	private static instance: LoadingChrysanthemum = null;

	@property({ type: cc.Prefab, tooltip: '提示的prefable' })
	private toolTipPrefable: cc.Prefab = null;

	//当前的引用资源
	private _toolTipScrits: cc.Node = null;

	//设置一个强制的属性
	private m_isfore_show = false;

	onLoad() {
		LoadingChrysanthemum.instance = this;
		this.m_isfore_show = null;

		this.init();
	}
	private init() {
		if (!GameHelp || !GameHelp.getLayerBySceneLayerName) {
			return;
		}

		//动态的找到内存
		var tipsLayer = GameHelp.getLayerBySceneLayerName(
			GameLayerConstants.LOADING_LAYER
		);
		if (!tipsLayer) {
			return;
		}

		var betUIPrefab = cc.instantiate(this.toolTipPrefable);
		tipsLayer.addChild(betUIPrefab);

		betUIPrefab.active = false;
		this._toolTipScrits = betUIPrefab;

		return betUIPrefab;
	}

	//获取当前的prefable
	private _getPrefable() {
		var self = this;
		// if (self._toolTipScrits == null) {
		//   self.init();
		// } else if (self._toolTipScrits.isValid == false) {
		//   if (self._toolTipScrits.parent) {
		//     self._toolTipScrits.destroy();
		//     self._toolTipScrits = null;
		//     // self._toolTipScrits.removeFromParent()
		//   }
		//   // PoolManager.returnPoolObj("LoadingChrysanthemumPrefab",self._toolTipScrits);
		//   self.init();
		// }
		return self._toolTipScrits;
	}

	/**
	 *  设置 是否强制显示
	 * @param isfore_show
	 */
	public static setIsForeShow(isfore_show) {
		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			instance.m_isfore_show = isfore_show;
		}
	}

	/**
	 * 显示
	 */
	public static show() {
		if (GameConfig.IS_FGUI) {
			// 显示菊花
			fgui.GRoot.inst.showModalWait();
			return;
		}

		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			var prefable = instance._getPrefable();
			//如果没有
			if (!cc.isValid(prefable)) {
				prefable.destroy();
				prefable = null;
				prefable = instance.init();
			}
			if (prefable && !prefable.active) {
				prefable.active = true;
			}
		}
	}

	/**
	 *  隐藏
	 */
	public static hide() {
		if (GameConfig.IS_FGUI) {
			// 显示菊花
			fgui.GRoot.inst.closeModalWait();
			return;
		}

		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			//任何地方 如果是强制显示的 不能自己去隐藏
			if (instance.m_isfore_show) {
				return;
			}
			var prefable = instance._getPrefable();
			if (prefable && prefable.active) {
				prefable.active = false;
			}
		}
	}
}
