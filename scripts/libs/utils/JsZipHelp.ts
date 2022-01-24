// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameLoader } from "./GameLoader";

const {ccclass, property} = cc._decorator;

/**
 *  第三方的 jszip  压缩解压工具  
 * 、
 *  https://forum.cocos.org/t/creator3d-jszip-/97685
 */
@ccclass
export class JsZipHelp {

   
    /** 加载后的 资源  */
    private static m_zip = null



    /**
     *  加载 resources 下的某个 zip 包 
     * @param url 
     */
    public static async load(url:string){
        let self = this

        let path: string = url//.raw(url);//"resources/zip/config.zip"

        let res = await GameLoader.load(url, "binary");
        if (res){
            let zip = await this._loadZip(path);
            self.m_zip = zip ;
        }

        // cc.loader.load({ url: path, type: "binary", }, (err, res) => {
        //     if (err) return;

        //     JSZip.loadAsync(res).then((zip: JSZip) => {

        //         self.m_zip = zip ;

        //         let path:string="config.json"
        //         zip.file("path").async("text").then((data: string) => {
        //             console.log(JSON.parse(data));
        //         })
        //     })
        // });
    }
    /**
     *  获取 zip的数据  
     * @param res 
     * @returns 
     */
    private static _loadZip(
        res: string,
        ): Promise<object> {
        return new Promise((resolve, reject) => {
            JSZip.loadAsync(res).then((zip:JSZip)=> {
                return resolve(zip);
            });
        });
    }



    /**
     *  在 zip 中获取某个文件 
     * @param name 
     */
    public static getByName(name:string): Promise<object> {
        let self = this
        let zip =  self.m_zip ;
                
        // name ="config.json"
        // 在调用下边代码获取json文件信息时，如果不太清除path的路
        // 径，大家可以先输出一下console.log(zip.files)，
        // zip.files 是一个数组，数组中列出了压缩文件中所有的子文件目录
        // zip.file(name).async("text").then((data: string) => {
        //     console.log(JSON.parse(data));
        // })
        // 注： 微信平台需要将zip的后缀改为bin，才能以二进制模式读取文件。


        return new Promise((resolve, reject) => {
            zip.file(name).async("text").then((data) => {
                return resolve(data);
            })
        });
    }
}
