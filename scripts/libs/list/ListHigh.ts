const {
  ccclass,
  property,
  disallowMultiple,
  menu,
  executionOrder,
  requireComponent,
} = cc._decorator;

import ListItem from './ListItem';
import List from './List';

enum SelectedType {
  NONE = 0,
  SINGLE = 1, //单选
  MULT = 2, //多选
}

@ccclass
@disallowMultiple()
@menu('framework/ListHigh')
@requireComponent(cc.ScrollView)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@executionOrder(-5000)
export default class ListHigh extends List {
  @property({ tooltip: '当设置items 时  是否强制刷新' })
  is_reflush: boolean = true;

  //     /**
  //    * 创建或更新Item（虚拟列表用）
  //    * @param {Object} data 数据
  //    */
  //     _createOrUpdateItem(data: any) {
  //         let t = this;
  //         let item: any = this.getItemByListId(data.id);
  //         if (!item) { //如果不存在
  //             let canGet: boolean = this._pool.size() > 0;
  //             if (canGet) {
  //                 item = this._pool.get();
  //                 // cc.log('从池中取出::   旧id =', item['_listId'], '，新id =', data.id, item);
  //             } else {
  //                 item = cc.instantiate(this._itemTmp);
  //                 // cc.log('新建::', data.id, item);
  //             }
  //             if (item._listId != data.id) {
  //                 item._listId = data.id;
  //                 item.setContentSize(this._itemSize);
  //             }
  //             item.setPosition(cc.v2(data.x, data.y));
  //             this._resetItemSize(item);
  //             this.content.addChild(item);
  //             if (canGet && this._needUpdateWidget) {
  //                 let widget: cc.Widget = item.getComponent(cc.Widget);
  //                 if (widget)
  //                     widget.updateAlignment();
  //             }
  //             item.setSiblingIndex(this.content.childrenCount - 1);

  //             let listItem: ListItem = item.getComponent(ListItem);
  //             item['listItem'] = listItem;
  //             if (listItem) {
  //                 listItem.listId = data.id;
  //                 listItem.list = this;
  //                 listItem._registerEvent();
  //             }
  //             if (this.renderEvent) {
  //                 cc.Component.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
  //             }
  //         } else if (this._forceUpdate && this.renderEvent && this.is_reflush) { //强制更新
  //             item.setPosition(cc.v2(data.x, data.y));
  //             this._resetItemSize(item);
  //             // cc.log('ADD::', data.id, item);
  //             if (this.renderEvent) {
  //                 cc.Component.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
  //             }
  //         }
  //         this._resetItemSize(item);

  //         this._updateListItem(item['listItem']);
  //         if (this._lastDisplayData.indexOf(data.id) < 0) {
  //             this._lastDisplayData.push(data.id);
  //         }
  //     }

  //当默认选中的时候  不要触发其他  onclick事件，通过第三个参数来识别
  setSelectedId(val: number, rd3_date) {
    let t: any = this;
    let item: any;
    switch (t.selectedMode) {
      case SelectedType.SINGLE: {
        if (!t.repeatEventSingle && val == t._selectedId) return;
        item = t.getItemByListId(val);
        // if (!item && val >= 0)
        //     return;
        let listItem: ListItem;
        if (t._selectedId >= 0) t._lastSelectedId = t._selectedId;
        //如果＜0则取消选择，把_lastSelectedId也置空吧，如果以后有特殊需求再改吧。
        else t._lastSelectedId = null;
        t._selectedId = val;
        if (item) {
          listItem = item.getComponent(ListItem);
          listItem.selected = true;
        }
        if (t._lastSelectedId >= 0 && t._lastSelectedId != t._selectedId) {
          let lastItem: any = t.getItemByListId(t._lastSelectedId);
          if (lastItem) {
            lastItem.getComponent(ListItem).selected = false;
          }
        }
        if (t.selectedEvent) {
          cc.Component.EventHandler.emitEvents(
            [t.selectedEvent],
            item,
            t._lastSelectedId == null
              ? null
              : t._lastSelectedId % this._actualNumItems,
            rd3_date
          );
        }
        break;
      }
      case SelectedType.MULT: {
        item = t.getItemByListId(val);
        if (!item) return;
        let listItem = item.getComponent(ListItem);
        if (t._selectedId >= 0) t._lastSelectedId = t._selectedId;
        t._selectedId = val;
        let bool: boolean = !listItem.selected;
        listItem.selected = bool;
        let sub: number = t.multSelected.indexOf(val);
        if (bool && sub < 0) {
          t.multSelected.push(val);
        } else if (!bool && sub >= 0) {
          t.multSelected.splice(sub, 1);
        }
        if (t.selectedEvent) {
          cc.Component.EventHandler.emitEvents(
            [t.selectedEvent],
            item,
            t._lastSelectedId == null
              ? null
              : t._lastSelectedId % this._actualNumItems,
            bool
          );
        }
        break;
      }
    }
  }
}
