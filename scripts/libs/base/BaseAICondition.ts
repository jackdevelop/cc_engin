const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseAICondition {
	protected m_vo;
	protected m_obj;

	/**
	 *   初始化方法
	 *   在实例化好 basesprite 以及  m_vo 后
	 *
	 * @param self
	 * @param m_obj
	 * @param m_vo
	 */
	public init(m_obj, m_vo) {
		this.m_vo = m_vo;
		this.m_obj = m_obj;
	}

	// ai执行
	public excude(): boolean {
		return false;
	}
}
