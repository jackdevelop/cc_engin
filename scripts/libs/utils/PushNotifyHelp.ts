/**
 *  推送的相关 help 类
 *
 */
export class PushNotifyHelp {
  /**
   *   推送
   * @param id
   * @param body
   * @param time 秒数
   */
  public static sendNotify(id: number, body: string, time: number) {
    let last_login_device = '';
    if (cc.sys.isNative) {
      if (cc.sys.platform == cc.sys.WIN32) {
      } else if (cc.sys.platform == cc.sys.MACOS) {
      } else if (cc.sys.platform == cc.sys.ANDROID) {
        last_login_device = jsb.reflection.callStaticMethod(
          'org/cocos2dx/sscq/push/Push',
          'sendNotify',
          '(ILjava/lang/String;Ljava/lang/String;)V',
          id,
          body,
          time
        ); //org.cocos2dx.sscq.util;
      } else {
        last_login_device = jsb.reflection.callStaticMethod(
          'GameHelper',
          'sendNotify'
        );
      }
    } else {
    }
    return last_login_device;
  }
}
