import { Round } from './Round';
var _ = require('Underscore');

export class Room {
  public static className = 'Room';

  
  public room_id: number;
  public room_code: number;
  public game_id: number;
  public creator_uid;
  public room_channel;

  public user_ids;



  
  public config: any;


  
  public status;
  public status_data;


  
  
  private m_round: Round = null;


  constructor(room_code: number, opts: any) {
    this.init(room_code, opts);
  }

  
  public init(room_code: number, opts: any) {
    this.room_code = room_code;
    this.merge(opts)
  }
  
  public merge(opts: any) {
    var self = this;
    _.map(opts, function (v, k) {
      self[k] = v;
    });
  }



  
  
  
  

  
  public quite(user_id) {
    this.user_ids = _.without(this.user_ids, user_id);
  }


  
  public set_status(status, status_data) {
    this.status = status
    this.status_data = status_data
  }


  
  
  
  

  
  public init_round(game_id: number, cla) {
    this.m_round = new cla();
    return this.m_round;
  }
  public get_round() {
    return this.m_round;
  }

}
