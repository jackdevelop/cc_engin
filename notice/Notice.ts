// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import { LoginService } from '../../app/login/scripts/LoginService';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('engin/Notice')
export default class Notice extends cc.Component {
  @property({ type: cc.RichText, tooltip: '文本' })
  txt_notice: cc.RichText = null;

  @property({ type: cc.Sprite, tooltip: '图片' })
  spt_notice: cc.Sprite = null;

  @property({ type: cc.Float, tooltip: '多久刷新一次' })
  time: number = 0.01;

  @property({ type: cc.Integer, tooltip: '每次x变化多少' })
  time_add_x: number = 1;

  @property({ tooltip: '当公告显示完，是否自动隐藏起来 ' })
  auto_hide: boolean = true;

  //所有的 当前的data
  private _data = [];

  //单例
  private static instance: Notice = null;

  onLoad() {
    Notice.instance = this;

    var self = this;
    var width = this.txt_notice.node.parent.width;

    this.node.active = false;
    self.schedule(function () {
      self.txt_notice.node.x = self.txt_notice.node.x - 1;

      if (self.txt_notice.node.x < -width / 2 - self.txt_notice.node.width) {
        self.show();
        self.txt_notice.node.x = width / 2; //+ self.txt_notice.node.width;
      }
    }, this.time);
  }

  show() {
    if (!this.node.isValid) {
      return;
    }

    let self = this;
    // let m_marquee = LoginService.getInstance().m_marquee;
    let data = self._data.shift();

    if (!data) {
      if (this.auto_hide) {
        this.node.active = false;
        return;
      }

      data = { msg: '欢迎光临' };
    }

    let msg = data.msg;
    if (!msg) return;
    this.node.active = true;
    this.txt_notice.string = msg;
  }

  onDestroy() {
    Notice.instance = null;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ///////////// static 方法 /////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  /**
   * 显示
   */
  public static show(info) {
    if (!info) {
      return;
    }
    var self = Notice.instance;
    if (!self) {
      return;
    }
    if (!self._data) self._data = [];
    self._data.push(info);
  }
}
