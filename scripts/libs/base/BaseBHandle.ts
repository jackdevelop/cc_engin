// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseBHandle extends cc.Component {
	protected m_vo;
	protected m_obj;

	/**
	 *   初始化方法
	 *   在实例化好 basesprite 以及  m_vo 后
	 *
	 * @param self
	 * @param obj
	 * @param m_vo
	 */
	public init(obj, m_vo) {
		this.m_vo = m_vo;
		this.m_obj = obj;
	}

	/**
	 *  onStarted 启动方法 ，在 init之后调用
	 * @param obj
	 * @param m_vo
	 */
	public onStarted(obj, m_vo) {}

	/**
	 *  销毁的操作
	 *
	 */
	public un_init() {}
}
