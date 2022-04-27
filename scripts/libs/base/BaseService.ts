import { GameConfigUrl } from '../../../../cc_own/config/GameConfigUrl';
import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
import { NetWork } from '../server/NetWork';
import BaseComponent from './BaseComponent'

const { ccclass, property } = cc._decorator

@ccclass
export class BaseService extends BaseComponent {

	public async httpPost(path: string, param = {}, ip: string = '') {
		return await this.httpRequest(path, param, 'POST', ip);
	}

	public async httpGet(url: string, ip: string = '') {
		return await this.httpRequest(url, null, 'GET', ip);
	}

	public async httpRequest(path: string, param = {}, method: string, ip: string = '') {
		ip = ip || GameConfigUrl.httpIp_login;
		ip = ip.replace(/(\/+)$/, '/');
		path = path.replace(/^(\/+)/, '');
		let url = ip + path;
		LoadingChrysanthemum.show();
		let ret = await NetWork.getInstance().request_http(
			url,
			param,
			method,
			GameConfigUrl.header_data
		);
		LoadingChrysanthemum.hide();
		return ret;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////FMS start ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//状态机
	private M_FSM = null

	//状态机 init
	public FSM_init() {
		return true
	}
	//获取fsm
	public FSM_get() {
		return this.M_FSM
	}
	//go
	public FSM_go(one) {
		this.M_FSM.go(one)
	}
	//canGo
	public FSM_canGo(one) {
		return this.M_FSM.canGo(one)
	}
	// FSM_is
	public FSM_is(one) {
		return this.M_FSM.is(one)
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////FMS end ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public onDestroy() {
		super.onDestroy()
		this.M_FSM = null
		if (this['instance']) {
			this['instance'] = null
		}
	}
}
