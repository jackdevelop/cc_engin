const { ccclass, property } = cc._decorator;
@ccclass
export default class PopUpManager extends cc.Component {
  private static instance: PopUpManager = null;
  @property([cc.Prefab]) Prefab_arr: Array<cc.Prefab> = [];
  private _Prefab_hash: any = null;
  onLoad() {
    PopUpManager.instance = this;
    this._Prefab_hash = new Object();
    for (var i = 0; i < this.Prefab_arr.length; i++) {
      var one = this.Prefab_arr[i];
      this._Prefab_hash[one.name] = one;
    }
  }
  public static getPrefab(name: string) {
    var self = PopUpManager.instance;
    if (self && self._Prefab_hash) {
      var currentprefab = self._Prefab_hash[name];
      return currentprefab;
    }
  }
  public static removePrefab(name: string) {
    var self = PopUpManager.instance;
    if (self && self._Prefab_hash) {
      self._Prefab_hash[name] = null;
      delete self._Prefab_hash[name];
    }
  }
}
