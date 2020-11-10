export default class RegexUtil {
  public static isDWORD(string: string): boolean {
    return /[^\x00-\xff]/.test(string);
  }
}
