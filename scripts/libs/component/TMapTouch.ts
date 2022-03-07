// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('framework/TMapTouch')
export default class TMapTouch extends cc.Component {
  @property(cc.Node)
  zone: cc.Node = null;

  @property(cc.Node)
  targetMap: cc.Node = null;

  @property({ tooltip: '是否可以拖动 ' })
  is_touch: boolean = false;

  // LIFE-CYCLE CALLBACKS:

  // private _originW:number = 0;
  // private _originH:number = 0;

  // onResizeClicked(){
  //     var canvas = cc.find('Canvas');
  //     this.zone.width = Math.random() * (canvas.width - 640) + 640;
  //     this.zone.height = this.zone.width / 2;
  // }

  // onLoad(){
  //     this._originW = this.zone.width;
  //     this._originH = this.zone.height;
  // }
  //
  // onReset(){
  //     this.zone.width = this._originW;
  //     this.zone.height = this._originH;
  //     this.targetMap.x = 0;
  //     this.targetMap.y = 0;
  // }
  // start () {
  //     let self = this;
  //     this.targetMap.on(cc.Node.EventType.TOUCH_MOVE,function(event:cc.Event.EventTouch){
  //         let pre = event.getPreviousLocation();
  //         let cur = event.getLocation();
  //         var dir = cur.sub(pre);
  //         self.targetMap.x += dir.x;
  //         self.targetMap.y += dir.y;
  //         //判断左边距离
  //         var zoneLeft = self.zone.x - self.zone.width / 2 ;
  //         var zoneRight = self.zone.x + self.zone.width / 2   ;
  //         var zoneTop = self.zone.y + self.zone.height / 2;
  //         var zoneBottom = self.zone.y - self.zone.height / 2;
  //
  //         var halfMapWidth = self.targetMap.width / 2   ;
  //         var halfMapHeight = self.targetMap.height / 2  + 20 ;
  //
  //
  //
  //
  //         //左边
  //         if(self.targetMap.x - halfMapWidth   > zoneLeft){
  //             self.targetMap.x = zoneLeft + halfMapWidth;
  //         }
  //
  //
  //         // //右边
  //         // if(self.targetMap.x + halfMapWidth  < zoneRight){
  //         //     self.targetMap.x = zoneRight - halfMapWidth  ;
  //         // }
  //
  //
  //         //上边
  //         if(self.targetMap.y + halfMapHeight < zoneTop){
  //             self.targetMap.y = zoneTop - halfMapHeight;
  //         }
  //         //下边
  //         if(self.targetMap.y - halfMapHeight > zoneBottom){
  //             self.targetMap.y = zoneBottom + halfMapHeight;
  //         }
  //     });
  // }

  start() {
    //左右最多能滑动的距离
    let dis = 300;

    let self = this;
    this.targetMap.on(
      cc.Node.EventType.TOUCH_START,
      function (event) {
        if (!self.is_touch) {
          return;
        }

        event.stopPropagation();
      },
      this,
      true
    );
    this.targetMap.on(cc.Node.EventType.TOUCH_MOVE, function (
      event: cc.Event.EventTouch
    ) {
      if (!self.is_touch) {
        return;
      }

      let pre = event.getPreviousLocation();
      let cur = event.getLocation();
      var dir = cur.sub(pre);
      self.targetMap.x += dir.x;
      self.targetMap.y += dir.y;
      //判断左边距离
      var zoneLeft = self.zone.x - self.zone.width / 2;
      var zoneRight = self.zone.x + self.zone.width / 2;
      var zoneTop = self.zone.y + self.zone.height / 2;
      var zoneBottom = self.zone.y - self.zone.height / 2;

      var halfMapWidth = self.targetMap.width / 2;
      var halfMapHeight = self.targetMap.height / 2 + dis;

      //左边
      if (self.targetMap.x > dis) {
        self.targetMap.x = dis;
      }

      // //右边
      // if(self.targetMap.x + halfMapWidth  < zoneRight){
      //     self.targetMap.x = zoneRight - halfMapWidth  ;
      // }
      if (self.targetMap.x + self.targetMap.width < self.zone.width - dis) {
        self.targetMap.x = self.zone.width - dis - self.targetMap.width;
      }

      //上边
      if (self.targetMap.y + halfMapHeight < zoneTop) {
        self.targetMap.y = zoneTop - halfMapHeight;
      }
      //下边
      if (self.targetMap.y - halfMapHeight > zoneBottom) {
        self.targetMap.y = zoneBottom + halfMapHeight;
      }
    });
  }
}
