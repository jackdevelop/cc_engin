


const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class BaseCache extends cc.Component {

    //需要存储的 object 
    @property({tooltip:"需要存储的东西",type:[cc.Object]})
    obj_arr: Array<cc.Object> = [];

    private m_hash: any = null; 

    
    onLoad(){
      this.m_hash = new Object();
      for (var i = 0; i < this.obj_arr.length; i++) {
          var one = this.obj_arr[i];
          this.m_hash[one.name] = one;
      }
    }

    /**
     *  获取 
     * @param name
     */
    public static getOne(name: string) {
      var self = this.instance;

      if (self && self.m_hash) {
        var current = self.m_hash[name];
        return current;
      }
    }


    /**
     *  删除 
     * @param name
     */
    public static removeOne(name: string) {
      var self = this.instance;

      if (self && self.m_hash) {
        // var currentprefab = self._Prefab_hash[name];
        self.m_hash[name] = null;
        delete self.m_hash[name];
      }
    }
}
