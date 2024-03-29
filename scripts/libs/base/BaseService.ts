import { GameConfigUrl } from '../../../../cc_own/config/GameConfigUrl';
import { code_constants } from '../../../../cc_own/constants/code_constants';
import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';
import { NetWork } from '../server/NetWork';
import { StringExtension } from '../utils/StringExtension';
import { UserList } from '../vo/UserList';
import BaseComponent from './BaseComponent'

const { ccclass, property } = cc._decorator

@ccclass
export class BaseService extends BaseComponent {

	public async httpPost(path: string, param = {}, ip: string = '') {
		return await this.httpRequest(path, param, 'POST', ip);
	}

	public async httpGet(path: string, param = {}, ip: string = '') {
		path = StringExtension.appendGetPathParams(path, param);
		return await this.httpRequest(path, param, 'GET', ip);
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
        if (ret && ret.code == code_constants.SUCCESS) {
            //过滤掉所有的 背包 item的变化 
			let itemChange = ret.itemChange 
            if(itemChange){
                // let bagItems = itemChange.bagItems
                // let coin = itemChange.coin
                // let diamond = itemChange.diamond

                let user = UserList.getUserByUserid(UserList.meUserId)
                user.merge(itemChange)
            }
		}     

		LoadingChrysanthemum.hide();
		return ret;
	}

	// public appendGetPathParams(path: string, param = {}) {
	// 	path = path.replace(/(\/+)$/, '');
	// 	for (var key in param) {
	// 		let value = param[key];
	// 		if (value != null && value != undefined) {
	// 			path = path + "/" + value;
	// 		}
	// 	}
	// 	return path;
	// }

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////FMS start ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// //状态机
	// private M_FSM = null

	// //状态机 init
	// public FSM_init() {
	// 	return true
	// }
	// //获取fsm
	// public FSM_get() {
	// 	return this.M_FSM
	// }
	// //go
	// public FSM_go(one) {
	// 	this.M_FSM.go(one)
	// }
	// //canGo
	// public FSM_canGo(one) {
	// 	return this.M_FSM.canGo(one)
	// }
	// // FSM_is
	// public FSM_is(one) {
	// 	return this.M_FSM.is(one)
	// }
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////FMS end ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public onDestroy() {
		super.onDestroy()
		// this.M_FSM = null
		if (this['instance']) {
			this['instance'] = null
		}
	}
}
