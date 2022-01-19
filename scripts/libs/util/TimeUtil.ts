
export default class TimeUtil {
	
	public static get_show_time() {
		var now = new Date()
		var nowTime = now.toLocaleString()
		var date = nowTime.substring(0, 10) 
		var time = nowTime.substring(10, 20) 
		var week = now.getDay() 
		var hour = now.getHours() 

		return { week, hour }
	}

	
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

	
	public static getTargetTimestamp(
		hour: number = 0,
		minute: number = 0,
		second: number = 0
	): number {
		const start = new Date(new Date().toLocaleDateString()).getTime()
		const target = (hour * 3600 + minute * 60 + second) * 1000
		return new Date(start + target).getTime()
	}

	
	
	
	
	
	
	
	
	
	
	
	
	

	
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

	
	public static getCurrentTimestamp(): number {
		return new Date().getTime()
	}

	
	static getHHmmss(time?: number, isHh?, fixed = '') {
		if (!time || time <= 0) return { time_str: '00:00' }
		
		
		
		
		
		
		
		

		
		
		
		
		
		
		
		
		

		
		

		

		let r: string = ''
		let all_s = Math.floor(time / 3600)
		let d = Math.floor(all_s / 24) 
		let h = Math.floor(all_s % 24) 

		let hY = time % 3600
		let m = Math.floor(hY / 60) 
		let s = Math.floor(hY % 60) 

		
		
		
		
		
		

		if (all_s > 0) {
			r = (all_s > 9 ? '' + all_s : '0' + all_s) + fixed + ':'
		} else if (isHh) {
			
			r = '00' + fixed + ':'
		}

		r += (m > 9 ? '' : '0') + m + fixed + ':' + fixed 
		r += (s > 9 ? '' : '0') + s 

		return { all_s: all_s, time_str: r, d: d, h: h, m: m, s: s }
	}
}

window['eazax'] && (window['eazax']['time'] = TimeUtil)
