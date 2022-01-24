import { GameConfig } from "../../../../cc_own/config/GameConfig";

/**
 *   AnimationUtil 
 * @see AnimationUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/NodeUtil.ts
 */
export default class PhysicalUtil {

   
    /**
     *  开启物理引擎 
     */
    public static openPhysical(): void {
        //开启物理引擎 
        if (GameConfig.is_physical){
            var collisionManager = cc.director.getCollisionManager();
            collisionManager.enabled = true 
            if (GameConfig.debug_physical){
                collisionManager.enabledDebugDraw = true 
                collisionManager.enabledDrawBoundingBox = true;
            }
            cc.director.getPhysicsManager().enabled = true 
        }
    }
}
