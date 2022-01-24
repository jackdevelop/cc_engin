// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameNotify } from '../utils/GameNotify';
// var _ = require('Underscore');

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/BaseComponent')
export default class BaseComponent extends cc.Component {
	@property({ tooltip: '隐藏是否监听事件' })
	hide_is_handleEvent: boolean = false;
	// @property({ tooltip: "指定哪个node隐藏，控制监听事件", type: cc.Node })
	// node_handleEvent: cc.Node = null;

	// @property({ tooltip: '是否自动销毁 ImageLoader 资源' })
	// GAME_AUTO_CLEAN: boolean = true;

	//事件
	private __eventHandle = null;
	// //需要动态管理的资源
	// private m_ref_ImageLoader = null;

	//监听事件
	m__addEventHandle(event_name_all: Array<string>, priority: number) {
		console.log('BaseComponent > m__addEventHandle ');

		let event_name_hash = event_name_all;
		if (!event_name_hash) {
			return;
		}
		var self = this;
		if (self.__eventHandle == null) {
			self.__eventHandle = (data: any) => {
				let curr_node = self.node;
				//有 node
				if (curr_node) {
					if (curr_node.active) {
						self.m__eventHandle(data);
					} else {
						if (self.hide_is_handleEvent) {
							self.m__eventHandle(data);
						}
					}
				} else {
					self.m__eventHandle(data);
				}
			};

			GameNotify.getInstance().removeAllEventListenersForHandle(
				self.__eventHandle
			);
			for (let i = 0; i < event_name_hash.length; i++) {
				let one_name = event_name_hash[i];
				GameNotify.getInstance().addEventListener(
					one_name,
					self.__eventHandle,
					null,
					priority
				);
			}
		}
	}

	m__eventHandle(event: { name: string; data?: any; target?: any }) {
		var self = this;
		var data = event.data;
		// cc.log(event.name);
	}

	// //动态管理 ImageLoader 的资源
	// onRefAdd_ImageLoader(arr) {
	//   if (this.GAME_AUTO_CLEAN && GameConstants.GAME_AUTO_CLEAN) {
	//     // this.m_ref_ImageLoader = arr;
	//     // _.each(this.m_ref_ImageLoader, function (v, k) {
	//     //   if (v && cc.isValid(v) && v.spriteFrame) v.spriteFrame.addRef();
	//     // });
	//   }
	// }
	// onRefDec_ImageLoader() {
	//   if (this.GAME_AUTO_CLEAN && GameConstants.GAME_AUTO_CLEAN) {
	//     // _.each(this.m_ref_ImageLoader, function (v, k) {
	//     //   if (v && cc.isValid(v) && v.spriteFrame) v.spriteFrame.decRef();
	//     // });
	//   }
	// }

	onDestroy() {
		// this.onRefDec_ImageLoader();

		this.node.stopAllActions();
		this.unschedule(null);
		this.unscheduleAllCallbacks();

		// super.onDestroy();
		//清楚事件
		// var GameNotify = require("GameNotify");
		GameNotify.getInstance().removeAllEventListenersForHandle(
			this.__eventHandle
		);
		this.__eventHandle = null;
		// this.node_handleEvent = null;
	}
}
