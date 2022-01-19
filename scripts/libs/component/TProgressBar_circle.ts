

import TProgressBar from "./TProgressBar";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('framework/TProgressBar_circle')
export default class TProgressBar_circle extends TProgressBar {
 

  
  setProgress(progress, is_ani = true) {
    

    let self = this;
    if (progress > 1) {
      progress = 1;
    }
    if (progress < 0) {
      progress = 0;
    }

    

    
    
    

    
    
    


    this.node.getComponent(cc.Sprite).fillRange = progress;
    
    
    
  }

  
  getProgress() {
    let progressbar = this.node.getComponent(cc.Sprite).fillRange
    return progressbar;
  }

}
