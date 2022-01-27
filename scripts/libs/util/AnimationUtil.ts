/**
 *   AnimationUtil
 * @see AnimationUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/NodeUtil.ts
 */
export default class AnimationUtil {
	/**
	 *  // 停在动画的第一帧   https://blog.csdn.net/weixin_43297573/article/details/115258793
	 * @param anim 节点
	 * @param name 目标节点（容器）
	 */
	public static animationGoToStart(
		anim: cc.Animation,
		name: string | number
	): void {
		if (anim == null) {
			//anim = this.node.getComponent(cc.Animation);
			cc.log('当前缺少动画参数！');
			return;
		}

		let anim_name: string | number = name;
		if (typeof name === 'number') {
			anim_name = anim.getClips()[name].name;
		}
		// anim.play(String(anim_name), 0);
		anim.setCurrentTime(0, anim_name.toString());
		anim.sample(anim_name.toString()); //采样
		anim.stop();
	}

	/**
	 * 震屏效果
	 *
	 * @param duration  震屏时间
	 * @param componet
	 */
	public static shakeEffect(duration, componet) {
		let self = this;
		let x = 0; //componet.x;
		let y = 0; //componet.y

		var shakeY = 10; //初始震动距离
		var sv = cc.v2(x, y + shakeY);
		componet.stopAllActions();
		componet.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (0 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (1 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (2 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (3 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (4 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (5 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (6 * 3)) % 8)),
					cc.moveTo(0.02, sv.rotate(((Math.PI / 4) * (7 * 3)) % 8))
				)
			)
		);
		setTimeout(() => {
			componet.stopAllActions();
			componet.setPosition(x, y);
		}, duration * 1000);
	}

	/**
	 *  执行 tween 动画
	 * @param node
	 * @param props
	 */
	public static async doTween(node, time, props) {
		return new Promise((res) => {
			cc.tween(node)
				.to(time, props)
				// 当前面的动作都执行完毕后才会调用这个回调函数
				.call(res)
				.start();
		});
	}
}
