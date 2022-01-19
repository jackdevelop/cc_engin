






import { BaseWindow_fgui } from '../../scripts/libs/base/BaseWindow_fgui';
import { MWindowConfig } from '../../scripts/libs/component/MWindowExtends';
import { MWindow_fgui } from '../../scripts/libs/component/MWindow_fgui';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('game/planewar/FairyGUI/Common')
@MWindowConfig({
	PATH: 'game/planewar/FairyGUI/Common', 
	FGUI_pkgName: 'Common', 
	FGUI_resName: 'AlertWindow', 

	TYPE: 'single',
	TYPE_MASK: 0,
})
export default class AlertWindow_fgui extends BaseWindow_fgui {
	
	onUILoaded() {
		let self = this;
		
		this.contentPane.getChild('btn_ok').onClick(function () {
			MWindow_fgui.hide(AlertWindow_fgui, null);

			if (self.m_param && self.m_param.confirmfun) self.m_param.confirmfun();
		}, this);
		
		this.contentPane.getChild('btn_close').onClick(function () {
			MWindow_fgui.hide(AlertWindow_fgui, null);
			if (self.m_param && self.m_param.closefun) self.m_param.closefun();
		}, this);
	}

	
	onStarted(param: any) {
		
		
		
		
		
		
		
		this.contentPane.getChild('n10').text = param.title;
		this.contentPane.getChild('txt_tip').text = param.tip;
	}
	
	onCloseed(param: any) {}
}
