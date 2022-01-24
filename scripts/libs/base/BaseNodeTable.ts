// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseNodeTable extends cc.Component {

    @property({ type: [cc.Prefab], tooltip: '所有的prefab' })
    prefable_arr = [];


    /**
     *  通过 prefab_name 获取当前的 prefab  
     * 
     * @param name 
     * @returns 
     */
    public get_prefable_by_name(name: string) {
        let find_obj = _.find(this.prefable_arr, function (v, k) {
            if (v.name == name) {
                return v
            }
        });

        return find_obj
    }
}
