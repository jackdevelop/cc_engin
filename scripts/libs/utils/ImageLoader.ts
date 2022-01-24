/*
 * @Author: Damo 
 * @Date: 2018-06-08 09:56:20 
 * @Last Modified by: Damo
 * @Last Modified time: 2018-06-10 13:29:52
 * 
 * 使用方法 ：
cc.vv.imageLoader = require("ImageLoader");
cc.vv.imageLoader.imageLoadTool(imageURL,function(spriteFrame){
this.headSprite.spriteFrame = spriteFrame;
}.bind(this));
注：imageURL就是远程服务器的图片地址。


 var md5Sign = require("signMd5").md5Sign;
   let md5URL = md5Sign(url);
   var filepath = dirpath + md5URL + '.jpg';

 * 
 */

// import { GameHelp } from './GameHelp';
// import { NetHttp } from '../server/NetHttp';
// import { game_constants } from '../../../../cc_own/constants/game_constants';
import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { resLoader } from '../res/ResLoader';
import { ResUtil } from '../res/ResUtil';

var _ = require('Underscore');

export class ImageLoader {
	//总的缓存
	public static all_hash = new Object();
	// //清除所有
	// public static destoryAll(is_remove) {
	//   let self = this;
	//   _.each(ImageLoader.all_hash, function (v, k) {
	//     if (is_remove) {
	//       ImageLoader.destoryOne(k, null);
	//     }
	//   });
	//   ImageLoader.all_hash = new Object();
	// }
	// //删除资源
	// public static destoryOne(url, phpUrl) {
	//   var newUrl = ImageLoader.getUrl(url, phpUrl);
	//   //当前缓存中是否存在
	//   let spriteFrame = ImageLoader.getOne(newUrl);
	//   if (spriteFrame) {
	//     cc.log('销毁资源:', newUrl);
	//     cc.assetManager.releaseAsset(spriteFrame);
	//   }

	//   ImageLoader.all_hash[newUrl] = null;
	//   delete ImageLoader.all_hash[name];

	//   cc.log('释放后：', ImageLoader.all_hash);
	//   return spriteFrame;
	// }
	//添加资源
	// public static addOne(newUrl, spriteFrame) {
	//   let old_info = ImageLoader.all_hash[newUrl];
	//   // if (old_info) {
	//   //   old_info.game_count++;
	//   // } else {
	//   //   old_info = {
	//   //     game_count: 1,
	//   //     spriteFrame: spriteFrame,
	//   //   };
	//   // }

	//   if (!old_info) {
	//     // old_info.spriteFrame._game_count = old_info.game_count;
	//     // old_info.spriteFrame._game_url = newUrl;
	//     ImageLoader.all_hash[newUrl] = spriteFrame;
	//   }
	//   // if (ImageLoader.all_log_arr) {
	//   //   ImageLoader.all_log_arr.push(newUrl);
	//   // }
	// }
	// // //获取某一个
	// public static getOne(newUrl) {
	//   let spriteFrame = null;
	//   let old_info = ImageLoader.all_hash[newUrl];
	//   // if (old_info) {
	//   //   spriteFrame = old_info.spriteFrame;
	//   // }
	//   return old_info;
	// }

	// //记录开始
	// public static all_log_arr = null;
	// public static log_start() {
	//   ImageLoader.all_log_arr = [];
	// }
	// public static log_end(is_remove) {
	//   let all_log_arr = ImageLoader.all_log_arr;
	//   if (is_remove) {
	//     _.each(all_log_arr, function (v, k) {
	//       ImageLoader.destoryOne(v, null);
	//     });
	//   }
	//   ImageLoader.all_log_arr = null;
	//   return all_log_arr;
	// }

	//将要加载的 全部放到队列里
	// private static m_all_arr = [];
	// private static m_loading = false;

	//从远程加载图片
	public static async load(url, phpUrl, spt, auto_clean) {
		var newUrl = ImageLoader.getUrl(url, phpUrl);
		// this.m_all_arr.push({ newUrl: newUrl, spt: spt });

		// if (!ImageLoader.m_loading) {
		this._load(newUrl, spt, auto_clean);
		// }
		// this._load_complete();
	}

	//从远程加载图片
	public static async _load(newUrl, spt, auto_clean) {
		var self = this;
		var isNet = this.compareUrlIsNet(newUrl);
		cc.log('加载图片远程：', isNet, newUrl, ImageLoader.all_hash);
		if (isNet == true) {
			if (cc.sys.isNative) {
			} else {
				resLoader.loadRemoteRes(
					newUrl,
					// 'http://tools.itharbors.com/christmas/res/tree.png',
					(err, res) => {
						if (err || !res) {
							cc.log('加载资源失败：', newUrl);
							return;
						}
						// resLoader.releaseAsset(res);
						spt.spriteFrame = ResUtil.assignWith(res, spt.node, true);
						// GameHelp.wait_time(0.01, null);

						if (auto_clean && GameConstants.GAME_AUTO_CLEAN) {
							resLoader.releaseAsset(res);
						}

						// ImageLoader.m_loading = null;
						// ImageLoader._load_complete();
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
						// resLoader.releaseAsset(res);
						spt.spriteFrame = ResUtil.assignWith(res, spt.node, true);
						// GameHelp.wait_time(0.01, null);
						if (auto_clean && GameConstants.GAME_AUTO_CLEAN) {
							resLoader.releaseAsset(res);
						}

						// ImageLoader.m_loading = null;
						// ImageLoader._load_complete();
					}
				);
			} else {
				cc.log('当前没有这个资源===', is_hav);
			}
		}
	}

