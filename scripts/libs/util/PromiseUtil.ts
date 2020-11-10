export class PromiseUtil {
  public static wait(time: number): Promise<void> {
    return new Promise((res) => cc.Canvas.instance.scheduleOnce(res, time));
  }
  static wait_time(time: number, node: cc.Component) {
    if (node) {
      return new Promise((res) => node.scheduleOnce(res, time));
    } else {
      return new Promise((res) => cc.Canvas.instance.scheduleOnce(res, time));
    }
  }
  static run_by_each_frame(f: () => void, nc: cc.Component, all_count: number) {
    nc.schedule(f, 0, all_count - 1);
  }
  static run_by_interval_frame(
    f: () => void,
    nc: cc.Component,
    all_count: number,
    interval: number
  ) {
    let c = 0;
    let count = null;
    if (all_count) {
      count = (all_count - 1) * interval;
    }
    nc.schedule(
      () => {
        c === 0 && f();
        c += 1;
        c %= interval;
      },
      0,
      count
    );
  }
}
