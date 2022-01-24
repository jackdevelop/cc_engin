import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import ListItem from './ListItem';
var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListHighItem extends ListItem {
  @property({ tooltip: '是否自动销毁 ImageLoader 资源' })
  GAME_AUTO_CLEAN: boolean = true;

  @property({ tooltip: '是否可以点击' })
  is_touch: boolean = false;
  @property({ tooltip: '是否可以长按' })
  is_touch_long: boolean = false;
  m_is_touch_fun; //点击响应
  is_touch_long_fun; //长按反应

  /**
   *  设置单独的点击响应
   * @param is_touch
   * @param is_touch_fun  自定义点击反应函数
   */
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

  //动态管理 ImageLoader 的资源
  //需要动态管理的资源
  private m_ref_ImageLoader = null;
  onRefAdd_ImageLoader(arr) {
    if (this.GAME_AUTO_CLEAN && GameConstants.GAME_AUTO_CLEAN) {
      // this.m_ref_ImageLoader = arr;
      // _.each(this.m_ref_ImageLoader, function (v, k) {
      //   if (v && cc.isValid(v) && v.spriteFrame) v.spriteFrame.addRef();
      // });
    }
  }
  onRefDec_ImageLoader() {
    if (this.GAME_AUTO_CLEAN && GameConstants.GAME_AUTO_CLEAN) {
      // _.each(this.m_ref_ImageLoader, function (v, k) {
      //   if (v && cc.isValid(v) && v.spriteFrame) v.spriteFrame.decRef();
      // });
    }
  }
}
