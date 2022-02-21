
const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseBHandle {
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
	 */
	public onStarted() { }

	/**
	 * 结束方法
	 */
	public handStoped() { }

	/**
	 * 每帧更新操作
	 */
	public handleUpdate(dt: number) { }

	/**
	 * 销毁的操作
	 */
	public un_init() { }
}
