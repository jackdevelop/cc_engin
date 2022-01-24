// import PoolManager from '../scripts/libs/pool/PoolManager';
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';
// import { GameHelp } from '../scripts/libs/utils/GameHelp';

var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export class ToolTips extends cc.Component {
  /**单例实例**/
  private static m_instance = null;

  @property({ tooltip: 'prefabe', type: cc.Prefab })
  m_prefable: cc.Prefab = null;
  // @property({ tooltip: 'requestPoolObj 缓存池中的名字 ' })
  // m_requestPoolObj_name: string = null;

  @property({ tooltip: '最多创建的数量', type: cc.Integer })
  m_max_num: number = 3;

  @property({ tooltip: '层级', type: cc.Integer })
  m_zorder: number = 2000;

  //存储所有的实例化的
  private m_all_item = [];
  private m_current_idx = 0; //当前寻找的 index
  public m_start_pos; //当前的起步坐标

  onLoad() {
    ToolTips.m_instance = this;

    let pos = cc.view.getCanvasSize();
    this.m_start_pos = pos.height / 4;
  }

  //获取某一个有用的 prefab
  public get_prefab() {
    let self = this;

    let m_prefable = this.m_prefable;
    if (!m_prefable == null) {
      return;
    }

    let m_all_item = this.m_all_item;
    let m_max_num = this.m_max_num;

    // var Canvas = cc.director.getScene().getChildByName('Canvas');
    var canvas = cc.find('Canvas');
    var tipsLayer = canvas.getChildByName(GameLayerConstants.TIP_LAYER);
    if (tipsLayer == null) {
      return;
    }

    //找出当前的
    let find_idx = null;
    let retobj = _.find(this.m_all_item, function (v, k) {
      if (v) {
        let isValid = v.isValid;
        let active = v.active;

        if (isValid) {
          if (!active) {
            retobj = v;
            self.m_current_idx = k;

            return v;
          }
        } else {
          v.destroy();
          self.m_all_item[k] = null;
          find_idx = true;
        }
      }
    });

    //删除掉 为 null 的一些资源
    if (find_idx) this.m_all_item = _.compact(this.m_all_item);

    //当当前没找到 且小于最大的长度
    if (!retobj) {
      if (m_all_item.length < m_max_num) {
        // retobj = PoolManager.requestPoolObj(this.m_requestPoolObj_name || "ToolTipsPrefab", this.m_prefable);
        retobj = cc.instantiate(this.m_prefable);
        this.m_all_item.push(retobj);
        tipsLayer.addChild(retobj, this.m_zorder);

        self.m_current_idx = -1;
      } else {
        self.m_current_idx++;
        if (self.m_current_idx >= this.m_all_item.length) {
          self.m_current_idx = 0;
        }
        retobj = this.m_all_item[self.m_current_idx];
      }
    }

    return retobj;
  }

  /**
   * 设置 文本 相关信息
   *
   * @param retobj
   * @param str
   */
  public set_text(retobj, param) {
    var Tips_txt = retobj.getChildByName('Tips_txt');
    if (Tips_txt && Tips_txt.getComponent(cc.RichText)) {
      Tips_txt = Tips_txt.getComponent(cc.RichText);
      Tips_txt.string = param;
      // Tips_txt._forceUpdateRenderData(true);
    }
    let w = Tips_txt.node.width;
    var Tips_bg = retobj.getChildByName('Tips_bg');
    Tips_bg.width = w + 200;
  }

  /**
   *  执行动画
   * @param retobj
   */
  public set_action(retobj) {
    let start_pos = this.m_start_pos;
    retobj.stopAllActions();
    retobj.setPosition(0, start_pos);
    retobj.opacity = 255;
    retobj.active = true;

    cc.tween(retobj)
      .to(0.5, { position: cc.v2(0, start_pos + 100) })
      .to(1, { opacity: 0, position: cc.v2(0, start_pos + start_pos * 2) })
      .call(() => { retobj.active = false; retobj.opacity = 255; })
      .start();
    return;

    //第一个
    var action0 = cc.moveTo(0.5, 0, start_pos + 100);
    // action0.easing(cc.easeOut(1.0));

    //第二个
    var action1_0 = cc.fadeOut(1);
    var action1_1 = cc.moveTo(1, 0, start_pos + start_pos * 2);
    let action1 = cc.spawn([action1_0, action1_1]);

    //第二个
    var mycallback = function (target, data) {
      //这个回调函数会收到两个参数
      //第一个是回调这个函数的组件所在的节点 即this.node
      //第二个是我们传进来的参数对象了{a:'cocos',b:'creator'},
      // tipsLayer.removeChild(betUIPrefab);
      retobj.active = false;
      retobj.opacity = 255;
      // PoolManager.returnPoolObj("ToolTipsPrefab", retobj);
    };
    var action2 = cc.callFunc(mycallback, this);

    var actionsArray = [action0, action1, action2];
    retobj.runAction(cc.sequence(actionsArray));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////静态方法///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   *  显示
   * @param str
   */
  public static show(one_element): void {
    if (!one_element) {
      return;
    }

    let instance = ToolTips.m_instance;
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
    let instance = ToolTips.m_instance;
    if (instance == null) {
      cc.log('no ToolTips instance ');
      return;
    }

    let retobj = instance.get_prefab();
    return retobj;
  }
}
