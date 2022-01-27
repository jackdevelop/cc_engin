// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var _ = require('Underscore');

/**
 *   临时数据
 *
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseTempData {
	/** 是否可以移动  */
	public is_move = true;
}
