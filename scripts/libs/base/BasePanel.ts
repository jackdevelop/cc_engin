import { MPanel, MPanelConfig, MPanelExtends } from "../component/MPanel";
import { AudioManager } from "../manager/AudioManager";
const { ccclass, property, menu } = cc._decorator;
interface OpenParams {
  name: string;
}
interface CloseParams {
  name: string;
}
const C = { FADE_TIME: MPanel.TIME * 3 };
@ccclass
@menu("panel/hall/BasePanel")
@MPanelConfig({ PATH: "hall/BasePanel", TYPE: "single" })
export class BasePanel extends MPanelExtends {
  static OPEN_PARAMS: OpenParams;
  static CLOSE_PARAMS: CloseParams;
  protected m_param: any = null;
  @property({ type: cc.Boolean, tooltip: "是否包含动画" })
  is_anmation: cc.Boolean = false;
  @property({ type: cc.AudioClip, tooltip: "打开界面的声音" })
  sound_begin: cc.AudioClip = null;
  @property({ type: cc.AudioClip, tooltip: "关闭界面的声音" })
  sound_end: cc.AudioClip = null;
  async on_open(params: OpenParams) {
    if (this.is_anmation) {
      await MPanel.in_scale(this.node, null);
      this.node.setScale(1);
      AudioManager.getInstance().playSFX(this.sound_begin, null);
    }
    return true;
  }
  async on_close(params: OpenParams) {
    if (this.is_anmation) {
      await MPanel.out_scale(this.node, null);
      this.node.setScale(0);
      AudioManager.getInstance().playSFX(this.sound_end, null);
    }
    return true;
  }
  public __onStarted__(param: any) {
    this.m_param = param;
    this.onStarted(param);
  }
}
