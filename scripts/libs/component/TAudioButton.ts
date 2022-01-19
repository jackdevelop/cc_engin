import { AudioManager } from '../manager/AudioManager';
import menu = cc._decorator.menu;
import disallowMultiple = cc._decorator.disallowMultiple;
import GameManger from '../../../gamemanager/GameManger';

const { ccclass, property } = cc._decorator;

@ccclass
@menu('framework/TAudioButton')
@disallowMultiple()
export default class TAudioButton extends cc.Component {
  
  

  
  @property({ type: cc.AudioClip, tooltip: '禁止连续点击' })
  SOUND_STR_BUTTON: cc.AudioClip = null; 

  onLoad() {
    
    
    

    this._registerEvent();
  }

  _registerEvent() {
    
    
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    

    
    
  }
  
  
  
  
  
  
  
  _onTouchEnded(event) {
    var self = this;

    
    
    
    
    
    
    
    
    
    
    

    
    let str = self.SOUND_STR_BUTTON;
    if (!str && GameManger.instance) {
      str = GameManger.instance.sound_click;
    }

    AudioManager.getInstance().playSFX(str, null);
    
    
  }
  
  
  
  
  
  
  
  
  

  onDestroy() {
    this.unscheduleAllCallbacks();
    
    
    
    

    
    

    this.node.targetOff(this);
  }
}
