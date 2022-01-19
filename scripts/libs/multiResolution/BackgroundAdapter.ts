


const { ccclass, property, requireComponent, executeInEditMode, menu } = cc._decorator;



@ccclass
@menu("engin/BackgroundAdapter")
export default class BackgroundAdapter extends cc.Component {
    onLoad() {
        
        
        
        
        
        
        
        
        
        

        
        
        let srcScaleForShowAll = Math.min(cc.view.getCanvasSize().width / this.node.width, cc.view.getCanvasSize().height / this.node.height);
        let realWidth = this.node.width * srcScaleForShowAll;
        let realHeight = this.node.height * srcScaleForShowAll;

        
        this.node.scale = Math.max(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight);

        
        

        
        
        
        
        
    }
}
