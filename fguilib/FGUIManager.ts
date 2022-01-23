






import { GameConfig } from '../../cc_own/config/GameConfig';
import BaseComponent from '../scripts/libs/base/BaseComponent';
import { BaseWindow_fgui } from '../scripts/libs/base/BaseWindow_fgui';
import { MWindowExtends } from '../scripts/libs/component/MWindowExtends';
import { GameLoader } from '../scripts/libs/utils/GameLoader';
import { Util } from '../scripts/libs/utils/Util';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FGUIManager {
	
	private static instance: FGUIManager = null;
	public static getInstance(): FGUIManager {
		if (this.instance == null) {
			this.instance = new FGUIManager();
		}
		return this.instance;
	}
	
	public async init() {
		if (!GameConfig.IS_FGUI) {
			return;
		}

		
		Util.applyMixins(BaseWindow_fgui, [BaseComponent]);

		
		cc.game.addPersistRootNode(fgui.GRoot.create().root.node);
		

		fgui.UIConfig.globalModalWaiting = 'ui://Common/GlobalModalWaiting';
		fgui.UIConfig.windowModalWaiting = 'ui://Common/WindowModalWaiting';
		fgui.UIConfig.tooltipsWin = 'ui://Common/TooltipsWin'; 

		
		await GameLoader.loadFgui('game/planewar/FairyGUI/Common');
		await GameLoader.loadFgui('game/planewar/FairyGUI/Loading');
	}

	
	public async onDestory() {
		if (!GameConfig.IS_FGUI) {
			return;
		}

		fgui.GRoot.inst.removeChildren();
		
	}
}
