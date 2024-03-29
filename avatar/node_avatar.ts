// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

	@property({ type: cc.Label, tooltip: '用户 userid' })
	txt_userid: cc.Label = null;

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

	//user 信息
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
		if (this.txt_userid) {
			this.txt_userid.string = (user.getUserId() || '') + ''; //user.bag.getItemByItemid_GOLD();
		}
		if (this.spt_vip) {
			let vip: number = user.vip || 0;
			this.spt_vip.spriteFrame = this.sptframe_vip[vip];
		}
		// if(this.txt_nickname) {
		//     this.txt_nickname.string =   (user.nickname || "") + "" //|| "游客账号";
		// }
		this.setTxtNickname(user.nickname);

		// ImageLoader.load(null)
	}

	//设置头像
	public async setAvatar(avatar) {
		//头像
		if (this.spt_avatar) {
			// cc.log(avatar, 'aaaa');
			if (avatar || _.isNumber(avatar)) {
				let spriteFrame = await ImageLoader.load(
					avatar,
					null,
					this.spt_avatar,
					this.GAME_AUTO_CLEAN
				);
				// if (this.spt_avatar) {
				// this.spt_avatar.spriteFrame = spriteFrame;
				this.spt_avatar.node.active = true;
				// }
			} else {
				this.spt_avatar.node.active = false;
			}
		}
	}

	//设置名称
	public setTxtNickname(nickname) {
		if (this.txt_nickname) {
			if (nickname == null) {
				this.txt_nickname.node.active = false;
			} else {
				this.txt_nickname.node.active = true;
				this.txt_nickname.string = nickname;
				// this.txt_nickname.string = '游客账号';
			}
		}
	}
	public setTxtGold(num) {
		if (this.txt_gold) {
			// cc.log('=================================', num);
			let str = GameMath.toNumShort(num);
			// cc.log('====222=============================', str);
			this.txt_gold.string = str + '';
		}
	}

	//点击用户头像
	private async onClickAwatar(event, eventdata) {
		if (eventdata == null) {
			eventdata = new Object();
		}
		// await MWindow.show(InfoPanel, eventdata)
	}

	//复制剪贴板
	private onClickcopyTextToClipboard() {
		if (this.m_user) {
			let userid = this.m_user.getUserId() + '';
			let success = NativeHelp.copyTextToClipboard(userid);
		}
	}
}
