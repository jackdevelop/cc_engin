// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseWindow_fgui } from '../scripts/libs/base/BaseWindow_fgui';
import { MWindowConfig } from '../scripts/libs/component/MWindowExtends';
import { MWindow_fgui } from '../scripts/libs/component/MWindow_fgui';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('game/planewar/FairyGUI/Common')
@MWindowConfig({
	PATH: 'game/planewar/FairyGUI/Common', // fgui的路径地址
	FGUI_pkgName: 'Common', //fgui的文件夹名
	FGUI_resName: 'TooltipsWin', //fgui的文件名  ui://Common/TooltipsWin

	TYPE: 'single',
	TYPE_MASK: 0,
})
export default class ToolTipsWindow_fgui extends BaseWindow_fgui {
	public m_start_pos; //当前的起步坐标

	//加载完 fgui的文件的调用
	onUILoaded() {
		let self = this;

		let pos = cc.view.getCanvasSize();
		this.m_start_pos = pos.height / 4;
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
		// cc.log('打开了');
		this.contentPane.getChild('title').text = param.title + '';

		let start_pos = this.m_start_pos;

		let node_tooltips = this.contentPane.node;
		// cc.log(node_tooltips.getPosition());
		node_tooltips.stopAllActions();
		node_tooltips.setPosition(0, 0, 0);
		node_tooltips.opacity = 255;
		node_tooltips.active = true;

		cc.tween(node_tooltips)
			.to(0.5, { position: cc.v2(0, start_pos + 100) })
			.to(1, { opacity: 0, position: cc.v2(0, start_pos + start_pos * 2) })
			.call(() => {
				MWindow_fgui.hide(ToolTipsWindow_fgui, null);
				// node_tooltips.active = false;
				// node_tooltips.opacity = 255;
			})
			.start();
	}
	//关闭时候的调用
	onCloseed(param: any) {}
}
