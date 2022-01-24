// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameConfig } from '../../../cc_own/config/GameConfig';
import { MWindow_fgui } from '../../scripts/libs/component/MWindow_fgui';
import AlertWindow from './AlertWindow';
import AlertWindow_fgui from './AlertWindow_fgui';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Alert extends cc.Component {
	/**
	 * 显示
	 */
	public static show(
		title,
		tip,
		btnArr,
		confirmfun,
		canclefun,
		closefun,
		parent_layer = null
	): void {
		if (GameConfig.IS_FGUI) {
			MWindow_fgui.show(AlertWindow_fgui, {
				title,
				tip,
				btnArr,
				confirmfun,
				canclefun,
				closefun,
			});
		} else {
			AlertWindow.show(title, tip, btnArr, confirmfun, canclefun, closefun);
		}
	}
}
