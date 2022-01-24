





import BaseVo from './BaseVo';


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

	
	private m_vo = null;

	
	private m_behaviorObjects_ = null;
	
	

	
	protected __init(m_vo) {
		if (!m_vo) {
			return;
		}

		this.set_m_vo(m_vo);
		

		
		let m_config_data = m_vo.get_m_config_data();
		this.ITEM_TYPE = m_config_data.item_type;

		
		if (this.txt_debug_no) {
			this.txt_debug_no.string = '' + this.get_m_vo().get_no();
		}

		
		this.__unbind_behavior();
		
		let behaviors = m_vo.get_m_config_data().behaviors;
		this.__init_behaviors(behaviors);
	}

	
	public un_init() {
		this.__un_init();
	}
	private __un_init() {
		this.unschedule(null);
		this.unscheduleAllCallbacks();

		this.__unbind_behavior();
	}

	
	get_m_vo() {
		return this.m_vo;
	}
	set_m_vo(m_vo) {
		this.m_vo = m_vo;
	}

	
	public setPosition(
		v: cc.Vec2 | cc.Vec3 | number,
		y?: number,
		z?: number
	): void {
		if (v) {
			this.node.setPosition(v);
		}
	}
	getPosition(out?: cc.Vec2 | cc.Vec3): cc.Vec2 {
		return this.node.getPosition();
	}

	
	public setAngle(v) {
		if (_.isNaN(v)) return;

		this.node.angle = v;
	}

	
	public setScale(x: number | cc.Vec2 | cc.Vec3, y?: number, z?: number): void {
		this.node.setScale(x, y, z);
	}

	
	public get_prefable_by_name(name: string) {
		let find_obj = _.find(this.prefable_arr, function (v, k) {
			if (v.name == name) {
				return v;
			}
		});

		return find_obj;
	}

	
	
	
	
	
	

	
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

		
		if (!self.m_behaviorObjects_) self.m_behaviorObjects_ = {};
		if (self.m_behaviorObjects_[behaviorName]) return;

		
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

	
	private __unbind_behavior() {
		let self = this;

		
		
		

		cc.log('当前的behavior:', self.m_behaviorObjects_);

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

		
	}

	
	call_method(behaviorComponent: any, methodName, ...param) {
		let self = this;
		let script = this.getComponent(behaviorComponent);
		if (script) {
			if (script[methodName]) {
				return script[methodName](self, self.m_vo, ...param);
			}
		}
	}

	
	
	
	
	
	
	
	
	
	
	

	
	
	

	
	

	
	
	
	
	

	
	
	

	

	
	
	
	

	
	
	
	
	
	
	
	
	

	

	
	
	
	
	
	
	

	
	
	
	
	

	
	

	
	
	

	

	
	
	
	onFireEnd() {}
}
