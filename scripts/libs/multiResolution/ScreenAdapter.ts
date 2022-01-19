


const { ccclass } = cc._decorator;


@ccclass
export default class ScreenAdapter extends cc.Component {
  protected onLoad() {
    
    cc.view.setResizeCallback(() => this.onResize());
  }

  protected start() {
    
    this.adapt();
  }

  
  private onResize() {
    
    
    
    
    this.adapt();
  }

  
  private adapt() {
    
    let screenRatio = cc.winSize.width / cc.winSize.height;
    
    let designRatio =
      cc.Canvas.instance.designResolution.width /
      cc.Canvas.instance.designResolution.height;
    
    if (screenRatio <= 1) {
      
      if (screenRatio <= designRatio) {
        this.setFitWidth();
      } else {
        
        
        this.setFitHeight();
      }
    } else {
      
      this.setFitHeight();
    }
  }

  
  private setFitHeight() {
    cc.Canvas.instance.fitHeight = true;
    cc.Canvas.instance.fitWidth = false;
  }

  
  private setFitWidth() {
    cc.Canvas.instance.fitHeight = false;
    cc.Canvas.instance.fitWidth = true;
  }
}
