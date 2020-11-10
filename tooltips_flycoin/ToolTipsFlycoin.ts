import { ImageLoader } from "../scripts/libs/utils/ImageLoader";
import { GameHelp } from "../scripts/libs/utils/GameHelp";
import { ToolTips } from "../tooltips/ToolTips";
import { PromiseUtil } from "../scripts/libs/util/PromiseUtil";

var _ = require("Underscore");

const { ccclass, property } = cc._decorator;

/**
 * 动画
 */
@ccclass
export class ToolTipsFlycoin extends ToolTips {
  private static instance = null;

  @property({ type: cc.Boolean, tooltip: "是否自动销毁 ImageLoader 资源" })
  GAME_AUTO_CLEAN: cc.Boolean = true;

  onLoad() {
    ToolTipsFlycoin.instance = this;

    let pos = cc.view.getCanvasSize();
    this.m_start_pos = pos.height / 4;
  }

  public set_text(retobj, param) {
    if (!retobj) {
      return;
    }

    let item_icon = param.item_icon;
    let item_num = param.item_num || 0;
    let item_text = param.item_text;

    if (retobj.getChildByName("Tips_txt")) {
      var Tips_txt = retobj.getChildByName("Tips_txt").getComponent(cc.Label);
      Tips_txt.string = item_text;
    }

    this.setAvatar(retobj, item_icon);
  }

  public async setAvatar(retobj, item_icon) {
    if (retobj.getChildByName("Tips_icon")) {
      var Tips_icon = retobj
        .getChildByName("Tips_icon")
        .getComponent(cc.Sprite);

      if (Tips_icon) {
        if (item_icon) {
          let spriteFrame = await ImageLoader.load(
            item_icon,
            null,
            Tips_icon,
            this.GAME_AUTO_CLEAN
          );

          Tips_icon.node.active = true;
        } else {
        }
      }
    }
  }

  public static async showAll(arr_param) {
    let self = this;

    if (arr_param) {
      for (let index = 0; index < arr_param.length; index++) {
        const one_element = arr_param[index];
        ToolTipsFlycoin.show(one_element);
        await PromiseUtil.wait_time(0.2, null);
      }
    }
  }

  public static show(one_element): void {
    if (!one_element) {
      return;
    }

    let instance = ToolTipsFlycoin.instance;
    if (instance == null) {
      cc.log("no ToolTips instance ");
      return;
    }

    let retobj = instance.get_prefab();
    if (retobj) {
      instance.set_text(retobj, one_element);
      instance.set_action(retobj);
    }
    return retobj;
  }

  public static showCustom(): void {
    let instance = ToolTipsFlycoin.instance;
    if (instance == null) {
      cc.log("no ToolTips instance ");
      return;
    }

    let retobj = instance.get_prefab();
    return retobj;
  }
}
