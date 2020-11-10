import { BaseScene } from "./BaseScene";
import { GameNotify } from "../utils/GameNotify";
export class BaseController {
  private _scene: BaseScene;
  public getScene(): BaseScene {
    return this._scene;
  }
  __onStarted__(scene: BaseScene, ...params) {
    this._scene = scene;
  }
  __beforeDestroy__() {
    this._scene = null;
  }
}
