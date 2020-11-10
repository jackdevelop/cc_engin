const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class Item extends cc.Component {
  private cb;
  private idx;
  initComboBox(cb, idx) {
    this.cb = cb;
    this.idx = idx;
  }
  itemBtn(event) {
    this.cb.comboLabel.string = event.target.children[0].getComponent(
      cc.Label
    ).string;
    this.cb.comboboxClicked(this.idx);
  }
}