	// public static async _load_complete() {
	//   let m_all_arr = ImageLoader.m_all_arr;

	//   if (!ImageLoader.m_loading) {
	//     let one = m_all_arr.shift();
	//     if (one) {
	//       let newUrl = one.newUrl;
	//       let spt = one.spt;
	//       if (newUrl) {
	//         ImageLoader.m_loading = true;
	//         this._load(newUrl, spt, true);
	//       }
	//     }
	//   }
	// }

	// /**
	//  *  这是在真机上的调试显示
	//  *
	//  * @param {*} url
	//  */
	// public static async imageLoadTool(url: string) {
	//   if (!cc.sys.isNative && cc.sys.isMobile) {
	//     return;
	//   }

	//   // let tex = await GameHelp.load(url, 'jpg');
	//   // var spriteFrame = new cc.SpriteFrame(tex);
	//   // //cc.log("touxiangtupian=====", spriteFrame)
	//   // return spriteFrame;

	//   let tex = await GameHelp.load_net(url, { ext: '.png' });
	//   var spriteFrame = new cc.SpriteFrame(tex);
	//   return spriteFrame;

	//   // var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
	//   // cc.log('dirpath ->', dirpath);

	//   // // var md5Sign = require('signMd5').md5Sign;
	//   // // let md5URL = md5Sign(url);
	//   // let md5URL = window.btoa(url);
	//   // var filepath = dirpath + md5URL + '.jpg';

	//   // cc.log('filepath ->', filepath);

	//   // // function loadEnd() {
	//   // //   cc.loader.load(filepath, function(err, tex) {
	//   // //     if (err) {
	//   // //       cc.error(err);
	//   // //     } else {
	//   // //       var spriteFrame = new cc.SpriteFrame(tex);
	//   // //       if (spriteFrame) {
	//   // //         spriteFrame.retain();
	//   // //         callback(spriteFrame);
	//   // //       }
	//   // //     }
	//   // //   });
	//   // // }

	//   // if (jsb.fileUtils.isFileExist(filepath)) {
	//   //   cc.log('Remote is find' + filepath);
	//   //   // loadEnd();

	//   //   let tex = await GameHelp.load(filepath, 'jpg');
	//   //   var spriteFrame = new cc.SpriteFrame(
	//   //     tex
	//   //     // cc.Rect(0, 0, tex.width, tex.height)
	//   //   );
	//   //   // spriteFrame.retain();
	//   //   return spriteFrame;
	//   // }

	//   // // var saveFile = function(data) {
	//   // //
	//   // // };

	//   // let response = NetHttp.AsyncXMLHttpRequestObject(url);
	//   // if (typeof response !== 'undefined') {
	//   //   if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
	//   //     jsb.fileUtils.createDirectory(dirpath);
	//   //   } else {
	//   //     cc.log('路径exist');
	//   //   }

	//   //   // new Uint8Array(data) writeDataToFile  writeStringToFile
	//   //   if (jsb.fileUtils.writeDataToFile(new Uint8Array(response), filepath)) {
	//   //     cc.log('Remote write file succeed.');
	//   //     // loadEnd();
	//   //     let tex = await GameHelp.load(filepath, 'jpg');
	//   //     var spriteFrame = new cc.SpriteFrame(
	//   //       tex
	//   //       // cc.Rect(0, 0, tex.width, tex.height)
	//   //     );
	//   //     // spriteFrame.retain();
	//   //     return spriteFrame;
	//   //   } else {
	//   //     cc.log('Remote write file failed.');
	//   //   }
	//   // } else {
	//   //   cc.log('Remote download file failed.');
	//   // }
	//   // //   var xhr = new XMLHttpRequest();
	//   // //   xhr.onreadystatechange = function() {
	//   // //     cc.log('xhr.readyState  ' + xhr.readyState);
	//   // //     cc.log('xhr.status  ' + xhr.status);
	//   // //     if (xhr.readyState === 4) {
	//   // //       if (xhr.status === 200) {
	//   // //         //responseType一定要在外面设置
	//   // //         // xhr.responseType = 'arraybuffer';
	//   // //         let response = xhr.response;
	//   // //         saveFile(response);
	//   // //       }
	//   // //     }
	//   // //   }.bind(this);
	//   // //   //responseType一定要在外面设置
	//   // //   xhr.responseType = 'arraybuffer';
	//   // //   xhr.open('GET', url, true);
	//   // //   xhr.send();
	// }

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////内部方法////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//判断地址是网络还是本地
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
	//从resource下加载图片
	public static getUrl(url, phpUrl) {
		var newUrl = url;
		if (phpUrl) {
			newUrl = phpUrl + '?url=' + url;
		}
		return newUrl;
	}
}
