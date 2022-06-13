const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseAIHandle {
	protected m_vo;
	protected m_obj;

	/**
	 * 初始化方法
	 */
	public init(m_obj, m_vo) {
		this.m_vo = m_vo;
		this.m_obj = m_obj;
	}

	// ai执行
	public excude(param: string): boolean {
		return false;
	}
}
