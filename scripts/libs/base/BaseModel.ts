






const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseModel {
	
	private m_items = new Object();

	
	public set_item(item_id, item) {
		let is_hav = this.get_item_by_itemid(item_id);
		if (!is_hav) {
			item_id = item_id + '';

			
			
			item.___item_no = item_id;

			this.m_items[item_id] = item;
		} else {
			cc.log('当前含有数据了，' + item_id + '请先删除在添加');
		}

		return item;
	}

	
	public get_items() {
		return this.m_items;
	}

	
	public delete_item_by_itemid(item_id) {
		item_id = item_id + '';

		var item = this.m_items[item_id];

		
		this.m_items[item_id] = null;
		delete this.m_items[item_id];

		return item;
	}

	
	public delete_all_items() {
		let ret = this.m_items
		this.m_items = {};
		return ret
	}

	
	public get_item_by_itemid(item_id) {
		item_id = item_id + '';
		var item = this.m_items[item_id];

		return item;
	}
}
