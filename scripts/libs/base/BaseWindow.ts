import { MWindow } from '../component/MWindow';
import { MWindowConfig, MWindowExtends } from '../component/MWindowExtends';
import { AudioManager } from '../manager/AudioManager';


const { ccclass, property, menu } = cc._decorator;


interface OpenParams {
	name: string;
}

interface CloseParams {
	name: string;
}

const C = {
	FADE_TIME: MWindow.TIME * 3,
};


@ccclass
@menu('panel/hall/BaseWindow')
@MWindowConfig({
	PATH: 'hall/BaseWindow',
	TYPE: 'single',

	FGUI_pkgName: 'Main',
	FGUI_resName: 'MainWindow',
})
export class BaseWindow extends MWindowExtends {
	
	static OPEN_PARAMS: OpenParams;
	static CLOSE_PARAMS: CloseParams;

	
	protected m_param: any = null;
	
	
	
	
	
	
	
	
	@property({ tooltip: '是否包含动画' })
	is_anmation: boolean = false;

	@property({ type: cc.AudioClip, tooltip: '打开界面的声音' })
	sound_begin: cc.AudioClip = null;
	@property({ type: cc.AudioClip, tooltip: '关闭界面的声音' })
	sound_end: cc.AudioClip = null;

	
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

	
	public __onStarted__(param: any) {
		this.m_param = param;
		this.onStarted(param);
	}

	
	onStarted(param: any) {
		
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
