// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import { moment_util } from '../utils/moment_util';
import BaseTempData from './BaseTempData';

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var _ = require('Underscore');

/**
 *  数据实体类
 *   主要是存储数据长什么样
 *
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseVo {
	/**  状态 比如死忙 活着等 ,状态机的状态 ,这个状态,每个实体对象定义不一样 */
	protected m_entity_state: number;

	/** 当前实体的 序号 , 在当前实体种类的集合中 是唯一的  */
	protected m_no;

	/** 服务器或者是动态的生成数据 */
	protected m_data;

	/** 当前的静态配置数据 */
	protected m_config_data;

	/** 临时数据 主要为了在游戏中 可以去动态设置，而且可能经常改变 比如应用于buff */
	protected m_temp_data: BaseTempData;

	/**
	 *  初始化数据
	 * @param no  序号,唯一
	 * @param opts  数据  一般情况下,{data:,config_data: } 必须组织好
	 */
	public async __init(no, opts) {
		this.m_no = no;

		this.merge(opts);
	}

	/**
	 *  属性覆盖
	 * @param opts
	 */
	private merge(opts: any) {
		var self = this;
		_.map(opts, function (v, k) {
			self['m_' + k] = v;
		});
	}

	/**
	 *  设置血量
	 * @returns
	 */
	get_m_hp() {
		return this.m_data.hp;
	}
	get_m_max_hp() {
		return this.m_data.max_hp || 100;
	}
	set_m_hp(change_num) {
		let max_hp = this.get_m_max_hp();

		let hp = this.m_data.hp;
		hp = hp + change_num;
		if (hp < 0) {
			hp = 0;
		} else if (hp > max_hp) {
			hp = max_hp;
		}

		this.m_data.hp = hp;

		return hp;
	}

	/**
	 *  获取当前的  状态
	 *  比如死忙 活着等 ,状态机的状态 ,这个状态,每个实体对象定义不一样
	 * @returns
	 */
	get_m_entity_state() {
		return this.m_entity_state;
	}
	set_m_entity_state(entity_state) {
		this.m_entity_state = entity_state;
	}

	/**
	 *  获取当前的 当前实体的 序号 ,
	 *  这个no序号 在当前实体种类的集合中 是唯一的
	 * @returns
	 */
	get_no() {
		return this.m_no;
	}

	/**
	 *  获取该对象的 item_id  这个不是唯一  而是配置表中配置的 item_id
	 * @returns
	 */
	get_m_item_id() {
		let item_id = this.m_config_data.item_id || this.m_config_data.id;
		return item_id;
	}

	/**
	 *  获取当前对象的类型
	 * @returns
	 */
	get_m_item_type() {
		let item_type = this.m_config_data.item_type || this.m_config_data.type;
		return item_type;
	}

	/**
	 *  获取当前对象的种类
	 * @returns
	 */
	get_m_game_obj_kind() {
		let game_obj_kind = this.m_config_data.game_obj_kind;
		return game_obj_kind;
	}

	/**
	 *  获取 当前的静态配置数据
	 * @returns
	 */
	get_m_config_data() {
		return this.m_config_data;
	}

	/**
	 *  获取 服务器或者是动态的生成数据
	 * @returns
	 */
	get_m_data() {
		return this.m_data;
	}

	/**
	 *  获取 临时的数据
	 *  这种数据为了方便 用户随时的动态设置
	 * @returns
	 */
	get_m_temp_data() {
		return this.m_temp_data;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 *  获取出当前是否激活生效
	 */
	get_m_active() {
		let is_active = this.m_config_data.active;
		let is_active2 = this.m_data.active;

		if (is_active2 && is_active) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 *  获取当前是否可以移动
	 */
	get_m_ismove() {
		let is_move = this.m_config_data.is_move;
		let is_move2 = this.m_temp_data.is_move;

		if (is_move2 && is_move) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 *  判断当前是否超过cd时间内
	 * @returns
	 *
	 */
	public m_last_fire_time = 0; //上次攻击的时间

	is_out_cdtime() {
		// let m_vo = this.get_m_vo();

		//首先判断是否在cd内
		let cd_time = this.get_m_config_data().cd_time;
		if (cd_time > 0) {
			//判断时间是否有效
			let distance =
				moment_util.get_interval_distance(this.m_last_fire_time) / 1000;
			// console.log(distance, m_vo.m_last_fire_time);

			//除以1000 得到毫秒数
			if (distance < cd_time) {
				return false;
			}
		}

		return true;
	}
}
