// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolManager from '../scripts/libs/pool/PoolManager';

var _ = require('Underscore');

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/BetBaseSprite')
export default class BetBaseSprite extends cc.Component {
  @property({ type: [cc.SpriteFrame], tooltip: '下注多个图片显示' })
  SpriteFrame_bet: Array<cc.SpriteFrame> = [];

  @property({ type: cc.Sprite, tooltip: '图片' })
  spt_bet: cc.Sprite = null;

  //自己内部的 prefable
  private m_prefable: cc.Prefab = null;
  //当前的注金额
  private m_bet_num: number = 0;
  //谁拥有的
  public m_own_user_code: number = null;

  /**单例实例**/
  private static instance: BetBaseSprite = null;
  // use this for initialization
  onLoad() {
    BetBaseSprite.instance = this;
  }

  //初始化
  public init(bet_num: number, own_user_code: number) {
    this.m_bet_num = bet_num;
    this.m_own_user_code = own_user_code;

    // cc.log(bet_num);

    let one = _.find(this.SpriteFrame_bet, function (v) {
      let name = v.name;
      let arr = name.split('_');
      if (arr[arr.length - 1] == bet_num + '') {
        return true;
      }
    });

    //cc.log(one,"xxxxxxxxxxxxxx")
    if (one) {
      this.spt_bet.spriteFrame = one;
    }
  }

  /**
   * 显示
   */
  public static show(parent: cc.Node, prefable: cc.Prefab): void {
    let instance = BetBaseSprite.instance;
    if (instance == null) {
      return;
    }

    // prefable = prefable ||  instance.prefable;
    if (instance.m_prefable == null) {
      instance.m_prefable = prefable;
    }

    if (instance.m_prefable == null) {
      return;
    }

    // var betUIPrefab = cc.instantiate(toolTipPrefable);
    let retobj = PoolManager.requestPoolObj(
      'BetBaseSprite',
      instance.m_prefable
    );
    // betUIPrefab.removeFromParent()
    if (!retobj.getParent()) {
      parent.addChild(retobj);
    } else {
      if (retobj.getParent() != parent) {
        retobj.parent = parent;
      }
    }

    retobj.setPosition(0, 0);
    retobj.opacity = 255;
    let script_bet_sprite = retobj.getComponent('BetBaseSprite');
    // this.node.getComponent()
    return script_bet_sprite;
  }

  //隐藏
  public static hide(retobj): void {
    PoolManager.returnPoolObj('BetBaseSprite', retobj);
    return retobj;
  }
}
