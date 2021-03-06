import { GameMath } from "./GameMath";
export default class PositionExtension {
  static get_node_world_position(node: cc.Node, pos: cc.Vec2): cc.Vec2 {
    return node.convertToWorldSpaceAR(pos || cc.Vec2.ZERO);
  }
  static convertToNodeSpaceAR(source, traget, x, y) {
    var newVec1 = source.parent.convertToWorldSpaceAR(cc.v2(x || 0, y || 0));
    var newVec2 = traget.convertToNodeSpaceAR(newVec1);
    return newVec2;
  }
  static touchLocationConvertToNodeSpaceAR(touch_location, layer) {
    if (!layer) {
      layer = cc.find("Canvas");
    }
    var location = layer.convertToNodeSpaceAR(touch_location);
    return location;
  }
  static dist(ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
