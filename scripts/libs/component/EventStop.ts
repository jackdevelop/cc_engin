const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/EventStop')
export default class EventStop extends cc.Component {
  
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
      e.stopPropagation();
    });
    this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
      e.stopPropagation();
    });
    this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
      e.stopPropagation();
    });

    this.node.on(cc.Node.EventType.MOUSE_DOWN, function (e) {
      e.stopPropagation();
    });
    this.node.on(cc.Node.EventType.MOUSE_ENTER, function (e) {
      e.stopPropagation();
    });
    this.node.on(cc.Node.EventType.MOUSE_MOVE, function (e) {
      e.stopPropagation();
    });
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, function (e) {
      e.stopPropagation();
    });
  }

  
  

  
}
