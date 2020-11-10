export class moment_util {
  private static miao_jishu = 0.001;
  public static m_server_time = null;
  private static m_client_time = null;
  public static get_server_time() {
    let self = moment_util;
    var now = Math.ceil(new Date().getTime() * self.miao_jishu);
    if (self.m_server_time) {
      return now - self.m_client_time + self.m_server_time;
    }
    return now;
  }
  public static set_server_time(server_time: number) {
    let self = moment_util;
    let t = Math.ceil(new Date().getTime() * self.miao_jishu);
    if (server_time) {
      self.m_server_time = Number(server_time);
    } else {
      self.m_server_time = t;
    }
    self.m_client_time = t;
  }
  public static get_interval_distance(time) {
    let self = moment_util;
    if (time == null) {
      return null;
    }
    return self.get_server_time() - time;
  }
  public static get_time_out_by_server(time, time_out: number) {
    let self = moment_util;
    if (time) {
      time = Number(time);
      var len = (self.get_server_time() - time) * self.miao_jishu;
      if (len > 0) {
        return Number(time_out - len);
      }
    }
    return time_out;
  }
  public static get_show_time() {
    var now = new Date();
    var nowTime = now.toLocaleString();
    var date = nowTime.substring(0, 10);
    var time = nowTime.substring(10, 20);
    var week = now.getDay();
    var hour = now.getHours();
    return { week, hour };
  }
  static getDataByTime(date) {
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let currentdate =
      date.getFullYear() +
      seperator1 +
      (month >= 1 && month <= 9 ? "0" : "") +
      month +
      seperator1 +
      (strDate >= 0 && strDate <= 9 ? "0" : "") +
      strDate +
      " " +
      date.getHours() +
      seperator2 +
      date.getMinutes() +
      seperator2 +
      date.getSeconds();
    return currentdate;
  }
  static getHHmmss(time?: number, isHh?, fixed = "") {
    if (!time || time <= 0) return { time_str: "00:00" };
    let r: string = "";
    let all_s = Math.floor(time / 3600);
    let d = Math.floor(all_s / 24);
    let h = Math.floor(all_s % 24);
    let hY = time % 3600;
    let m = Math.floor(hY / 60);
    let s = Math.floor(hY % 60);
    if (all_s > 0) {
      r = (all_s > 9 ? "" + all_s : "0" + all_s) + fixed + ":";
    } else if (isHh) {
      r = "00" + fixed + ":";
    }
    r += (m > 9 ? "" : "0") + m + fixed + ":" + fixed;
    r += (s > 9 ? "" : "0") + s;
    return { all_s: all_s, time_str: r, d: d, h: h, m: m, s: s };
  }
}
