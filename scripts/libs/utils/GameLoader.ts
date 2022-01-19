import { NetWork } from '../server/NetWork';
import { GameHelp } from './GameHelp';
const { ccclass, property } = cc._decorator;

var _ = require('Underscore');


@ccclass
export class GameLoader {
	
	static async _loadFgui(url: string): Promise<object> {
		return new Promise((res) => {
			try {
				fgui.UIPackage.loadPackage(url, function (error) {
					res({});
				});
			} catch (error) {
				res(null);
			}
		});
	}
	public static async loadFgui(prefab_url: string): Promise<object> {
		try {
			const res = await this._loadFgui(prefab_url);
			return res;
		} catch (err) {
			return null;
		}
	}

	
	public static _load<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T
	): Promise<InstanceType<T>> {
		return new Promise((resolve, reject) => {
			
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
			return null; 
		}
	}

	
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

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	private static _load_net<T extends typeof cc.Asset>(
		prefab_url: string,
		type: T 
	): Promise<InstanceType<T>> {
		return new Promise((resolve, reject) => {
			if (type) {
				cc.assetManager.loadRemote(prefab_url, type, function (err, resObj) {
					if (err) {
						return reject(false);
					}
					
					return resolve(resObj);
				});
			} else {
				cc.assetManager.loadRemote(prefab_url, function (err, resObj) {
					if (err) {
						return reject(false);
					}
					
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
			
			return res;
		} catch (err) {
			return null; 
		}
	}

	
	
	

	
	public static async imageLoadTool(url: string) {
		if (!cc.sys.isNative && cc.sys.isMobile) {
			return;
		}

		var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
		cc.log('dirpath ->', dirpath);

		
		
		let md5URL = window.btoa(url);
		var filepath = dirpath + md5URL + '.jpg';

		cc.log('filepath ->', filepath);
		if (jsb.fileUtils.isFileExist(filepath)) {
			cc.log('Remote is find' + filepath);
			

			let tex = await GameHelp.load(filepath, 'jpg');
			var spriteFrame = new cc.SpriteFrame(
				tex
				
			);
			
			return spriteFrame;
		}

		let response = await NetWork.getInstance().request_http(url, null);
		if (typeof response !== 'undefined') {
			if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
				jsb.fileUtils.createDirectory(dirpath);
			} else {
				cc.log('路径exist');
			}

			
			if (jsb.fileUtils.writeDataToFile(new Uint8Array(response), filepath)) {
				cc.log('Remote write file succeed.');
				
				
				let tex = await GameHelp.load(filepath, null);
				var spriteFrame = new cc.SpriteFrame(
					tex
					
				);
				
				return spriteFrame;
			} else {
				cc.log('Remote write file failed.');
			}
		} else {
			cc.log('Remote download file failed.');
		}
	}
}
