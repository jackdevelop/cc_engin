import { MWindow } from '../component/MWindow';
import {
	MWindowConfig,
	MWindowExtends,
	MWindowExtends_gui,
	WindowConfig,
} from '../component/MWindowExtends';
import { AudioManager } from '../manager/AudioManager';
import { GameLoader } from '../utils/GameLoader';
// import { GameNotify } from '../utils/GameNotify';
var _ = require('Underscore');

const { ccclass, property, menu } = cc._decorator;

// /** 界面打开参数接口 */
// interface OpenParams {
// 	name: string;
// }
// /** 界面关闭参数接口 */
// interface CloseParams {
// 	name: string;
// }
// /** 界面内部配置参数 */
// const C = {
// 	FADE_TIME: MWindow.TIME * 3,
// };

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
	// //打开 关闭 参数
	// static OPEN_PARAMS: OpenParams;
	// static CLOSE_PARAMS: CloseParams;

	/** 路径 **/
	// private m_path;
	/** 当前的fgui view */
	// public m_view: fgui.GComponent;

	//当前的参数
	protected m_param: any = null;

	// protected contentPane: custo;
	//j渐隐动画
	// async on_open() {
	//     await MWindow.in_fade_move(this.node, "down", null, { time: C.FADE_TIME })
	// }
	//
	// async on_close() {
	//     await MWindow.out_fade_move(this.node, "up", null, { time: C.FADE_TIME })
	// }
	// @property({ tooltip: '是否包含动画' })
	// is_anmation: boolean = false;

	// @property({ type: cc.AudioClip, tooltip: '打开界面的声音' })
	// sound_begin: cc.AudioClip = null;
	// @property({ type: cc.AudioClip, tooltip: '关闭界面的声音' })
	// sound_end: cc.AudioClip = null;

	// //放大缩小动画
	// async on_open(params: OpenParams) {
	// 	if (this.is_anmation) {
	// 		await MWindow.in_scale(this.node, null);
	// 		this.node.setScale(1);

	// 		AudioManager.getInstance().playSFX(this.sound_begin, null);
	// 	}
	// 	return true;
	// }
	// async on_close(params: OpenParams) {
	// 	if (this.is_anmation) {
	// 		await MWindow.out_scale(this.node, null);
	// 		this.node.setScale(0);

	// 		AudioManager.getInstance().playSFX(this.sound_end, null);
	// 	}
	// 	return true;
	// }
	public constructor() {
		super();
	}

	//只能由 MWindow 调用
	public async __init__(panelConfig: WindowConfig) {
		// this.m_path = path;
		this.onLoad();

		await GameLoader.loadFgui(panelConfig.PATH);
		// fgui.UIPackage.addPackage(this.m_path);
		// this.m_view = fgui.UIPackage.createObject('ModalWaiting', 'TestWin').asCom;
		// this.contentPane.getChild('n1').onClick(this.onClickStart, this);
		// 当时window 的时候  必须 this.contentPane 命名 才可以显示
		this.contentPane = fgui.UIPackage.createObject(
			panelConfig.FGUI_pkgName,
			panelConfig.FGUI_resName
		).asCom;

		// this.contentPane = fgui.UIPackage.createObject('Main', 'MainWindow').asCom;
		// this.m_view.makeFullScreen();
		// fgui.GRoot.inst.addChild(this.contentPane);
		this.center();
		//弹出窗口的动效已中心为轴心
		this.setPivot(0.5, 0.5);
		this.modal = true;

		this.onUILoaded();
	}
	public __onStarted__(param: any) {
		this.m_param = param;
		this.onStarted(param);
	}
	public __onCloseed__(param: any) {
		// this.m_view.
		// this.m_view.dispose();

		this.onCloseed(param);
	}

	/**
	 *  第一次实例化的调用   注意当前类不是 commont 只是自己构造了一个 onLoad 方法而已
	 */
	onLoad() {}

	/**
	 *  ui加载完成的回调
	 * @param event
	 */
	onUILoaded() {}
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
}
