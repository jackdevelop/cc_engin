



import { GameHelp } from '../utils/GameHelp';
import PopUpManager from '../manager/PopUpManager';
import { GameLayerConstants } from '../../../../cc_own/constants/GameLayerConstants';
import BaseComponent from '../base/BaseComponent';
import { GameNotify } from '../utils/GameNotify';
import { GameLoader } from '../utils/GameLoader';
import GameManger from '../../../gamemanager/GameManger';
import {
	ActionParams,
	C,
	DIRECTION,
	MWindowExtends,
	WindowInstance,
} from './MWindowExtends';



var _ = require('Underscore');


export class MWindow {
	static instance: MWindow;

	static init() {
		let old_instance = MWindow.instance;
		if (old_instance) {
			let old_map_ins = old_instance.map_ins;
			_.each(old_map_ins, function (v, k) {});

			old_instance.map_ins = null;
			MWindow.instance = null;
		}

		
		MWindow.instance = new MWindow();
		
		MWindow.instance.now_z_index = 0;
		
		
		
		
		
		
		
		
	}

	
	
	
	
	
	private now_z_index: number;
	
	private map_ins: Map<string, WindowInstance> = new Map();
	
	private arr_ins = [];

	
	
	

	
	static async open<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS'],
		node_parent: cc.Node
	) {
		
		cc.log('新打开了窗口:', panel.name);

		if (panel.CONFIG.PATH === C.MAGIC_PANEL_NAME) {
			cc.log(`@MWindow, panel-config-not-exist, name=${panel.name}`);
			return;
		}

		
		
		
		
		
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			cmd: [],
			panel: null,
			node_loading: null,
		};
		let z_index = (MWindow.instance.now_z_index += 1); 

		
		let arr_ins = MWindow.instance.arr_ins;
		arr_ins.unshift(key);
		arr_ins = _.uniq(arr_ins);
		MWindow.instance.arr_ins = arr_ins;

		
		let value_node = value.node;
		if (value_node) {
			if (value.node_loading) {
				cc.log('@MPanel： is loading ！');
				return;
			} else {
				if (cc.isValid(value_node)) {
					let panel_script = await this._open(
						key,
						value_node,
						panel,
						params,
						z_index
					);
					return panel_script;
				} else {
					value_node.destroy();
					value.node = null;
					
				}
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		
		value.node_loading = true;
		MWindow.instance.map_ins.set(key, value);
		

		
		
		let prefab = value.prefab;
		
		if (!prefab) {
			let prefab_name = panel.name;
			prefab = PopUpManager.getOne(prefab_name);
			
			if (!prefab) {
				prefab = await GameLoader.load(`${C.BASE_PATH}/${key}`, cc.Prefab);
				
			}
			
			if (!prefab) {
				cc.log(
					`@MWindow: panel-prefab-not-exist, name=${prefab_name}, path=${key}`
				);
				return;
			}
		}

		

		
		
		let node = cc.instantiate(prefab);

		
		let parent = node_parent;
		if (!parent) {
			
			
			parent = GameHelp.getLayerBySceneLayerName(GameLayerConstants.UI_LAYER);
			
		}

		
		

		node.parent = parent;
		node.position = cc.Vec2.ZERO;
		
		
		
		node.active = false;
		
		value.node = node;
		value.prefab = prefab;
		value.node_loading = null;
		value.panel = panel;
		
		MWindow.instance.map_ins.set(key, value);
		let panel_script = await this._open(key, node, panel, params, z_index);

		return panel_script;
	}
	private static async _open(key, node, panel, params, z_index) {
		node.zIndex = z_index;
		
		
		let panel_script = node.getComponent(panel);
		panel_script.__onStarted__(params);
		panel_script && (await panel_script.on_open(params));

		let arr_ins = MWindow.instance.arr_ins;
		
		
		
		this._handleMask();

		cc.log('当前的所有排列 open ：', key, arr_ins);
		return panel_script;
	}
	private static _handleMask() {
		
		let arr_ins = MWindow.instance.arr_ins;

		
		let find_mask_idx = null;
		_.each(arr_ins, function (v, k) {
			let value = MWindow.instance.map_ins.get(v);
			if (value) {
				let node = value.node;
				let panel = value.panel;
				if (node) {
					let ui_mask = node.getChildByName('ui_mask');
					if (ui_mask) {
						let TYPE_MASK = panel.CONFIG.TYPE_MASK;
						if (find_mask_idx == null && TYPE_MASK == 1) {
							ui_mask.active = true;
							find_mask_idx = true;
						} else {
							ui_mask.active = false;
						}
					}
				}
			}
		});
	}
	
	public static handleAllMask() {
		let arr_ins = MWindow.instance.arr_ins;
		_.each(arr_ins, function (v, k) {
			let value = MWindow.instance.map_ins.get(v);
			if (value) {
				let node = value.node;
				if (node) {
					let ui_mask = node.getChildByName('ui_mask');
					if (ui_mask) {
						ui_mask.active = false;
					}
				}
			}
		});
	}

	
	static async close<T extends typeof MWindowExtends>(
		panel: T,
		params: T['CLOSE_PARAMS']
	) {
		cc.log('新销毁了窗口:', panel);

		
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			panel: null,
			cmd: [],
		};
		cc.log(value);
		
		let value_node = value.node;
		if (!value_node) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
			return;
		}
		
		let panel_script = value_node.getComponent(panel);
		let Mpanel_name = panel_script.name;
		panel_script && (await panel_script.on_close(params));

		
		
		if (panel.CONFIG.TYPE_CLOSE == 'REMOVE') {
			value_node.destroy();
			value.node = null;
			value.node_loading = null;
			MWindow.instance.map_ins.set(key, null);
		} else {
			value_node.active = false;
		}

		let arr_ins = MWindow.instance.arr_ins;
		arr_ins = _.without(arr_ins, key);
		arr_ins = _.uniq(arr_ins);
		MWindow.instance.arr_ins = arr_ins;
		cc.log('当前的所有排列 close ：', arr_ins);
		

		
		this._handleMask();
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		

		
		var event = {
			name: 'PANEL_HIDE',
			data: {
				Mpanel_name: Mpanel_name,
				
				
				path: key,
				params: params,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);
	}

	
	
	
	
	
	
	
	
	
	static async show<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS'],
		node_parent: cc.Node,
		
		not_visible = false,
		other_params = null
	) {
		

		if (panel.CONFIG.PATH === C.MAGIC_PANEL_NAME) {
			cc.log(`@MWindow, panel-config-not-exist, name=${panel.name}`);
			return;
		}

		
		var event = {
			name: 'PANEL_OPEN_BEGIN',
			data: {
				
				panel: panel,
				
				params: params,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);
		

		let panel_script = await this.open(panel, params, node_parent);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		
		
		
		
		
		
		

		if (panel_script) {
			panel_script.node.active = !not_visible;
		}
		
		
		
		

		
		
		let key = panel.CONFIG.PATH;
		var e = {
			name: 'PANEL_OPEN',
			data: {
				Mpanel_name: panel_script ? panel_script.name : 'unkonw',
				path: key,

				panel: panel,
				panel_script: panel_script,
				params: params,
			},
		};
		GameNotify.getInstance().dispatchEvent(e);
		

		return panel_script;
	}
	static async hide<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		this.close(panel, params);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}

	

	
	static async hide_all(source_name) {
		let self = this;

		let own_panel = null;
		MWindow.instance.map_ins.forEach((v, k) => {
			if (v.node && v.node.active) {
				if (v.node.name == source_name) {
					own_panel = v.panel;
				} else {
					v.node.active = false;
				}
			}
		});

		this._hide_all(own_panel);
	}
	static hide_all_by_panel<T extends typeof MWindowExtends>(panel: T) {
		let self = this;
		MWindow.instance.map_ins.forEach((v, k) => {
			
			if (v.node && v.node.active) {
				if (panel && panel.CONFIG && v.panel.CONFIG.PATH == panel.CONFIG.PATH) {
				} else {
					v.node.active = false;
				}
			}
		});

		this._hide_all(panel);
	}
	static _hide_all(own_panel) {
		if (own_panel && own_panel.CONFIG) {
			let key = own_panel.CONFIG.PATH;
			MWindow.instance.arr_ins = [key];
		} else {
			MWindow.instance.arr_ins = [];
		}
		this._handleMask();
	}

	
	static getPanel<T extends typeof MWindowExtends>(panel: T) {
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			cmd: [],
		};
		
		if (!value.node) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
			return;
		}
		if (!cc.isValid(value.node)) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);

			this.close(panel, null);
			
			
			return;
		}

		let panel_script = value.node.getComponent(panel);
		return panel_script;
	}

	
	

	
	static async add<T extends typeof MWindowExtends>(panel: T, node) {
		let key = panel.CONFIG.PATH;
		let value = {
			prefab: null,
			panel: panel,
			node: node,
			cmd: [],
		};
		MWindow.instance.map_ins.set(key, value);
	}

	
	
	
	static get TIME() {
		return C.TIME;
	}
	static get EASE_IN() {
		return C.EASE_IN;
	}
	static get EASE_OUT() {
		return C.EASE_OUT;
	}

	
	
	

	
	static in_nothing(node: cc.Node) {
		node.active = true;
	}

	
	static out_nothing(node: cc.Node) {
		node.active = false;
	}

	
	static in_scale(node: cc.Node, params: ActionParams) {
		if (!params) params = new Object();
		return new Promise((res) => {
			node.scale = C.SCALE_0;
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc
						.scaleTo(params.time || C.TIME, C.SCALE_1)
						.easing(params.ease || C.EASE_IN),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static out_scale(node: cc.Node, params: ActionParams) {
		if (!params) params = new Object();
		return new Promise((res) => {
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc
						.scaleTo(params.time || C.TIME, C.SCALE_0)
						.easing(params.ease || C.EASE_OUT),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static in_fade(node: cc.Node, params: ActionParams) {
		if (!params) params = new Object();
		return new Promise((res) => {
			node.opacity = C.FADE_0;
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc.fadeIn(params.time || C.TIME).easing(params.ease || C.EASE_IN),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static out_fade(node: cc.Node, params: ActionParams) {
		if (!params) params = new Object();
		return new Promise((res) => {
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc.fadeOut(params.time || C.TIME).easing(params.ease || C.EASE_OUT),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static in_move(
		node: cc.Node,
		direction: keyof typeof DIRECTION,
		distance: number = null,
		params: ActionParams
	) {
		if (!params) params = new Object();
		return new Promise((res) => {
			GameHelp.check_widget(node);
			if (!distance) {
				distance = Math.max(cc.winSize.width, cc.winSize.height);
			}
			const start_position = node.position.add(
				C.DIRECTION_VEC2[direction].mul(distance)
			);
			const end_position = node.position;
			node.position = start_position;
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc
						.moveTo(
							params.time || C.TIME,
							cc.v2(end_position.x, end_position.y)
						)
						.easing(params.ease || C.EASE_IN),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static out_move(
		node: cc.Node,
		direction: keyof typeof DIRECTION,
		distance: number = null,
		params: ActionParams
	) {
		if (!params) params = new Object();
		return new Promise((res) => {
			if (!distance) {
				distance = Math.max(cc.winSize.width, cc.winSize.height);
			}
			const end_position = node.position.add(
				C.DIRECTION_VEC2[direction].mul(distance)
			);
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc
						.moveTo(
							params.time || C.TIME,
							cc.v2(end_position.x, end_position.y)
						)
						.easing(params.ease || C.EASE_OUT),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static in_fade_move(
		node: cc.Node,
		direction: keyof typeof DIRECTION,
		distance: number = null,
		params: ActionParams
	) {
		if (!params) params = new Object();
		return new Promise((res) => {
			GameHelp.check_widget(node);
			const start_position = node.position.add(
				C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE)
			);
			const end_position = node.position;
			node.position = start_position;
			node.opacity = C.FADE_0;
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc.spawn(
						cc.fadeIn(params.time || C.TIME).easing(params.ease || C.EASE_IN),
						cc
							.moveTo(
								params.time || C.TIME,
								cc.v2(end_position.x, end_position.y)
							)
							.easing(params.ease || C.EASE_IN)
					),
					cc.callFunc(res)
				)
			);
		});
	}

	
	static out_fade_move(
		node: cc.Node,
		direction: keyof typeof DIRECTION,
		distance: number = null,
		params: ActionParams
	) {
		if (!params) params = new Object();
		return new Promise((res) => {
			const end_position = node.position.add(
				C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE)
			);
			node.active = true;
			node.runAction(
				cc.sequence(
					cc.delayTime(params.delay || 0),
					cc.spawn(
						cc
							.moveTo(
								params.time || C.TIME,
								cc.v2(end_position.x, end_position.y)
							)
							.easing(params.ease || C.EASE_IN),
						cc.fadeOut(params.time || C.TIME).easing(params.ease || C.EASE_IN)
					),
					cc.callFunc(res)
				)
			);
		});
	}
}
