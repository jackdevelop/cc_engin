const {
  ccclass,
  property,
  requireComponent,
  executeInEditMode,
  menu,
} = cc._decorator;

@ccclass
@menu('framework/TTime_Clock')
export class TTime_Clock extends cc.Component {


  @property({ type: cc.Sprite, tooltip: '目标精灵(推荐sprite 挂载在本节点或子节点)' })
  targetSprite: cc.Sprite = null;


  @property({ type: cc.Integer, tooltip: '计时时长' })
  actionTime: number = 5;


  @property({ type: cc.Integer, tooltip: '起始位置 0~1' })
  startFill: number = 0;


  @property({ tooltip: '是否逆时针' })
  wise: Boolean = false;
  @property({ tooltip: '是否反转' })
  reverse: Boolean = false;


  private _isRuning;
  private _nowTime
  private _endFunc


  onLoad() {
    if (!this.targetSprite) {
      this.targetSprite = this.node.getComponent(cc.Sprite);
      if (this.targetSprite) {
        cc.log('使用默认target sprite');
      } else {
        cc.warn('未设置target sprite');
        return;
      }
    }

    this.targetSprite.type = cc.Sprite.Type.FILLED;
    this.targetSprite.fillType = cc.Sprite.FillType.RADIAL;
    this.targetSprite.fillCenter = new cc.Vec2(0.5, 0.5);
    this.targetSprite.fillStart = this.startFill;

    this.onStop();

    // this.init(5, null)
  }

  /**
  *  初始化 
  * @param repeat  秒数  
  * @param end_callback  回调 
  */
  init(
    repeat: number,
    end_callback: Function
  ) {
    var self = this;
    this.unscheduleAllCallbacks();

    if (repeat <= 0) {
      return;
    }
    this._isRuning = true;
    this.targetSprite.node.active = true;
    this._nowTime = 0;
    this.actionTime = repeat;
    this._endFunc = end_callback;
  }

  //销毁
  onDestroy() {
    this.onStop();
    // this.unscheduleAllCallbacks();
  }

  //关闭
  onStop() {
    this._isRuning = false;
    this._endFunc = null

    if (this.targetSprite && this.targetSprite.node) {
      this.targetSprite.node.active = false;
    }
    this.unscheduleAllCallbacks();
  }




  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////

  update(dt) {
    if (!this._isRuning) {
      return;
    }

    this._nowTime += dt;
    // cc.log(this._nowTime)

    // 将时间转换为百分比，设置给this.sprite的FillRange属性
    let per = this._nowTime / this.actionTime;
    if (per > 1) {
      per = 1;
      this._isRuning = false;
      if (this._endFunc) {
        this._endFunc();
      }
    }

    if (this.reverse) {
      per = 1 - per;
    }

    //  方向
    if (this.wise) {
      per = -per;
    }

    this.targetSprite.fillRange = per;
  }
}
