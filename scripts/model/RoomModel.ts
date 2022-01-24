import BaseModel from '../libs/base/BaseModel';
import { Room } from '../libs/vo/Room';
import { Room_match } from '../libs/vo/Room_match';
import { Room_seat } from '../libs/vo/Room_seat';

export class RoomModel extends BaseModel {
	// public static className = 'RoomModel';

	/**单例实例**/
	private static instance: RoomModel = null;
	public static getInstance(): RoomModel {
		if (this.instance == null) {
			this.instance = new RoomModel();
		}
		return this.instance;
	}

	// public static rooms: any = new Object();

	//我的房间id
	// public static meId = null;
	public static meRoomCode = null;

	/**
	 *  重写父类的设置数据方法
	 * @param item_id
	 * @param opts
	 * @returns
	 */
	public override set_item(item_id, opts) {
		let room = null;

		let room_type = opts.room_type;
		if (room_type) {
			room = new Room_seat(item_id, opts);
		} else {
			room = new Room_match(item_id, opts);
		}

		return super.set_item(item_id, room);
	}
	// // private
	// public static setRoom(opts) {
	// 	if (!opts.room_code) opts.room_code = 1;
	// 	// var roomId = opts.id || opts.rid || opts.roomId || opts.room_id;
	// 	let room_code = opts.room_code; //    0: integer # 房号
	// 	// let game_id = opts.game_id; //  1: integer # 游戏 id
	// 	// let room_category = opts.room_category; //2: integer # 房间类别
	// 	// let config = opts['config' + game_id]; //3: Config1200
	// 	let room_type = opts.room_type;

	// 	if (this.rooms[room_code]) {
	// 		this.deleteRoom(room_code);
	// 	}

	// 	let room = null;
	// 	if (room_type) {
	// 		room = new Room_seat(room_code, opts);
	// 	} else {
	// 		room = new Room_match(room_code, opts);
	// 	}

	// 	this.rooms[room_code] = room;

	// 	return room;
	// }
	//private
	/**
	 *  重写父类方法
	 * @param item_id
	 */
	public override delete_item_by_itemid(item_id) {
		super.delete_item_by_itemid(item_id);

		//如果清除的是自己的房间  吧 RoomModel.meRoomCode 置为 null
		if (RoomModel.meRoomCode == item_id) {
			RoomModel.meRoomCode = null;
		}
	}

	// 	return room;
	// }
	// public static deleteAllRoom() {
	// 	this.rooms = {};
	// }
	// private
	// public static getRoomByRoomcode(room_code): Room {
	// 	var room = this.rooms[room_code];

	// 	return room;
	// }
}
