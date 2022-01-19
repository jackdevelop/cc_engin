import ResKeeper from "./ResKeeper";
import { resLoader, CompletedCallback, ProcessCallback } from "./ResLoader";


export class LoadResArgs {
    urls: string | string[];
    type: typeof cc.Asset;
    onCompleted?: CompletedCallback;
    onProgess?: ProcessCallback;
};




































































export class ResUtil {

    
    public static parseLoadResArgs(urls, type, onProgess, onCompleted): LoadResArgs {
        if (onCompleted === undefined) {
            if (typeof type == 'function') {
                if (typeof onProgess == 'function') {
                    onCompleted = onProgess;
                    onProgess = type;
                } else {
                    onCompleted = type;
                }
                type = null;
            } else if (typeof onProgess == 'function') {
                onCompleted = onProgess;
                onProgess = null;
            }
        }
        return { urls, type, onProgess, onCompleted };
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    public static getResKeeper(attachNode: cc.Node, autoCreate?: boolean): ResKeeper {
        if (attachNode) {
            let ret = attachNode.getComponent(ResKeeper);
            if (!ret) {
                if (autoCreate) {
                    return attachNode.addComponent(ResKeeper);
                } else {
                    return ResUtil.getResKeeper(attachNode.parent, autoCreate);
                }
            }
            return ret;
        }
        return null;
    }

    
    public static assignWith(srcAsset: cc.Asset, targetNode: cc.Node, autoCreate?: boolean): any {
        let keeper = ResUtil.getResKeeper(targetNode, autoCreate);
        if (keeper && srcAsset) {
            keeper.autoReleaseRes(srcAsset);
            return srcAsset;
        }
        console.error(`AssignWith ${srcAsset} to ${targetNode} faile`);
        return null;
    }

    
    public static instantiate(prefab: cc.Prefab): cc.Node {
        let node = cc.instantiate(prefab);
        let keeper = ResUtil.getResKeeper(node, true);
        if (keeper) {
            keeper.autoReleaseRes(prefab);
            return node;
        }
        console.warn(`instantiate ${prefab}, autoRelease faile`);
        return node;
    }

    
    
    
    
    
    
    
    
    
    
}
