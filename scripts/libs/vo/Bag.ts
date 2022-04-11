import { GameHelp } from '../utils/GameHelp';

var _ = require('Underscore');

/**
 *  每个小 item 的数据格式  
 *  #背包数据
	.UserBagItem {
	id    1: integer #背包物品id
	config_id   2: integer #配置表id
	num 3: integer #数量
	}
 */
type BagItemData = {
	id: number;
	config_id?: number;
	num?: number;
	type?: number;
	quality?: number;
	[x: string]: any;
}

/**
 * Bag
 */
export class Bag {

	private m_items: BagItemData[] = [];

	init(opts: BagItemData[]) {
		this.m_items = [];
		this.setItems(opts, true);
	}

	/**
	 * 获取所有的道具
	 */
	public getAllBagItems() {
		return this.m_items;
	}

	/**
	 * 获取某个道具
	 * @param id 背包物品id
	 * @returns 
	 */
	public getItemById(id: number) {
		let item: BagItemData = null;
		if (id > 0) {
			item = _.findWhere(this.m_items, { id: id });
		}
		return item;
	}

	/**
	 * 批量设置道具
	 * 如果存在则合并属性
	 * 如果不存在则根据第二个参数决定是否新增
	 * 新增时必须传入config_id
	 * @param opts
	 */
	public setItems(opts: BagItemData[], isCreateNotExist = false) {
		let self = this;
		// cc.log('================', opts);
		if (!this.m_items) {
			this.m_items = [];
		}
		if (!_.isArray(opts)) {
			return;
		}
		_.each(opts, function (v) {
			if (!v || _.isEmpty(v)) {
				return;
			}
			self.updateOne(v.id, v, isCreateNotExist);
		});
	}

	/**
	 * 获取某个道具数量
	 * @param id 背包物品id
	 * @returns 负数代表不存在
	 */
	public getItemNum(id: number) {
		let num = -1;
		let item = this.getItemById(id);
		if (item && item.num >= 0) {
			num = item.num;
		}
		return num;
	}

	/**
	 * 设置某个道具数量
	 * @param id 
	 * @param num 要求num >= 0
	 * @returns 返回改变后的数量 如果是负数代表修改失败
	 */
	public setItemNum(id: number, num: number) {
		let new_num = -1;
		if (id > 0 && num >= 0) {
			let item = this.getItemById(id);
			if (item) {
				new_num = num;
				item.num = new_num;
			}
		}
		return new_num;
	}

	/**
	 * 在原有基础上增加某个道具数量
	 * @param id 
	 * @param num 正数增加负数减少
	 * @returns 返回改变后的数量 如果是负数代表修改失败
	 */
	public addItemNum(id: number, num: number) {
		let new_num = -1;
		if (_.isNumber(num)) {
			let item = this.getItemById(id);
			if (item) {
				new_num = this.setItemNum(id, item.num + num);
			}
		}
		return new_num;
	}

	/**
	 * 获取某个类型的所有道具
	 */
	public getAllItemsByType(type: number) {
		if (type >= 0) {
			let items: BagItemData[] = _.where(this.m_items, { type: type }) || [];
			return items;
		}
	}

	private updateOne(id: number, opts: BagItemData, isCreateNotExist = false) {
		if (!(id > 0)) {
			return;
		}
		if (!opts || _.isEmpty(opts)) {
			return;
		}
		let item = this.getItemById(id);
		if (item) {
			_.map(opts, function (v, k) {
				item[k] = v;
			});
			return item;
		}
		if (!isCreateNotExist) {
			return;
		}
		let config_id = opts.config_id;
		if (!(config_id > 0)) {
			return;
		}
		let num = 0;
		if (opts.num > 0) {
			num = opts.num;
		}
		item = { id, config_id, num };
		// const ItemConfig = GameHelp.getFromFileBy_EXCEL_TO_DB('ItemConfig');
		// if (!ItemConfig) {
		// 	return;
		// }
		// const oneConfig = ItemConfig[config_id];
		// if (!oneConfig) {
		// 	return;
		// }
		// let type = oneConfig.type;
		// if (type >= 0) {
		// 	item.type = type;
		// }
		// let quality = oneConfig.quality;
		// if (quality >= 0) {
		// 	item.quality = quality;
		// }
		this.m_items.push(item);
		_.map(opts, function (v, k) {
			item[k] = v;
		});
		return item;
	}

}
