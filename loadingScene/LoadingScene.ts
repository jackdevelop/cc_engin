

import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {
  
  private static instance: LoadingScene = null;

  @property(cc.Prefab)
  private toolTipPrefable: cc.Prefab = null;

  private _toolTipScrits: cc.Node = null;

  onLoad() {
    LoadingScene.instance = this;

    
  }
  private init() {
    
    
    
    if (!GameHelp || !GameHelp.getLayerBySceneLayerName) {
      return;
    }

    
    var tipsLayer = GameHelp.getLayerBySceneLayerName(
      GameLayerConstants.LOADING_LAYER
    );

    if (!tipsLayer) {
      return;
    }

    
    var betUIPrefab = cc.instantiate(this.toolTipPrefable);
    tipsLayer.addChild(betUIPrefab);

    betUIPrefab.active = false;
    this._toolTipScrits = betUIPrefab;
    
    
  }

  
  private _getPrefable() {
    var self = this;
    if (self._toolTipScrits == null) {
      self.init();
    } else if (self._toolTipScrits.isValid == false) {
      if (self._toolTipScrits.parent) {
        self._toolTipScrits.destroy();
        self._toolTipScrits = null;
        
      }
      
      self.init();
    }

    return self._toolTipScrits;
  }

  
  public static show() {
    var instance = LoadingScene.instance;
    if (instance) {
      var prefable = instance._getPrefable();
      prefable.active = true;

      
      
      let ani = prefable.getComponent(cc.Animation);
      if (ani) {
        ani.play();
      }
      
      
      
      
      

      
      
      
    }
  }

  
  public static hide() {
    var instance = LoadingScene.instance;
    if (instance) {
      var prefable = instance._getPrefable();
      prefable.active = false;
    }
  }
}
