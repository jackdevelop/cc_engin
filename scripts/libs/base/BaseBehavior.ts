






const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseBehavior extends cc.Component {


    protected m_vo;
    protected m_obj

    
    protected init(obj, m_vo) {
        this.m_vo = m_vo
        this.m_obj = obj
    }
}
