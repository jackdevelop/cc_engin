









import { MWindow } from '../scripts/libs/component/MWindow';
import { BaseWindow } from '../scripts/libs/base/BaseWindow';
import { HallService } from '../../app/hall/scripts/HallService';
import { MWindowConfig } from '../scripts/libs/component/MWindowExtends';

var _ = require('Underscore');
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('panel/common/GMSelectPanel')
@MWindowConfig({ PATH: 'common/GMSelectPanel', TYPE: 'single' })
export default class GMSelectPanel extends BaseWindow {
	
	
	
	
	
	
	
	

	@property({ type: cc.EditBox, tooltip: 'EditBox' })
	txt_gm: cc.EditBox = null;

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	onStarted(param: any) {
		
		let self = this;
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	async onClickOK(event, eventdata) {
		let self = this;
		if (!this.txt_gm) {
			return;
		}

		let cmd = 'game_gm_command';
		let gm_param = self.txt_gm.string;
		let gm_type = 0;
		let ret = await HallService.getInstance().game_gm(gm_type, gm_param);
	}

	
	async onClickClose(event, eventdata) {
		MWindow.hide(GMSelectPanel, null);
	}

	
	async onClickDump(event, eventdata) {
		
		let str = `当前资源总数:${Object.keys(cc.loader._cache).length}`;
		
		cc.log(str);
	}
}
