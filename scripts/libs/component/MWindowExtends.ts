



import { GameHelp } from '../utils/GameHelp';
import PopUpManager from '../manager/PopUpManager';
import { GameLayerConstants } from '../../../../cc_own/constants/GameLayerConstants';
import BaseComponent from '../base/BaseComponent';
import { GameNotify } from '../utils/GameNotify';
import { GameLoader } from '../utils/GameLoader';
import GameManger from '../../../gamemanager/GameManger';
import { GameConfig } from '../../../../cc_own/config/GameConfig';



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
	SCALE_0: 0.01, 
	SCALE_1: 1,
	FADE_0: 1, 
	FADE_1: 255,
	FADE_MOVE_DISTANCE: 100, 
	FADE_SCALE_TARGET: 2, 
};

export interface ActionParams {
	time?: number;
	delay?: number;
	ease?: any;
}

export interface WindowConfig {
	
	PATH: string;
	
	TYPE?: 'single' | 'cover' | 'chain';
	TYPE_CLOSE?: 'HIDE' | 'REMOVE';
	TYPE_MASK?: 0 | 1; 

	FGUI_pkgName: string;
	FGUI_resName: string;
}

export interface WindowInstance {
	
	prefab: cc.Prefab;
	
	node: cc.Node;
	
	cmd: object[];
	
	node_loading: null;

	
	panel_script: null;
}

export const MWindowConfig = (config: WindowConfig) => {
	return (constructor) => {
		
		
		constructor.CONFIG = {
			PATH: config.PATH || constructor.CONFIG.PATH,
			TYPE: config.TYPE || constructor.CONFIG.TYPE,
			TYPE_CLOSE: config.TYPE_CLOSE || constructor.CONFIG.TYPE_CLOSE,
			TYPE_MASK: config.TYPE_MASK || constructor.CONFIG.TYPE_MASK,

			FGUI_pkgName: config.FGUI_pkgName,
			FGUI_resName: config.FGUI_resName,
		};
		
		Object.freeze(constructor.CONFIG);
	};
};


export abstract class MWindowExtends extends BaseComponent {
	
	static CONFIG: WindowConfig = {
		PATH: C.MAGIC_PANEL_NAME,
		TYPE: 'single',
		TYPE_CLOSE: 'HIDE',
		TYPE_MASK: 1,

		FGUI_pkgName: null,
		FGUI_resName: null,
	};
	
	static OPEN_PARAMS: object;
	
	static CLOSE_PARAMS: object;
	
	async on_open(params: object) {
		return true;
	}
	
	async on_close(params: object) {
		return true;
	}
}

export abstract class MWindowExtends_gui extends fgui.Window {
	
	static CONFIG: WindowConfig = {
		PATH: C.MAGIC_PANEL_NAME,
		TYPE: 'single',
		TYPE_CLOSE: 'HIDE',
		TYPE_MASK: 1,

		FGUI_pkgName: null,
		FGUI_resName: null,
	};
	
	static OPEN_PARAMS: object;
	
	static CLOSE_PARAMS: object;
	
	async on_open(params: object) {
		return true;
	}
	
	async on_close(params: object) {
		return true;
	}

	m__addEventHandle(event_name_all: Array<string>, priority: number) {
		console.log('MWindowExtends_gui > m__addEventHandle ');
	}
}
