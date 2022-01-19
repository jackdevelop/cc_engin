import { User } from '../../../../cc_own/vo/User';

export class UserList {
	public static className = 'UserList';

	
	public static users = new Object();
	
	public static meUserId: number = null;

	
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

	
	public static deleteUser(user_id): User {
		user_id = user_id + '';

		var user = this.users[user_id];
		this.users[user_id] = null;

		return user;
	}

	
	public static deleteAllUser() {
		this.users = {};
	}

	
	
	
	

	
	
	
	public static getUserByUserid(user_id): User {
		user_id = user_id + '';
		var user = this.users[user_id];

		return user;
	}
}
