import SpineData from '../../../../app/game_sns/planewar/fight/scripts/data/SpineData';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');


export default class SpineUtil {
	
	static async _playAnimation(
		spine: dragonBones.ArmatureDisplay,
		animName: string,
		playTimes: number
	): Promise<object> {
		return new Promise((res) => {
			try {
				
				spine.once(dragonBones.EventObject.COMPLETE, function (e) {
					res({});
				});
				spine.playAnimation(animName, playTimes);
			} catch (error) {
				res(null);
			}
		});
	}
	public static async playAnimation(
		spine: dragonBones.ArmatureDisplay,
		armatureName: string,
		animName: string,
		playTimes: number,
		callback?: Function
	) {
		
		let all_AnimationNames = spine.getAnimationNames(armatureName);

		
		let is_find = _.find(all_AnimationNames, function (num) {
			return num == animName;
		});
		if (!is_find) {
			console.log('当前没有动画', animName, is_find, all_AnimationNames);
			if (callback) {
				callback();
			}
			return;
		}

		spine.armatureName = armatureName;
		if (callback) {
			await this._playAnimation(spine, animName, playTimes);
			callback();
		} else {
			spine.playAnimation(animName, playTimes);
		}
	}

	
	public static playAnimationBySpineId(
		spine: dragonBones.ArmatureDisplay,
		spine_id: number,
		playTimes: number,
		callback?: Function
	): void {
		let config = SpineData.getSpineById(spine_id);
		let armature_name = config.armature_name;
		let animation_name = config.animation_name;
		this.playAnimation(
			spine,
			armature_name,
			animation_name,
			playTimes,
			callback
		);
	}

	
	
	
	
	
	
	
	

	
	public static async changeSpineByAsset(
		spine: dragonBones.ArmatureDisplay,
		dragon_asset,
		dragon_atlas_asset,
		armature
	) {
		let dbAtlas = await GameLoader.load(
			dragon_atlas_asset + '',
			dragonBones.DragonBonesAtlasAsset
		);

		let dbAsset = await GameLoader.load(
			dragon_asset + '',
			dragonBones.DragonBonesAsset
		);

		console.log('切换动作');
		spine.dragonAtlasAsset = dbAtlas; 
		spine.dragonAsset = dbAsset; 
		spine.armatureName = armature;
		
		
		if (armature) {
			spine.buildArmature = armature;
			spine.armatureName = armature; 
		}
	}

	
	
	
	
	
	
	
	

	
	public static getArmatureByAnimation(
		spine: dragonBones.ArmatureDisplay,
		animation_name: string
	): string {
		let all_armature = spine.getArmatureNames();
		let ret = _.find(all_armature, function (v, k) {
			let all_AnimationNames = spine.getAnimationNames(v);
			
			let is_find = _.find(all_AnimationNames, function (v2) {
				return v2 == animation_name;
			});

			if (is_find) {
				return v;
			}
		});

		return ret;
	}
}
