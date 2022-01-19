


const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class BaseCache extends cc.Component {

    
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

    
    public static getOne(name: string) {
      var self = this.instance;

      if (self && self.m_hash) {
        var current = self.m_hash[name];
        return current;
      }
    }


    
    public static removeOne(name: string) {
      var self = this.instance;

      if (self && self.m_hash) {
        
        self.m_hash[name] = null;
        delete self.m_hash[name];
      }
    }
}
