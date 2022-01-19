const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass('ShaderProperty')
export class ShaderProperty {
  @property({ readonly: true })
  key = '';

  @property(cc.Float)
  value = 0.0;
}

const ShaderEnum = cc.Enum({
  a: 1,
});

@ccclass
@executeInEditMode
export default class ShaderHelper extends cc.Component {
  
  @property
  _program = 0;
  @property({ type: ShaderEnum })
  get program() {
    return this._program;
  }
  set program(value) {
    if (this._program === value) {
      return;
    }
    this._program = value;
    this.applyEffect();
  }

  
  @property({ type: [ShaderProperty] })
  _props: ShaderProperty[] = [];

  @property({ type: [ShaderProperty] })
  get props(): ShaderProperty[] {
    return this._props;
  }

  set props(value) {
    this._props = value;
    this.applyEffect();
  }

  
  material: cc.Material = null;

  
  static effectAssets: any[] = null;

  start() {
    if (CC_EDITOR) {
      setTimeout(() => {
        this.applyEffect();
      }, 1000);
    } else {
      this.applyEffect();
    }
    
  }

  applyEffect() {
    
    let sprite = this.node.getComponent(cc.Sprite);
    if (!sprite) {
      return;
    }

    let effectAsset = ShaderHelper.effectAssets[this.program];
    
    let material = new cc.Material();

    
    let defineUserTexture = !!effectAsset.shaders.find((shader) =>
      shader.defines.find((def) => def.name === 'USE_TEXTURE')
    );
    if (defineUserTexture) {
      material.define('USE_TEXTURE', true);
    }

    
    material.effectAsset = effectAsset;
    material.name = effectAsset.name;

    
    
    sprite.setMaterial(0, material);

    
    this.material = sprite.getMaterial(0);
    this.setProperty(effectAsset);
    this.node.emit('effect-changed', this, this.material);
  }

  setProperty(effectAsset) {
    if (CC_EDITOR) {
      let oldProps = this._props;
      this._props = [];

      let keys = Object.keys(effectAsset._effect._properties);
      
      let values = Object.values(effectAsset._effect._properties);

      for (let i = 0; i < values.length; i++) {
        let value: number = values[i].value;
        let key = keys[i];
        let type = values[i].type;
        if (value !== null && (type === 4 || type === 13)) {
          let oldItem = oldProps.find((item) => item.key === key);
          if (oldItem) {
            value = oldItem.value;
          }
          let sp = new ShaderProperty();
          sp.key = key;
          sp.value = typeof value === 'object' ? value[0] : value;
          this._props.push(sp);
        }
      }

      
      let shaderTimer = this.getComponent('ShaderTime');
      
      if (shaderTimer) {
        shaderTimer.max = shaderTimer.max;
      }
      
    }

    if (this._props.length) {
      this._props.forEach(
        (item) =>
          item.key && this.material.setProperty(item.key, item.value || 0)
      );
    }
    
    cc.Class.Attr.setClassAttr(
      ShaderHelper,
      'props',
      'visible',
      !!this._props.length
    );
  }

  next() {
    this.program = (this.program + 1) % ShaderHelper.effectAssets.length;
  }

  prev() {
    if (this.program === 0) {
      this.program = ShaderHelper.effectAssets.length - 1;
      return;
    }
    this.program = (this.program - 1) % ShaderHelper.effectAssets.length;
  }
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
  cc.dynamicAtlasManager.enabled = false;

  
  
  
  
  
  

  
  
  
});
