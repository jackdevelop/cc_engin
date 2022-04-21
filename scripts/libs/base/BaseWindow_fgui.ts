import {
	MWindowConfig,
	MWindowExtends_gui,
	WindowConfig,
} from '../component/MWindowExtends';
import { MWindow_fgui } from '../component/MWindow_fgui';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');

const { ccclass, property, menu } = cc._decorator;

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - [注意] 需要通过MPanelConfig配置界面参数.
 * - [注意] 如果有的话,需要配置OPEN_PARAMS/CLOSE_PARAMS来进行类型提示.
 */
@ccclass
@menu('panel/hall/BaseWindow')
@MWindowConfig({
	PATH: 'hall/BaseWindow',
	TYPE: 'single',

	FGUI_pkgName: 'Main',
	FGUI_resName: 'MainWindow',
})
export class BaseWindow_fgui extends MWindowExtends_gui {

	//当前的参数
	protected m_param: any = null;
	private m_WindowPanel: typeof BaseWindow_fgui = null;
	private m_BackWindowPanel: typeof BaseWindow_fgui = null;
	private m_BackWindowParam: any = null;

	//只能由 MWindow 调用
	public async __init__(panelConfig: WindowConfig) {
		this.onLoad();

		await GameLoader.loadFgui(panelConfig.PATH);
		// 加载的fgui资源必须赋值contentPane才可以显示
		this.contentPane = fgui.UIPackage.createObject(
			panelConfig.FGUI_pkgName,
			panelConfig.FGUI_resName
		).asCom;
		this.center();
		//弹出窗口的动效已中心为轴心
		this.setPivot(0.5, 0.5);
		this.modal = true;

		this.onUILoaded();
	}
	public __onStarted__(panel: typeof BaseWindow_fgui, param: any = {}) {
		this.m_WindowPanel = panel;
		this.m_param = param;
		if (param) {
			this.m_BackWindowPanel = param.backWindowPanel;
			this.m_BackWindowParam = param.backWindowParam;
		}
		this.onStarted(param);
	}
	public __onCloseed__(param: any) {
		this.onCloseed(param);
	}

	/**
	 *  第一次实例化的调用   注意当前类不是 commont 只是自己构造了一个 onLoad 方法而已
	 */
	onLoad() { }

	/**
	 *  ui加载完成的回调
	 * @param event
	 */
	onUILoaded() { }
	/**
	 * 初始化调用
	 */
	onStarted(param: any) {
		// return true;
	}
	/**
	 * 关闭时候调用
	 */
	onCloseed(param: any) {
		// return true;
	}

	protected async showComeBackWindow(windowPanel: typeof BaseWindow_fgui, params: any = {}) {
		params.backWindowPanel = this.m_WindowPanel;
		params.backWindowParam = this.m_param;
		await MWindow_fgui.show(windowPanel, params);
		await MWindow_fgui.hide(this.m_WindowPanel, null);
	}

	protected async backWindow(params: any = {}) {
		let backWindow = this.m_BackWindowPanel;
		if (backWindow) {
			await MWindow_fgui.show(backWindow, this.m_BackWindowParam);
		}
		await MWindow_fgui.hide(this.m_WindowPanel, params);
	}
}
