
import { Room } from './Room';
import { UserList } from './UserList';
var _ = require('Underscore');



export class Room_seat extends Room {

  



  
  public seat_user_ids = [];
  private max_seat: number = 4


  
  public online_ids;
  
  public ready_ids;


  
  private client_room_enter = null


  
  public set_client_room_enter(client_room_enter) {
    this.client_room_enter = client_room_enter;
  }
  public get_client_room_enter() {
    return this.client_room_enter
  }


  
  public game_room_sitdown(seat_id: number, user_id) {
    this.seat_user_ids[seat_id] = user_id;
  }
  public game_room_standup(seat_id: number) {
    this.seat_user_ids[seat_id] = 0;
  }

  
  public get_room_sitdownIdx(user_id) {
    return _.indexOf(this.seat_user_ids, user_id);
  }
  
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
