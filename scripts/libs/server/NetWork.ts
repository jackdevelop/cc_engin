import { GameNotify } from '../utils/GameNotify'
import { UserList } from '../vo/UserList'
import { GameConfigUrl } from '../../../../cc_own/config/GameConfigUrl'
import { NetWebSocket } from './NetWebSocket'
import { NetHttp } from './NetHttp'

import LoadingChrysanthemum from '../../../loadingchrysanthemum/LoadingChrysanthemum'







import Alert from '../../../alert/alert/Alert'
import { NetWorkHandle } from '../../../../cc_own/tool/NetWorkHandle'
import { net_type } from '../../../../cc_own/constants/net_type'
import { NetWorkHandle_NoNet } from './NetWorkHandle_NoNet'
import TimeUtil from '../util/TimeUtil'
import { NetPhoenix } from './NetPhoenix'

var _ = require('Underscore')


export class NetWork {
	
	private static instance: NetWork = null
	public static getInstance(): NetWork {
		if (this.instance == null) {
			this.instance = new NetWork()
			this.instance._init()

			NetWorkHandle.init()
		}
		return this.instance
	}

	
	private CURRENT_NET: any = null
	public get_current_net() {
		return this.CURRENT_NET
	}

	_init() {
		var self = this
		GameNotify.getInstance().removeEventListener('CMD', this._CMDcallBack)
		this._CMDcallBack = function (event) {
			var eventData = event.data
			NetWorkHandle.__onResponseHandle(eventData)
		}
		GameNotify.getInstance().addEventListener(
			'CMD',
			this._CMDcallBack,
			null,
			null
		)

		GameNotify.getInstance().removeEventListener(
			'CONNECTION_CLOSE',
			this.__eventHandle
		)
		GameNotify.getInstance().removeEventListener(
			'CONNECTION',
			this.__eventHandle
		)
		GameNotify.getInstance().removeEventListener(
			'CONNECTION_ERROR',
			this.__eventHandle
		)
		this.__eventHandle = function (event) {
			NetWorkHandle.__onConnectionHandle(event)
		}
		GameNotify.getInstance().addEventListener(
			'CONNECTION_CLOSE',
			self.__eventHandle,
			null,
			null
		)
		GameNotify.getInstance().addEventListener(
			'CONNECTION',
			self.__eventHandle,
			null,
			null
		)
		GameNotify.getInstance().addEventListener(
			'CONNECTION_ERROR',
			self.__eventHandle,
			null,
			null
		)
	}

	
	public async init(networkName: string, servers: any) {
		var self = this

		if (networkName == null) {
			networkName = 'HALL'
		}

		if (servers == null) {
			let user = UserList.getUserByUserid(UserList.meUserId)
			servers = {
				ip: GameConfigUrl.hall_Ip,
				port: GameConfigUrl.hall_port,
				param: {
					ts: cc.sys.now(),
					token: user.token,
					user_code: user.user_code,
				},
			}
		}

		if (this.CURRENT_NET) {
			this.CURRENT_NET.close(false)
		}

		
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return null
		}

		return new Promise((resolve, reject) => {
			var fun = function (ret) {
				resolve(ret)
			}

			
			self.CURRENT_NET = new NetPhoenix()
			self.CURRENT_NET.prepareWebSocket(
				servers.ip,
				servers.port,
				networkName,
				servers.param,
				fun
			)
		})

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}

	
	public close(dispatchEvent: boolean) {
		LoadingChrysanthemum.show()

		if (this.CURRENT_NET) {
			this.CURRENT_NET.close(dispatchEvent)

			return true
		}
		return null
	}

	
	public request(cmd: string, param: any, current_net, channel_name) {
		var self = this

		if (!param) param = new Object()

		if (current_net == null) {
			current_net = self.CURRENT_NET
		}

		
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return NetWorkHandle_NoNet.hanlde(param, cmd)
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
			)

			var fun = function (ret) {
				NetWorkHandle.__Filter(ret)
				
				resolve(ret)
			}

			
			
			
			
			
			if (current_net) {
				param.ts = cc.sys.now()
				current_net.send(cmd, param, fun, channel_name)
			} else {
				cc.log('当前没有建立连接')
			}
		})
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public async request_http(
		url: string,
		param: any = new Object(),
		method: string = 'POST', 
		header_data: object
	) {
		var self = this
		param.ts = cc.sys.now()

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
		)

		
		if (GameConfigUrl.netType == net_type.NETTYPE_NOT) {
			return NetWorkHandle_NoNet.hanlde(param, url)
		}

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		let ret = null
		if (method == 'GET') {
			ret = await NetHttp.xhr_get_json(url, param, header_data)
		} else {
			ret = await NetHttp.xhr_post_json(url, param, header_data)
		}
		
		if (ret) {
			
			NetWorkHandle.__Filter(ret)

			cc.log('http收到消息：', ret)
			return ret
		} else {
			Alert.show('提示', '网络异常，请稍后重试！', null, null, null, null)
		}
		return null
		
	}
}
