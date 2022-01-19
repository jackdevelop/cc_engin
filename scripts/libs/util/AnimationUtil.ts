
export default class AnimationUtil {
	
	public static animationGoToStart(
		anim: cc.Animation,
		name: string | number
	): void {
		if (anim == null) {
			
			cc.log('当前缺少动画参数！');
			return;
		}

		let anim_name: string | number = name;
		if (typeof name === 'number') {
			anim_name = anim.getClips()[name].name;
		}
		
		anim.setCurrentTime(0, anim_name.toString());
		anim.sample(anim_name.toString()); 
		anim.stop();
	}

	
	public static shakeEffect(duration, componet) {
		let self = this;
		let x = 0; 
		let y = 0; 

		var shakeY = 10; 
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
}
