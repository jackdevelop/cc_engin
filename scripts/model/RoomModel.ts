import BaseModel from '../libs/base/BaseModel';
import { Room } from '../libs/vo/Room';
import { Room_match } from '../libs/vo/Room_match';
import { Room_seat } from '../libs/vo/Room_seat';

export class RoomModel extends BaseModel {
	

	
	private static instance: RoomModel = null;
	public static getInstance(): RoomModel {
		if (this.instance == null) {
			this.instance = new RoomModel();
		}
		return this.instance;
	}

	

	
	
	public static meRoomCode = null;

	
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
	
	
	
	
	
	
	
	
	

	
	
	

	
	
	
	
	
	

	

	
	
	
	
	public override delete_item_by_itemid(item_id) {
		super.delete_item_by_itemid(item_id);

		
		if (RoomModel.meRoomCode == item_id) {
			RoomModel.meRoomCode = null;
		}
	}

	
	
	
	
	
	
	
	

	
	
}
