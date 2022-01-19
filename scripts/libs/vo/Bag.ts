

import { game_item_constans } from '../../../../cc_own/constants/game_item_constans';
import { GameHelp } from '../utils/GameHelp';

var _ = require('Underscore');

export class Bag {
	
	public items: Array = null;

	
	constructor(opts: any) {
		this.init(opts);
	}

	init(opts: any) {
		let self = this;
		
		
		if (opts) {
			let new_item = [];
			_.each(opts, function (v, k) {
				let item = self._init_one_info(v);
				new_item.push(item);
			});

			this.items = new_item;
		} else {
			this.items = [];
		}
	}
	private _init_one_info(item) {
		var item_id = item.item_id;

		let EquipConfig = GameHelp.getFromFileBy_EXCEL_TO_DB('EquipConfig');
		let ItemConfig = GameHelp.getFromFileBy_EXCEL_TO_DB('ItemConfig');
		

		if (ItemConfig) {
			let one_ItemConfig = ItemConfig[item_id];
			if (one_ItemConfig) {
				item.type = one_ItemConfig.type;
				item.bag_tab = one_ItemConfig.bag_tab;
				item.sort = one_ItemConfig.sort;
				item.quality = one_ItemConfig.quality;
			}
		}

		if (EquipConfig) {
			let one_EquipConfig = EquipConfig[item_id];
			if (one_EquipConfig) {
				item.is_recast = one_EquipConfig.is_recast;
				item.is_grade = one_EquipConfig.is_grade;
			}
		}
		return item;
	}

	
	public getItems(): Array {
		return this.items;
	}

	
	public getItemByItemidOrBagid(item_id: Number, bag_id: Number) {
		let find = null;
		if (bag_id) {
			find = _.findWhere(this.items, { bag_id: bag_id });
		} else if (item_id) {
			find = _.findWhere(this.items, { item_id: item_id });
		}

		return find;
	}
	
	public getAllItemByItemid(item_id: Number, bag_id: Number) {
		let find = null;

		if (bag_id) {
			find = _.where(this.items, { bag_id: bag_id });
		} else if (item_id) {
			find = _.where(this.items, { item_id: item_id });
		} else {
			cc.log('hava no  item ！');
		}

		return find;
	}
	
	public getAllItemNumByItemid(item_id: Number, bag_id: Number) {
		let num = 0;

		let find = this.getAllItemByItemid(item_id, bag_id);
		if (find) {
			_.each(find, function (v, k) {
				let curr_num = v.item_num || v.after_number;
				num = num + curr_num;
			});
		}

		return num;
	}

	
	public getItemsByItemtype(item_type: Number) {
		
		return _.where(this.items, { type: item_type }) || [];
	}

	
	public setItemByItemid(item: Object) {
		var item_id = item.item_id;
		var index = _.findIndex(this.items, {
			item_id: item_id,
		});

		let item_num = item.after_number || item.item_num;
		if (!item_num || item_num <= 0) {
			if (index >= 0) {
				
				let old_item = this.items[index];
				this.items = _.without(this.items, old_item);
			}
			return;
		}

		item = this._init_one_info(item);
		if (index >= 0) {
			this.items[index] = item;
		} else {
			this.items.push(item);
		}
	}
	public setItemByBagid(item: Object, item_id: Number, bag_id: Number) {
		

		let index = -1;
		if (bag_id) {
			index = _.findIndex(this.items, {
				bag_id: bag_id,
			});
		} else if (item_id) {
			index = _.findIndex(this.items, {
				item_id: item_id,
			});
		}

		let item_num = item.after_number || item.item_num;
		if (!item_num || item_num <= 0) {
			if (index >= 0) {
				
				let old_item = this.items[index];
				this.items = _.without(this.items, old_item);
			}
			return;
		}

		item = this._init_one_info(item);
		if (index >= 0) {
			this.items[index] = item;
		} else {
			this.items.push(item);
		}
	}

	
	
	public getItemByItemid_GOLD() {
		let item = this.getItemByItemidOrBagid(game_item_constans.gold, null);
		if (item) return item.item_num || item.after_number;
		return 0;
	}
	public setItemByItemid_GOLD(item_num: number) {
		let item = this.getItemByItemidOrBagid(game_item_constans.gold, null);
		item.item_num = item_num;
		item.after_number = item_num;

		this.setItemByItemid(item);
		
	}

	
	public getItemByItemid_ROOMCARD() {
		let item = this.getItemByItemidOrBagid(game_item_constans.room_card, null);

		if (item) return item.item_num || item.after_number;
		return 0;
	}
	public setItemByItemid_ROOMCARD(item_num: number) {
		let item = this.getItemByItemidOrBagid(game_item_constans.room_card, null);
		item.item_num = item_num;
		item.after_number = item_num;

		this.setItemByItemid(item);
	}

	
	public getItemByItemid_SAFEBOXGOLD() {
		let item = this.getItemByItemidOrBagid(
			game_item_constans.safebox_gold,
			null
		);
		if (item) return item.item_num || item.after_number;
		return 0;
	}
}
