import { Room } from "./Room";

/**
 * 牌局中的 房间列表
 */
export class Room_List {
  public static className = "Room_List";
  public static rooms: any = new Object();
  public static meRoomCode = null;
  public static setRoom(opts) {
    if (!opts.room_code) opts.room_code = 1;
    let room_code = opts.room_code;
    let game_id = opts.game_id;
    let room_category = opts.room_category;
    let config = opts["config" + game_id];
    if (this.rooms[room_code]) {
      this.deleteRoom(room_code);
    }
    var room = new Room(room_code, opts);
    this.rooms[room_code] = room;
    return room;
  }
  public static deleteRoom(room_code) {
    var room = this.rooms[room_code];
    this.rooms[room_code] = null;
    if (this.meRoomCode == room_code) {
      this.meRoomCode = null;
    }
    return room;
  }
  public static deleteAllRoom() {}
  public static getRoomByRoomcode(room_code): Room {
    var room = this.rooms[room_code];
    return room;
  }
}
