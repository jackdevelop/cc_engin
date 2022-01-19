
import { GameLayerConstants } from '../../cc_own/constants/GameLayerConstants';


var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export class ToolTips extends cc.Component {
  
  private static m_instance = null;

  @property({ tooltip: 'prefabe', type: cc.Prefab })
  m_prefable: cc.Prefab = null;
  
  

  @property({ tooltip: '最多创建的数量', type: cc.Integer })
  m_max_num: number = 3;

  @property({ tooltip: '层级', type: cc.Integer })
  m_zorder: number = 2000;

  
  private m_all_item = [];
  private m_current_idx = 0; 
  public m_start_pos; 

  onLoad() {
    ToolTips.m_instance = this;

    let pos = cc.view.getCanvasSize();
    this.m_start_pos = pos.height / 4;
  }

  
  public get_prefab() {
    let self = this;

    let m_prefable = this.m_prefable;
    if (!m_prefable == null) {
      return;
    }

    let m_all_item = this.m_all_item;
    let m_max_num = this.m_max_num;

    
    var canvas = cc.find('Canvas');
    var tipsLayer = canvas.getChildByName(GameLayerConstants.TIP_LAYER);
    if (tipsLayer == null) {
      return;
    }

    
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

    
    if (find_idx) this.m_all_item = _.compact(this.m_all_item);

    
    if (!retobj) {
      if (m_all_item.length < m_max_num) {
        
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

  
  public set_text(retobj, param) {
    var Tips_txt = retobj.getChildByName('Tips_txt');
    if (Tips_txt && Tips_txt.getComponent(cc.RichText)) {
      Tips_txt = Tips_txt.getComponent(cc.RichText);
      Tips_txt.string = param;
      
    }
    let w = Tips_txt.node.width;
    var Tips_bg = retobj.getChildByName('Tips_bg');
    Tips_bg.width = w + 200;
  }

  
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

    
    var action0 = cc.moveTo(0.5, 0, start_pos + 100);
    

    
    var action1_0 = cc.fadeOut(1);
    var action1_1 = cc.moveTo(1, 0, start_pos + start_pos * 2);
    let action1 = cc.spawn([action1_0, action1_1]);

    
    var mycallback = function (target, data) {
      
      
      
      
      retobj.active = false;
      retobj.opacity = 255;
      
    };
    var action2 = cc.callFunc(mycallback, this);

    var actionsArray = [action0, action1, action2];
    retobj.runAction(cc.sequence(actionsArray));
  }

  
  
  

  
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
