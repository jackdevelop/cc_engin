
var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseSprite extends cc.Component {
	@property({ type: cc.Integer, tooltip: '当前的类型 ' })
	ITEM_TYPE: number = 0;

	@property({ type: [cc.Prefab], tooltip: '所有的prefab' })
	prefable_arr = [];

	@property({ type: cc.Label, tooltip: '调试显示的 no 序号' })
	txt_debug_no: cc.Label = null;

	@property({ type: cc.Node, tooltip: 'buff的显示' })
	node_buff: cc.Node = null;

	/** 所引用的数据实体 */
	protected m_vo = null;

	/** 所有的 bind对象  */
	private m_behaviorObjects_ = null;
	/** 所有 bind 的方法 */
	// private m_bindingMethods_ = null;

	/**
	 *  父类的 __init 方法
	 *  子类 不可能修改
	 * @param m_vo
	 * @returns
	 */
	protected __init(m_vo) {
		if (!m_vo) {
			return;
		}

		this.set_m_vo(m_vo);
		// async init(fish_data, path_data, fish_no, ts, parent) {

		// let fish_data = monsterBaseVo.get_m_data()
		let m_config_data = m_vo.get_m_config_data();
		this.ITEM_TYPE = m_config_data.item_type;

		//显示当前的 no  序号
		if (this.txt_debug_no) {
			this.txt_debug_no.string = '' + this.get_m_vo().get_no();
		}

		if (this.node_buff) {
			this.node_buff.removeAllChildren();
		}

		//先删除组件
		this.__unbind_behavior();
		// 开始绑定对象
		let behaviors = m_vo.get_m_config_data().behaviors;
		this.__init_behaviors(behaviors);
	}

	/**
	 *  解除移除
	 */
	public un_init() {
		this.__un_init();
	}
	private __un_init() {
		this.unschedule(null);
		this.unscheduleAllCallbacks();

		this.__unbind_behavior();
	}

	/**
	 *  设置数据实体
	 * @returns
	 */
	get_m_vo() {
		return this.m_vo;
	}
	set_m_vo(m_vo) {
		this.m_vo = m_vo;
	}

	/**
	 *  坐标
	 * @param v
	 */
	public setPosition(
		v: cc.Vec2 | cc.Vec3 | number,
		y?: number,
		z?: number
	): void {
		this.node.setPosition(v, y, z);
	}
	getPosition(out?: cc.Vec2 | cc.Vec3): cc.Vec2 {
		return this.node.getPosition(out);
	}

	/**
	 *  设置角度
	 * @param v
	 */
	public setAngle(v) {
		if (_.isNaN(v)) return;

		this.node.angle = v;
	}

	/**
	 *  设置子弹显示隐藏
	 */
	public setVisible(visible = false) {
		if (!visible) {
			this.node.active = false;
		} else {
			// this.get_m_vo().set_m_entity_state(
			// 	game_constants_planewar.BULLET_STATE.IDEL
			// );
			this.node.active = true;
		}
	}

	/**
	 *  设置缩放
	 * @param x
	 * @param y
	 * @param z
	 * @returns
	 */
	public setScale(x: number | cc.Vec2 | cc.Vec3, y?: number, z?: number): void {
		this.node.setScale(x, y, z);
	}

	/**
	 *  通过 prefab_name 获取当前的 prefab
	 *
	 * @param name
	 * @returns
	 */
	public get_prefable_by_name(name: string) {
		let find_obj = _.find(this.prefable_arr, function (v, k) {
			if (v.name == name) {
				return v;
			}
		});

		return find_obj;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////js的 bind 相关操作///////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 *  初始化 当前的 behaviors
	 * @returns
	 */
	private __init_behaviors(behaviors) {
		let self = this;
		if (!behaviors) return;

		let behaviors_arr = null;
		if (_.isString(behaviors)) {
			behaviors_arr = behaviors.split(',');
		} else {
			behaviors_arr = behaviors;
		}

		_.each(behaviors_arr, function (v, k) {
			if (v != '') {
				self.__bind_behavior(v);
			}
		});
	}

	private __bind_behavior(behaviorName: string) {
		let self = this;

		//首先判断是否能绑定
		if (!self.m_behaviorObjects_) self.m_behaviorObjects_ = {};
		if (self.m_behaviorObjects_[behaviorName]) return;

		// 已经绑定了 此类   不能在绑定
		let behavior = this.getComponent(behaviorName);
		if (!behavior) {
			this.addComponent(behaviorName);
			behavior = this.getComponent(behaviorName);
		}

		if (behavior) {
			behavior.init(self, self.m_vo);
			self.m_behaviorObjects_[behaviorName] = behavior;
		}
	}

	/**
	 *  删除配表中绑定的组件 ,非配表中的直接在prefa上添加的不会删除
	 */
	private __unbind_behavior() {
		let self = this;

		// if (!cc.isValid(this.node)) {
		// 	return;
		// }

		// cc.log('当前的behavior:', self.m_behaviorObjects_);

		if (self.m_behaviorObjects_) {
			let m_behaviorObjects_ = self.m_behaviorObjects_;
			self.m_behaviorObjects_ = null;
			_.each(m_behaviorObjects_, function (v, k) {
				v.un_init();
			});
			_.each(m_behaviorObjects_, function (v, k) {
				self.node.removeComponent(v);
			});
		}

		// this.un_bind_all_method();
	}

	/**
	 *  主动调用某个方法
	 * @param behaviorComponent 行为树的名称
	 * @param methodName 方法名称
	 */
	call_method(behaviorComponent: any, methodName, ...param) {
		let self = this;
		let script = this.getComponent(behaviorComponent);
		if (script) {
			if (script[methodName]) {
				return script[methodName](self, self.m_vo, ...param);
			}
		}
	}

	/**
	 *  所有的 behavior 都调用的方法
	 * @param methodName
	 * @param param
	 */
	protected all_call_method(methodName, ...param) {
		let self = this;

		_.each(self.m_behaviorObjects_, function (script, k) {
			if (script) {
				if (script[methodName]) {
					return script[methodName](self, self.m_vo, ...param);
				}
			}
		});
	}

	// /**
	//  *  开始绑定
	//  * @param behaviorComponent
	//  * @param methodName
	//  * @param method
	//  * @param callOriginMethodLast  优先级 暂时无用
	//  * @returns
	//  */
	// public bind_method(behaviorComponent, methodName, method, callOriginMethodLast) {
	//     let self = this
	//     if (!method) return

	//     //获取出当前的所有绑定 methodName 的方法
	//     if (!self.m_bindingMethods_) self.m_bindingMethods_ = {}
	//     if (!self.m_bindingMethods_[methodName]) self.m_bindingMethods_[methodName] = []

	//     // 全部存储起来  原始方法
	//     self.m_bindingMethods_[methodName].push({ method: method, behaviorComponent: behaviorComponent });

	//     // 组合调用
	//     // 注意 尽量少使用 return 返回参数来接受,因为当多个行为树组件的时候,他只会返回最后一个的 return  结果
	//     let all_method_fun = function (...param) {
	//         let ret = null
	//         _.each(self.m_bindingMethods_[methodName], function (v, k) {

	//             let current_behaviorComponent = v.behaviorComponent
	//             let current_method = v.method
	//             ret = current_method(current_behaviorComponent, self, self.m_vo, ...param)

	//         });

	//         return ret
	//     }
	//     self[methodName] = all_method_fun;
	// }

	// /**
	//  *  卸载绑定的方法
	//  * @param behaviorComponent
	//  * @param methodName
	//  */
	// public un_bind_method(behaviorComponent, methodName) {
	//     let self = this
	//     if (!self.m_bindingMethods_) return
	//     if (!self.m_bindingMethods_[methodName]) return

	//     self.m_bindingMethods_[methodName] = null

	//     //直接先清除方法
	//     let originMethod = self[methodName]
	//     if (!originMethod) {
	//         return
	//     }
	//     self[methodName] = null
	// }

	// /**
	//  *  粗暴直接全部删除绑定的方法
	//  */
	// public un_bind_all_method() {
	// 	let self = this;

	// 	//删除前
	// 	// cc.log("删除前:", self.m_bindingMethods_, self);

	// 	_.each(self.m_bindingMethods_, function (v, k) {
	// 		self[k] = null;
	// 	});

	// 	self.m_bindingMethods_ = null;

	// 	//删除后
	// 	// cc.log("删除后:", self.m_bindingMethods_, self);
	// }
	onFireEnd() { }
}
