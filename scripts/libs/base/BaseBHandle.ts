






const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseBHandle extends cc.Component {
	protected m_vo;
	protected m_obj;

	
	public init(obj, m_vo) {
		this.m_vo = m_vo;
		this.m_obj = obj;
	}
}
