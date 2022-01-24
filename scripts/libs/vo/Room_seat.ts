
import { Room } from './Room';
import { UserList } from './UserList';
var _ = require('Underscore');


/**
 *  Room_seat
 *   座位相关信息  
 */
export class Room_seat extends Room {

  // public static className = 'Room_seat';



  // /**当前座位上的人**/
  public seat_user_ids = [];//player_ids
  private max_seat: number = 4


  //在线的人物 
  public online_ids;
  //当前准备的人物  
  public ready_ids;


  //标识客户端的当前的房间是否 完成进入 
  private client_room_enter = null


  /**
   *  获取当前用户 是否已经初始化桌面信息 
   * 
   * @param client_room_enter 
   */
  public set_client_room_enter(client_room_enter) {
    this.client_room_enter = client_room_enter;
  }
  public get_client_room_enter() {
    return this.client_room_enter
  }


  /**
   *  某个玩家坐下
   * @param seat_id
   * @param user_id
   */
  public game_room_sitdown(seat_id: number, user_id) {
    this.seat_user_ids[seat_id] = user_id;
  }
  public game_room_standup(seat_id: number) {
    this.seat_user_ids[seat_id] = 0;
  }

  /**
   *  通过 user_id  获取某个座位
   * @param user_id
   */
  public get_room_sitdownIdx(user_id) {
    return _.indexOf(this.seat_user_ids, user_id);
  }
  /**
   *  通过 服务器的 idx 获取客户端的 idx 
   *  以自己为中心点 旋转  
   * @param sitdownIdx 服务器的座位index  
   */
  public get_clientIdx_by_sitdownIdx(sitdownIdx) {
    let clientIdx = sitdownIdx

    let meUserId = UserList.meUserId
    let mypos = this.get_room_sitdownIdx(meUserId);
    if (mypos >= 0) {
      let markPos = sitdownIdx - mypos;
      if (markPos < 0) {
        markPos = markPos + this.max_seat;
      }
      clientIdx = markPos;
    } else {
      cc.log("当前我不在座位上！")
    }

    return clientIdx
  }

}
