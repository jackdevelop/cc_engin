




import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { resLoader } from '../res/ResLoader';
import { ResUtil } from '../res/ResUtil';

var _ = require('Underscore');

export class ImageLoader {
	
	public static all_hash = new Object();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	

	
	public static async load(url, phpUrl, spt, auto_clean) {
		var newUrl = ImageLoader.getUrl(url, phpUrl);
		

		
		this._load(newUrl, spt, auto_clean);
		
		
	}

	
	public static async _load(newUrl, spt, auto_clean) {
		var self = this;
		var isNet = this.compareUrlIsNet(newUrl);
		cc.log('加载图片远程：', isNet, newUrl, ImageLoader.all_hash);
		if (isNet == true) {
			if (cc.sys.isNative) {
			} else {
				resLoader.loadRemoteRes(
					newUrl,
					
					(err, res) => {
						if (err || !res) {
							cc.log('加载资源失败：', newUrl);
							return;
						}
						
						spt.spriteFrame = ResUtil.assignWith(res, spt.node, true);
						

						if (auto_clean && GameConstants.GAME_AUTO_CLEAN) {
							resLoader.releaseAsset(res);
						}

						
						
					}
				);
			}
		} else {
			let is_hav = cc.resources.getInfoWithPath(newUrl);
			if (is_hav) {
				resLoader.loadRes(
					newUrl,
					cc.SpriteFrame,
					(err: Error, res: cc.SpriteFrame) => {
						if (err || !res) {
							cc.log('加载资源失败：', newUrl);
							return;
						}
						
						spt.spriteFrame = ResUtil.assignWith(res, spt.node, true);
						
						if (auto_clean && GameConstants.GAME_AUTO_CLEAN) {
							resLoader.releaseAsset(res);
						}

						
						
					}
				);
			} else {
				cc.log('当前没有这个资源===', is_hav);
			}
		}
	}

	
	

	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	

	
	
	
	

	
	
	

	
	

	
	
	
	

	

	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	

	
	
	
	
	
	
	
	

	
	
	

	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	public static compareUrlIsNet(url) {
		var newurl_lower = url.toLocaleLowerCase();

		if (
			newurl_lower.startsWith('http://') ||
			newurl_lower.startsWith('https://') ||
			newurl_lower.startsWith('ftp://')
		) {
			return true;
		}
		return false;
	}
	
	public static getUrl(url, phpUrl) {
		var newUrl = url;
		if (phpUrl) {
			newUrl = phpUrl + '?url=' + url;
		}
		return newUrl;
	}
}
