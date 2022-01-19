









import { HotUpdateModule } from './HotUpdateModule';
import HotUpdate from './HotUpdate';
import { GameLocalStorageConstants } from '../../cc_own/constants/GameLocalStorageConstants';
import TProgressBar from '../scripts/libs/component/TProgressBar';
import BaseComponent from '../scripts/libs/base/BaseComponent';
import { GameEventConstants } from '../scripts/libs/constants/GameEventConstants';
import { GameConfigFromServer } from '../../cc_own/config/GameConfigFromServer';
import { LoginService } from '../../app/login/scripts/LoginService';
import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { PromiseUtil } from '../scripts/libs/util/PromiseUtil';

const { ccclass, property } = cc._decorator;

@ccclass
export default class node_hotupdate extends BaseComponent {
	@property({ tooltip: '热更新进度条', type: TProgressBar })
	TProgressBar_hotupdate: TProgressBar = null;
	
	
	@property({ tooltip: '版本号', type: cc.Label })
	txt_version: cc.Label = null;

	@property({
		tooltip: '外部设置,是否允许热更',
	})
	allow_hot_update: boolean = false;

	
	

	@property({ tooltip: '热更脚本', type: HotUpdate })
	script_HotUpdate: HotUpdate = null;

	@property({ tooltip: '延迟几秒成功', type: cc.Integer })
	delay_time: number = 0;

	
	private m_event_name_hash: Array<string> = [
		HotUpdateModule.OnUpdateVersion_SUCCESS,
		HotUpdateModule.OnUpdateVersionResult_FAILED,
		HotUpdateModule.OnUpdateProgress,
		HotUpdateModule.OnUpdateVersion_CanRetry,
	];
	
	
	
	
	
	
	
	

	
	private m_endCallFun = null;
	
	
	
	
	
	
	
	onLoad() {
		
		let version = cc.sys.localStorage.getItem(
			GameLocalStorageConstants.LOCALSTORAGE_Login_VERSION
		);
		
		this.txt_version.string = version || 'v0.0.1';

		
		this.TProgressBar_hotupdate.setProgress(0);
		let str = '';
		this.TProgressBar_hotupdate.setTxtValue(str);
		
		
		
		this.m__addEventHandle(this.m_event_name_hash, null);
	}

	m__eventHandle(event) {
		var self = this;
		var data = event.data;
		cc.log(event.name);
		if (event.name == HotUpdateModule.OnUpdateVersion_SUCCESS) {
			let str = '热更完成';
			this.TProgressBar_hotupdate.setTxtValue(str);

			
			if (this.delay_time > 0) {
				PromiseUtil.wait_time(this.delay_time, this);
			}

			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		} else if (event.name == HotUpdateModule.OnUpdateVersionResult_FAILED) {
			let str = '热更失败，请稍后重试';
			this.TProgressBar_hotupdate.setTxtValue(str);
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		} else if (event.name == HotUpdateModule.OnUpdateProgress) {
			this.TProgressBar_hotupdate.setProgress(data.fileProgress - 0.1);
			let str = '正在更新中,请耐心等待';
			this.TProgressBar_hotupdate.setTxtValue(str);
		} else if (event.name == HotUpdateModule.OnUpdateVersion_CanRetry) {
			this.script_HotUpdate.retry();
		}
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	public checkUpdate() {
		return this.script_HotUpdate.checkUpdate();
	}
	
	public hotUpdate() {
		let is_update = this.script_HotUpdate.hotUpdate();
		if (!is_update) {
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		}
	}

	
	public onBtnClickReStart() {
		cc.log('软启动游戏！！');
		if (cc.sys.isNative) {
			cc.game.restart();
		} else {
			cc.log("don't reStart");
		}
	}

	
	async onBtnClickUpdate(endCallFun) {
		this.m_endCallFun = endCallFun;
		
		let allow_hot_update =
			await LoginService.getInstance().get_system_info_by_key(
				'allow_hot_update'
			);

		
		if (
			this.allow_hot_update &&
			cc.sys.isNative &&
			allow_hot_update + '' == '1'
		) {
			
			this.hotUpdate();
		} else {
			if (this.m_endCallFun) {
				this.m_endCallFun();
			}
		}
	}
}
