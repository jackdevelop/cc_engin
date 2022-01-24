/**
 * PopUpManager
 */

import BaseCache from "../base/BaseCache";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopUpManager extends BaseCache {
  /**单例实例**/
  private static instance: PopUpManager = null;

  //需要 prefab
  // @property([cc.Prefab])
  // Prefab_arr: Array<cc.Prefab> = [];

  @property({ type: [cc.Prefab], override: true })
  obj_arr: Array<cc.Prefab> = [];

  // private _Script_hash:any= null;//存储脚本对象
  // private m_hash: any = null; //存储prefable 对象
  // private  __zorder:int = 1;

  onLoad() {
    PopUpManager.instance = this;
    super.onLoad();
  }

  // private init(){
  //   this.m_hash = new Object();
  //   for (var i = 0; i < this.obj_arr.length; i++) {
  //       var one = this.obj_arr[i];
  //       this.m_hash[one.name] = one;
  //   }
  // }

  // /**
  //  *  获取 
  //  * @param name
  //  */
  // public static getOne(name: string) {
  //   var self = PopUpManager.instance;

  //   if (self && self.m_hash) {
  //     var current = self.m_hash[name];
  //     return current;
  //   }
  // }

  // /**
  //  *  删除 
  //  * @param name
  //  */
  // public static removeOne(name: string) {
  //   var self = PopUpManager.instance;

  //   if (self && self.m_hash) {
  //     // var currentprefab = self._Prefab_hash[name];
  //     self.m_hash[name] = null;
  //     delete self.m_hash[name];
  //   }
  // }
  // /**
  //  *  这个是直接通过编辑器添加点击事件
  //  *
  //  * @param event
  //  * @param customEventData
  //  */
  // private addPopUpByButtonEvent(event, customEventData) {
  //   //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
  //   // var node = event.target;
  //   // var button = node.getComponent(cc.Button);
  //   //这里的 customEventData 参数就等于你之前设置的 "foobar"
  //   PopUpManager.addPopUp(customEventData);
  // }
  // private  removePopUpByButtonEvent(event, customEventData) {
  //   PopUpManager.removePopUp(customEventData);
  // }
  //
  //
  //
  //
  //   /**
  //    * 弹出窗口
  //    * @param window window是要弹出的窗口
  //    * @param parent parent是指其弹出时的父项 可以为null
  //    * @param modal modal是指是否为模态，即外界可否操作（窗口存在时），false是可以。 默认为true
  //    */
  //   private static _addPopUp_animation(currentscript) {
  //     var node_parent = currentscript.node.getChildByName('node_parent');
  //     if (node_parent) {
  //       // var action1 = cc.scaleTo(0.0001, 0.01);
  //       var action2 = cc.scaleTo(0.05, 1.01);
  //       var action3 = cc.scaleTo(0.05, 0.99);
  //       var action4 = cc.scaleTo(0.05, 1);
  //       var finished = cc.callFunc(function(target) {
  //         // var viewSize = cc.winSize;
  //         // node_parent.setContentSize(viewSize.width, viewSize.height);
  //         // node_parent.setScale(1, 1);
  //       }, this);
  //
  //       // var GameConfig = require('GameConfig');
  //       // if (GameConfig.is_game_hide == true) {
  //       // } else {
  //         node_parent.setScale(1);
  //         node_parent.setScale(0.1);
  //         var endAction = cc.sequence(
  //           // action1,
  //           action2,
  //           action3,
  //           action4,
  //           finished
  //         );
  //         node_parent.runAction(endAction);
  //       // }
  //     }
  //   }
  // private _addPopUp(currentprefab:cc.Prefab, name:string, parent:cc.Node, param) {
  //     // var self = PopUpManager.instance;
  //
  //     var ui = cc.instantiate(currentprefab);
  //     if (ui) {
  //       ui.parent = parent;
  //
  //       var currentscript = ui.getComponent('BaseUI');
  //       currentscript.show(param);
  //       GameHelp.setTopZOrder(currentscript, this.__zorder);
  //       this.__zorder++;
  //       this._Script_hash[name] = currentscript;
  //       PopUpManager._addPopUp_animation(currentscript);
  //     }
  //   }
  //
  // public static async addPopUp(name:string, prefab_url:string, parent:cc.Node, param, modal) {
  //     var self = PopUpManager.instance;
  //     var that = this;
  //
  //     cc.log(name, '当前打开窗口');
  //     if (parent == null)
  //       parent = GameHelp.getLayerBySceneLayerName(GameLayerConstants.UI_LAYER);
  //
  //     var currentscript = self._Script_hash[name];
  //     if (currentscript == null) {
  //       var currentprefab = self._Prefab_hash[name];
  //       if (currentprefab == null) {
  //         LoadingChrysanthemum.show();
  //
  //
  //         // cc.loader.loadRes(prefab_url, function(err, res) {
  //         //   if (err) {
  //         //     that.addPopUp(name, prefab_url, parent, param, modal);
  //         //     return;
  //         //   }
  //         //
  //         //   LoadingChrysanthemum.hide();
  //         //   self._addPopUp(res, name, parent, param);
  //         // });
  //
  //         let res = await GameHelp.loadRes(prefab_url);
  //         LoadingChrysanthemum.hide();
  //         self._addPopUp(res, name, parent, param);
  //
  //
  //       } else {
  //         self._addPopUp(currentprefab, name, parent, param);
  //       }
  //     } else {
  //       currentscript.show(param);
  //       GameHelp.setTopZOrder(currentscript, this.__zorder);
  //       this.__zorder++;
  //       PopUpManager._addPopUp_animation(currentscript);
  //     }
  //   }
  //
  //   /**
  //    * 移除指定窗口
  //    * @param window
  //    */
  //   public static removePopUp(name:string, prefab_url) {
  //     var self = PopUpManager.instance;
  //
  //     var currentscript = self._Script_hash[name];
  //     if (currentscript != null) {
  //       currentscript.close();
  //       //this._removePopUp_animation(currentscript);
  //     }
  //   }
  //   // _removePopUp_animation: function(currentscript) {
  //   //   var node_parent = currentscript.node.getChildByName("node_parent");
  //   //   if (node_parent) {
  //   //     var action2 = cc.scaleTo(0.05, 0.1);
  //   //     var finished = cc.callFunc(function(target) {
  //   //       currentscript.close();
  //   //       node_parent.setScale(1, 1);
  //   //     }, self);
  //   //     var endAction = cc.sequence(action2, finished);
  //   //     node_parent.runAction(endAction);
  //   //   }
  //   // },
  //   /**
  //    * 移除隐藏所有指定窗口
  //    * @param window
  //    */
  //   public static removeAllPopUp() {
  //     var self = PopUpManager.instance;
  //     var hasShow = false;
  //
  //     _.forEach(self._Script_hash, function(v, k) {
  //       if (v) {
  //         if (v != null) {
  //           if (v.isShow()) {
  //             v.close();
  //             hasShow = true;
  //           }
  //         }
  //       }
  //     });
  //     // var currentscript = self._Script_hash[name];
  //
  //     return hasShow;
  //   }
  //
  // public static getPopUp(name:string) {
  //     var self = PopUpManager.instance;
  //
  //     var currentscript = self._Script_hash[name];
  //     return currentscript;
  //   }
  //

  //   /**
  //    * 彻底删除指定窗口
  //    * @param window
  //    */
  //   public static delPopUp(name:string) {
  //     var self = PopUpManager.instance;
  //
  //     var currentscript = self._Script_hash[name];
  //     if (currentscript != null) {
  //       currentscript.close();
  //       currentscript.node.destroy();
  //
  //       self._Script_hash[name] = null;
  //     }
  //   }
}
