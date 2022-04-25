
var _ = require('Underscore');

export class Round {

  /**游戏id**/
  protected game_id: number = null;

  //游戏的 actions 
  public actions = null

  /**
   *  初始化
   * @param id
   * @param opts
   */
  public init(game_id: number, opts: any) {
    let self = this;
    this.game_id = game_id;
    this.merge(opts)
  }
  /**
  *  属性覆盖
  * @param opts
  */
  public merge(opts: any) {
    var self = this;
    _.map(opts, function (v, k) {
      self[k] = v;
    });
  }

}
