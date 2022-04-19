import { TaskType } from "../../../../app/game_sns/planewar/fight/prefab/monster/behaviors/task/TaskFactory";
import TaskMgr from "../../../../app/game_sns/planewar/fight/prefab/monster/behaviors/task/TaskMgr";
import { game_constants_planewar } from "../../../../app/game_sns/planewar/fight/scripts/config/game_constants_planewar";
import { GameMath } from "../utils/GameMath";
import BaseBehavior from "./BaseBehavior";
import BaseTempData from "./BaseTempData";

var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BaseSprite extends cc.Component {
	@property({ type: cc.Integer, tooltip: '当前的类型 ' })
	ITEM_TYPE: number = 0;

	@property({ type: [cc.Prefab], tooltip: '所有的prefab' })
	prefable_arr = [];

	@property({ type: cc.Label, tooltip: '调试显示的 no 序号' })
	txt_debug_no: cc.Label = null;

	@property({ type: cc.Node, tooltip: '发射子弹的位置' })
	node_startpos: cc.Node = null;

	@property({ type: cc.Node, tooltip: 'buff的显示' })
	node_buff: cc.Node = null;

	@property({ type: cc.ProgressBar, tooltip: '血量条' })
	progress_hp: cc.ProgressBar = null;

	/** 所引用的数据实体 */
	protected m_vo = null;

	/** 所有的 bind对象  */
	private m_behaviorObjects_ = null;

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
		m_vo.set_m_entity_state(game_constants_planewar.GAME_OBJ_STATE.INIT);
		this.ITEM_TYPE = m_vo.get_m_item_type();;

		//显示当前的 no  序号
		if (this.txt_debug_no) {
			this.txt_debug_no.string = '' + this.get_m_vo().get_no();
		}

		if (this.node_buff) {
			this.node_buff.removeAllChildren();
		}

		// 先禁用碰撞体
		this.closeCollider();

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
		this.m_vo.set_m_entity_state(game_constants_planewar.GAME_OBJ_STATE.UN_INIT);
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
	 * 通过 prefab_name 获取当前的 prefab
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

	/** 禁用碰撞体 */
	closeCollider() {
		let boxCollider = this.getComponent(cc.BoxCollider);
		if (boxCollider) {
			boxCollider.enabled = false;
		}
		let polygonCollider = this.getComponent(cc.PolygonCollider);
		if (polygonCollider) {
			polygonCollider.enabled = false;
		}
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////子类的一些方法形式///////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 初始化完成后执行
	 */
	onStarted() {
		let coms = this.getComponents(BaseBehavior);
		if (coms) {
			coms.forEach(function (v) {
				if (v && v.bd_onStarted) {
					v.bd_onStarted();
				}
			});
		}
	}

	/**
	 * 重置 从对象池中取出时需要重置属性
	 */
	onReseted(): void {
		this.node.active = false;
		this.__un_init();
		this.set_m_vo(null);
	}

	/** 准备 */
	handleReady() { }

	/** 待机 */
	handleStand() { }

	/**
	 * 碰撞
	 * @param target 碰撞目标
	 */
	handleHit(target: any) { }

	/** 死亡 */
	handleDead() {
		// 先禁用碰撞体
		this.closeCollider();
	}

	/**
	 * 开始攻击
	 * @param angle 攻击角度
	 */
	onFire(angle: number) { }

	/** 结束攻击 */
	onFireEnd() { }

	/**
	 * 血量变化
	 * @param change_num 变化值
	 */
	changeHp(change_num: number) {
		this.call_method("HpBehavior", "bd_hp_change", change_num);
	}

	/**
	 * 设置一次移动行为 是否移动以返回值为准
	 */
	setMoveActive(active: boolean): boolean {
		let m_vo = this.m_vo;
		let temp_data: BaseTempData = m_vo.get_m_temp_data();
		let stop_move_num = temp_data.stop_move_num;
		if (active) {
			stop_move_num--;
			if (stop_move_num < 0) {
				stop_move_num = 0;
			}
		} else {
			stop_move_num++;
		}
		temp_data.stop_move_num = stop_move_num;
		let is_move = m_vo.get_m_ismove();
		return is_move;
	}

	/** 检查是否可以移动 */
	protected getMoveActive() {
		let m_vo = this.m_vo;
		if (this.isAlive() && m_vo.get_m_ismove()) {
			return true;
		}
	}

	/**
	 * 是否存活
	 */
	isAlive(): boolean {
		let m_vo = this.get_m_vo();
		let state = m_vo.get_m_entity_state();
		if (m_vo &&
			m_vo.get_m_active() &&
			state != game_constants_planewar.GAME_OBJ_STATE.DEAD &&
			state != game_constants_planewar.GAME_OBJ_STATE.INIT &&
			state != game_constants_planewar.GAME_OBJ_STATE.UN_INIT
		) {
			return true;
		}
		return false;
	}

	async rotateAngle(angle) {
		let m_obj = this;
		let m_vo = this.m_vo;
		let data = {
			m_obj,
			m_vo,
			angle
		}
		let ret = await TaskMgr.getInst().addTaskAsync(TaskType.TaskRotate, data);
		if (!ret && m_vo.get_m_config_data().is_rotate) {
			m_obj.setRotation(angle);
		}
	}

	private total_time: number = 0;
	private cur_time: number = 0;
	private start_angle: number = 0;
	private end_angle: number = 0;
	protected lateUpdate(dt: number): void {
		if (this.cur_time < this.total_time) {
			this.cur_time += dt;
			let angle = GameMath.Lerp(this.start_angle, this.end_angle, this.cur_time / this.total_time);
			this.setRotation(angle);
		}
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////节点属性设置////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 坐标
	 * @param v
	 */
	public setPosition(
		v: cc.Vec2 | cc.Vec3 | number,
		y?: number,
		z?: number
	): void {
		this.node.setPosition(v, y, z);
	}

	public getPosition(out?: cc.Vec2 | cc.Vec3): cc.Vec2 {
		return this.node.getPosition(out);
	}

	/**
	 *  设置角度
	 * @param angle
	 */
	public setRotation(angle: number) {
		if (_.isNaN(angle)) {
			return;
		}
		this.node.angle = angle - 90;
	}

	public getRotation() {
		let angle = this.node.angle;
		return angle + 90;
	}

	/**
	 *  设置子弹显示隐藏
	 */
	public setVisible(visible = false) {
		if (!visible) {
			this.node.active = false;
		} else {
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
				return script[methodName](...param);
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

}
