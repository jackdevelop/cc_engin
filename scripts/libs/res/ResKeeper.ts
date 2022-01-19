import ResLoader, {
  resLoader,
  CompletedCallback,
  ProcessCallback,
} from './ResLoader';
import { LoadResArgs, ResUtil } from './ResUtil';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResKeeper extends cc.Component {
  private autoRes: cc.Asset[] = [];

  
  loadRes<T extends cc.Asset>(
    paths: string | string[],
    type: typeof cc.Asset,
    onProgress: ProcessCallback,
    onComplete: CompletedCallback
  ): void;
  loadRes<T extends cc.Asset>(
    paths: string | string[],
    onProgress: ProcessCallback,
    onComplete: CompletedCallback
  ): void;
  loadRes<T extends cc.Asset>(
    paths: string | string[],
    type: typeof cc.Asset,
    onComplete: CompletedCallback
  ): void;
  loadRes<T extends cc.Asset>(
    paths: string | string[],
    onComplete: CompletedCallback
  ): void;
  loadRes<T extends cc.Asset>(
    paths: string | string[],
    type: typeof cc.Asset
  ): void;
  loadRes<T extends cc.Asset>(paths: string | string[]): void;
  public loadRes() {
    let resArgs: LoadResArgs = ResUtil.parseLoadResArgs.apply(this, arguments);
    let callback = resArgs.onCompleted;
    resArgs.onCompleted = (error: Error, res: cc.Asset) => {
      if (!error) {
        res.addRef();
        this.autoRes.push(res);
      }
      callback && callback(error, res);
    };
    resLoader.loadRes(
      resArgs.urls,
      resArgs.type,
      resArgs.onProgess,
      resArgs.onCompleted
    );
  }

  
  public onDestroy() {
    cc.log('资源销毁===');
    this.releaseAutoRes();
  }

  
  public releaseAutoRes() {
    for (let index = 0; index < this.autoRes.length; index++) {
      const element = this.autoRes[index];
      element.decRef();
    }
    this.autoRes.length = 0;
  }

  
  public autoReleaseRes(asset: cc.Asset) {
    asset.addRef();
    this.autoRes.push(asset);
  }
}
