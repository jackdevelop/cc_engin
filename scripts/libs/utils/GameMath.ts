
export class GameMath {

	public static Lerp(start: number, end: number, t: number): number;
	public static Lerp(start: cc.Vec2, end: cc.Vec2, t: number): cc.Vec2;
	public static Lerp(start: cc.Vec3, end: cc.Vec3, t: number): cc.Vec3;
	public static Lerp(start: number | cc.Vec2 | cc.Vec3, end: number | cc.Vec2 | cc.Vec3, t: number) {
		if (cc.js.isNumber(t)) {
			if (t < 0) {
				t = 0;
			} else if (t > 1) {
				t = 1;
			}
		} else {
			t = 0;
		}
		if (typeof start == "number" && typeof end == "number") {
			return start * (1 - t) + end * t;
		} else if (start instanceof cc.Vec2 && end instanceof cc.Vec2) {
			return start.lerp(end, t);
		} else if (start instanceof cc.Vec3 && end instanceof cc.Vec3) {
			return start.lerp(end, t);
		} else {
			console.log(`Lerp Error start:${start.toString()},end:${end.toString()},t:${t.toString()}`);
		}
	}

	public static Clamp(value: number, min: number, max: number) {
		if (value < min) {
			value = min;
		} else if (value > max) {
			value = max;
		}
		return value;
	}

	public static getLimitDesc(data: { createTime: string, expireTime: string }) {
		let create_date = this.getDateFromString(data.createTime);
		let expire_date = this.getDateFromString(data.expireTime);
		let str = `${create_date.toLocaleDateString()}(${this.getDifferentDateString(create_date, expire_date)}过期)`;
		return str;
	}

