/**
 * Promise 工具
 * @see PromiseUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/PromiseUtil.ts
 */
export class PromiseUtil {
	/**
	 * 等待
	 * @param time 时长（秒）
	 * @example
	 * await PromiseUtil.wait(1);
	 */
	public static wait(time: number): Promise<void> {
		return new Promise((res) => cc.Canvas.instance.scheduleOnce(res, time));
	}

	/**
	 * 异步函数中等待一段时间
	 * @param time
	 * @param node 挂载在什么node上
	 * @returns
	 */
	static wait_time(time: number, node: cc.Component) {
		if (node) {
			return new Promise((res) => node.scheduleOnce(res, time));
		} else {
			// return new Promise((res) => setTimeout(res, time * 1e3));
			return new Promise((res) => cc.Canvas.instance.scheduleOnce(res, time));
		}
	}

	/**
	 *  间隔1一帧后执行
	 * @param node 挂载在什么node上
	 * @returns
	 */
	static wait_frame(node: cc.Component) {
		if (node) {
			return new Promise((res) => node.scheduleOnce(res));
		} else {
			return new Promise((res) => cc.Canvas.instance.scheduleOnce(res));
		}
	}

	/**
	 * 逐帧执行
	 * - 使用cc.Component.schedule()方法,在interval参数为0时表示逐帧调用
	 * @param f 需要执行的方法
	 * @param nc 执行方法的节点脚本
	 * @param all_count 执行的总数
	 */
	static run_by_each_frame(f: () => void, nc: cc.Component, all_count: number) {
		nc.schedule(f, 0, all_count - 1);
	}

	/**
	 * 间隔帧执行
	 * @param f
	 * @param nc
	 * @param all_count
	 * @param interval 间隔帧;默认为1,表示连续帧
	 */
	static run_by_interval_frame(
		f: () => void,
		nc: cc.Component,
		all_count: number,
		interval: number
	) {
		let c = 0;
		let count = null;
		if (all_count) {
			count = (all_count - 1) * interval;
		}

		nc.schedule(
			() => {
				c === 0 && f();
				c += 1;
				c %= interval;
			},
			0,
			count
		);
	}
	// static run_by_interval_frame_(
	//   f: () => void,
	//   nc: cc.Component,
	//   all_count: number,
	//   interval: number
	// ) {
	//   let c = 0;
	//   nc.schedule(() => {
	//     c === 0 && f();
	//     c += 1;
	//     c %= interval;
	//   }, 0);
	// }
}
