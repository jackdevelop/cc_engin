const { ccclass, property } = cc._decorator;

@ccclass
export default class textureRenderUtils extends cc.Component {
  @property({ type: cc.Camera, tooltip: '摄像机' })
  camera: cc.Camera = null;

  
  
  
  
  

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

  
  createCanvas() {
    let width = this.texture.width;
    let height = this.texture.height;
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');

      this._canvas.width = width;
      this._canvas.height = height;
    } else {
      this.clearCanvas();
    }
    let ctx = this._canvas.getContext('2d');
    this.camera.render();
    let data = this.texture.readPixels();
    
    let rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
      let srow = height - 1 - row;
      let imageData = ctx.createImageData(width, 1);
      let start = srow * width * 4;
      for (let i = 0; i < rowBytes; i++) {
        imageData.data[i] = data[start + i];
      }

      ctx.putImageData(imageData, 0, row);
    }
    return this._canvas;
  }

  
  createImg() {
    
    var dataURL = this._canvas.toDataURL('image/png');
    var img = document.createElement('img');
    img.src = dataURL;
    return img;
  }
  
  showImage(img) {
    let texture = new cc.Texture2D();
    texture.initWithElement(img);

    let spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(texture);

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  }
  
  
  
  
  
  
  
  
  
  
  

  clearCanvas() {
    let ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
}
