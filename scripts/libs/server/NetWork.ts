import { GameNotify } from '../utils/GameNotify';
import { UserList } from '../vo/UserList';
import { GameConfigUrl } from '../../../../cc_own/config/GameConfigUrl';
import { NetWebSocket } from './NetWebSocket';
import { NetHttp } from './NetHttp';

import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum';

// import {Model1300} from "../../../../game/1300/scripts/Model1300";
// import {FightService_planewar} from "../../../../game/1800/scripts/FightService_planewar";
// import {Model2000} from "../../../../game/2000/scripts/Model2000";
// import {Model3000} from "../../../../game/3000/scripts/Model3000";
// import {Model1200} from "../../../../game/1200/scripts/Model1200";

import Alert from '../../../alert/alert/Alert';
import { NetWorkHandle } from '../../../../cc_own/tool/NetWorkHandle';
import { net_type } from '../../../../cc_own/constants/net_type';
import { NetWorkHandle_NoNet } from './NetWorkHandle_NoNet';
import TimeUtil from '../util/TimeUtil';
import { NetPhoenix } from './NetPhoenix';

var _ = require('Underscore');

/**
 * NetWork.js
 *
 */
export class NetWork {
	/**单例实例**/
	private static instance: NetWork = null;
	public static getInstance(): NetWork {
		if (this.instance == null) {
			this.instance = new NetWork();
			this.instance._init();

			NetWorkHandle.init();
		}
		return this.instance;
	}

	/**
	 * 网络请求 http
	 * @param url 请求的action
	 * @param param 对应的方法
	 */
	public async request_http(
		url: string,
		param: any = new Object(),
		method: string = 'POST', // GET
		header_data: object
	) {
		var self = this;
		param.ts = cc.sys.now();

		cc.log(
			'发送http消息:url:' +
				url +
				',cmd:' +
				param.cmd +
				', netType:' +
				GameConfigUrl.netType +
				',param:' +
				JSON.stringify(param) +
				',method:' +
				method
		);

		//单机
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return NetWorkHandle_NoNet.hanlde(param, url);
		}

		// if (net_type.NETTYPE_NOT == GameConfigUrl.netType) {
		//   //单机
		// } else {
		//网络
		// var fun = function (result) {
		//   if (result == null || result == "") {
		//     cc.log("服务器返回数据为null");
		//     return;
		//   }
		//   result = JSON.parse(result);
		//   self.__Filter(result);
		//   if (callBack) callBack(result);
		// };
		// var errorfun = function (result) {
		//   if (errorCallBack) errorCallBack(result);
		// };
		// let ret = NetHttp.fetch_post_json(
		//     url,
		//     param
		// );
		let ret = null;
		if (method == 'GET') {
			ret = await NetHttp.xhr_get_json(url, param, header_data);
		} else {
			ret = await NetHttp.xhr_post_json(url, param, header_data);
		}
		// cc.log('xx' + JSON.stringify(ret));
		if (ret) {
			// let ret = NetHttp.httpPost(url,param)
			NetWorkHandle.__Filter(ret);

			cc.log('http收到消息：', ret);
			return ret;
		} else {
			Alert.show('提示', '网络异常，请稍后重试！', null, null, null, null);
		}
		return null;
		// }
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////长连接部分//////长连接部分//////////////长连接部分////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//cmd 自定义的cmd事件监听
	private _CMDcallBack(event) {
		var eventData = event.data;
		NetWorkHandle.__onResponseHandle(eventData);
	}
	//系统事件监听
	private __eventHandle(event) {
		NetWorkHandle.__onConnectionHandle(event);
	}
	private _init() {
		var self = this;
		GameNotify.getInstance().removeEventListener('CMD', this._CMDcallBack);
		GameNotify.getInstance().addEventListener(
			'CMD',
			this._CMDcallBack,
			null,
			null
		);

		GameNotify.getInstance().removeEventListener(
			'CONNECTION_CLOSE',
			this.__eventHandle
		);
		GameNotify.getInstance().removeEventListener(
			'CONNECTION',
			this.__eventHandle
		);
		GameNotify.getInstance().removeEventListener(
			'CONNECTION_ERROR',
			this.__eventHandle
		);
		GameNotify.getInstance().addEventListener(
			'CONNECTION_CLOSE',
			self.__eventHandle,
			null,
			null
		);
		GameNotify.getInstance().addEventListener(
			'CONNECTION',
			self.__eventHandle,
			null,
			null
		);
		GameNotify.getInstance().addEventListener(
			'CONNECTION_ERROR',
			self.__eventHandle,
			null,
			null
		);
	}

