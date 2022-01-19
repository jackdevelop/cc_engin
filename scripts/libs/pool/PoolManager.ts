











import PopUpManager from "../manager/PopUpManager";
import { GameLoader } from "../utils/GameLoader";
var _ = require("Underscore");








export default class PoolManager {
    
    private static instance: PoolManager = null;
    public static getInstance(): PoolManager {
        if (this.instance == null) {
            this.instance = new PoolManager();
            this.instance._init();
        }
        return this.instance;
    }

    
    private objPools_free: any = null;

    _init() {
        this.objPools_free = new Object();
    }

    
    public static requestPoolObj(name: string, prefab: cc.Prefab) {
        if (name == null) {
            cc.log("Error: the pool do not have enough free item.");
            return null;
        }

        
        let isnew = false;

        let instance = PoolManager.getInstance();
        let objs = instance.objPools_free[name];

        if (objs == null) {
            cc.log("requestPoolObj cc.NodePool,name:" + name);

            objs = new cc.NodePool(name);
            instance.objPools_free[name] = objs;
        }

        
        if (!prefab) {
            prefab = PopUpManager.getOne(name);

            
            
            
        }

        
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

    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    

    
    
    

    
    
    
    

    
    public static returnPoolObj(name: string, obj) {
        let instance = PoolManager.getInstance();

        let free = instance.objPools_free[name];
        free.put(obj);
        obj.setPosition(cc.v2(0, 0));
        
        obj.active = false;
        instance.objPools_free[name] = free;
    }

    
    public static clearOnePoolObj(name: string) {
        let instance = PoolManager.getInstance();

        let free = instance.objPools_free[name];
        free.clear();
        instance.objPools_free[name] = free;
    }

    
    public static clearAllPoolObj() {
        let instance = PoolManager.getInstance();
        let free = instance.objPools_free;
        _.each(free, function (v, k) {
            PoolManager.clearOnePoolObj(k);
        });
    }
}
