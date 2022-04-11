var _ = require('Underscore');

export class Util {
	/**
	 * proxy 绑定this
	 */
	public static proxy(fun, that) {
		return function () {
			fun.apply(that, arguments);
		};
	}

	/**
	 * 模仿实现多继承 的函数方法
	 * @param derivedCtor 原始类
	 * @param baseCtor  集合类
	 */
	public static applyMixins(derivedCtor: any, allbaseCtor: any[]) {
		//遍历父类中的所有的属性，添加到子类的属性中中
		allbaseCtor.forEach((baseCtor) => {
			//获取遍历到的父类中的所有属性
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				if (name !== 'constructor' && name !== "__classname__" && name !== "__cid__" &&
					name !== "onLoad" && name !== "onDestroy"
				) {
					//父类中的属性，添加到子类的属性中
					// console.log(derivedCtor)
					// console.log(name);
					if (derivedCtor && derivedCtor.prototype) {
						derivedCtor.prototype[name] = null
						derivedCtor.prototype[name] = baseCtor.prototype[name];
					}
				}
			});
		});
	}

	//编码
	public static b64Encode(str) {
		return btoa(encodeURIComponent(str));
	}
	//解码
	public static b64Decode(str) {
		return decodeURIComponent(atob(str));
	}

	/**
	 * 获取类名
	 * @param c
	 */
	static getClassName(c: any): string {
		var funcNameRegex = /function (.{1,})\(/;
		var results = funcNameRegex.exec(c.constructor.toString());
		return results && results.length > 1 ? results[1] : '';
	}

	/**
	 *  通过对象的属性值找到属性名
	 * @param obj
	 * @param value
	 * @param {(a, b) => boolean} compare
	 * @returns {string}
	 */
	public static findKey(obj, value, compare = (a, b) => a === b) {
		return Object.keys(obj).find((k) => compare(obj[k], value));
	}

	/**
	 * 数组分类
	 */
	public static Array_split_by_num(arr, num) {
		let ret = [];

		let one_arr = [];
		_.each(arr, function (v, k) {
			one_arr.push(v);
			if (one_arr.length == num || arr.length == k + 1) {
				ret.push(_.clone(one_arr));
				one_arr.length = 0;
			}
		});

		return ret;
	}

	//arraybuff 转化成 string
	public static Utf8ArrayToStr(array) {
		var out, i, len, c;
		var char2, char3, char4;

		out = '';
		len = array.length;
		i = 0;
		while (i < len) {
			c = array[i++];
			var pre = c >> 3;
			if (pre >= 0 && pre <= 15) {
				// 0xxxxxxx
				out += String.fromCharCode(c);
			} else if (pre >= 24 && pre <= 27) {
				// 110x xxxx   10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
			} else if (pre >= 28 && pre <= 29) {
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(
					((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
				);
			} else if (pre == 30) {
				//1111 0xxx  10xx xxxx  10xx xxxx 10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				char4 = array[i++];
				out += String.fromCodePoint(
					((c & 0x07) << 15) |
					((char2 & 0x3f) << 12) |
					((char3 & 0x3f) << 6) |
					((char4 & 0x3f) << 0)
				);
			}
		}

		return out;
	}
}
