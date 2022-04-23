// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseWindow_fgui } from '../../scripts/libs/base/BaseWindow_fgui';
import { MWindowConfig } from '../../scripts/libs/component/MWindowExtends';
import { MWindow_fgui } from '../../scripts/libs/component/MWindow_fgui';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('game/planewar/FairyGUI/Common')
@MWindowConfig({
	PATH: 'game/planewar/FairyGUI/Common', // fgui的路径地址
	FGUI_pkgName: 'Common', //fgui的文件夹名
	FGUI_resName: 'AlertWindow', //fgui的文件名

	TYPE: 'single',
	TYPE_MASK: 0,
})
export default class AlertWindow_fgui extends BaseWindow_fgui {
	//加载完 fgui的文件的调用
	onUILoaded() {
		let self = this;
		//点击 ok
		this.contentPane.getChild('btn_ok').onClick(function () {
			MWindow_fgui.hide(AlertWindow_fgui, null);

			if (self.m_param && self.m_param.confirmfun) self.m_param.confirmfun();
		}, this);
		//点击关闭
		this.contentPane.getChild('btn_close').onClick(function () {
			MWindow_fgui.hide(AlertWindow_fgui, null);
			if (self.m_param && self.m_param.closefun) self.m_param.closefun();
		}, this);
	}

	//打开时候的调用
	onStarted(param: any) {
		// title,
		// 	tip,
		// 	btnArr,
		// 	confirmfun,
		// 	canclefun,
		// 	closefun,
		// txt_tip
		this.contentPane.getChild('n10').text = param.title;
		this.contentPane.getChild('txt_tip').text = param.tip;
	}
}
