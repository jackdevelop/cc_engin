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
import { GameConfig } from '../../../../cc_own/config/GameConfig';
// import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
// import {GameLayerConstants} from "../../scripts/constants/GameLayerConstants";

var _ = require('Underscore');

export enum DIRECTION {
	left,
	right,
	up,
	down,
	left_up,
	left_down,
	right_up,
	right_down,
}
export const C = {
	BASE_PATH: 'panel',
	MAGIC_PANEL_NAME: 'FTS',
	TIME: 0.3,
	EASE_IN: cc.easeCubicActionOut(),
	EASE_OUT: cc.easeCubicActionIn(),
	DIRECTION_VEC2: {
		left: cc.v3(-1, 0),
		right: cc.v3(1, 0),
		up: cc.v3(0, 1),
		down: cc.v3(0, -1),
		left_up: cc.v3(-1, 1),
		left_down: cc.v3(-1, -1),
		right_up: cc.v3(1, 1),
		right_down: cc.v3(1, -1),
	},
	SCALE_0: 0.01, // 某些组件在scale=0时会出现异常,因此将初始值设为0.01
	SCALE_1: 1,
	FADE_0: 1, // 某些组件在opacity=0时会出现异常,因此将初始值设为1
	FADE_1: 255,
	FADE_MOVE_DISTANCE: 100, // 在fade-move模式下的移动距离
	FADE_SCALE_TARGET: 2, // 在fade-scale模式下的目标scale
};
/** 动作的基础参数 */
export interface ActionParams {
	time?: number;
	delay?: number;
	ease?: any;
}
/** panel-config,panel配置 */
export interface WindowConfig {
	/** 资源路径;同时也作为唯一key使用 */
	PATH: string;
	/** 打开方式;single-不允许再次打开;cover-再次打开时覆盖;chain-再次打开时会加入chain */
	TYPE?: 'single' | 'cover' | 'chain';
	TYPE_CLOSE?: 'HIDE' | 'REMOVE';
	TYPE_MASK?: 0 | 1; // 0 没有遮罩  1有遮罩

	FGUI_pkgName?: string;
	FGUI_resName?: string;
}
/** panel-instance,panel实例 */
export interface WindowInstance {
	/** 对应的prefab */
	prefab: cc.Prefab;
	/** 实例node,单个 */
	node: cc.Node;
	/** 命令集合 */
	cmd: object[];
	/** 正在加载 */
	node_loading: null;

	/** 当前所属的 脚本 */
	panel_script: null;
}
/** 装饰器函数,panel配置参数;装饰器的设置会覆盖内部设置 */
export const MWindowConfig = (config: WindowConfig) => {
	return (constructor) => {
		// return (constructor: typeof MWindowExtends) => {
		// 特别注意,由于js中原型继承的bug,这里的config必须创建新的object而不是修改
		constructor.CONFIG = {
			PATH: config.PATH || constructor.CONFIG.PATH,
			TYPE: config.TYPE || constructor.CONFIG.TYPE,
			TYPE_CLOSE: config.TYPE_CLOSE || constructor.CONFIG.TYPE_CLOSE,
			TYPE_MASK: config.TYPE_MASK || constructor.CONFIG.TYPE_MASK,

			FGUI_pkgName: config.FGUI_pkgName,
			FGUI_resName: config.FGUI_resName,
		};
		// 注意,冻结之后在严格模式下会报错,在非严格模式下会跳过;cocos脚本运行方式为严格模式
		Object.freeze(constructor.CONFIG);
	};
};

/** 每个子panel的抽象类;注意必须实现CONFIG-PATH属性. */
export abstract class MWindowExtends extends BaseComponent {
	/** panel的配置参数 */
	static CONFIG: WindowConfig = {
		PATH: C.MAGIC_PANEL_NAME,
		TYPE: 'single',
		TYPE_CLOSE: 'HIDE',
		TYPE_MASK: 1,

		FGUI_pkgName: null,
		FGUI_resName: null,
	};
	/** 打开界面的参数结构 */
	static OPEN_PARAMS: object;
	/** 关闭界面的参数结构 */
	static CLOSE_PARAMS: object;
	/** panel-open-process */
	async on_open(params: object) {
		return true;
	}
	/** panel-close-process */
	async on_close(params: object) {
		return true;
	}
}

export abstract class MWindowExtends_gui extends fgui.Window {
	/** panel的配置参数 */
	static CONFIG: WindowConfig = {
		PATH: C.MAGIC_PANEL_NAME,
		TYPE: 'single',
		TYPE_CLOSE: 'HIDE',
		TYPE_MASK: 1,

		FGUI_pkgName: null,
		FGUI_resName: null,
	};
	/** 打开界面的参数结构 */
	static OPEN_PARAMS: object;
	/** 关闭界面的参数结构 */
	static CLOSE_PARAMS: object;
	/** panel-open-process */
	async on_open(params: object) {
		return true;
	}
	/** panel-close-process */
	async on_close(params: object) {
		return true;
	}

	m__addEventHandle(event_name_all: Array<string>, priority: number) {
		console.log('MWindowExtends_gui > m__addEventHandle ');
	}
}
