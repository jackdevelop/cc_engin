/**
 *  LoadingScene.js
 *    过渡场景 
 *
 *  使用：

   var LoadingScene  = require('LoadingScene');
   LoadingScene.show()

 *
 */

import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {
  /**单例实例**/
  private static instance: LoadingScene = null;

  @property(cc.Prefab)
  private toolTipPrefable: cc.Prefab = null;

  private _toolTipScrits: cc.Node = null;

  onLoad() {
    LoadingScene.instance = this;

    // this.init();
  }
  private init() {
    // this.node.on(cc.Node.EventType.TOUCH_START, function(e){
    //     e.stopPropagation();
    // });
    if (!GameHelp || !GameHelp.getLayerBySceneLayerName) {
      return;
    }

    //动态的找到内存
    var tipsLayer = GameHelp.getLayerBySceneLayerName(
      GameLayerConstants.LOADING_LAYER
    );

    if (!tipsLayer) {
      return;
    }

    // var betUIPrefab = PoolManager.requestPoolObj("LoadingChrysanthemumPrefab",LoadingChrysanthemum.instance.toolTipPrefable);
    var betUIPrefab = cc.instantiate(this.toolTipPrefable);
    tipsLayer.addChild(betUIPrefab);

    betUIPrefab.active = false;
    this._toolTipScrits = betUIPrefab;
    //var baseRenderer = betUIPrefab.getComponent("BaseRenderer");
    //baseRenderer.show();
  }

  //获取当前的prefable
  private _getPrefable() {
    var self = this;
    if (self._toolTipScrits == null) {
      self.init();
    } else if (self._toolTipScrits.isValid == false) {
      if (self._toolTipScrits.parent) {
        self._toolTipScrits.destroy();
        self._toolTipScrits = null;
        // self._toolTipScrits.removeFromParent()
      }
      // PoolManager.returnPoolObj("LoadingChrysanthemumPrefab",self._toolTipScrits);
      self.init();
    }

    return self._toolTipScrits;
  }

  /**
   * 显示
   */
  public static show() {
    var instance = LoadingScene.instance;
    if (instance) {
      var prefable = instance._getPrefable();
      prefable.active = true;

      // this.node_loading.node.active = true
      // this.node_loading.play("ani_loading");
      let ani = prefable.getComponent(cc.Animation);
      if (ani) {
        ani.play();
      }
      // var self = LoadingChrysanthemum.instance;
      // self.unscheduleAllCallbacks();
      // var timersrc = function() {
      //   var ToolTips = require("ToolTips");
      //   ToolTips.show(i18n.t("label.21") + "!");

      //   self.hide();
      // };
      // self.scheduleOnce(timersrc, 120);
    }
  }

  /**
   *  隐藏
   */
  public static hide() {
    var instance = LoadingScene.instance;
    if (instance) {
      var prefable = instance._getPrefable();
      prefable.active = false;
    }
  }
}
