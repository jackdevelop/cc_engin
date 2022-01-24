import { MWindow } from '../component/MWindow';
import { MWindowConfig, MWindowExtends } from '../component/MWindowExtends';
import { AudioManager } from '../manager/AudioManager';
// import { GameNotify } from '../utils/GameNotify';

const { ccclass, property, menu } = cc._decorator;

/** 界面打开参数接口 */
interface OpenParams {
	name: string;
}
/** 界面关闭参数接口 */
interface CloseParams {
	name: string;
}
/** 界面内部配置参数 */
const C = {
	FADE_TIME: MWindow.TIME * 3,
};

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
export class BaseWindow extends MWindowExtends {
	//打开 关闭 参数
	static OPEN_PARAMS: OpenParams;
	static CLOSE_PARAMS: CloseParams;

	//当前的参数
	protected m_param: any = null;
	//j渐隐动画
	// async on_open() {
	//     await MWindow.in_fade_move(this.node, "down", null, { time: C.FADE_TIME })
	// }
	//
	// async on_close() {
	//     await MWindow.out_fade_move(this.node, "up", null, { time: C.FADE_TIME })
	// }
	@property({ tooltip: '是否包含动画' })
	is_anmation: boolean = false;

	@property({ type: cc.AudioClip, tooltip: '打开界面的声音' })
	sound_begin: cc.AudioClip = null;
	@property({ type: cc.AudioClip, tooltip: '关闭界面的声音' })
	sound_end: cc.AudioClip = null;

	//放大缩小动画
	async on_open(params: OpenParams) {
		if (this.is_anmation) {
			await MWindow.in_scale(this.node, null);
			this.node.setScale(1);

			AudioManager.getInstance().playSFX(this.sound_begin, null);
		}
		return true;
	}
	async on_close(params: OpenParams) {
		if (this.is_anmation) {
			await MWindow.out_scale(this.node, null);
			this.node.setScale(0);

			AudioManager.getInstance().playSFX(this.sound_end, null);
		}
		return true;
	}

	//只能由 MWindow 调用
	public __onStarted__(param: any) {
		this.m_param = param;
		this.onStarted(param);
	}

	/**
	 * 初始化调用
	 */
	onStarted(param: any) {
		// return true;
	}

	// //系统得 start 方法
	// start() {
	//   let self = this;
	//   var event = {
	//     name: 'PANEL_OPEN_START',
	//     data: {
	//       Mpanel_name: this.name ? this.name : 'unkonw',
	//       panel: this,
	//       panel_script: this,
	//       params: this.m_param,
	//     },
	//   };
	//   GameNotify.getInstance().dispatchEvent(event);
	// }
}
