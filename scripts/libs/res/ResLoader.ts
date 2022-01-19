import { ResLeakChecker } from "./ResLeakChecker";




export type ProcessCallback = (completedCount: number, totalCount: number, item: any) => void;

export type CompletedCallback = (error: Error, resource: any | any[]) => void;

export default class ResLoader {

    public resLeakChecker: ResLeakChecker = null;

    
    public loadRes(url: string | string[]);
    public loadRes(url: string | string[], onCompleted: CompletedCallback);
    public loadRes(url: string | string[], onProgess: ProcessCallback, onCompleted: CompletedCallback);
    public loadRes(url: string | string[], type: typeof cc.Asset);
    public loadRes(url: string | string[], type: typeof cc.Asset, onCompleted: CompletedCallback);
    public loadRes(url: string | string[], type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback);
    public loadRes() {
        cc.resources.load.apply(cc.resources, arguments);
    }

    public loadResDir(dir: string);
    public loadResDir(url: string, onCompleted: CompletedCallback);
    public loadResDir(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback);
    public loadResDir(url: string, type: typeof cc.Asset);
    public loadResDir(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback);
    public loadResDir(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback);
    public loadResDir() {
        cc.resources.loadDir.apply(cc.resources, arguments);
        
    }

    public loadRemoteRes<T extends cc.Asset>(url: string, options: Record<string, any>, onComplete: (err: Error, asset: T) => void): void;
    public loadRemoteRes<T extends cc.Asset>(url: string, options: Record<string, any>): void;
    public loadRemoteRes<T extends cc.Asset>(url: string, onComplete: (err: Error, asset: T) => void): void;
    public loadRemoteRes<T extends cc.Asset>(url: string): void;	
    public loadRemoteRes() {
        cc.assetManager.loadRemote.apply(cc.assetManager, arguments);
    }

    public releaseArray(assets: cc.Asset[]) {
        for (let i = 0; i < assets.length; ++i) {
            this.releaseAsset(assets[i]);
        }
    }

    
    public releaseAsset(asset: cc.Asset) {
        asset.decRef();
    }
}

export let resLoader: ResLoader = new ResLoader();

