import BaseComponent from './BaseComponent'

const { ccclass, property } = cc._decorator

@ccclass
export class BaseService extends BaseComponent {
	// //当前的网络连接名称
	// public networkName:string = null
	// //当前的连接
	// public net:BaseNet = null ;

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////FMS start ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// public server_game_room_enter(ret) {
	//   return true;
	// }

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

	public onDestroy(model) {
		super.onDestroy()
		this.M_FSM = null

		if (this.instance) {
			this.instance = null
		}

		if (model && model.instance) {
			model.instance = null
		}
	}
	// public initNet (
	//     networkName,
	//     servers,
	//     callback
	// ) {
	//     var self = this ;
	//     self.networkName = networkName;
	//
	//     self.closeNet();
	//     var fun = function(data) {
	//         self.m_net_ = data;
	//         if (callback) {
	//             callback(self.m_net_);
	//         }
	//         //连接成功 开始执行心跳
	//         self.head_tick();
	//     };
	//     NetWork.getInstance().init(networkName,servers, fun);
	// }
	//
	// private head_tick () {
	//     var self = object;
	//     if (self.m_net_) {
	//         var callback = function() {
	//             if (self.m_net_) {
	//                 self.m_net_.send("common_head_tick", null, null, null);
	//             }
	//         };
	//         var GameTimer = require("GameTimer");
	//         GameTimer.stoptimer(null, self.__timersrc);
	//         if (isTick == true) self.__timersrc = GameTimer.runtimer(callback, 60);
	//     }
	// }
	// public closeNet (dispatchEvent = false) {
	//     var self = this;
	//     var GameTimer = require("GameTimer");
	//     GameTimer.stoptimer(null, self.__timersrc);
	//
	//     if (self.m_net_) {
	//        cc.log("断开连接：" + self.name);
	//         NetWork.getInstance().closeOne(self.m_net_, dispatchEvent);
	//         self.m_net_ = null;
	//     }
	// }
	// public getNet() {
	//     var self = this;
	//     if (self.isConnect() == true) {
	//         return self.m_net_;
	//     } else {
	//         return null;
	//     }
	// }
	// public isConnect () {
	//     var self = this;
	//     if (self.m_net_ && self.m_net_.isConnect() == true) {
	//         return true;
	//     }
	//     return false;
	// }
	// public getScene () {
	//     var self = object;
	//     var m_scene = null;
	//
	//     var FightScene = require("FightScene_" + self.m_game_id);
	//     if (FightScene) {
	//         m_scene = FightScene.instance;
	//     }
	//     return m_scene;
	// }
}
