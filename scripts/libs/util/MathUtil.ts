export default class MathUtil {
  public static getRandomInt(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
  public static getPseudoRandomInt(seed: number, key: number): number {
    return Math.ceil((((seed * 9301 + 49297) % 233280) / 233280) * key);
  }
  public static getAngle(p1: cc.Vec2, p2: cc.Vec2): number {
    return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
  }
  public static getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  public static angleToRadian(angle: number): number {
    return (angle * Math.PI) / 180;
  }
  static radianToAngle(radian: number): number {
    return radian / (Math.PI / 180);
  }
  static pointAtCircle(p: cc.Vec2, radians, radius) {
    let px = p.x;
    let py = p.y;
    return cc.v2(
      px + Math.cos(radians) * radius,
      py - Math.sin(radians) * radius
    );
  }
  static get_p_line_distance(p: cc.Vec2, p_line_0: cc.Vec2, p_line_1: cc.Vec2) {
    let line = p_line_1.sub(p_line_0);
    let p_line = p.sub(p_line_0);
    let p_shadow = p_line.project(line);
    let dot_value = p_line.dot(line);
    let result: number;
    if (dot_value >= 0) {
      if (p_shadow.mag() >= line.mag()) {
        result = p_line.sub(line).mag();
      } else {
        result = p_line.sub(p_shadow).mag();
      }
    } else {
      result = p_line.mag();
    }
    return result;
  }
}
