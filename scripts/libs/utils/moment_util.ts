export class moment_util {
	/**
	 *
	 * 获取当前服务器时间
	 *
	 */
	// private static miao_jishu = 0.001; //是否以秒作为单位
	public static miao_jishu = 1;
	public static m_server_time = null;
	private static m_client_time = null;

	//获取服务器时间 秒数
	public static get_server_time() {
		let self = moment_util;

		var now = Math.ceil(new Date().getTime() * self.miao_jishu);
		//cc.log(now)
		if (self.m_server_time) {
			return now - self.m_client_time + self.m_server_time;
		}

		return now;
	}
	//设置 服务器时间  注意是秒 不是毫秒
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

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////时间操作//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//获取当前距离游戏启动时候的距离  注意是秒 不是毫秒
	public static get_interval_distance(time) {
		let self = moment_util;
		if (time == null) {
			return null;
		}

		return self.get_server_time() - time;
	}
	//根据传进的时间，以及倒计时间，获取在当前还距离多久
	public static get_time_out_by_server(time, time_out: number) {
		let self = moment_util;
		if (time) {
			time = Number(time);
			var len = (self.get_server_time() - time) * self.miao_jishu; //转化为秒
			if (len > 0) {
				return Number(time_out - len);
			} else {
			}
			//cc.log(time, self.get_server_time(), len, time_out);
			// 1532344096 1532344083 "1532344053"
			// Util_client.js:107 1532344096 1532344083 "1532344053"
			// Util_client.js:123 1532344065 "131532344053" 129999999988 25
		}
		return time_out;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////获取时间//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// /**
	//  *   当前时间格式化
	//  * @param {string} format
	//  * @param {number} time 毫秒
	//  * @returns {string}
	//  */
	// public static format(format: string, time: number) {
	//   if (time == null) {
	//     time = time = new Date().getTime();
	//   }

	//   if (format == null) {
	//     format = 'hh:mm'; // "YY-MM-DD hh:mm:ss";
	//   }

	//   var date = new Date(time);

	//   var year = date.getFullYear(),
	//     month = date.getMonth() + 1, //月份是从0开始的
	//     day = date.getDate(),
	//     hour = date.getHours(),
	//     min = date.getMinutes(),
	//     sec = date.getSeconds();
	//   var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
	//     return '0' + index;
	//   }); ////开个长度为10的数组 格式为 00 01 02 03

	//   var newTime = format
	//     .replace(/YY/g, year)
	//     .replace(/MM/g, preArr[month] || month)
	//     .replace(/DD/g, preArr[day] || day)
	//     .replace(/hh/g, preArr[hour] || hour)
	//     .replace(/mm/g, preArr[min] || min)
	//     .replace(/ss/g, preArr[sec] || sec);

	//   return newTime;
	// }

	// /** 根据年月日时分秒获取时间戳 格式 yyyy-MM-dd HH:mm:ss yyyy/MM/dd HH:mm:ss  */
	// static getTimestamp(d, isMillisecond = false) {
	//   if (d == null) return 0;
	//   if (typeof d == 'number') {
	//     if (!isMillisecond && d > 10000000000) return d / 1000;
	//     if (isMillisecond && d < 10000000000) return d * 1000;
	//     return d;
	//   }
	//   if (d == '') return 0;
	//   if (d.indexOf('/') == -1 && d.indexOf('-') == -1) return 0; // 必须包含年月日 时  时可以没有 但是必须有 空格
	//   let ttt = new Date(d.replace(new RegExp('-', 'gm'), '/')).getTime();
	//   return isMillisecond ? ttt : ttt / 1000;
	// }
}
