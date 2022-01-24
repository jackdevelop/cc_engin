// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import { LogWrap } from '../utils/LogWrap';
// import { GameHelp } from '../utils/GameHelp';
import PopUpManager from "../manager/PopUpManager";
import { GameLoader } from "../utils/GameLoader";
var _ = require("Underscore");

// interface PoolObj {
//     name: string;
//     url: string;
//     prefab:cc.Prefab;
// }

/**
 *  PoolManager
 *  资源管理
 */
export default class PoolManager {
    /**单例实例**/
    private static instance: PoolManager = null;
    public static getInstance(): PoolManager {
        if (this.instance == null) {
            this.instance = new PoolManager();
            this.instance._init();
        }
        return this.instance;
    }

    //cc.pool 存储
    private objPools_free: any = null;

    _init() {
        this.objPools_free = new Object();
    }

    /**
     *  从对象池中获取一个对象
     * @param name
     * @param prefab
     * @returns {null}
     */
    public static requestPoolObj(name: string, prefab: cc.Prefab) {
        if (name == null) {
            cc.log("Error: the pool do not have enough free item.");
            return null;
        }

        //是否新创建
        let isnew = false;

        let instance = PoolManager.getInstance();
        let objs = instance.objPools_free[name];

        if (objs == null) {
            cc.log("requestPoolObj cc.NodePool,name:" + name);

            objs = new cc.NodePool(name);
            instance.objPools_free[name] = objs;
        }

        //如果没有 直接去 PopUpManager 中寻找
        if (!prefab) {
            prefab = PopUpManager.getOne(name);

            // if(!prefab){
            //   prefab = await GameLoader.load(name,null)
            // }
        }

        //获取出来
        let retobj = objs.get();
        if (!retobj) {
            if (prefab) {
                cc.log("requestPoolObj instantiate object");
                let oneobj = cc.instantiate(prefab);
                objs.put(oneobj);
                instance.objPools_free[name] = objs;

                retobj = objs.get();
            }
        }

        if (retobj) {
            retobj.active = true;
        }

        return retobj;
    }

    // /**
    //  *   从对象池中获取一个对象
    //  *    当对象池中没有  还会会从远程重新加载获取（与 requestPoolObj 的区别）
    //  * @param name
    //  * @param url
    //  * @param prefab
    //  * @param callback
    //  */
    // public static async requestPoolObjByUrl(
    //   name: string,
    //   url: string,
    //   prefab: cc.Prefab
    // ) {
    //   let instance = PoolManager.getInstance();

    //   let obj = this.requestPoolObj(name, prefab);
    //   if (obj == null) {
    //     let res = await GameHelp.load(url, null);
    //     let one = cc.instantiate(res);

    //     let free = instance.objPools_free[name]; //|| (new cc.NodePool(name));
    //     free.put(one);
    //     instance.objPools_free[name] = free;

    //     obj = free.get();
    //   }
    //   return obj;
    // }

    /**
     *  回收一个资源 到 对象池 中
     * @param name
     * @param obj
     */
    public static returnPoolObj(name: string, obj) {
        let instance = PoolManager.getInstance();

        let free = instance.objPools_free[name];
        free.put(obj);
        obj.setPosition(cc.v2(0, 0));
        // obj.removeFromParent()
        obj.active = false;
        instance.objPools_free[name] = free;
    }

    /**
     *  回收某类型资源
     */
    public static clearOnePoolObj(name: string) {
        let instance = PoolManager.getInstance();

        let free = instance.objPools_free[name];
        free.clear();
        instance.objPools_free[name] = free;
    }

    /**
     *  回收所有
     */
    public static clearAllPoolObj() {
        let instance = PoolManager.getInstance();
        let free = instance.objPools_free;
        _.each(free, function (v, k) {
            PoolManager.clearOnePoolObj(k);
        });
    }
}
