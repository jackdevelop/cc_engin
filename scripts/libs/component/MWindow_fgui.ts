



import { WindowInstance } from './MWindowExtends';
import { BaseWindow_fgui } from '../base/BaseWindow_fgui';


var _ = require('Underscore');

export class MWindow_fgui {
	static instance: MWindow_fgui;

	static init() {
		let old_instance = MWindow_fgui.instance;
		if (old_instance) {
			let old_map_ins = old_instance.map_ins;
			_.each(old_map_ins, function (v, k) {});

			old_instance.map_ins = null;
			MWindow_fgui.instance = null;
		}

		MWindow_fgui.instance = new MWindow_fgui();
	}

	
	private map_ins: Map<string, WindowInstance> = new Map();
	
	private arr_ins = [];

	
	
	

	
	static async open<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		
		cc.log('新打开了窗口:', panel.name);

		
		let key = panel.CONFIG.PATH;
		let value = MWindow_fgui.instance.map_ins.get(key);
		let panel_script = null;
		if (!value) {
			panel_script = new panel();
			await panel_script.__init__(panel.CONFIG);

			value = {
				cmd: [],
				panel_script: panel_script,
			};
			
			MWindow_fgui.instance.map_ins.set(key, value);
		} else {
			panel_script = value.panel_script;
		}

		
		let arr_ins = MWindow_fgui.instance.arr_ins;
		arr_ins.unshift(key);
		arr_ins = _.uniq(arr_ins);
		MWindow_fgui.instance.arr_ins = arr_ins;

		
		panel_script.__onStarted__(params);
		panel_script.show();
		

		return panel;
	}
	
	static async close<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['CLOSE_PARAMS']
	) {
		cc.log('新销毁了窗口:', panel);

		
		let key = panel.CONFIG.PATH;
		let value = MWindow_fgui.instance.map_ins.get(key);
		if (value) {
			let panel_script: BaseWindow_fgui = value.panel_script;
			if (panel_script) {
				panel_script.__onCloseed__(params);
				panel_script.hide();
			}
		}

		let arr_ins = MWindow_fgui.instance.arr_ins;
		arr_ins = _.without(arr_ins, key);
		arr_ins = _.uniq(arr_ins);
		MWindow_fgui.instance.arr_ins = arr_ins;

		cc.log('当前的所有排列 close ：', arr_ins);
	}

	
	
	
	
	
	
	
	
	
	static async show<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		let panel_script = await this.open(panel, params);
		return panel_script;
	}
	static async hide<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		this.close(panel, params);
	}
}
