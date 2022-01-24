import { code_constants } from '../../../../cc_own/constants/code_constants';

var _ = require('Underscore');
// import Map = dragonBones.Map;

export class NetWorkHandle_NoNet {
  ///////////////////////////////////////  私有方法 (主要处理服务器的返回 )  ////////////////////////////////////////////////////////////////////////////

  /**处理 处理返回消息
   * @param data
   * @private
   */
  public static hanlde(param, agars) {
    var cmd = param.cmd || param.p || param.n || param.name;
    let ret = {
      code_str: 'SUCCESS',
      code: code_constants.SUCCESS,
      cmd: cmd,
    };

    cc.log('NetWorkHandle_NoNet > ', cmd);
    //过滤公共接口
    switch (cmd) {
      case 'login_by_mobilephone':
        ret.user = {
          avatar: '0',
          devices: '101_chrome_78.0.3904.108_null_13333333333',
          items: [
            { item_id: 100, item_num: 9148 },
            { item_id: 130, item_num: 0 },
            { item_id: 900, item_num: 0 },
          ],
          gender: 1,
          mobilephone: '13333333333',
          nickname: '麻神来了123',
          password: '123456',
          state: 1,
          sysmail_receiveidx: 0,
          token: '2C84F135CB0D94B8F72C58D74133C366',
          type: 1,
          user_code: 972109,
        };

        break;
      default:
        break;
    }

    return ret;
  }
}
