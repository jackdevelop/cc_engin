import PoolManager from "../scripts/libs/pool/PoolManager";
var _ = require("Underscore");
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("engin/BetBaseSprite")
export default class BetBaseSprite extends cc.Component {
  @property({ type: [cc.SpriteFrame], tooltip: "下注多个图片显示" })
  SpriteFrame_bet: Array<cc.SpriteFrame> = [];
  @property({ type: cc.Sprite, tooltip: "图片" }) spt_bet: cc.Sprite = null;
  private m_prefable: cc.Prefab = null;
  private m_bet_num: number = 0;
  public m_own_user_code: number = null;
  private static instance: BetBaseSprite = null;
  onLoad() {
    BetBaseSprite.instance = this;
  }
  public init(bet_num: number, own_user_code: number) {
    this.m_bet_num = bet_num;
    this.m_own_user_code = own_user_code;
    let one = _.find(this.SpriteFrame_bet, function (v) {
      let name = v.name;
      let arr = name.split("_");
      if (arr[arr.length - 1] == bet_num + "") {
        return true;
      }
    });
    if (one) {
      this.spt_bet.spriteFrame = one;
    }
  }
  public static show(parent: cc.Node, prefable: cc.Prefab): void {
    let instance = BetBaseSprite.instance;
    if (instance == null) {
      return;
    }
    if (instance.m_prefable == null) {
      instance.m_prefable = prefable;
    }
    if (instance.m_prefable == null) {
      return;
    }
    let retobj = PoolManager.requestPoolObj(
      "BetBaseSprite",
      instance.m_prefable
    );
    if (!retobj.getParent()) {
      parent.addChild(retobj);
    } else {
      if (retobj.getParent() != parent) {
        retobj.parent = parent;
      }
    }
    retobj.setPosition(0, 0);
    retobj.opacity = 255;
    let script_bet_sprite = retobj.getComponent("BetBaseSprite");
    return script_bet_sprite;
  }
  public static hide(retobj): void {
    PoolManager.returnPoolObj("BetBaseSprite", retobj);
    return retobj;
  }
}
