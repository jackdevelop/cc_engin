import { MWindow } from '../component/MWindow';
import {
	MWindowConfig,
	MWindowExtends,
	MWindowExtends_gui,
	WindowConfig,
} from '../component/MWindowExtends';
import { AudioManager } from '../manager/AudioManager';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');

const { ccclass, property, menu } = cc._decorator;















@ccclass
@menu('panel/hall/BaseWindow')
@MWindowConfig({
	PATH: 'hall/BaseWindow',
	TYPE: 'single',

	FGUI_pkgName: 'Main',
	FGUI_resName: 'MainWindow',
})
export class BaseWindow_fgui extends MWindowExtends_gui {
	
	
	

	
	
	
	

	
	protected m_param: any = null;
	
	
	
	
	
	
	
	
	
	

	
	
	
	

	
	
	
	
	

	
	
	
	
	
	
	
	

	
	
	
	
	public constructor() {
		super();
	}

	
	public async __init__(panelConfig: WindowConfig) {
		
		this.onLoad();

		await GameLoader.loadFgui(panelConfig.PATH);
		
		
		
		
		this.contentPane = fgui.UIPackage.createObject(
			panelConfig.FGUI_pkgName,
			panelConfig.FGUI_resName
		).asCom;
		
		
		
		this.center();
		
		this.setPivot(0.5, 0.5);
		this.modal = true;

		this.onUILoaded();
	}
	public __onStarted__(param: any) {
		this.m_param = param;
		this.onStarted(param);
	}
	public __onCloseed__(param: any) {
		
		

		this.onCloseed(param);
	}

	
	onLoad() {}

	
	onUILoaded() {}
	
	onStarted(param: any) {
		
	}
	
	onCloseed(param: any) {
		
	}
}
