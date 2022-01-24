const {ccclass,property} =cc._decorator;

@ccclass
export default class ScreenAdaptation extends cc.Component {
    //横板设计分辨率
    @property(cc.Size)
    private designSiveH: cc.Size = cc.size(1440, 1080);
    private clientSize: cc.Size = cc.size(0, 0);
    //竖版设计分辨率
    @property(cc.Size)
    private designSiveV: cc.Size = cc.size(1080, 1920); 
    /**
    * H 横板 V 竖版 记录当前
    */
    private _screenOrientation: string = "";
    public start() {
        this.changeDesignResolution();
    }
    public update(){
        //检测分辨率 某些环境下对尺寸改变添加回调函数会有严重延时所以放在update检测
        this.changeDesignResolution();
    }
    //对分辨率进行检测
    public changeDesignResolution(){
        let size: cc.Size = cc.view.getFrameSize();
        //未检测到尺寸变化则跳出函数
        if (size.width == this.clientSize.width && size.height == this.clientSize.height) {
            return;
        }
        this.clientSize = cc.size(size.width, size.height);
        //计算当前屏幕比
        let proportion: number = (size.width / size.height);
        //屏占比切换条件 当宽>高 设定为横屏，当然你可以根据实际调整
        if (proportion >= 1) {
            //屏幕和横板设计相比比较宽
            if (proportion >= this.designSiveH.width / this.designSiveH.height) { 
                //重新设定canvas设计分辨率
                this.node.getComponent(cc.Canvas).designResolution = cc.size(size.width * (this.designSiveH.height / size.height), this.designSiveH.height);
            } else {
                //重新设定canvas设计分辨率
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.designSiveH.width, size.height * (this.designSiveH.width / size.width));
            }
            if (this._screenOrientation != "H" ) {
                this._screenOrientation = "H";
                //通知所有需要改变场景变成横屏
            }
        }else{//竖屏处理
            if (proportion >= this.designSiveV.width / this.designSiveV.height) { //屏幕比较宽
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