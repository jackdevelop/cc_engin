// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { HallService } from '../../app/hall/scripts/HallService';
import GameManger from '../gamemanager/GameManger';
import { SceneManager } from '../scripts/libs/manager/SceneManager';
import { GameConfig } from '../../cc_own/config/GameConfig';
import { NetWork } from '../scripts/libs/server/NetWork';
import { MWindow } from '../scripts/libs/component/MWindow';
import GMSelectPanel from './GMSelectPanel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class node_gm extends cc.Component {
	@property({ type: cc.Node, tooltip: 'gm显示' })
	node_gm: cc.Node = null;

	@property({ type: cc.EditBox, tooltip: '类型' })
	txt_action_type: cc.EditBox = null;

	@property({ type: cc.EditBox, tooltip: '参数' })
	txt_action_json_param: cc.EditBox = null;

	onLoad() {
		this.node.active = GameConfig.debug;

		//gm 命令
		this.txt_action_type.string = 'game_gm_command';
		this.txt_action_json_param.string = '{"next_card": "101"}';
	}

	//显示
	onClickShow() {
		this.node_gm.active = !this.node_gm.active;
	}

	//发送gm命令
	// onClickok(){
	//     let txt_channelType = Number(this.txt_action_type.string);
	//     let txt_action_json_param = this.txt_action_json_param.string;
	//
	//     // HallService.getInstance().game_gm_action(txt_channelType,txt_action_json_param)
	// }

	//发送gm命令
	async onClickAll() {
		let cmd = this.txt_action_type.string;
		let txt_action_json_param = this.txt_action_json_param.string;
		let action_card = JSON.parse(txt_action_json_param);
		//TODO
		//这里获取当前还剩下多少底牌   然后弹出来
		let ret = await HallService.getInstance().game_cmd(cmd, null);
		if (ret) {
			await MWindow.show(GMSelectPanel, {
				wall_cards: ret.wall_cards,
				action_card: action_card,
			});
		}
	}

	//断线
	onClickCloseNet() {
		NetWork.getInstance().close(false);
	}
	//重连
	onClickResetNet() {
		NetWork.getInstance().init(null, null);
	}
}
