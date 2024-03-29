export class HotUpdateModule {
  public static OnUpdateProgress = 'HotUpdateModule_Msg_OnUpdateProgress'; //进度
  public static OnGetVersionInfo = 'HotUpdateModule_Msg_OnGetVersionInfo';
  public static OnTipUpdateVersion = 'HotUpdateModule_Msg_OnTipUpdateVersion';

  public static OnUpdateVersion_CanRetry =
    'HotUpdateModule_Msg_OnUpdateVersion_CanRetry'; //可以重试

  public static OnUpdateVersion_SUCCESS =
    'HotUpdateModule_Msg_OnUpdateVersionResult_SUCCESS';
  public static OnUpdateVersionResult_FAILED =
    'HotUpdateModule_Msg_OnUpdateVersionResult_FAILED';
}
