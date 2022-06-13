
var _ = require('Underscore');

export type BagItemData = {
	id: number;
	configId?: number;
	num?: number;
	type?: number;
	lv?: number,
	createTime?: string,
	[x: string]: any;
}

/**
 * Bag
 */
export class Bag {

    //当前的所有道具  
	private m_items: BagItemData[] = [];


    //初始化  
	init(opts: BagItemData[]) {
		this.m_items = [];
		this.setItems(opts);
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
	 * 获取某个道具 获取第一个
	 * @param configId 背包物配置表id
	 * @returns 
	 */
	public getItemByConfigId(configId: number) {
		let item: BagItemData = null;
		if (configId > 0) {
			item = _.findWhere(this.m_items, { configId:configId });
		}
		return item;
	}

	/**
	 * 批量设置道具
	 * 如果存在则合并属性
	 * 如果不存在则新增
	 * 新增时必须传入configId
	 * @param opts
	 */
	public setItems(opts: BagItemData[]) {
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
			self.updateOne(v.id, v);
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

	// /**
	//  * 在原有基础上增加某个道具数量
	//  * @param id 
	//  * @param num 正数增加负数减少
	//  * @returns 返回改变后的数量 如果是负数代表修改失败
	//  */
	// public addItemNum(id: number, num: number) {
	// 	let new_num = -1;
	// 	if (_.isNumber(num)) {
	// 		let item = this.getItemById(id);
	// 		if (item) {
	// 			new_num = this.setItemNum(id, item.num + num);
	// 		}
	// 	}
	// 	return new_num;
	// }

	/**
	 * 获取某个类型的所有道具
	 */
	public getAllItemsByType(type: number) {
		if (type >= 0) {
			let items: BagItemData[] = _.where(this.m_items, { type: type }) || [];
			return items;
		}
	}

    //更改某一个  
	private updateOne(id: number, opts: BagItemData) {
		if (!(id > 0)) {
			return;
		}
		if (!opts || _.isEmpty(opts)) {
			return;
		}
		let item = this.getItemById(id) ;
        if (!item){
            if (!(opts.configId > 0)){
                return 
            }
            item =  opts;
			this.m_items.push(item);
        }
        _.map(opts, function (v, k) {
            item[k] = v;
		});
        return item;	
	}
}