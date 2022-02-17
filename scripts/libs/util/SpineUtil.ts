import SpineData from '../../../../app/game_sns/planewar/fight/scripts/data/SpineData';
import { GameLoader } from '../utils/GameLoader';

var _ = require('Underscore');

/**
 *    spine动画的相关方法
 */
export default class SpineUtil {
	//单个得
	public static active(m_spine: dragonBones.ArmatureDisplay) {
		if (m_spine) {
			m_spine.unscheduleAllCallbacks();
			m_spine.armatureName = null;
			m_spine.timeScale = 1;

			let m_node = m_spine.node;
			m_node.active = false;
			m_node.scale = 1;
			m_node.angle = 0;
			m_node.position = cc.Vec3.ZERO;
		}
	}

	/**
	 * spine动画入口方法
	 * 
	 *  dragonBones.EventObject.START 动画开始播放。
		dragonBones.EventObject.LOOP_COMPLETE 动画循环播放完成一次。
		dragonBones.EventObject.COMPLETE 动画播放完成。
		dragonBones.EventObject.FADE_IN 动画淡入开始。
		dragonBones.EventObject.FADE_IN_COMPLETE 动画淡入完成。
		dragonBones.EventObject.FADE_OUT 动画淡出开始。
		dragonBones.EventObject.FADE_OUT_COMPLETE 动画淡出完成。
		dragonBones.EventObject.FRAME_EVENT 动画帧事件。
		dragonBones.EventObject.SOUND_EVENT 动画帧声音事件。
	 * 
	 * @param spine_index 动画索引
	 * @param spine_name 需要运行的动画名称
	 * @param useLoop 是否循环播放
	 * @param callback 回调方法
	 */
	static async _playAnimation(
		spine: dragonBones.ArmatureDisplay,
		animName: string,
		playTimes: number
	): Promise<object> {
		return new Promise((res) => {
			try {
				//once 添加 DragonBones 一次性事件监听器，回调会在第一时间被触发后删除自身。
				spine.once(dragonBones.EventObject.COMPLETE, function (e) {
					// console.log('播放完毕', animName);
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
		//getAnimationNames 获取指定的 armature 的所有动画名称。
		let all_AnimationNames = spine.getAnimationNames(armatureName);

		//判断当前是否有这个名称
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
			// console.log('xxxxxxxx');
			callback();
		} else {
			spine.playAnimation(animName, playTimes);
		}
	}

	/**
	 *  简化版播放  直接指定spine_id
	 *   通过表格自动去寻找 armatureName  和 animation_name 播放
	 *
	 * @param spine
	 * @param spine_id
	 * @param playTimes
	 * @param callback
	 */
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

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////// 直接替换 骨骼数据  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 *  动态的修改 spine 的 谷歌数据 和 骨骼设置骨骼数据所需Atlas
	 *
	 *   https://www.cnblogs.com/gamedaybyday/p/13021916.html
	 *
	 * @param spine
	 * @param asset_name
	 */
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

		// console.log('切换动作');
		spine.dragonAtlasAsset = dbAtlas; //设置骨骼数据所需Atlas
		spine.dragonAsset = dbAsset; //设置骨骼数据
		spine.armatureName = armature;
		// let all_AnimationNames = spine.getArmatureNames();
		// console.log(all_AnimationNames);
		if (armature) {
			spine.buildArmature = armature;
			spine.armatureName = armature; //设置皮肤
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////// 获取数据 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 *  通过  animation_name 动画名称 去查找 animation_name 贴图名称
	 * @param spine
	 * @param animation_name
	 * @returns
	 */
	public static getArmatureByAnimation(
		spine: dragonBones.ArmatureDisplay,
		animation_name: string
	): string {
		let all_armature = spine.getArmatureNames();
		let ret = _.find(all_armature, function (v, k) {
			let all_AnimationNames = spine.getAnimationNames(v);
			//判断当前是否有这个名称
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
