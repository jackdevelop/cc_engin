import MathUtil from '../util/MathUtil';
import { GameMath } from '../utils/GameMath';

const { ccclass, menu, property, requireComponent } = cc._decorator;
const C = {
  
  R: 25,
  
  RATIO: 0.95,
  
  SPACE: 0.2,
  
  MAX_COUNT: 10,
};
Object.freeze(C);


@ccclass
@requireComponent(cc.Mask)
@menu('framework/TErase')
export class TErase extends cc.Component {
  
  static get(node: cc.Node): TErase {
    return node.getComponent(TErase);
  }

  onLoad() {
    
    this.mask = this.node.getComponent(cc.Mask);
    this.mask.type = cc.Mask.Type.RECT;
    this.mask.inverted = true;
    
    this.g = this.mask['_graphics'];
    
    if (this.is_auto_touch) {
      this.set_touch_event();
    }
  }

  update() {
    this.g.fill();
    this.do_finish_f();
  }

  @property({ tooltip: '触摸区域', type: cc.Node })
  touch_area: cc.Node = null;

  @property({
    tooltip:
      '是否记录擦除点（如果记录，则可以解锁擦除进度功能，但是相应的会一定程度的影响性能）',
  })
  is_save: cc.Boolean = true;

  @property({ tooltip: '是否自动触摸擦除' })
  is_auto_touch: cc.Boolean = true;

  @property({ tooltip: '如果自动触摸擦除，擦除半径是' })
  erase_r: number = C.R;

  
  mask: cc.Mask;
  
  g: cc.Graphics;
  
  array_save = new Object();
  
  p_start: cc.Vec2;
  
  p_end: cc.Vec2;
  
  array_finish_f: ControllerFinish[] = [];

  
  set_touch_event() {
    
    const f_start = (e: cc.Touch) => {
      this.p_start = this.node.convertToNodeSpaceAR(e.getLocation());
      this.draw_circle(this.p_start, this.erase_r);
    };
    
    const f_move = (e: cc.Touch) => {
      this.p_end = this.node.convertToNodeSpaceAR(e.getLocation());
      this.draw_many_circle(this.p_start, this.p_end, this.erase_r);
      this.p_start = this.p_end;
    };
    
    const f_end_cancel = (e: cc.Touch) => {
      
    };
    this.touch_area.on(cc.Node.EventType.TOUCH_START, (e: cc.Touch) => {
      f_start(e);
    });
    this.touch_area.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Touch) => {
      f_move(e);
    });
    this.touch_area.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch) => {
      f_end_cancel(e);
    });
    this.touch_area.on(cc.Node.EventType.TOUCH_CANCEL, (e: cc.Touch) => {
      f_end_cancel(e);
    });
  }

  
  draw_circle(p: cc.Vec2, r: number = C.R) {
    
    this.g.circle(p.x, p.y, r);
    
    if (this.is_save) {
      
      p.x = Math.trunc(p.x);
      p.y = Math.trunc(p.y);
      r = Math.trunc(r);
      
      for (let x = p.x - r; x <= p.x + r; x += 1) {
        for (let y = p.y - r; y <= p.y + r; y += 1) {
          
          if (this.array_save[`${x}-${y}`] != undefined) {
            continue;
          }
          
          if (MathUtil.getDistance(p, cc.v2(x, y)) > r) {
            continue;
          }
          
          this.array_save[`${x}-${y}`] = 1;
          
          for (let cfinish of this.array_finish_f) {
            cfinish.save(cc.v2(x, y));
          }
        }
      }
    }
  }

  
  draw_many_circle(
    p0: cc.Vec2,
    p1: cc.Vec2,
    r: number = C.R,
    space: number = C.SPACE
  ) {
    
    let count = Math.min(
      C.MAX_COUNT,
      MathUtil.getDistance(p0, p1) / (r * space)
    );
    
    for (let i = 0; i < count; i += 1) {
      let p = p0.lerp(p1, (i + 1) / count);
      this.draw_circle(p, r);
    }
  }

  
  check_save() {
    if (!this.is_save) {
      cc.log(
        `@TErase: 记录功能未开启，无法实现完成回调功能，已自动开启，请检查node=${this.node}`
      );
    }
    this.is_save = true;
  }

  
  set_finish_f_by_rect(rect: cc.Rect, f: Function, ratio: number = C.RATIO) {
    this.check_save();
    this.array_finish_f.push(new ControllerFinish(rect, f, ratio));
  }

  
  set_finish_f_by_center(
    p_center: cc.Vec2,
    width: number,
    height: number,
    f: Function,
    ratio: number = C.RATIO
  ) {
    this.check_save();
    this.array_finish_f.push(
      new ControllerFinish(
        cc.rect(p_center.x - width / 2, p_center.y - height / 2, width, height),
        f,
        ratio
      )
    );
  }

  
  do_finish_f() {
    for (let cfinish of this.array_finish_f) {
      cfinish.do();
    }
  }

  
  reset() {
    this.g.clear();
    this.array_save = new Object();
    for (let cfinish of this.array_finish_f) {
      cfinish.reset();
    }
  }

  
  hide(time: number = 0.2) {
    this.mask.node.runAction(cc.fadeOut(time));
  }
}


class ControllerFinish {
  
  constructor(rect: cc.Rect, f: Function, ratio: number) {
    this.rect = rect;
    this.f = f;
    this.ratio = ratio;
    this.all_count = rect.width * rect.height;
    this.is_over = false;
    this.finish_count = 0;
  }

  
  rect: cc.Rect;
  
  f: Function;
  
  ratio: number;
  
  is_over: cc.Boolean;
  
  finish_count: number;
  
  all_count: number;

  
  do() {
    
    if (this.is_over) {
      return;
    }
    if (this.finish_count / this.all_count < this.ratio) {
      return;
    }
    
    this.is_over = true;
    this.f();
  }

  
  save(p: cc.Vec2) {
    if (this.rect.contains(p)) {
      this.finish_count += 1;
    }
  }

  
  reset() {
    this.is_over = false;
    this.finish_count = 0;
  }
}
