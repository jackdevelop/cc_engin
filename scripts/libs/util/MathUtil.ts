/**
 * 数学工具
 */
export default class MathUtil {
  /**
   * 获取一个 min 到 max 范围内的随机整数
   * @param min 最小值
   * @param max 最大值
   */
  public static getRandomInt(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * 获取一个伪随机整数
   * @param seed 随机种子
   * @param key key
   */
  public static getPseudoRandomInt(seed: number, key: number): number {
    return Math.ceil((((seed * 9301 + 49297) % 233280) / 233280) * key);
  }

  /**
   * 获取两点间的角度
   * @param p1 点1
   * @param p2 点2
   */
  public static getAngle(p1: cc.Vec2, p2: cc.Vec2): number {
    return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
  }

  /**
   * 获取两点间的距离
   * @param p1 点1
   * @param p2 点2
   */
  public static getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * 将角度转为弧度
   * @param angle 角度
   */
  public static angleToRadian(angle: number): number {
    return (angle * Math.PI) / 180;
  }

  /**
   * 将弧度转换为角度
   * - cc.misc.radiansToDegrees()
   * @param radian
   */
  static radianToAngle(radian: number): number {
    return radian / (Math.PI / 180);
  }

  /**
   * 求圆上一个点的位置  弧度
   *
   * @param px
   * @param py
   * @param radians
   * @param radius
   */
  static pointAtCircle(p: cc.Vec2, radians, radius) {
    let px = p.x;
    let py = p.y;
    return cc.v2(
      px + Math.cos(radians) * radius,
      py - Math.sin(radians) * radius
    );
  }

  /**
   * 计算点到一个线段的最短距离
   * - 注意是线段而非直线
   * - 矢量法
   * @param p
   * @param p0
   * @param p1
   */
  static get_p_line_distance(p: cc.Vec2, p_line_0: cc.Vec2, p_line_1: cc.Vec2) {
    let line = p_line_1.sub(p_line_0); // 线段矢量
    let p_line = p.sub(p_line_0); // 线段起点到外部点矢量
    let p_shadow = p_line.project(line); // 投影矢量
    let dot_value = p_line.dot(line); // 向量点乘值
    let result: number;
    if (dot_value >= 0) {
      // >=0表示夹角为直角或者锐角
      if (p_shadow.mag() >= line.mag()) {
        result = p_line.sub(line).mag();
      } else {
        result = p_line.sub(p_shadow).mag();
      }
    } else {
      // <0表示夹角为钝角
      result = p_line.mag();
    }
    return result;
  }
}
