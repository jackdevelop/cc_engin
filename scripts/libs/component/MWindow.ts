//  this.node.emit('fade-in');
//  this.node.emit('fade-out');

/** 移动方向 */
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

		// GameHelp.check_ins(MWindow);
		MWindow.instance = new MWindow();
		// MWindow.instance.parent = parent_node
		MWindow.instance.now_z_index = 0;
		//制作一个 UIMaskPanel
		// let m_UIMaskPanel = cc.instantiate(
		//   GameManger.instance.getPrefab('UIMaskPanel')
		// );
		// let parent = GameHelp.getLayerBySceneLayerName(GameLayerConstants.UI_LAYER);
		// parent.addChild(m_UIMaskPanel);
		// m_UIMaskPanel.active = false;
		// MWindow.instance.m_UIMaskPanel = m_UIMaskPanel;
	}

	/** 主要是 uimask ***/
	// private m_UIMaskPanel: cc.Node = null;
	// /** 挂载父节点 */
	// private parent: cc.Node;
	/** 当前的渲染层级 */
	private now_z_index: number;
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
	static async open<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS'],
		node_parent: cc.Node
	) {
		// 判定是否配置了panel-config
		cc.log('新打开了窗口:', panel.name);

		if (panel.CONFIG.PATH === C.MAGIC_PANEL_NAME) {
			cc.log(`@MWindow, panel-config-not-exist, name=${panel.name}`);
			return;
		}

		// // 判断在编辑器模式下PATH是否包含name,仅在编辑器模式下;打包后会压缩代码,name会被丢弃
		// if (MVersion.run_editor && panel.CONFIG.PATH.includes(panel.name)) {
		//     cc.log(`@MWindow, panel-path-wrong, name=${panel.name}`)
		// }
		// 获取key,value,z_index
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			cmd: [],
			panel: null,
			node_loading: null,
		};
		let z_index = (MWindow.instance.now_z_index += 1); // 考虑异步延迟,需要提前获取

		//吧新的排序好
		let arr_ins = MWindow.instance.arr_ins;
		arr_ins.unshift(key);
		arr_ins = _.uniq(arr_ins);
		MWindow.instance.arr_ins = arr_ins;

		//已经加载过了
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
					// value.node_loading = null;
				}
			}
		}
		// // 获取同名节点进行预处理
		// switch (panel.CONFIG.TYPE) {
		//   case 'single':
		//     if (value.node || value.node_load) {
		//       cc.log('single');
		//       return;
		//     }
		//     break;
		//   case 'cover':
		//     if (value.node) {
		//       value.node.destroy();
		//     }
		//     break;
		//   case 'chain':
		//     if (value.node) {
		//       cc.log('chain');
		//       value.cmd.push(params);
		//       return;
		//     }
		//     break;
		//   default:
		//     break;
		// }

		//为了防止 当去远程加载时  重复点击  start
		value.node_loading = true;
		MWindow.instance.map_ins.set(key, value);
		//为了防止 当去远程加载时  重复点击  end

		// LoadingChrysanthemum.show();
		// 载入prefab
		let prefab = value.prefab;
		//先从popmanager中获取
		if (!prefab) {
			let prefab_name = panel.name;
			prefab = PopUpManager.getOne(prefab_name);
			//没有在去远程加载
			if (!prefab) {
				prefab = await GameLoader.load(`${C.BASE_PATH}/${key}`, cc.Prefab);
				// cc.assetManager.releaseAsset(prefab);
			}
			// 需要载入的prefab并不存在时,输出log并return;注意name属性在打包后(或者代码混淆后)不可用
			if (!prefab) {
				cc.log(
					`@MWindow: panel-prefab-not-exist, name=${prefab_name}, path=${key}`
				);
				return;
			}
		}

		// LoadingChrysanthemum.hide();

		// 实例化prefab
		// cc.log('实例化');
		let node = cc.instantiate(prefab);

		//自己使用
		let parent = node_parent;
		if (!parent) {
			// parent = MWindow.instance.parent;
			// if (!parent) {
			parent = GameHelp.getLayerBySceneLayerName(GameLayerConstants.UI_LAYER);
			// }
		}

		//销毁 prefab
		// cc.assetManager.releaseAsset(prefab);

		node.parent = parent;
		node.position = cc.Vec2.ZERO;
		// node.width = cc.winSize.width;
		// node.height = cc.winSize.height;
		// node.zIndex = z_index;
		node.active = false;
		// 重新保存value
		value.node = node;
		value.prefab = prefab;
		value.node_loading = null;
		value.panel = panel;
		// value.node_parent = parent
		MWindow.instance.map_ins.set(key, value);
		let panel_script = await this._open(key, node, panel, params, z_index);

		return panel_script;
	}
	private static async _open(key, node, panel, params, z_index) {
		node.zIndex = z_index;
		// node.active = false;
		// 执行节点打开动画
		let panel_script = node.getComponent(panel);
		panel_script.__onStarted__(params);
		panel_script && (await panel_script.on_open(params));

		let arr_ins = MWindow.instance.arr_ins;
		// arr_ins.unshift(key);
		// arr_ins = _.uniq(arr_ins);
		// MWindow.instance.arr_ins = arr_ins;
		this._handleMask();

		cc.log('当前的所有排列 open ：', key, arr_ins);
		return panel_script;
	}
	private static _handleMask() {
		//是否有 uimask  控制好mask
		let arr_ins = MWindow.instance.arr_ins;

		//找到一个 mask
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
	//隐藏所有的 mask
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

	/**
	 * 关闭panel
	 * @param panel 传入panel的类型
	 * @param param
	 * @static @async
	 */
	static async close<T extends typeof MWindowExtends>(
		panel: T,
		params: T['CLOSE_PARAMS']
	) {
		cc.log('新销毁了窗口:', panel);

		// 获取key,value
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			panel: null,
			cmd: [],
		};
		cc.log(value);
		// 如果node实例不存在,则输出log并返回
		let value_node = value.node;
		if (!value_node) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
			return;
		}
		// 执行节点关闭动画
		let panel_script = value_node.getComponent(panel);
		let Mpanel_name = panel_script.name;
		panel_script && (await panel_script.on_close(params));

		// let type_close = panel.CONFIG.TYPE_CLOSE;
		// TYPE_CLOSE?: 'HIDE' | 'REMOVE';
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
		// MWindow.ins.map_ins.set(key, null);

		//判断上一个是否要显示 TYPE_MASK
		this._handleMask();
		// let one = arr_ins[0];
		// let last_value = MWindow.instance.map_ins.get(one);
		// let m_UIMaskPanel = MWindow.instance.m_UIMaskPanel;
		// if (last_value && last_value.panel) {
		//   let last_panel = last_value.panel;
		//   let TYPE_MASK = last_panel.CONFIG.TYPE_MASK;
		//   if (TYPE_MASK == 1) {
		//     m_UIMaskPanel.zIndex = last_value.zIndex - 1;
		//     m_UIMaskPanel.active = true;
		//   } else {
		//     m_UIMaskPanel.active = false;
		//   }
		// } else {
		//   m_UIMaskPanel.active = false;
		// }
		// // 打开下一个窗口
		// if (panel.CONFIG.TYPE === 'chain') {
		//   let cmd = value.cmd.shift();
		//   if (cmd) {
		//     MWindow.open(panel, cmd, null); // 注意此处没有await
		//   }
		// }
		// 重新保存value

		// MWindow.ins.map_ins.set(key, value)

		//抛送界面事件
		var event = {
			name: 'PANEL_HIDE',
			data: {
				Mpanel_name: Mpanel_name,
				// panel: panel,
				// panel_script: panel_script,
				path: key,
				params: params,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);
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
	static async show<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS'],
		node_parent: cc.Node,
		// ui_mask_opacity = null,
		not_visible = false,
		other_params = null
	) {
		// 判定是否配置了panel-config

		if (panel.CONFIG.PATH === C.MAGIC_PANEL_NAME) {
			cc.log(`@MWindow, panel-config-not-exist, name=${panel.name}`);
			return;
		}

		// if (active) {
		var event = {
			name: 'PANEL_OPEN_BEGIN',
			data: {
				// Mpanel_name: panel_script ? panel_script.name : 'unkonw',
				panel: panel,
				// panel_script: panel_script,
				params: params,
			},
		};
		GameNotify.getInstance().dispatchEvent(event);
		// }

		let panel_script = await this.open(panel, params, node_parent);
		// // // 判断在编辑器模式下PATH是否包含name,仅在编辑器模式下;打包后会压缩代码,name会被丢弃
		// // if (MVersion.run_editor && panel.CONFIG.PATH.includes(panel.name)) {
		// //     cc.log(`@MWindow, panel-path-wrong, name=${panel.name}`)
		// // }
		// // 获取key,value,z_index
		// let key = panel.CONFIG.PATH;
		// let value = MWindow.instance.map_ins.get(key) || {
		//   prefab: null,
		//   node: null,
		//   cmd: [],
		// };
		// let node = value.node;
		// if (node) {
		//   if (node.isValid) {
		//     let z_index = (MWindow.instance.now_z_index += 1); // 考虑异步延迟,需要提前获取
		//     // cc.log(z_index, panel);
		//     node.zIndex = z_index;
		//     // node.active = active;
		//     // 执行节点打开动画
		//     panel_script = node.getComponent(panel);
		//     panel_script.__onStarted__(params);
		//     panel_script && (await panel_script.on_open(params));
		//   } else {
		//     value.node.destroy();
		//     value.node = null;
		//     value.node_loading = null;
		//     panel_script = await this.open(panel, params, node_parent);
		//   }
		// } else {
		//   panel_script = await this.open(panel, params, node_parent);
		// }

		// //修改透明度
		// if (ui_mask_opacity) {
		//   let ui_mask = panel_script.node.getChildByName('ui_mask');
		//   if (ui_mask) {
		//     ui_mask.opacity = ui_mask_opacity;
		//   }
		// }

		if (panel_script) {
			panel_script.node.active = !not_visible;
		}
		//是否隐藏其他界面
		// if (other_params && other_params.not_hide_all) {
		//   this.hide_all(panel_script.node);
		// }

		//抛送界面事件
		// if (active) {
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
		// }

		return panel_script;
	}
	static async hide<T extends typeof MWindowExtends>(
		panel: T,
		params: T['OPEN_PARAMS']
	) {
		this.close(panel, params);
		// // 获取key,value
		// let key = panel.CONFIG.PATH;
		// let value = MWindow.instance.map_ins.get(key) || {
		//   prefab: null,
		//   node: null,
		//   cmd: [],
		// };
		// let node = value.node;
		// // 如果node实例不存在,则输出log并返回
		// if (!node) {
		//   cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
		//   return;
		// }
		// if (!cc.isValid(node)) {
		//   cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
		//   node.destroy();
		//   value.node = null;
		//   value.node_loading = null;
		//   return;
		// }
		// // 执行节点关闭动画
		// let panel_script = node.getComponent(panel);
		// node.active = false;
		// //抛送界面事件
		// var event = {
		//   name: 'PANEL_HIDE',
		//   data: {
		//     Mpanel_name: panel_script.name,
		//     panel: panel,
		//     panel_script: panel_script,
		//     params: params,
		//   },
		// };
		// GameNotify.getInstance().dispatchEvent(event);
	}

	//关闭所有

	//关闭所有
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
			// cc.log(v, panel, ';llll');
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

	//获取panel
	static getPanel<T extends typeof MWindowExtends>(panel: T) {
		let key = panel.CONFIG.PATH;
		let value = MWindow.instance.map_ins.get(key) || {
			prefab: null,
			node: null,
			cmd: [],
		};
		// 如果node实例不存在,则输出log并返回
		if (!value.node) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);
			return;
		}
		if (!cc.isValid(value.node)) {
			cc.log(`@MWindow: panel-node-not-exist, name=${panel.name}, path=${key}`);

			this.close(panel, null);
			// value.node = null;
			// value.node_loading = null;
			return;
		}

		let panel_script = value.node.getComponent(panel);
		return panel_script;
	}

	// //将显示的那个mask 移动到
	// static async move_mask(panel_script) {}

	//添加
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

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 配置的默认数值
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	static get TIME() {
		return C.TIME;
	}
	static get EASE_IN() {
		return C.EASE_IN;
	}
	static get EASE_OUT() {
		return C.EASE_OUT;
	}

	//////////
	// UI方法
	//////////

	/**
	 * @param node
	 * @static @async
	 */
	static in_nothing(node: cc.Node) {
		node.active = true;
	}

	/**
	 * @param node
	 * @static @async
	 */
	static out_nothing(node: cc.Node) {
		node.active = false;
	}

	/**
	 *
	 * @param node
	 * @param params
	 * @static
	 */
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

	/**
	 *
	 * @param node
	 * @param params
	 * @static
	 */
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

	/**
	 *
	 * @param node
	 * @param params
	 * @static
	 */
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

	/**
	 *
	 * @param node
	 * @param params
	 * @static
	 */
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

	/**
	 *
	 * @param node
	 * @param direction 方向
	 * @param distance 距离,默认为null,会计算Math.max(cc.winSize.width, cc.winSize.height)
	 * @param params
	 * @static
	 */
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

	/**
	 *
	 * @param node
	 * @param direction
	 * @param time
	 * @param ease
	 * @static
	 */
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

	/**
	 * 组合效果：fade+move
	 * @param node
	 * @param direction
	 * @param distance
	 * @param params
	 * @static
	 */
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

	/**
	 * 组合效果：fade+move
	 * @param node
	 * @param direction
	 * @param distance
	 * @param params
	 */
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
