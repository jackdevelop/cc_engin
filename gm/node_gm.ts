









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

		
		this.txt_action_type.string = 'game_gm_command';
		this.txt_action_json_param.string = '{"next_card": "101"}';
	}

	
	onClickShow() {
		this.node_gm.active = !this.node_gm.active;
	}

	
	
	
	
	
	
	

	
	async onClickAll() {
		let cmd = this.txt_action_type.string;
		let txt_action_json_param = this.txt_action_json_param.string;
		let action_card = JSON.parse(txt_action_json_param);
		
		
		let ret = await HallService.getInstance().game_cmd(cmd, null);
		if (ret) {
			await MWindow.show(GMSelectPanel, {
				wall_cards: ret.wall_cards,
				action_card: action_card,
			});
		}
	}

	
	onClickCloseNet() {
		NetWork.getInstance().close(false);
	}
	
	onClickResetNet() {
		NetWork.getInstance().init(null, null);
	}
}
