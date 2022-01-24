// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { MWindow } from '../scripts/libs/component/MWindow';
import { BaseWindow } from '../scripts/libs/base/BaseWindow';
import { HallService } from '../../app/hall/scripts/HallService';
import { MWindowConfig } from '../scripts/libs/component/MWindowExtends';

var _ = require('Underscore');
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('panel/common/GMSelectPanel')
@MWindowConfig({ PATH: 'common/GMSelectPanel', TYPE: 'single' })
export default class GMSelectPanel extends BaseWindow {
	// @property({ type: cc.Node, tooltip: "麻将的父节点" })
	// node_card_pos: cc.Node = null;
	// @property({ type: cc.Prefab, tooltip: "麻将的prefab" })
	// prefable_poker: cc.Prefab = null;
	// @property({ tooltip: "麻将的prefab" })
	// prefable_poker_name: string = "PokermajongSpritePrefab";
	// //选中的牌
	// private select_next_card:number = null

	@property({ type: cc.EditBox, tooltip: 'EditBox' })
	txt_gm: cc.EditBox = null;

	// onLoad() {
	//   let self = this;
	//   // let nodes = self.node_card_pos
	//   // if(nodes){
	//   //     nodes.removeAllChildren();
	//   // }
	//   // _.each(nodes, function (node) {
	//   //     // node.stopAllActions()
	//   //     cc.log("node====", node)
	//   //     if (node) {
	//   //         // let prefab = node.getComponent(cc.Prefab)
	//   //         let script = node.getComponent("PokermajongSprite")
	//   //         script.setColor(255, 255, 255)
	//   //         script.unscheduleAllCallbacks()
	//   //         PoolManager.returnPoolObj(self.prefable_poker_name, node)
	//   //     }
	//   // })
	// }

	/**
	 * 初始化调用
	 */
	onStarted(param: any) {
		// 结算的数据
		let self = this;
		// let wall_cards = this.m_param.wall_cards
		// this.select_next_card = null
		// //todo 将他展示出来  并有点击事件  点击以后将牌的id=select_next_card  即可
		// //点击确定他会调用 onClickOK 方法  ，这样下次就会摸到这张牌
		// wall_cards = _.uniq(wall_cards)
		// wall_cards = _.sortBy(wall_cards)
		// let items = this.node_card_pos.children
		// _.each(items, function(item){
		//     item.active = false
		// })
		// _.each(wall_cards, function(card_num, k){
		//     let one_item = items[k]
		//     let script = null
		//     if (!one_item) {
		//         script = self.createOneCard(card_num, 0)
		//         one_item = script.node
		//         one_item.parent = self.node_card_pos
		//     }
		//     one_item.active = true
		//     script = one_item.getComponent("PokermajongSprite")
		//     script.init(card_num, null)
		//     script.initView(0, "SHOW")
		//     script.reveal(true)
		//     script.setScale(1)
		//     script._setSelect(false);
		//     script.setTouchEnable(false)
		//     script.setColor(255, 255, 255)
		//     one_item.off(cc.Node.EventType.TOUCH_END)
		//     one_item.on(cc.Node.EventType.TOUCH_END, function (event) {
		//         let nodes = self.node_card_pos.children
		//         _.each(nodes, function (v) {
		//             let script1 = v.getComponent("PokermajongSprite")
		//             script1.setColor(255, 255, 255)
		//         })
		//         script.setColor(255, 255, 0)
		//         self.select_next_card = card_num
		//         cc.log("选择的牌型=====", self.select_next_card)
		//     }.bind(this));
		// })
	}

	// //创建手牌
	// public createOneCard(pokerid: number, client_indx: number) {
	//     let poker = PoolManager.requestPoolObj(this.prefable_poker_name, this.prefable_poker)
	//     poker.parent = null
	//     let pokerscript = poker.getComponent("PokermajongSprite");
	//     pokerscript.init(pokerid, null)
	//     pokerscript.initView(client_indx, "SHOW")
	//     pokerscript.reveal(true)
	//     pokerscript.setScale(1)
	//     pokerscript._setSelect(false);
	//     pokerscript.setTouchEnable(false)
	//     pokerscript.setPosition(cc.Vec2.ZERO)
	//     return pokerscript;
	// }

	//点击继续游戏
	async onClickOK(event, eventdata) {
		let self = this;
		if (!this.txt_gm) {
			return;
		}

		let cmd = 'game_gm_command';
		let gm_param = self.txt_gm.string;
		let gm_type = 0;
		let ret = await HallService.getInstance().game_gm(gm_type, gm_param);
	}

	//点击关闭
	async onClickClose(event, eventdata) {
		MWindow.hide(GMSelectPanel, null);
	}

	//点击dump
	async onClickDump(event, eventdata) {
		// let Loader = cc.loader;
		let str = `当前资源总数:${Object.keys(cc.loader._cache).length}`;
		// resLoader.resLeakChecker.dump();
		cc.log(str);
	}
}
