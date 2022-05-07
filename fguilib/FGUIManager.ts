// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameConfig } from '../../cc_own/config/GameConfig';
import BaseComponent from '../scripts/libs/base/BaseComponent';
import { BaseWindow_fgui } from '../scripts/libs/base/BaseWindow_fgui';
import { MWindowExtends } from '../scripts/libs/component/MWindowExtends';
import { GameLoader } from '../scripts/libs/utils/GameLoader';
import { Util } from '../scripts/libs/utils/Util';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FGUIManager {
	/**单例实例**/
	private static instance: FGUIManager = null;
	public static getInstance(): FGUIManager {
		if (this.instance == null) {
			this.instance = new FGUIManager();
		}
		return this.instance;
	}
	//初始化
	public async init() {
		if (!GameConfig.IS_FGUI) {
			return;
		}

		//让 BaseWindow_fgui 继承  fgui.Window
		Util.applyMixins(BaseWindow_fgui, [BaseComponent]);

		//提前将fgui 创建
		cc.game.addPersistRootNode(fgui.GRoot.create().root.node);
		// fgui.UIConfig.modalLayerColor = new cc.Color(255, 0.0, 0.0, 255);

		fgui.UIConfig.globalModalWaiting = 'ui://Common/GlobalModalWaiting';
		fgui.UIConfig.windowModalWaiting = 'ui://Common/WindowModalWaiting';
		fgui.UIConfig.tooltipsWin = 'ui://Common/TooltipsWin'; // 注意 TooltipsWin 这个控件里面的文本 必须命名为 title

		//两个必须要用到的组件
		await GameLoader.loadFgui('game/planewar/FairyGUI/Common');
		await GameLoader.loadFgui('game/planewar/FairyGUI/Loading');
		await GameLoader.loadFgui('game/planewar/FairyGUI/Bg');
	}

	//destory 比如切换场景的时候  会调用此方法
	public async onDestory() {
		if (!GameConfig.IS_FGUI) {
			return;
		}

		fgui.GRoot.inst.removeChildren();
		// fgui.GRoot.inst.closeAllWindows();
	}
}
