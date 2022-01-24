/**
 * 时间工具
 * @see TimeUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/TimeUtil.ts
 */
export default class TimeUtil {
	//获取当前时间的星期 和小时
	public static get_show_time() {
		var now = new Date()
		var nowTime = now.toLocaleString()
		var date = nowTime.substring(0, 10) //截取日期
		var time = nowTime.substring(10, 20) //截取时间
		var week = now.getDay() //星期
		var hour = now.getHours() //小时

		return { week, hour }
	}

	/**
	 * yyyy-MM-dd HH:mm:ss
	 */
	static getDataByTime(date) {
		if (!date) date = new Date()

		let seperator1 = '-'
		let seperator2 = ':'
		let month = date.getMonth() + 1
		let strDate = date.getDate()
		let currentdate =
			date.getFullYear() +
			seperator1 +
			(month >= 1 && month <= 9 ? '0' : '') +
			month +
			seperator1 +
			(strDate >= 0 && strDate <= 9 ? '0' : '') +
			strDate +
			' ' +
			date.getHours() +
			seperator2 +
			date.getMinutes() +
			seperator2 +
			date.getSeconds()
		return currentdate
	}

	/**
	 * 获取当天指定时间的时间戳
	 * @param hour 时
	 * @param minute 分
	 * @param second 秒
	 * @example
	 * const time = TimeUtil.getTargetTimestamp(10, 20, 30); // 1601259630000
	 * const timeString = new Date(time).toLocaleString(); // "上午10:20:30"
	 */
	public static getTargetTimestamp(
		hour: number = 0,
		minute: number = 0,
		second: number = 0
	): number {
		const start = new Date(new Date().toLocaleDateString()).getTime()
		const target = (hour * 3600 + minute * 60 + second) * 1000
		return new Date(start + target).getTime()
	}

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

	/**
	 * 将毫秒转为时分秒的格式（最小单位为秒，如：”00:01:59“）
	 * @param time 毫秒数
	 * @param separator 分隔符
	 * @param keepHours 当小时数为 0 时依然展示小时数
	 * @example
	 * const HMS = TimeUtil.msToHMS(119000); // "00:01:59"
	 */
	public static msToHMS(
		time: number,
		separator: string = ':',
		keepHours: boolean = true
	): string {
		if (time == null) {
			time = time = new Date().getTime()
		}

		const hours = Math.floor(time / 3600000)
		const minutes = Math.floor((time - hours * 3600000) / 60000)
		const seconds = Math.floor(
			(time - hours * 3600000 - minutes * 60000) / 1000
		)
		const hoursString =
			hours === 0 && !keepHours ? '' : hours.toString().padStart(2, '0')

		return `${hoursString}${separator}${minutes
			.toString()
			.padStart(2, '0')}${separator}${seconds.toString().padStart(2, '0')}`
	}

	/**
	 * 获取当前时间戳
	 */
	public static getCurrentTimestamp(): number {
		return new Date().getTime()
	}

	/**
	 * 根据时分秒获取时间差 获取HH:mm:ss 如果没有小时的话默认mm:ss fixed冒号直接加缀
	 *
	 * @param time  秒
	 * @param isHh
	 * @param fixed
	 */
	static getHHmmss(time?: number, isHh?, fixed = '') {
		if (!time || time <= 0) return { time_str: '00:00' }
		// if (time > 239711525) {
		//   // 1977/8/6 18:32:5 设置大一点表示时间戳进行转换
		//   if (time.toString().length <= 11) time *= 1000;
		//   var date = new Date(time); //直接用 new Date(时间戳) 格式转化获得当前时间
		//   let r: string = '';
		//   let h = date.getHours(); // 60*60 1个小时
		//   let m = date.getMinutes();
		//   let s = date.getSeconds();

		//   //cc.log("dddd", date.toLocaleDateString() + " " + date.toLocaleTimeString());
		//   if (h > 0) {
		//     r = (h > 9 ? '' + h : '0' + h) + fixed + ':';
		//   } else if (isHh) {
		//     // HH
		//     r = '00' + fixed + ':';
		//   }
		//   r += (m > 9 ? '' : '0') + m + fixed + ':' + fixed; // mm
		//   r += (s > 9 ? '' : '0') + s;

		//   return { str: r };
		// }

		// time *= 1000;

		let r: string = ''
		let all_s = Math.floor(time / 3600)
		let d = Math.floor(all_s / 24) //天
		let h = Math.floor(all_s % 24) //小时

		let hY = time % 3600
		let m = Math.floor(hY / 60) //分钟
		let s = Math.floor(hY % 60) //秒

		// if (d > 0) {
		//   r = (h > 9 ? '' + h : '0' + h) + fixed + ':';
		// } else if (isHh) {
		//   // 不够小时  自动补：00
		//   r = '00' + fixed + ':';
		// }

		if (all_s > 0) {
			r = (all_s > 9 ? '' + all_s : '0' + all_s) + fixed + ':'
		} else if (isHh) {
			// 不够小时  自动补：00
			r = '00' + fixed + ':'
		}

		r += (m > 9 ? '' : '0') + m + fixed + ':' + fixed // 分
		r += (s > 9 ? '' : '0') + s //秒

		return { all_s: all_s, time_str: r, d: d, h: h, m: m, s: s }
	}
}

window['eazax'] && (window['eazax']['time'] = TimeUtil)
