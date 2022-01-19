









import { ImageLoader } from '../scripts/libs/utils/ImageLoader';
import { GameMath } from '../scripts/libs/utils/GameMath';
import BaseComponent from '../scripts/libs/base/BaseComponent';
import { NativeHelp } from '../scripts/libs/utils/NativeHelp';
var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class node_avatar extends BaseComponent {
	@property({ tooltip: '是否自动销毁 ImageLoader 资源' })
	GAME_AUTO_CLEAN: boolean = true;

	@property({ type: cc.Label, tooltip: '用户 usercode' })
	txt_user_code: cc.Label = null;

	@property({ type: cc.Label, tooltip: '金币' })
	txt_gold: cc.Label = null;

	@property({ type: cc.Label, tooltip: '用户名称' })
	txt_nickname: cc.Label = null;

	@property({ type: cc.Label, tooltip: '用户所在城市' })
	txt_city: cc.Label = null;

	@property({ type: cc.Label, tooltip: '用户IP' })
	txt_ip: cc.Label = null;

	@property({ type: cc.Sprite, tooltip: '头像' })
	spt_avatar: cc.Sprite = null;

	@property({ type: cc.Sprite, tooltip: 'vip' })
	spt_vip: cc.Sprite = null;
	@property({ type: [cc.SpriteFrame], tooltip: 'vip的集合' })
	sptframe_vip: Array<cc.SpriteFrame> = [];

	@property({ tooltip: '是否可以点击' })
	is_touch: boolean = false;

	
	private m_user = null;

	onLoad() {
		this.m_user = null;
	}

	public getUser() {
		return this.m_user;
	}

	public async init(user: any) {
		user = user || new Object();
		this.m_user = user;

		if (this.txt_ip) {
			this.txt_ip.string = (user.ip || '0.0.0.0') + '';
		}

		if (this.txt_city) {
			let str_city = null;
			if (user.ip) {
				let ret = await NativeHelp.getCityByIp(user.ip);
				if (ret) {
					str_city = '' + ret.country + '' + ret.region + '' + ret.city + '';
				} else {
					str_city = '非原生平台无法定位';
				}
			}
			this.txt_city.string = (str_city || '未知地区') + '';
		}

		if (this.txt_gold) {
			if (user.bag) {
				this.setTxtGold(user.bag.getItemByItemid_GOLD());
			} else {
				this.setTxtGold(0);
			}
		}
		if (this.txt_user_code) {
			this.txt_user_code.string = (user.user_code || '') + ''; 
		}
		if (this.spt_vip) {
			let vip: number = user.vip || 0;
			this.spt_vip.spriteFrame = this.sptframe_vip[vip];
		}
		
		
		
		this.setTxtNickname(user.nickname);

		
	}

	
	public async setAvatar(avatar) {
		
		if (this.spt_avatar) {
			
			if (avatar || _.isNumber(avatar)) {
				let spriteFrame = await ImageLoader.load(
					avatar,
					null,
					this.spt_avatar,
					this.GAME_AUTO_CLEAN
				);
				
				
				this.spt_avatar.node.active = true;
				
			} else {
				this.spt_avatar.node.active = false;
			}
		}
	}

	
	public setTxtNickname(nickname) {
		if (this.txt_nickname) {
			if (nickname == null) {
				this.txt_nickname.node.active = false;
			} else {
				this.txt_nickname.node.active = true;
				this.txt_nickname.string = nickname;
				
			}
		}
	}
	public setTxtGold(num) {
		if (this.txt_gold) {
			
			let str = GameMath.toNumShort(num);
			
			this.txt_gold.string = str + '';
		}
	}

	
	private async onClickAwatar(event, eventdata) {
		if (eventdata == null) {
			eventdata = new Object();
		}
		
	}

	
	private onClickcopyTextToClipboard() {
		if (this.m_user) {
			let user_code = this.m_user.user_code + '';
			let success = NativeHelp.copyTextToClipboard(user_code);
		}
	}
}
