






import { GameLoader } from "./GameLoader";

const {ccclass, property} = cc._decorator;


@ccclass
export class JsZipHelp {

   
    
    private static m_zip = null



    
    public static async load(url:string){
        let self = this

        let path: string = url

        let res = await GameLoader.load(url, "binary");
        if (res){
            let zip = await this._loadZip(path);
            self.m_zip = zip ;
        }

        
        

        

        

        
        
        
        
        
        
    }
    
    private static _loadZip(
        res: string,
        ): Promise<object> {
        return new Promise((resolve, reject) => {
            JSZip.loadAsync(res).then((zip:JSZip)=> {
                return resolve(zip);
            });
        });
    }



    
    public static getByName(name:string): Promise<object> {
        let self = this
        let zip =  self.m_zip ;
                
        
        
        
        
        
        
        
        


        return new Promise((resolve, reject) => {
            zip.file(name).async("text").then((data) => {
                return resolve(data);
            })
        });
    }
}
