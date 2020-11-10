
const {
  ccclass,
  property,
  disallowMultiple,
  menu,
  executionOrder,
} = cc._decorator;



enum SelectedType {
  NONE = 0,
  TOGGLE = 1,
  SWITCH = 2,
}

@ccclass
@disallowMultiple()
@menu('自定义组件/List Item')
@executionOrder(-5001) 
export default class ListItem extends cc.Component {
  
  @property({ type: cc.Sprite, tooltip: CC_DEV && '图标' })
  icon: cc.Sprite = null;
  
  @property({ type: cc.Node, tooltip: CC_DEV && '标题' })
  title: cc.Node = null;
  
  @property({
    type: cc.Enum(SelectedType),
    tooltip: CC_DEV && '选择模式',
  })
  selectedMode: SelectedType = SelectedType.NONE;
  
  @property({
    type: cc.Node,
    tooltip: CC_DEV && '被选标志',
    visible() {
      return this.selectedMode > SelectedType.NONE;
    },
  })
  selectedFlag: cc.Node = null;
  
  @property({
    type: cc.SpriteFrame,
    tooltip: CC_DEV && '被选择的SpriteFrame',
    visible() {
      return this.selectedMode == SelectedType.SWITCH;
    },
  })
  selectedSpriteFrame: cc.SpriteFrame = null;
  
  _unselectedSpriteFrame: cc.SpriteFrame = null;
  
  @property({
    tooltip: CC_DEV && '自适应尺寸（宽或高）',
  })
  adaptiveSize: boolean = false;
  
  _selected: boolean = false;
  set selected(val: boolean) {
    this._selected = val;
    if (!this.selectedFlag) return;
    switch (this.selectedMode) {
      case SelectedType.TOGGLE:
        this.selectedFlag.active = val;
        break;
      case SelectedType.SWITCH:
        let sp: cc.Sprite = this.selectedFlag.getComponent(cc.Sprite);
        if (sp)
          sp.spriteFrame = val
            ? this.selectedSpriteFrame
            : this._unselectedSpriteFrame;
        break;
    }
  }
  get selected() {
    return this._selected;
  }
  
  private _btnCom: any;
  get btnCom() {
    if (!this._btnCom) this._btnCom = this.node.getComponent(cc.Button);
    return this._btnCom;
  }
  
  public list;
  
  private _eventReg = false;
  
  public listId: number;

  onLoad() {
    
    
    
    
    if (this.selectedMode == SelectedType.SWITCH) {
      let com: cc.Sprite = this.selectedFlag.getComponent(cc.Sprite);
      this._unselectedSpriteFrame = com.spriteFrame;
    }
  }

  onDestroy() {
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
  }

  _registerEvent() {
    if (!this._eventReg) {
      if (this.btnCom && this.list.selectedMode > 0) {
        this.btnCom.clickEvents.unshift(this.createEvt(this, 'onClickThis'));
      }
      if (this.adaptiveSize) {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
      }
      this._eventReg = true;

      this.node.name = 'item_' + this.listId;
    }
  }

  _onSizeChange() {
    this.list._onItemAdaptive(this.node);
  }
  
  createEvt(
    component: cc.Component,
    handlerName: string,
    node: cc.Node = null
  ) {
    if (!component.isValid) return; 
    component['comName'] =
      component['comName'] ||
      component.name
        .match(/\<(.*?)\>/g)
        .pop()
        .replace(/\<|>/g, '');
    let evt = new cc.Component.EventHandler();
    evt.target = node || component.node;
    evt.component = component['comName'];
    evt.handler = handlerName;
    return evt;
  }

  showAni(aniType: number, callFunc: Function, del: boolean) {
    let acts: any[];
    switch (aniType) {
      case 0: 
        acts = [cc.scaleTo(0.2, 0.7), cc.moveBy(0.3, 0, this.node.height * 2)];
        break;
      case 1: 
        acts = [cc.scaleTo(0.2, 0.7), cc.moveBy(0.3, this.node.width * 2, 0)];
        break;
      case 2: 
        acts = [cc.scaleTo(0.2, 0.7), cc.moveBy(0.3, 0, this.node.height * -2)];
        break;
      case 3: 
        acts = [cc.scaleTo(0.2, 0.7), cc.moveBy(0.3, this.node.width * -2, 0)];
        break;
      default:
        
        acts = [cc.scaleTo(0.3, 0.1)];
        break;
    }
    if (callFunc || del) {
      acts.push(
        cc.callFunc(() => {
          if (del) {
            this.list._delSingleItem(this.node);
            for (
              let n: number = this.list.displayData.length - 1;
              n >= 0;
              n--
            ) {
              if (this.list.displayData[n].id == this.listId) {
                this.list.displayData.splice(n, 1);
                break;
              }
            }
          }
          callFunc();
        })
      );
    }
    this.node.runAction(cc.sequence(acts));
  }

  onClickThis() {
    this.list.selectedId = this.listId;
  }

  
  onShow(param: any) {
    return true;
  }
}
