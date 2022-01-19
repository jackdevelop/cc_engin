import textureRenderUtils from './textureRenderUtils';
import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { PromiseUtil } from '../scripts/libs/util/PromiseUtil';

const { ccclass, property } = cc._decorator;


@ccclass
export default class capture_to_native extends textureRenderUtils {
  
  public static instance: capture_to_native = null;

  onLoad() {
    capture_to_native.instance = this;
  }

  
  async onClickSave(imagename) {
    this.init();
    
    
    await PromiseUtil.wait_time(1, this);
    let picData = this.initImage();
    
    
    let path = this.saveFile(picData, imagename);

    cc.log('保存成功', path);
    
    return path;
    
  }

  init() {
    
    let texture = new cc.RenderTexture();
    let gl = cc.game._renderContext;
    texture.initWithSize(
      cc.visibleRect.width,
      cc.visibleRect.height,
      gl.STENCIL_INDEX8
    );
    this.camera.targetTexture = texture;
    this.texture = texture;
  }
  
  initImage() {
    let data = this.texture.readPixels();
    this._width = this.texture.width;
    this._height = this.texture.height;
    let picData = this.filpYImage(data, this._width, this._height);
    
    return picData;
  }

  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  saveFile(picData, imagename) {
    imagename = imagename || 'render_to_sprite_image.png';
    if (CC_JSB || cc.sys.isNative) {
      let filePath = jsb.fileUtils.getWritablePath() + imagename;

      let success = jsb.saveImageData(
        picData,
        this._width,
        this._height,
        filePath
      );
      if (success) {
        cc.log('save image data success, file: ' + filePath);
        return filePath;
      } else {
        cc.log('save image data failed!');
      }
    } else {
      cc.log('save image data null !');
    }

    return null;
  }

  
  filpYImage(data, width, height) {
    
    let picData = new Uint8Array(width * height * 4);
    let rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
      let srow = height - 1 - row;
      let start = srow * width * 4;
      let reStart = row * width * 4;
      
      for (let i = 0; i < rowBytes; i++) {
        picData[reStart + i] = data[start + i];
      }
    }
    return picData;
  }
}