	//当前的连接
	private CURRENT_NET: any = null;
	public get_current_net() {
		return this.CURRENT_NET;
	}
	//初始化
	public async init(networkName: string, servers: any) {
		var self = this;

		if (networkName == null) {
			networkName = 'HALL';
		}
		

		if (servers == null) {
			let user = UserList.getUserByUserid(UserList.meUserId);
			servers = {
				ip: GameConfigUrl.hall_Ip,
				port: GameConfigUrl.hall_port,
				param: {
					ts: cc.sys.now(),
					token: user.token,
                    Authorization:user.token,
					userid: user.getUserId(),
                    Action: 'messagews',
				},
			};
		}

		if (this.CURRENT_NET) {
			this.CURRENT_NET.close(false);
		}

		//单机
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return null;
		}

		return new Promise((resolve, reject) => {
			var fun = function (ret) {
				resolve(ret);
			};

			self.CURRENT_NET = new NetWebSocket();
			// self.CURRENT_NET = new NetPhoenix()
			self.CURRENT_NET.prepareWebSocket(
				servers.ip,
				servers.port,
				networkName,
				servers.param,
				fun
			);
		});

		//显示菊花
		// var LoadingChrysanthemum = require("LoadingChrysanthemum");
		// LoadingChrysanthemum.show();
		// if (this.__BaseNet   &&  this.__BaseNet.isConnect()){
		//     this.__BaseNet.close();
		//     this.__BaseNet = null;
		// }
		// self.__conect_callback_name = name; // || network_name.LOBBY;
		// self.__conect_callback_fun = callback;
		// self.__temp_all_BaseNet = [];
		// if (net_type.NETTYPE_NET == GameConfig.netType) {
		// if ( Util.isArray(servers) ) {
		// for (var i = 0; i < servers.length; i++) {
		//     var one = servers[i];
		//     var oneip = one.domain;
		//     var oneport = one.port;
		//     var oneParam = servers.param;
		//
		//     self.__conect(oneip, oneport, i, name, oneParam);
		// }
		// }
		// }
	}

	//关闭
	public close(dispatchEvent: boolean) {
		LoadingChrysanthemum.show();

		if (this.CURRENT_NET) {
			this.CURRENT_NET.close(dispatchEvent);

			return true;
		}
		return null;
	}

	/**
	 * 网络请求 socket
	 * @param cmd 请求的 cmd
	 * @param param  参数
	 * @param callBack 回调
	 * @param current_net 指定当前的 socket句柄
	 */
	public async request(cmd: string, param: any, current_net, channel_name) {
		var self = this;

		if (!param) param = new Object();

		if (current_net == null) {
			current_net = self.CURRENT_NET;
		}

		//单机
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return NetWorkHandle_NoNet.hanlde(param, cmd);
		}

		return new Promise((resolve, reject) => {
			cc.log(
				'发送消息:cmd:' +
					cmd +
					',param:' +
					JSON.stringify(param) +
					',current_net:' +
					current_net,
				',channel_name:' + channel_name,
				',time:' + TimeUtil.msToHMS()
			);

			var fun = function (ret) {
				NetWorkHandle.__Filter(ret);
				// if (callBack) callBack(ret);
				resolve(ret);
			};

			// current_net = current_net;
			// ||
			// this.__BaseNet_hash[network_name.LOBBY] ||
			// this.__BaseNet_hash[network_name.ROOM];
			//cc.log("current_net:" + current_net);
			if (current_net) {
				param.ts = cc.sys.now();
				current_net.send(cmd, param, fun, channel_name);
			} else {
				cc.log('当前没有建立连接');
			}
		});
	}

	// /**
	//  * 网络请求 socket
	//  * @param cmd 请求的 cmd
	//  * @param param  参数
	//  * @param callBack 回调
	//  * @param current_net 指定当前的 socket句柄
	//  */
	// public request(cmd:string, param:any, current_net) {
	//         var self = this;
	//        cc.log(
	//             "发送消息:cmd:" +
	//             cmd +
	//             ",param:" +
	//             JSON.stringify(param) +
	//             ",current_net:" +
	//             current_net
	//         );
	//
	//         var fun = function(ret) {
	//             NetWorkHandle.__Filter(ret);
	//             // if (callBack) callBack(ret);
	//         };
	//
	//         if (current_net == null){
	//             current_net = this.CURRENT_NET ;
	//         }
	//         // current_net = current_net;
	//         // ||
	//         // this.__BaseNet_hash[network_name.LOBBY] ||
	//         // this.__BaseNet_hash[network_name.ROOM];
	//         //cc.log("current_net:" + current_net);
	//         if (current_net) {
	//             current_net.send(cmd, param, fun, null);
	//         }else{
	//            cc.log("当前没有建立连接");
	//         }
	// }
}
