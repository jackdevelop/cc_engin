import { Round } from './Round';

var _ = require('Underscore');

export class Room {

  //房间的code
  public room_id: number;
  public room_code: number;
  public game_id: number;
  public creator_uid: number;//房间的创建者id 
  public room_channel: number;

  public user_ids: number[] = [];//房间的人物 
  public ready_ids: number[] = [];



  //房间配置
  public config: any;


  ///////////////////////////////////////////////////////
  public status;// 房价状态 
  public status_data;//房价的状态数据  


  ///////////////////////////////////////////////////////
  //round 配置
  private m_round: Round = null;


  constructor(room_code: number, opts: any) {
    this.init(room_code, opts);
  }

  /**
   *  初始化
   * @param id
   * @param opts
   */
  public init(room_code: number, opts: any) {
    this.room_code = room_code;
    this.merge(opts)
  }
  /**
  *  属性覆盖
  * @param opts
  */
  public merge(opts: any) {
    var self = this;
    _.map(opts, function (v, k) {
      self[k] = v;
    });
  }



  ////////////////////////////////////////////////////////////////////////////
  /////////////////// room 相关 /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  /**
   *  某个用户退出房间 
   * @param user_id 
   */
  public quite(user_id) {
    this.user_ids = _.without(this.user_ids, user_id);
  }


  /**
   *  设置房价的状态 
   * @param status 
   * @param status_data 
   */
  public set_status(status, status_data) {
    this.status = status
    this.status_data = status_data
  }


  ////////////////////////////////////////////////////////////////////////////
  /////////////////// round 相关 /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  /**
   *   设置到某一局的内容
   * @param round_data
   */
  public init_round(game_id: number, cla) {
    this.m_round = new cla();
    return this.m_round;
  }
  public get_round() {
    return this.m_round;
  }

}
