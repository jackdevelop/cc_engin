import { User } from '../../../../cc_own/vo/User';

export class UserList {
	public static className = 'UserList';

	//用户
	public static users = new Object();
	//自己的 uid
	public static meUserId: number = null;

	//设置用户
	public static setUser(user_id, opts): User {
		let user = this.getUserByUserid(user_id);
		if (!user) {
			user = new User(user_id, opts);
			user_id = user_id + '';
			this.users[user_id] = user;
		} else {
			user.merge(opts);
		}

		return user;
	}

	//删除用户
	public static deleteUser(user_id): User {
		user_id = user_id + '';

		var user = this.users[user_id];
		this.users[user_id] = null;

		return user;
	}

	//删除所有
	public static deleteAllUser() {
		this.users = {};
	}

	//获取用户
	public static getUserByUserid(user_id): User {
		user_id = user_id + '';
		var user = this.users[user_id];

		return user;
	}
}
