var _ = require('Underscore');

export class Util {
	
	public static proxy(fun, that) {
		return function () {
			fun.apply(that, arguments);
		};
	}

	
	public static applyMixins(derivedCtor: any, allbaseCtor: any[]) {
		
		allbaseCtor.forEach((baseCtor) => {
			
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				if (name !== 'constructor' && name !== "__classname__" && name !== "__cid__" &&
					name !== "onLoad" && name !== "onDestroy"
				) {
					
					console.log(derivedCtor)
					console.log(name);
					if (derivedCtor && derivedCtor.prototype) {
						derivedCtor.prototype[name] = null
						derivedCtor.prototype[name] = baseCtor.prototype[name];
					}
				}
			});
		});
	}

	
	public static b64Encode(str) {
		return btoa(encodeURIComponent(str));
	}
	
	public static b64Decode(str) {
		return decodeURIComponent(atob(str));
	}

	
	static getClassName(c: any): string {
		var funcNameRegex = /function (.{1,})\(/;
		var results = funcNameRegex.exec(c.constructor.toString());
		return results && results.length > 1 ? results[1] : '';
	}

	
	public static findKey(obj, value, compare = (a, b) => a === b) {
		return Object.keys(obj).find((k) => compare(obj[k], value));
	}

	
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
				
				out += String.fromCharCode(c);
			} else if (pre >= 24 && pre <= 27) {
				
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
			} else if (pre >= 28 && pre <= 29) {
				
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(
					((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
				);
			} else if (pre == 30) {
				
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
