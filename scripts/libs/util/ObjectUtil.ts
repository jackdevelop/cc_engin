
export default class ObjectUtil {

    
    public static isObject(value: any): boolean {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    
    public static deepCopy(target: object): any {
        let result: any;

        
        if (target == null || typeof target != "object") return target;

        
        if (target instanceof Date) {
            result = new Date();
            result.setTime(target.getTime());
            return result;
        }

        
        if (target instanceof Array) {
            result = [];
            for (let i = 0, len = target.length; i < len; i++) {
                result[i] = this.deepCopy(target[i]);
            }
            return result;
        }

        
        if (target instanceof Object) {
            result = {};
            for (let attribute in target) {
                if (target.hasOwnProperty(attribute)) result[attribute] = this.deepCopy(target[attribute]);
            }
            return result;
        }

        throw new Error("Unable to copy target! Its type isn't supported.");
    }

    
    public static copy(target: object): object {
        
        

        
        

        
        let result = {};
        for (let name in target) {
            result[name] = target[name];
        }
        return result;
    }
}
