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
  @property({ tooltip: '左右最小边距' })
  padding_x: number = 200;
  @property({ tooltip: '上下最小边距' })
  padding_y: number = 200;

  private zoneWidth = 750;
  private zoneHeight = 1334;
  private zoneLeft = 0;
  private zoneRight = 750;
  private zoneTop = 1334;
  private zoneBottom = 0;

  start() {
    let self = this;
    this.zoneWidth = self.targetMap.width;
    this.zoneHeight = self.targetMap.height;
    this.zoneLeft = this.zone.x - this.zoneWidth + this.padding_x;
    this.zoneRight = this.zone.x + this.zoneWidth - this.padding_x;
    this.zoneTop = this.zone.y + this.zoneHeight - this.padding_y;
    this.zoneBottom = this.zone.y - this.zoneHeight + this.padding_y;
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
      let x = self.targetMap.x + dir.x;
      let y = self.targetMap.y + dir.y;
      if (x < self.zoneLeft) {
        x = self.zoneLeft;
      } else if (x > self.zoneRight) {
        x = self.zoneRight;
      }
      if (y < self.zoneBottom) {
        y = self.zoneBottom;
      } else if (y > self.zoneTop) {
        y = self.zoneTop;
      }
      self.targetMap.x = x;
      self.targetMap.y = y;
    });
  }
}
