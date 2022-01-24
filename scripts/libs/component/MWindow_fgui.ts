//  this.node.emit('fade-in');
//  this.node.emit('fade-out');

/** 移动方向 */
import { WindowInstance } from './MWindowExtends';
import { BaseWindow_fgui } from '../base/BaseWindow_fgui';
// import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
// import {GameLayerConstants} from "../../scripts/constants/GameLayerConstants";
var _ = require('Underscore');
/**
 * [M] 游戏窗口管理
 * - 封装窗口打开的open/close接口,API为open/close
 * - 封装窗口中UI打开的in/out接口,API为in/out+type
 * - [注意] 为了避免通过MPanel调用时无法注释每个窗口参数对应的意义,建议在各子窗口中实现相应的static方法标明参数含义
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 虽然格式上是static函数,但是需要在AppMain中实例化,使用到了MPanel.ins
 */
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

	/** panel-实例的map结构存储;包括prefab,node,cmd */
	private map_ins: Map<string, WindowInstance> = new Map();
	/** 存储当前的数组 最后打开的 往数组第一个放  **/
	private arr_ins = [];

	//////////
	// 打开 关闭
	//////////

	/**
	 * 打开panel
	 * @param panel 传入panel的类型
	 * @param params
	 * @static @async
	 */
	static async open<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		// 判定是否配置了panel-config
		cc.log('新打开了窗口:', panel.name);

		// 获取key,value,z_index
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
			//新的设置进 map_ins 中
			MWindow_fgui.instance.map_ins.set(key, value);
		} else {
			panel_script = value.panel_script;
		}

		//吧新的排序好
		let arr_ins = MWindow_fgui.instance.arr_ins;
		arr_ins.unshift(key);
		arr_ins = _.uniq(arr_ins);
		MWindow_fgui.instance.arr_ins = arr_ins;

		//调用 打开
		panel_script.__onStarted__(params);
		panel_script.show();
		// await panel_script.on_open(params);

		return panel;
	}
	/**
	 * 关闭panel
	 * @param panel 传入panel的类型
	 * @param param
	 * @static @async
	 */
	static async close<T extends typeof BaseWindow_fgui>(
		panel: T,
		params: T['CLOSE_PARAMS']
	) {
		cc.log('新销毁了窗口:', panel);

		// 获取key,value
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

	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	// 显示  隐藏
	//////////  ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// ////////// //////////
	/**
	 * 打开panel
	 * @param panel 传入panel的类型
	 * @param params
	 * @static @async
	 */
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
