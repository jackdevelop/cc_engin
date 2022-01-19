

import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';
import { GameConfig } from '../../cc_own/config/GameConfig';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingChrysanthemum extends cc.Component {
	
	private static instance: LoadingChrysanthemum = null;

	@property({ type: cc.Prefab, tooltip: '提示的prefable' })
	private toolTipPrefable: cc.Prefab = null;

	
	private _toolTipScrits: cc.Node = null;

	
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

	
	private _getPrefable() {
		var self = this;
		
		
		
		
		
		
		
		
		
		
		
		return self._toolTipScrits;
	}

	
	public static setIsForeShow(isfore_show) {
		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			instance.m_isfore_show = isfore_show;
		}
	}

	
	public static show() {
		if (GameConfig.IS_FGUI) {
			
			fgui.GRoot.inst.showModalWait();
			return;
		}

		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			var prefable = instance._getPrefable();
			
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

	
	public static hide() {
		if (GameConfig.IS_FGUI) {
			
			fgui.GRoot.inst.closeModalWait();
			return;
		}

		var instance = LoadingChrysanthemum.instance;
		if (instance) {
			
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
