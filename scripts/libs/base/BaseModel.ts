
const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseModel<ItemType> {

	/** 数据 */
	private m_items: { [x: string | number]: ItemType } = {};

	/**
	 *  设置进某个item数据 保存起来
	 *
	 * @param item_id
	 * @param item
	 * @returns 返回当前item
	 */
	public set_item(item_id: string | number, item: ItemType) {
		let is_hav = this.get_item_by_itemid(item_id);
		if (!is_hav) {
			this.m_items[item_id] = item;
		} else {
			cc.log('当前含有数据了，' + item_id + '请先删除在添加');
		}
		return item;
	}

	/**
	 *  获取所有的 items
	 * @returns
	 */
	public get_items() {
		return this.m_items;
	}

	/**
	 *  删除某个item
	 * @param item_id
	 * @returns 返回当前被删除的item
	 */
	public delete_item_by_itemid(item_id: string | number) {
		var item = this.m_items[item_id];
		//键值对也删除
		this.m_items[item_id] = null;
		delete this.m_items[item_id];
		return item;
	}

	/**
	 *  删除所有
	 */
	public delete_all_items() {
		let ret = this.m_items;
		this.m_items = {};
		return ret;
	}

	/**
	 *  获取某个 item
	 * @param item_id
	 * @returns
	 */
	public get_item_by_itemid(item_id: string | number) {
		var item = this.m_items[item_id];
		return item;
	}
}
