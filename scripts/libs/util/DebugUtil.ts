export default class DebugUtil {
  public static log(title: any, msg?: any): void {
    if (msg) {
      console.log(
        `%c ${title}%c ${msg}`,
        "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;",
        "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;"
      );
    } else {
      console.log(
        `%c ${title}`,
        "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;"
      );
    }
  }
  public static showDynamicAtlas(status: boolean = true): cc.Node {
    return cc.dynamicAtlasManager.showDebug(status);
  }
  public static showStats(status: boolean = true): void {
    cc.debug.setDisplayStats(status);
  }
  public static setStatsColor(
    font: cc.Color = cc.Color.WHITE,
    background: cc.Color = cc.color(0, 0, 0, 150)
  ) {
    const profiler = cc.find("PROFILER-NODE");
    if (!profiler) return cc.warn("未找到统计面板节点！");
    profiler.children.forEach((node) => (node.color = font));
    let node = profiler.getChildByName("BACKGROUND");
    if (!node) {
      node = new cc.Node("BACKGROUND");
      profiler.addChild(node, cc.macro.MIN_ZINDEX);
      node.setContentSize(profiler.getBoundingBoxToWorld());
      node.setPosition(0, 0);
    }
    const graphics =
      node.getComponent(cc.Graphics) || node.addComponent(cc.Graphics);
    graphics.clear();
    graphics.rect(-5, 12.5, node.width + 10, node.height - 10);
    graphics.fillColor = background;
    graphics.fill();
  }
  public static getDrawCalls(): number {
    return cc.renderer.drawCalls;
  }
}
window["eazax"] && (window["eazax"]["debug"] = DebugUtil);
