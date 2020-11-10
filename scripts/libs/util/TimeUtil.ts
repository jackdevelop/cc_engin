export default class TimeUtil {
  public static getTargetTimestamp(
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): number {
    const start = new Date(new Date().toLocaleDateString()).getTime();
    const target = (hour * 3600 + minute * 60 + second) * 1000;
    return new Date(start + target).getTime();
  }
  public static msToHMS(
    time: number,
    separator: string = ":",
    keepHours: boolean = true
  ): string {
    if (time == null) {
      time = time = new Date().getTime();
    }
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time - hours * 3600000) / 60000);
    const seconds = Math.floor(
      (time - hours * 3600000 - minutes * 60000) / 1000
    );
    const hoursString =
      hours === 0 && !keepHours ? "" : hours.toString().padStart(2, "0");
    return `${hoursString}${separator}${minutes
      .toString()
      .padStart(2, "0")}${separator}${seconds.toString().padStart(2, "0")}`;
  }
  public static getCurrentTimestamp(): number {
    return new Date().getTime();
  }
}
window["eazax"] && (window["eazax"]["time"] = TimeUtil);
