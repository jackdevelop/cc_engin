// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// import {GameLayerConstants} from "app/scripts/constants/GameLayerConstants";

// import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';
// import PoolManager from '../scripts/libs/pool/PoolManager';
import { ImageLoader } from '../scripts/libs/utils/ImageLoader';
import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { ToolTips } from '../tooltips/ToolTips';
import { PromiseUtil } from '../scripts/libs/util/PromiseUtil';
// import { GameHelp } from '../../../../TOOL/_in__/scripts/libs/utils/FadeUIPlugin';

var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export class ToolTipsFlycoin extends ToolTips {
  /**单例实例**/
  private static instance = null;

  @property({tooltip: '是否自动销毁 ImageLoader 资源' })
  GAME_AUTO_CLEAN: boolean = true;

  onLoad() {
    ToolTipsFlycoin.instance = this;

    let pos = cc.view.getCanvasSize();
    this.m_start_pos = pos.height / 4;
  }

  /**
   * 设置 文本 相关信息
   *
   * @param retobj
   * @param str
   */
  public set_text(retobj, param) {
    if (!retobj) {
      return;
    }

    let item_icon = param.item_icon;
    let item_num = param.item_num || 0;
    let item_text = param.item_text;

    //设置文本
    if (retobj.getChildByName('Tips_txt')) {
      var Tips_txt = retobj.getChildByName('Tips_txt').getComponent(cc.Label);
      Tips_txt.string = item_text;
      // Tips_txt._forceUpdateRenderData(true);
    }

    //设置图标
    this.setAvatar(retobj, item_icon);
  }

  //设置头像
  public async setAvatar(retobj, item_icon) {
    if (retobj.getChildByName('Tips_icon')) {
      var Tips_icon = retobj
        .getChildByName('Tips_icon')
        .getComponent(cc.Sprite);

      if (Tips_icon) {
        if (item_icon) {
          // Tips_icon.
          let spriteFrame = await ImageLoader.load(
            item_icon,
            null,
            Tips_icon,
            this.GAME_AUTO_CLEAN
          );
          // if (Tips_icon) {
          // Tips_icon.spriteFrame = spriteFrame;
          Tips_icon.node.active = true;
          // }
        } else {
          // Tips_icon.node.active = false;
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////静态方法///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //显示所有
  public static async showAll(arr_param) {
    let self = this;

    if (arr_param) {
      for (let index = 0; index < arr_param.length; index++) {
        const one_element = arr_param[index];
        ToolTipsFlycoin.show(one_element);
        await PromiseUtil.wait_time(0.2, null);
      }
    }
  }
  //显示
  public static show(one_element): void {
    if (!one_element) {
      return;
    }

    let instance = ToolTipsFlycoin.instance;
    if (instance == null) {
      cc.log('no ToolTips instance ');
      return;
    }

    let retobj = instance.get_prefab();
    if (retobj) {
      instance.set_text(retobj, one_element);
      instance.set_action(retobj);
    }
    return retobj;
  }

  /**
   *  外部 自定义显示
   */
  public static showCustom(): void {
    let instance = ToolTipsFlycoin.instance;
    if (instance == null) {
      cc.log('no ToolTips instance ');
      return;
    }

    let retobj = instance.get_prefab();
    return retobj;
  }
}
