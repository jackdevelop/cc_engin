export default class NodeUtil {
  public static getRelativePosition(node: cc.Node, target: cc.Node): cc.Vec2 {
    const worldPos = (node.getParent() || node).convertToWorldSpaceAR(
      node.getPosition()
    );
    return target.convertToNodeSpaceAR(worldPos);
  }
  public static isPosOnNodeRect(pos: cc.Vec2, target: cc.Node): boolean {
    const rect = target.getBoundingBoxToWorld();
    return rect.contains(pos);
  }
  public static areNodesOverlap(
    node1: cc.Node,
    node2: cc.Node,
    contains: boolean = false
  ): boolean {
    const rect2 = node2.getBoundingBoxToWorld();
    const rect1 = node1.getBoundingBoxToWorld();
    return contains ? rect2.containsRect(rect1) : rect2.intersects(rect1);
  }
}
