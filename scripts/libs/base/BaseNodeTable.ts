import BaseSprite from "./BaseSprite";

var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseNodeTable extends cc.Component {
	@property({ type: [cc.Prefab], tooltip: '所有的prefab' })
	prefable_arr = [];

	/**
	 *  通过 prefab_name 获取当前的 prefab
	 *
	 * @param name
	 * @returns
	 */
	public get_prefable_by_name(name: string) {
		let find_obj = _.find(this.prefable_arr, function (v) {
			if (v.name == name) {
				return v;
			}
		});

		return find_obj;
	}

	//创建
	public async createOneSprite(_one_data?: any, _parent?: cc.Node) {
		let obj: BaseSprite = null;
		return obj;
	}
}