	public static getDifferentDateString(start: Date, end: Date) {
		let startTime = start.getTime();
		let endTime = end.getTime();
		var diffTime = endTime - startTime;
		if (diffTime <= 0) {
			return '已';
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
		return '已';
	}

	/** format:"1999-09-09 09:09:09" */
	public static getDateFromString(fullString: string) {
		let date = new Date(fullString);
		return date;
	}

	// static cnNum: string[] = [
	//   '0',
	//   '一',
	//   '二',
	//   '三',
	//   '四',
	//   '五',
	//   '六',
	//   '七',
	//   '八',
	//   '九',
	//   '十',
	// ];

	// /** 进行排序 支持数字、字符串、User 和 cc.Node 根据数字正排或者倒序 默认正序*/
	// static sort(numList, reverse?: boolean) {
	//   numList.sort((a, b) => {
	//     let ac = 0,
	//       bc = 0;
	//     if (a.id) {
	//       // instanceof User) {
	//       ac = a.id;
	//       bc = b.id;
	//     } else {
	//       ac =
	//         typeof a === 'number'
	//           ? a
	//           : parseInt(
	//               typeof a === 'string' ? a : a instanceof cc.Node ? a.name : a
	//             );
	//       bc =
	//         typeof b === 'number'
	//           ? b
	//           : parseInt(
	//               typeof b === 'string' ? b : b instanceof cc.Node ? b.name : b
	//             );
	//     }
	//     if (ac > bc) return reverse ? -1 : 1;
	//     // 如果是降序排序，返回-1。
	//     else if (ac == bc) return 0;
	//     else return reverse ? 1 : -1; // 如果是降序排序，返回1。
	//   });
	// }

	// /** 支持 1-99 @param n 数值 */
	// static numToChiness(n?: number): string {
	//   let cnNum = this.cnNum;
	//   if (n > 0 && n <= 10) return cnNum[n];
	//   if (n > 10) {
	//     let geWei: number = n % 10;
	//     let shiWei: number = Math.floor(n / 10);
	//     return (
	//       (shiWei > 1 ? cnNum[shiWei] : '') +
	//       cnNum[10] +
	//       (geWei > 0 ? cnNum[geWei] : '')
	//     );
	//   }
	//   return '0';
	// }

	/** 截取数值后缀 字 向下取整 */
	static toNumShort(n: number): string {
		// // 进行计算整数值会计算成浮点0.99999999999999近似值1表示(数据有误差)
		// if (n> 1000000000000) return (Math.floor((n / 999999999999.9) * 10) / 10) + "兆";
		// if (n >= 100000000) return (Math.floor((n / 99999999.99) * 10) / 10) + "亿"; // 保留一位小数
		// if (n >= 10000) return (Math.floor((n / 9999.999) * 100) / 100) + "万"; // 大于1万才进行取整 保留二位小数
		// return n + "";

		if (n >= 1000000000000)
			return Math.floor((n / 1000000000000) * 10) / 10 + '兆'; // 保留一位小数
		if (n >= 100000000) return Math.floor((n / 100000000) * 10) / 10 + '亿'; // 保留一位小数
		if (n >= 100000) return Math.floor((n / 10000) * 100) / 100 + '万'; // 保留二位小数
		// if (n >= 10000) return (Math.floor((n / 10000) * 100) / 100) + "万";

		return n + '';
	}

	/**
	 * 获取一个随机整数,[min,max),满足条件的整数出现概率相等;如果min>=max则返回异常
	 * @param min 大于等于 min
	 * @param max 小于max
	 */
	static random_int(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	// newValue:function (min, max) {
	//     return Math.floor(Math.random() * (max - min + 1)) + min;
	// }
	/**
	 * 获取一个随机小数,[min,max);如果min>=max则返回异常
	 * @param min
	 * @param max
	 */
	static random_float(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	/**
	 *  自动排列的序列 ，中间的为 （0，0）点，获取出任意索引idx的位置
	 * @param max_num  最多的数量
	 * @param idx
	 * @param space
	 * @param angle 角度
	 */
	static get_pos_by_auto_layout(
		max_num: number,
		idx: number,
		space: number = 10
	) {
		let midle = max_num / 2;
		let start = 0;

		let pos = start;
		if (max_num % 2 == 0) {
			//偶数
			start = -(midle + 0.5) * space;
			pos = start + idx * space;
		} else {
			start = -Math.floor(midle) * space;
			pos = start + idx * space;

			// 7
			// 0 1 2   3   4 5 6
			// -30 -20 -10    0   10 20 30
			// -3.5*10

			// 6
			// 0 1 2    3 4 5
			// -30 -20 -10  0  10 20
			// -
		}

		return pos;
	}
	// /**
	//  * 获取一个随机数组项
	//  * @param array
	//  */
	// static random_array_item<T>(array: Array<T>): T {
	//   return array[Math.trunc(Math.random() * array.length)];
	// }

	// /**
	//  * 获取一个随机枚举项,仅限于typescript,且须从0开始
	//  * @param array_enum
	//  */
	// static random_enum_item(array_enum: any) {
	//   return Math.trunc((Math.random() * Object.keys(array_enum).length) / 2);
	// }

	// /**
	//  * 采用洗牌算法打乱数组顺序,不更改原数组,返回一个打乱顺序的新数组
	//  * - 采用遍历+替换的方式。在数量级很大时,可能会有性能损耗
	//  * @param array
	//  */
	// static shuffle_array<T>(array: Array<T>): Array<T> {
	//   let result = [...array];
	//   for (let i = 0; i < result.length; i += 1) {
	//     let t = Math.trunc(Math.random() * result.length);
	//     [result[i], result[t]] = [result[t], result[i]];
	//   }
	//   return result;
	// }

	// /**
	//  * 将角度转换为弧度
	//  * - cc.misc.degreesToRadians()
	//  * @param angle
	//  */
	// static trans_angle_to_radian(angle: number): number {
	//   return angle * (Math.PI / 180);
	// }

	// /**
	//  * 将弧度转换为角度
	//  * - cc.misc.radiansToDegrees()
	//  * @param radian
	//  */
	// static trans_radian_to_angle(radian: number): number {
	//   return radian / (Math.PI / 180);
	// }

	// static get_p_p_rotation(startpos: cc.Vec2, endPos: cc.Vec2) {
	//   let dir = endPos.sub(startpos);
	//   //根据朝向计算出夹角弧度
	//   var angle = dir.signAngle(cc.v2(1, 0));
	//   //将弧度转换为欧拉角
	//   var degree = this.trans_radian_to_angle(angle); //angle / Math.PI * 180;
	//   return degree;
	// }

	// /**
	//  * 计算两点之间的距离
	//  * - 有开平方计算,可能会有额外的性能损耗
	//  * @param p0
	//  * @param p1
	//  */
	// static get_p_p_distance(p0: cc.Vec2, p1: cc.Vec2) {
	//   return p0.sub(p1).mag();
	// }

	// /**
	//  * 计算两点之间的距离
	//  * - 有开平方计算,可能会有额外的性能损耗
	//  * @param p0
	//  * @param p1
	//  */
	// static get_middle_p(p0: cc.Vec2, p1: cc.Vec2) {
	//   return p0.add(p1).divSelf(2);
	// }

	// //-- 求圆上一个点的位置  弧度
	// static pointAtCircle(px, py, radians, radius) {
	//   return cc.v2(
	//     px + Math.cos(radians) * radius,
	//     py - Math.sin(radians) * radius
	//   );
	// }

	// /**
	//  * 计算点到一个线段的最短距离
	//  * - 注意是线段而非直线
	//  * - 矢量法
	//  * @param p
	//  * @param p0
	//  * @param p1
	//  */
	// static get_p_line_distance(p: cc.Vec2, p0: cc.Vec2, p1: cc.Vec2) {
	//   let line = p1.sub(p0); // 线段矢量
	//   let p_line = p.sub(p0); // 线段起点到外部点矢量
	//   let p_shadow = p_line.project(line); // 投影矢量
	//   let dot_value = p_line.dot(line); // 向量点乘值
	//   let result: number;
	//   if (dot_value >= 0) {
	//     // >=0表示夹角为直角或者锐角
	//     if (p_shadow.mag() >= line.mag()) {
	//       result = p_line.sub(line).mag();
	//     } else {
	//       result = p_line.sub(p_shadow).mag();
	//     }
	//   } else {
	//     // <0表示夹角为钝角
	//     result = p_line.mag();
	//   }
	//   return result;
	// }

	// /**
	//  * 截取数字的几位小数
	//  * @param n 源数字
	//  * @param count 小数位数
	//  */
	// static number_fixed(source: number, count: number = 1) {
	//   return Math.trunc(source * 10 ** count) / 10 ** count;
	// }

	// static string_formator(num, fmt) {
	//   // var as=[].slice.call(arguments),fmt=as.shift(),i=0;
	//   // return     fmt.replace(/%(\w)?(\d)?([dfsx])/ig,function(_,a,b,c){
	//   //     var s=b?new Array(b-0+1).join(a||''):'';
	//   //     if(c=='d') s+=parseInt(as[i++]);
	//   //     return b?s.slice(b*-1):s;
	//   // })

	//   if (fmt.length >= num) {
	//     return fmt;
	//   } else {
	//     let str = '';
	//     for (var i = fmt.length; i < num; i++) {
	//       str = str + '0';
	//     }

	//     return str + fmt;
	//   }
	// }

	// /**
	//  *  判断奇数偶数
	//  * 如果是偶数就为 true
	//  * @param n
	//  */
	// static even_number(d: number) {
	//   // var d=prompt('判断数字奇偶数')
	//   if (d % 2 == 1) {
	//     return false;
	//     // document.write('奇数')
	//   } else {
	//     // document.write('偶数')
	//     return true;
	//   }
	// }
}
