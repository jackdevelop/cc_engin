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
  SINGLE = 1, 
  MULT = 2, 
}

@ccclass
@disallowMultiple()
@menu('framework/ListHigh')
@requireComponent(cc.ScrollView)

@executionOrder(-5000)
export default class ListHigh extends List {
  @property({ tooltip: '当设置items 时  是否强制刷新' })
  is_reflush: boolean = true;

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  

  
  setSelectedId(val: number, rd3_date) {
    let t: any = this;
    let item: any;
    switch (t.selectedMode) {
      case SelectedType.SINGLE: {
        if (!t.repeatEventSingle && val == t._selectedId) return;
        item = t.getItemByListId(val);
        
        
        let listItem: ListItem;
        if (t._selectedId >= 0) t._lastSelectedId = t._selectedId;
        
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
