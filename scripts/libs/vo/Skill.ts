var _ = require("Underscore");

export class Skill {
  public user_skills: Array = null;
  constructor(opts: any) {
    this.init(opts);
  }
  public init(opts: any) {
    if (opts) {
      this.user_skills = opts;
    } else {
      this.user_skills = [];
    }
  }
  public getItems(): Array {
    return this.user_skills;
  }
  public getItemByItemid(skill_id: Number) {
    return (
      _.findWhere(this.user_skills, { skill_id: skill_id }) || {
        skill_id: skill_id,
        skill_num: 0,
      }
    );
  }
  public setItemByItemid(item: Object) {
    var skill_id = item.skill_id;
    var index = _.findIndex(this.user_skills, { skill_id: skill_id });
    if (index >= 0) {
      this.user_skills[index] = item;
    } else {
      this.user_skills.push(item);
    }
  }
}
