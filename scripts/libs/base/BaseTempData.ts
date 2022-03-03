
var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

/**
 * 临时数据
 */
@ccclass
export default class BaseTempData {
	/** 控制移动的目标数量 */
	public stop_move_num = 0;
}
