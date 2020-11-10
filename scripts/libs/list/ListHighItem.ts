import { GameConstants } from "../../../../cc_own/constants/GameConstants";
import ListItem from "./ListItem";
var _ = require("Underscore");
const { ccclass, property } = cc._decorator;
@ccclass
export default class ListHighItem extends ListItem {
  @property({ type: cc.Boolean, tooltip: "是否自动销毁 ImageLoader 资源" })
  GAME_AUTO_CLEAN: cc.Boolean = true;
  @property({ type: cc.Boolean, tooltip: "是否可以点击" })
  is_touch: cc.Boolean = false;
  @property({ type: cc.Boolean, tooltip: "是否可以长按" })
  is_touch_long: cc.Boolean = false;
  m_is_touch_fun;
  is_touch_long_fun;
  onSetTouch(is_touch, is_touch_fun, is_touch_long, is_touch_long_fun) {
    this.is_touch = is_touch;
    this.m_is_touch_fun = is_touch_fun;
    this.is_touch_long = is_touch_long;
    this.is_touch_long_fun = is_touch_long_fun;
  }
  onDestroy() {
    this.onRefDec_ImageLoader();
    super.onDestroy();
  }
  private m_ref_ImageLoader = null;
  onRefAdd_ImageLoader(arr) {}
  onRefDec_ImageLoader() {}
}
