import BaseModel from '../libs/base/BaseModel';
import { Room } from '../libs/vo/Room';

export class RoomModel extends BaseModel<Room> {

	/**单例实例**/
	private static instance: RoomModel = null;
	public static getInstance(): RoomModel {
		if (this.instance == null) {
			this.instance = new RoomModel();
		}
		return this.instance;
	}

	//我的房间id
	public static meRoomId: number = null;

	/**
	 *  重写父类的设置数据方法
	 * @param item_id
	 * @param opts
	 * @returns
	 */
	public override set_item(item_id, opts) {
		let room = new Room(item_id, opts);
		return super.set_item(item_id, room);
	}

	/**
	 *  重写父类方法
	 * @param item_id
	 */
	public override delete_item_by_itemid(item_id: number) {
		let room = super.delete_item_by_itemid(item_id);
		// 清除自己的房间
		if (RoomModel.meRoomId == item_id) {
			RoomModel.meRoomId = null;
		}
		return room;
	}
}
