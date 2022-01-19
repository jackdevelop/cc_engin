






var _ = require('Underscore');

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseNodeTable extends cc.Component {

    @property({ type: [cc.Prefab], tooltip: '所有的prefab' })
    prefable_arr = [];


    
    public get_prefable_by_name(name: string) {
        let find_obj = _.find(this.prefable_arr, function (v, k) {
            if (v.name == name) {
                return v
            }
        });

        return find_obj
    }
}
