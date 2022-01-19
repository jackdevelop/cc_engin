import { GameConfig } from "../../../../cc_own/config/GameConfig";


export default class PhysicalUtil {

   
    
    public static openPhysical(): void {
        
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
