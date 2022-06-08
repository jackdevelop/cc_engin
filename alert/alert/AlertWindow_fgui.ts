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

	private c_type: fgui.Controller = null;
	private txt_title: fgui.GLabel = null;
	private txt_content: fgui.GRichTextField = null;
	private btn_ok: fgui.GButton = null;
	private btn_cancel: fgui.GButton = null;
	private btn_close: fgui.GButton = null;

	private ok_callback: Function = null;
	private cancel_callback: Function = null;
	private close_callback: Function = null;


	//加载完 fgui的文件的调用
	onUILoaded() {
		this.c_type = this.contentPane.getController('c_type');
		this.txt_title = this.contentPane.getChild('txt_title').asLabel;
		this.txt_content = this.contentPane.getChild('txt_content').asRichTextField;
		let g_btn = this.contentPane.getChild('btn_ok').asButton;
		g_btn.onClick(this.onClickBtnOk, this);
		this.btn_ok = g_btn;
		g_btn = this.contentPane.getChild('btn_cancel').asButton;
		g_btn.onClick(this.onClickBtnCancel, this);
		this.btn_cancel = g_btn;
		g_btn = this.contentPane.getChild('btn_close').asButton;
		g_btn.onClick(this.onClickBtnClose, this);
		this.btn_close = g_btn;
	}

	//打开时候的调用
	onStarted(param: any) {
		// title,
		// 	tip,
		// 	btnArr,
		// 	confirmfun,
		// 	canclefun,
		// 	closefun
		this.reset();
		if (!param) {
			return;
		}
		let btnArr = param.btnArr || [];
		let len = btnArr.length;
		this.btn_ok.text = btnArr[0] || ['确定'];
		if (len > 1) {
			this.c_type.selectedIndex = 1;
			this.btn_cancel.text = btnArr[1];
		} else {
			this.c_type.selectedIndex = 0;
		}
		let title = param.title || '提示';
		let content = param.tip || '';
		this.txt_title.text = title;
		this.txt_content.text = content;
		this.ok_callback = param.confirmfun;
		this.cancel_callback = param.canclefun;
		this.close_callback = param.closefun;
	}

	private reset() {
		this.ok_callback = null;
		this.cancel_callback = null;
		this.close_callback = null;
	}

	private onClickBtnOk(event: fgui.Event) {
		MWindow_fgui.hide(AlertWindow_fgui, null);
		let callback = this.ok_callback;
		if (callback) {
			callback();
		}
	}

	private onClickBtnCancel(event: fgui.Event) {
		MWindow_fgui.hide(AlertWindow_fgui, null);
		let callback = this.cancel_callback;
		if (callback) {
			callback();
		}
	}

	private onClickBtnClose(event: fgui.Event) {
		MWindow_fgui.hide(AlertWindow_fgui, null);
		let callback = this.close_callback;
		if (callback) {
			callback();
		}
	}
}
