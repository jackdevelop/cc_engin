const {ccclass,property} =cc._decorator;

@ccclass
export default class ScreenAdaptation extends cc.Component {
    
    @property(cc.Size)
    private designSiveH: cc.Size = cc.size(1440, 1080);
    private clientSize: cc.Size = cc.size(0, 0);
    
    @property(cc.Size)
    private designSiveV: cc.Size = cc.size(1080, 1920); 
    
    private _screenOrientation: string = "";
    public start() {
        this.changeDesignResolution();
    }
    public update(){
        
        this.changeDesignResolution();
    }
    
    public changeDesignResolution(){
        let size: cc.Size = cc.view.getFrameSize();
        
        if (size.width == this.clientSize.width && size.height == this.clientSize.height) {
            return;
        }
        this.clientSize = cc.size(size.width, size.height);
        
        let proportion: number = (size.width / size.height);
        
        if (proportion >= 1) {
            
            if (proportion >= this.designSiveH.width / this.designSiveH.height) { 
                
                this.node.getComponent(cc.Canvas).designResolution = cc.size(size.width * (this.designSiveH.height / size.height), this.designSiveH.height);
            } else {
                
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.designSiveH.width, size.height * (this.designSiveH.width / size.width));
            }
            if (this._screenOrientation != "H" ) {
                this._screenOrientation = "H";
                
            }
        }else{
            if (proportion >= this.designSiveV.width / this.designSiveV.height) { 
                this.node.getComponent(cc.Canvas).designResolution = cc.size(size.width * (this.designSiveV.height / size.height), this.designSiveV.height);
            } else {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.designSiveV.width, size.height * (this.designSiveV.width / size.width));
            }
            if (this._screenOrientation != "V" ) {
                this._screenOrientation = "V";
            }
        }
    }
}