






import { GameConfig } from '../../../cc_own/config/GameConfig';
import { MWindow_fgui } from '../../scripts/libs/component/MWindow_fgui';
import AlertWindow from './AlertWindow';
import AlertWindow_fgui from './AlertWindow_fgui';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Alert extends cc.Component {
	
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
