export class moment_util {
	
	
	public static miao_jishu = 1;
	public static m_server_time = null;
	private static m_client_time = null;

	
	public static get_server_time() {
		let self = moment_util;

		var now = Math.ceil(new Date().getTime() * self.miao_jishu);
		
		if (self.m_server_time) {
			return now - self.m_client_time + self.m_server_time;
		}

		return now;
	}
	
	public static set_server_time(server_time: number) {
		let self = moment_util;
		let t = Math.ceil(new Date().getTime() * self.miao_jishu);
		if (server_time) {
			self.m_server_time = Number(server_time);
		} else {
			self.m_server_time = t;
		}
		self.m_client_time = t;
	}

	
	
	
	

	
	public static get_interval_distance(time) {
		let self = moment_util;
		if (time == null) {
			return null;
		}

		return self.get_server_time() - time;
	}
	
	public static get_time_out_by_server(time, time_out: number) {
		let self = moment_util;
		if (time) {
			time = Number(time);
			var len = (self.get_server_time() - time) * self.miao_jishu; 
			if (len > 0) {
				return Number(time_out - len);
			} else {
			}
			
			
			
			
		}
		return time_out;
	}
	
	
	
	

	
	
	
	
	
	
	
	
	
	

	
	
	

	

	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	

	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
}
