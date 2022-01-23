





var _ = require('Underscore');



const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseVo {
	
	protected m_entity_state: number;

	
	protected m_no;

	
	protected m_data;

	
	protected m_config_data;

	
	public async __init(no, opts) {
		this.m_no = no;

		this.merge(opts);
	}

	
	private merge(opts: any) {
		var self = this;
		_.map(opts, function (v, k) {
			self['m_' + k] = v;
		});
	}

	
	get_m_entity_state() {
		return this.m_entity_state;
	}
	set_m_entity_state(entity_state) {
		this.m_entity_state = entity_state;
	}

	
	get_no() {
		return this.m_no;
	}

	
	get_m_item_id() {
		let item_id = this.m_config_data.item_id || this.m_config_data.id;
		return item_id;
	}

	
	get_m_item_type() {
		let item_type = this.m_config_data.item_type || this.m_config_data.type;
		return item_type;
	}

	
	get_m_game_obj_kind() {
		let game_obj_kind = this.m_config_data.game_obj_kind;
		return game_obj_kind;
	}

	
	get_m_config_data() {
		return this.m_config_data;
	}

	
	get_m_data() {
		return this.m_data;
	}

	
	get_m_active() {
		let is_active = this.m_config_data.active;
		let is_active2 = this.m_data.active;

		if (is_active2 && is_active) {
			return true;
		} else {
			return false;
		}
	}
}
