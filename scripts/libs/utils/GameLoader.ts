import { NetWork } from '../server/NetWork';
import { GameHelp } from './GameHelp';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');

/**
 *  GameLoader 类
 */
@ccclass
export class GameLoader {
	/**
	 *  加载 本地 resource 下的 图片
	 *
	 * @param prefab_url
	 * @param type
	 */
	public static async loadFgui(url: string): Promise<fairygui.UIPackage> {
		return new Promise((res) => {
			fgui.UIPackage.loadPackage(url, function (error, pkg: fairygui.UIPackage) {
				if (error) {
					res(null);
				} else {
					res(pkg);
				}
			});
		});
	}

	/**
	 *  加载 本地 resource 下的 图片
	 *
	 * @param prefab_url
	 * @param type
	 */
	public static _load<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T
	): Promise<InstanceType<T>> {
		return new Promise((resolve, reject) => {
			// cc.resources.load({ url: prefab_url, type: type }, function (
			cc.resources.load(prefab_url, type, function (err, resObj) {
				if (err) {
					return reject(false);
				}
				return resolve(resObj);
			});
		});
	}
	public static async load<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T
	): Promise<InstanceType<T>> {
		try {
			const res = await this._load(prefab_url, type);
			return res;
		} catch (err) {
			return null; //await this.load(prefab_url, type);
		}
	}

	/**
	 * 载入dir资源
	 * - [注意] 编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
	 * @param path
	 * @param type
	 */
	static load_res_dir<T extends typeof cc.Asset>(
		path: string,
		type: T
	): Promise<InstanceType<T>[]> {
		return new Promise((res) => {
			cc.resources.loadDir(path, type, (err, resource) => {
				err && cc.warn(`load res dir fail, path=${path}, err=${err}`);
				err ? res(null) : res(resource);
			});
		});
	}

	// /**
	//  *  加载spine 动画
	//  * @param path
	//  * @param type
	//  */
	// static load_spine<T extends typeof cc.Asset>(
	//   path: string
	// ): Promise<InstanceType<T>[]> {
	//   return new Promise((res) => {
	//     cc.resources.load(
	//       path,
	//       sp.SkeletonData,
	//       (completeCount, totalCount, item) => {
	//         // cc.log('');
	//       },
	//       (err, resource) => {
	//         err && cc.warn(`load res dir fail, path=${path}, err=${err}`);
	//         err ? res(null) : res(resource);
	//       }
	//     );
	//   });
	// }

	/**
	 * 远程加载 或者 本地磁盘加载
	 * @param prefab_url
	 * @param type
	 */
	private static _load_net<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T //{ext: '.png'}
	): Promise<InstanceType<T>> {
		return new Promise((resolve, reject) => {
			if (type) {
				cc.assetManager.loadRemote(prefab_url, type, function (err, resObj) {
					if (err) {
						return reject(false);
					}
					// resObj.addRef();
					return resolve(resObj);
				});
			} else {
				cc.assetManager.loadRemote(prefab_url, function (err, resObj) {
					if (err) {
						return reject(false);
					}
					// resObj.addRef();
					return resolve(resObj);
				});
			}
		});
	}
	public static async load_net<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T
	): Promise<InstanceType<T>> {
		try {
			const res = await this._load_net(prefab_url, type);
			// cc.assetManager.releaseAsset(res);
			return res;
		} catch (err) {
			return null; //await this.load(prefab_url, type);
		}
	}

	//++++++++++++++++++=================================================================================================================
	//======= imageLoadTool ==============================================================================================================================
	//=====================================================================================================================================

	/**
	 *  这是在真机上的调试显示
	 *
	 * @param {*} url
	 */
	public static async imageLoadTool(url: string) {
		if (!cc.sys.isNative && cc.sys.isMobile) {
			return;
		}

		var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
		cc.log('dirpath ->', dirpath);

		// var md5Sign = require('signMd5').md5Sign;
		// let md5URL = md5Sign(url);
		let md5URL = window.btoa(url);
		var filepath = dirpath + md5URL + '.jpg';

		cc.log('filepath ->', filepath);
		if (jsb.fileUtils.isFileExist(filepath)) {
			cc.log('Remote is find' + filepath);
			// loadEnd();

			let tex = await GameHelp.load(filepath, 'jpg');
			var spriteFrame = new cc.SpriteFrame(
				tex
				// cc.Rect(0, 0, tex.width, tex.height)
			);
			// spriteFrame.retain();
			return spriteFrame;
		}

		let response = await NetWork.getInstance().request_http(url, null);
		if (typeof response !== 'undefined') {
			if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
				jsb.fileUtils.createDirectory(dirpath);
			} else {
				cc.log('路径exist');
			}

			// new Uint8Array(data) writeDataToFile  writeStringToFile
			if (jsb.fileUtils.writeDataToFile(new Uint8Array(response), filepath)) {
				cc.log('Remote write file succeed.');
				// loadEnd();
				// let tex = await GameHelp.load(filepath, 'jpg');
				let tex = await GameHelp.load(filepath, null);
				var spriteFrame = new cc.SpriteFrame(
					tex
					// cc.Rect(0, 0, tex.width, tex.height)
				);
				// spriteFrame.retain();
				return spriteFrame;
			} else {
				cc.log('Remote write file failed.');
			}
		} else {
			cc.log('Remote download file failed.');
		}
	}
}
