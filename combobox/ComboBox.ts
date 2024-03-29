const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class ComboBox extends cc.Component {
  @property({ type: cc.Node, tooltip: '下拉按钮右边的小三角形' })
  triangle: cc.Node = null;
  @property({ type: cc.Label, tooltip: '下拉按钮上显示的文本' })
  comboLabel: cc.Label = null;
  @property({ type: cc.Node, tooltip: '下拉框' })
  dropDown: cc.Node = null;
  @property({ type: cc.Node, tooltip: '垂直布局' })
  vLayoutNode: cc.Node = null;
  @property({ type: cc.Node, tooltip: '滚动视图内容' })
  contentNode: cc.Node = null;
  @property({ type: cc.Prefab, tooltip: '下拉框选项' })
  itemPrefab: cc.Prefab = null;
  private itemArray = [];
  private isDropDown = false;
  private fun = null;
  init(params, fun) {
    let info = params.info;
    this.fun = fun;
    this.itemArray = info || [
      'Cocos Creator',
      'Cocos-2dx',
      'Cocos2d-js',
      'Cocos2d-Lua',
      'Cocos Creator 3D',
      'Cocos Service',
      'Cocos社区',
    ];
    this.initItems();
    this.comboLabel.string = info[0];
  }
  comboboxClicked(idx) {
    this.rotateTriangle();
    this.showHideDropDownBox();
    if (!this.isDropDown) {
      this.isDropDown = true;
    } else {
      this.isDropDown = false;
      if (this.fun && idx != null) {
        this.fun(idx, idx);
        return;
      }
    }
    this.fun(idx, idx);
  }
  p_show(idx) {
    if (this.isDropDown) {
      return;
    }
    this.rotateTriangle();
    this.showHideDropDownBox();
    this.isDropDown = !this.isDropDown;
  }
  p_hide(idx) {
    if (!this.isDropDown) {
      return;
    }
    this.rotateTriangle();
    this.showHideDropDownBox();
    this.isDropDown = !this.isDropDown;
  }
  onClickNode(event, eventdata) {
    this.comboboxClicked(null);
  }
  rotateTriangle() {
    if (!this.isDropDown) {
      let rotateAction = cc.rotateTo(0.5, 180).easing(cc.easeCubicActionOut());
      this.triangle.runAction(rotateAction);
    } else {
      let rotateAction = cc.rotateTo(0.5, 0).easing(cc.easeCubicActionOut());
      this.triangle.runAction(rotateAction);
    }
  }
  showHideDropDownBox() {
    if (!this.itemArray || this.itemArray.length < 1) {
      return;
    }
    if (!this.isDropDown) this.dropDown.active = true;
    else this.dropDown.active = false;
  }
  initItems() {
    let totalHeight = 0;
    for (let i = 0; i < this.itemArray.length; i++) {
      let item = cc.instantiate(this.itemPrefab);
      item.children[0].getComponent(cc.Label).string = this.itemArray[i];
      item.getComponent('Item').initComboBox(this, i);
      this.vLayoutNode.addChild(item);
      totalHeight += item.height;
    }
    if (totalHeight > this.contentNode.height)
      this.contentNode.height = totalHeight;
  }
}
