/**
 *   DateExtension
 *  日期相关的处理  
 *  
 */
export class DateExtension {


	/**
	 *  根据日期的字符串转化为 date 
	 * @param fullString   format:"1999-09-09 09:09:09"
	 * @returns 
	 */
	public static getDateFromString(fullString: string) {
		let date = new Date();
		if (fullString) {
			date = new Date(fullString);
		}
		return date;
	}

	/**
	 *  获取 n天前或者n天后的日期   
		console.log("一月前："+getNextDateByCount(-30));
		console.log("三月后："+getNextDateByCount(90));

	 * @param AddDayCount 多少天后  
	 * @param dd  日期基准 
	 * @returns 
	 */
	public static getNextDateByCount(AddDayCount, dd: Date) {
		if (!dd) {
			dd = new Date();
		}

		dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
		// var y = dd.getFullYear();
		// var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
		// var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
		// return y + "-" + m + "-" + d;
		return dd;
	}






	/**
	 *  邮件逻辑  
	 * 
	 * @param data 
	 * @returns 
	 */
	public static getLimitDesc(data: { createTime: string, expireTime: string }) {
		let create_date = DateExtension.getDateFromString(data.createTime);
		// 30 天过期 
		let expire_date = DateExtension.getDateFromString(data.expireTime);
		expire_date = DateExtension.getNextDateByCount(30, create_date);
		let str = `${create_date.toLocaleDateString()}(${this.getDiffDateStringByDate(create_date, expire_date) || '已'}过期)`;
		return str;
	}

	public static getDiffDateStringByDate(start: Date, end: Date) {
		let diffTime = 0;
		let startTime = start.getTime();
		let endTime = end.getTime();
		diffTime = endTime - startTime;
		let str = this.getDiffDateStringByTime(diffTime);
		return str;
	}

	public static getDiffDateStringByTime(diffTime: number) {
		if (diffTime <= 0) {
			return '';
		}
		const C_Second = 1000;
		const C_Minute = C_Second * 60;
		const C_Hour = C_Minute * 60;
		const C_Day = C_Hour * 24;
		const C_Month = C_Day * 30;
		const C_Year = C_Month * 12;
		let year = diffTime / C_Year;
		if (year >= 1) {
			return Math.floor(year) + "年";
		}
		let month = diffTime / C_Month;
		if (month >= 1) {
			return Math.floor(month) + "个月";
		}
		let week = diffTime / (7 * C_Day);
		if (week >= 1) {
			return Math.floor(week) + "周";
		}
		let day = diffTime / C_Day;
		if (day >= 1) {
			return Math.floor(day) + "天";
		}
		let hour = diffTime / C_Hour;
		if (hour >= 1) {
			return Math.floor(hour) + "小时";
		}
		let minute = diffTime / C_Minute;
		if (minute >= 1) {
			return Math.floor(minute) + "分钟";
		}
		let second = diffTime / C_Minute;
		if (second >= 1) {
			return Math.floor(second) + "秒";
		}
		return '';
	}




}
