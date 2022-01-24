import { GameConfigUrl } from '../../../../cc_own/config/GameConfigUrl';

var _ = require('Underscore');

export class System_Vo {
  public static className = 'System_Vo';

  //最近登录的服务器
  public static server_list_last_login = null;
  //服务器列表
  private static server_list = null;

  //当前选中的服务器
  public static server_selected = null;

  //设置服务器列表
  public static set_server_list(server_list) {
    this.server_list = server_list;
  }
  public static get_server_list() {
    return this.server_list;
  }
  public static get_server_by_id(sid) {
    let one = _.findWhere(this.server_list, { sid: sid });
    return one;
  }

  //设置当前选中的服务器
  public static set_server_selected_idx(default_server) {
    if (default_server) {
      GameConfigUrl.hall_server_id = default_server.sid;
      GameConfigUrl.hall_Ip = default_server.ip;
      GameConfigUrl.hall_port = default_server.port;

      this.server_selected = default_server;
      return default_server;
    }
  }
  public static get_server_selected() {
    return this.server_selected;
  }

  //获取最近登录的服务器 如果没有则获取第一个sid的
  public static get_last_server() {
    let server_list_last_login = this.server_list_last_login;

    let item = null;
    if (server_list_last_login && server_list_last_login.length >0  ) {
      let one = server_list_last_login[0];
      item = this.get_server_by_id(one.sid);
      if (item) {
        return item;
      }
    }

    if ( this.server_list  &&  this.server_list.length >0) {
      item = this.server_list[0];
    }

    return item;
  }
}
