export class BaseFSM {
  //状态机
  private fsm = null;

  init(fms_state: any) {
    this.fsm = [];
    //cc.log('init');
    return true;
    //状态
    // let fsm = new TypeState.FiniteStateMachine<TYPE_STATE_GAME>(TYPE_STATE_GAME.bet);
    // fsm.from(TYPE_STATE_GAME.bet).to(TYPE_STATE_GAME.start);
    // fsm.from(TYPE_STATE_GAME.start).to(TYPE_STATE_GAME.lottery);
    // fsm.from(TYPE_STATE_GAME.lottery).to(TYPE_STATE_GAME.bet);
    // this.fsm = fsm;
  }
}
