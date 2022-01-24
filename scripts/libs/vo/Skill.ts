/**
 * Skill
 */

var _ = require('Underscore');

export class Skill {
  public user_skills: Array = null;

  /**
   * 构造函数
   * @param {Number} id
   * @param {Object|null} opts
   */
  constructor(opts: any) {
    this.init(opts);
  }

  public init(opts: any) {
    //每个item 长相 {item_id：，item_number:}
    // cc.log('================', opts);
    if (opts) {
      this.user_skills = opts;
    } else {
      this.user_skills = [];
    }
  }

  /**
   * 获取所有的道具
   */
  public getItems(): Array {
    return this.user_skills;
  }

  /**
   * 获取某个道具
   */
  public getItemByItemid(skill_id: Number) {
    // item_id
    return (
      _.findWhere(this.user_skills, { skill_id: skill_id }) || {
        skill_id: skill_id,
        skill_num: 0,
      }
    );
  }

  /**
   * 设置某个道具
   */
  public setItemByItemid(item: Object) {
    var skill_id = item.skill_id;
    var index = _.findIndex(this.user_skills, {
      skill_id: skill_id,
    });

    if (index >= 0) {
      this.user_skills[index] = item;
    } else {
      this.user_skills.push(item);
    }
  }
}
