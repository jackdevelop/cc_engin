import { UserList } from './UserList';

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





  // public ready_user_codes = [];
  // public continue_user_codes = [];

  // //牌
  // public user_cards = null;
  // public user_cards_show = new Object(); //桌面上显示的牌
  // public actions = [];

  // /**所有庄家**/
  // public banker_user_code_arr = [];
  // /**当前庄家**/
  // public banker_user_code = null;

  // /**** 状态保存 ******/
  // private states: any = null;
  // //第几场
  // public round_id: number = null;
  // public state: number = null; // state            1: integer # 房间状态
  // public timeout: number = null; // timeout          2: Timeout # 超时时间
  // public timestamp: number = null; // timestamp        3: integer # 进入此状态时的时间戳

  // //临时的一些存储变量
  // public temp_json = new Object();
  // public temp_arr = [];

  // //下注的注金
  // public bet_area_amount: Array<number> = [0, 0, 0, 0];
  // public user_area_amount: Array<number> = [0, 0, 0, 0];
  // private award: number = null; // award            4: Award1300

  // //1800 枪  哪个用户用哪个枪
  // public guns: Array = [];
  // public map_id = null;

  // //3000 麻将特有
  // public card_wall = null;
  // public laizi_card = null; //        10: integer
  // public pizi_card = null;
  // public first_card = null;
  // public turn_user_code = null; //轮到谁出牌

  // public ting_id:number = null

  // //初始化等待
  // public init_wait() {
  //   // this.ting_id = null
  //   this.user_cards = null;
  //   this.pizi_card = null;
  //   this.first_card = null;
  //   this.laizi_card = null;
  //   this.card_wall = null;
  //   this.continue_user_codes = [];
  //   this.actions = [];

  //   //cc.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]")
  //   this.temp_json = new Object();
  //   this.temp_arr = [];

  //   this.turn_user_code = null;
  // }

  // //以我自己为第一人称视角 获取某个座位
  // public get_room_sitdown_index_By_client(user_code, me_user_code) {
  //   var self = this;

  //   var pos = this.get_room_sitdown_index(user_code);
  //   var mypos = this.get_room_sitdown_index(me_user_code); //-1
  //   if (pos < 0) {
  //     console.error(
  //       '错误：当前用户不在座位上,当前 user_code ：' +
  //         user_code +
  //         ',seat_uids:' +
  //         this.seat_user_codes
  //     );
  //     return pos;
  //   }

  //   if (mypos >= 0) {
  //     var markPos = pos - mypos;
  //     if (markPos < 0) {
  //       let max_seat = 4;
  //       // var room_rule = self.room_info.room_rule;
  //       // var min_player_num = parseInt(room_rule.min_player_num);
  //       // var max_seat = parseInt(room_rule.max_seat);
  //       markPos = markPos + max_seat;
  //     }

  //     cc.log(
  //       'uid:' + user_code,
  //       'meUid:' + me_user_code,
  //       'mypos:' + mypos,
  //       'pos:' + pos,
  //       'markPos:' + markPos,
  //       this.seat_user_codes
  //     );
  //     return markPos;
  //   } else {
  //     //我不在座位上
  //     //因为lua的索引是从1 开始的，所有客户端要-1
  //     cc.log('pos - 1:', pos - 1);
  //     return pos;
  //   }
  // }

  // /**
  //  *  状态更改
  //  * @param states
  //  */
  // public server_game_state_change(states: any) {
  //   if (!states) {
  //     return;
  //   }

  //   states = states || new Object();
  //   this.states = states;

  //   this.round_id = states.round_id;
  //   this.state = states.state;
  //   this.timeout = states.timeout;
  //   this.timestamp = states.timestamp;
  // }
  // public setAward(states) {
  //   if (!states) {
  //     return;
  //   }

  //   let self = this;
  //   //下注的金额
  //   this.award = states.award;
  //   if (this.award) {
  //     let bets = [];
  //     _.forEach(this.award.bet_area, function (v, k) {
  //       let area_id = v.area_id - 1;
  //       bets[area_id] = v.bet;
  //     });
  //     this.set_bet_area_amount(bets);
  //   }
  // }

  // //设置庄家
  // public set_banker_user_code(banker_user_code) {
  //   this.banker_user_code = banker_user_code;
  // }
  // public set_banker(banker_user_code, banker) {
  //   if (banker) {
  //     UserList.setUser(banker.user_code, banker);
  //     banker_user_code = banker_user_code || banker.user_code;
  //     this.set_banker_user_code(banker_user_code);
  //   }
  // }

  // /**
  //  *  设置下注的金额
  //  * @param states
  //  */
  // public set_bet_area_amount(bets: Array<number>) {
  //   this.bet_area_amount = bets;
  // }
  // public set_user_area_amount(bets: Array<number>) {
  //   this.user_area_amount = bets;
  // }

  // //设置轮到谁出牌
  // public set_turn_user_code(turn_user_code) {
  //   this.turn_user_code = turn_user_code;
  // }
  // public get_turn_user_code() {
  //   return this.turn_user_code;
  // }

  // /**
  //  *   设置枪头
  //  */
  // public set_game_gun(user_code, one_gun) {
  //   if (one_gun) {
  //     let idx = _.findLastIndex(this.guns, {
  //       user_code: user_code,
  //     });
  //     if (idx >= 0) {
  //       this.guns[idx] = one_gun;
  //     } else {
  //       this.guns.push(one_gun);
  //     }
  //   } else {
  //     // this.guns = _.compact(   this.guns);
  //     var evens = _.filter(this.guns, function (one) {
  //       return one.user_code != user_code;
  //     });
  //     this.guns = evens;
  //   }
  // }
  // public get_game_gun(user_code) {
  //   let one = _.findWhere(this.guns, {
  //     user_code: user_code,
  //   });
  //   return one;
  // }

  // /**
  //  *  获取某个用户的牌
  //  */
  // public get_user_cards_by_user_code(user_code) {
  //   let user_cards = this.user_cards;
  //   let find = _.findWhere(user_cards, { user_code: user_code });
  //   return find;
  // }

  // /**
  //    *  添加action
  //    *
  //    uid 0: integer # 玩家 uid
  //    pos 1: integer # 玩家位置
  //    action_type 2: integer # 出牌类型 0: 要不起, 1: 压牌, 2: 发牌
  //    action_cards 3: *integer # 玩家出的牌型
  //    action_index 4: integer # 动作编号

  //    *
  //    * @param {*} action
  //    * @returns boolean
  //    */
  // public add_action(action) {
  //   // action.action_index = action.action_index - 1;
  //   var action_idx = action.action_idx;
  //   var actions = this.actions;
  //   // cc.log("add action========++++",this.actions.length, action)
  //   if (actions.length == action_idx - 1) {
  //     this.actions.push(action);

  //     return action;
  //   } else {
  //     console.error(
  //       '当前的索引不对，客户端记录的 action_index： ' +
  //         this.actions.length +
  //         ',服务器返回的 action_index： ' +
  //         action_idx
  //     );
  //   }
  //   return null;
  // }

  // public add_showcard(action, is_not_add) {
  //   let cards = action.cards;
  //   let user_code = action.user_code;
  //   // let idx = this.get_room_sitdown_index(user_code);
  //   let action_type = action.action_type;
  //   let self = this;
  //   if (this.user_cards_show == null) {
  //     this.user_cards_show = new Object();
  //   }
  //   if (this.user_cards_show[user_code] == null) {
  //     this.user_cards_show[user_code] = [];
  //   }

  //   _.forEach(cards, function (v, k) {
  //     if (is_not_add) {
  //       self.user_cards_show[user_code].push(0);
  //     } else {
  //       self.user_cards_show[user_code].push(v);
  //       // this.user_cards_show[user_code] =v
  //     }
  //   });
  // }
}
