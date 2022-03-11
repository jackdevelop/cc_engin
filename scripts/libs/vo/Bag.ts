/**
 * Bag
 *
 * 比如获取 金币
      var game_item_type = require("game_item_type");
      var User_List = require("User_List");
      var user = User_List.getUserByUserId(User_List.meId);
      var item = user.bag.getItemByItemid(game_item_type.ITEM_GOLD);
 *
 *
 * @author ""
 */

import { game_item_constans } from '../../../../cc_own/constants/game_item_constans';
import { GameHelp } from '../utils/GameHelp';

var _ = require('Underscore');

export class Bag {
	/**
     *  每个小 item 的数据格式  
     *   #背包数据
            .UserBagItem {
            changed_number          0: integer(2)  
            before_number           1: integer(2)
            after_number            3: integer(2)
            
            bag_id    4: integer #背包物品id
            item_id   5: integer #道具id
            equip_info 6: EquipInfo #装备信息
            }
     */
	public items: Array = null;

	/**
	 * 构造函数
	 * @param {Number} id
	 * @param {Object|null} opts
	 */
	constructor(opts: any) {
		this.init(opts);
	}

	init(opts: any) {
		let self = this;
		//每个item 长相 {item_id：，item_number:}
		// cc.log('================', opts);
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

		// let EquipConfig = GameHelp.getFromFileBy_EXCEL_TO_DB('EquipConfig');
		let ItemConfig = GameHelp.getFromFileBy_EXCEL_TO_DB('ItemConfig');
		// EquipQqualityAddConfig

		if (ItemConfig) {
			let one_ItemConfig = ItemConfig[item_id];
			if (one_ItemConfig) {
				item.type = one_ItemConfig.type;
				item.bag_tab = one_ItemConfig.bag_tab;
				item.sort = one_ItemConfig.sort;
				item.quality = one_ItemConfig.quality;
			}
		}

		// if (EquipConfig) {
		// 	let one_EquipConfig = EquipConfig[item_id];
		// 	if (one_EquipConfig) {
		// 		item.is_recast = one_EquipConfig.is_recast;
		// 		item.is_grade = one_EquipConfig.is_grade;
		// 	}
		// }
		return item;
	}

	/**
	 * 获取所有的道具
	 */
	public getItems(): Array {
		return this.items;
	}

	/**
	 * 获取某个道具
	 *  bag_id    4: integer #背包物品id
	 */
	public getItemByItemidOrBagid(item_id: Number, bag_id: Number) {
		let find = null;
		if (bag_id) {
			find = _.findWhere(this.items, { bag_id: bag_id });
		} else if (item_id) {
			find = _.findWhere(this.items, { item_id: item_id });
		}

		return find;
	}
	/**
	 *  获取所有道具
	 * @param item_id
	 */
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
	/**
	 *  获取道具的数量
	 * @param item_id
	 * @param bag_id
	 */
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

	/**
	 * 获取某个类型的所有道具
	 */
	public getItemsByItemtype(item_type: Number) {
		// item_id
		return _.where(this.items, { type: item_type }) || [];
	}

	/**
	 * 设置某个道具
	 */
	public setItemByItemid(item: Object) {
		var item_id = item.item_id;
		var index = _.findIndex(this.items, {
			item_id: item_id,
		});

		let item_num = item.after_number || item.item_num;
		if (!item_num || item_num <= 0) {
			if (index >= 0) {
				// delete this.items[index];
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
		// var item_id = item.item_id;

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
				// delete this.items[index];
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

	//================== 获取常见的四种道具 =================================================
	//金币
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
		// return item.item_num
	}

	//房卡
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

	//保险箱
	public getItemByItemid_SAFEBOXGOLD() {
		let item = this.getItemByItemidOrBagid(
			game_item_constans.safebox_gold,
			null
		);
		if (item) return item.item_num || item.after_number;
		return 0;
	}
}
