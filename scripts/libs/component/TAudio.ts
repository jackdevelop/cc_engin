









import BaseCache from "../base/BaseCache";
import { AudioManager } from "../manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TAudio extends BaseCache {

    
    

    
    

    
    

    
    




    @property({ type: [cc.AudioClip], override: true })
    obj_arr: Array<cc.AudioClip> = [];


    
    private static instance: TAudio = null;

    onLoad() {
        TAudio.instance = this;
        super.onLoad();
    }







    
    
    
    

    
    
    
    
    

    
    
    
    
    
    

    
    
    
    

    
    
    
    
    
    

    
    

    
    
    
    
    


}
