import textureRenderUtils from './textureRenderUtils';
import { GameHelp } from '../scripts/libs/utils/GameHelp';
import { PromiseUtil } from '../scripts/libs/util/PromiseUtil';

const { ccclass, property } = cc._decorator;

/**
 *   截屏使用
 *    1：  在场景上挂一个 摄像机 命名为 Camera_jieping
 *    2： 在场景的 Canvas 将当前的 capture_to_native 挂上去    详见 HallScene 中
 *    2： 代码调用
          //截屏
         let imagename = "render_to_sprite_image.png"
         let path = capture_to_native.instance.onClickSave(imagename);
 */
@ccclass
export default class capture_to_native extends textureRenderUtils {
  /**单例实例**/
  public static instance: capture_to_native = null;

  onLoad() {
    capture_to_native.instance = this;
  }

  /***
   *   截图保存
   */
  async onClickSave(imagename) {
    this.init();
    // create the capture
    // this.schedule(() => {
    await PromiseUtil.wait_time(1, this);
    let picData = this.initImage();
    // this.createCanvas(picData);
    // this.label.string = 'Showing the capture'
    let path = this.saveFile(picData, imagename);

    cc.log('保存成功', path);
    // cc.log('保存成功');
    return path;
    // }, 1, 0);
  }

  init() {
    // this.label.string = '';
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
  // override
  initImage() {
    let data = this.texture.readPixels();
    this._width = this.texture.width;
    this._height = this.texture.height;
    let picData = this.filpYImage(data, this._width, this._height);
    //console.log("截图的图片数据：",this._width,this._height,picData)
    return picData;
  }

  // override init with Data
  // createCanvas (picData) {
  //     let texture = new cc.Texture2D();
  //     texture.initWithData(picData, 32, this._width, this._height);
  //
  //     let spriteFrame = new cc.SpriteFrame();
  //     spriteFrame.setTexture(texture);

  // let node = new cc.Node();
  // let sprite = node.addComponent(cc.Sprite);
  // sprite.spriteFrame = spriteFrame;
  //
  // node.zIndex = cc.macro.MAX_ZINDEX;
  // node.parent = cc.director.getScene();
  // // set position
  // let width = cc.winSize.width;
  // let height = cc.winSize.height;
  // node.x = width / 2;
  // node.y = height / 2;
  // node.on(cc.Node.EventType.TOUCH_START, () => {
  //     node.parent = null;
  //     // this.label.string = '';
  //     node.destroy();
  // });
  //
  // this.captureAction(node, width, height);
  // }

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

  // This is a temporary solution
  filpYImage(data, width, height) {
    // create the data array
    let picData = new Uint8Array(width * height * 4);
    let rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
      let srow = height - 1 - row;
      let start = srow * width * 4;
      let reStart = row * width * 4;
      // save the piexls data
      for (let i = 0; i < rowBytes; i++) {
        picData[reStart + i] = data[start + i];
      }
    }
    return picData;
  }
}
