





export class Transitions<T> {
  constructor(public fsm: FiniteStateMachine<T>) {}

  public fromStates: T[];
  public toStates: T[];

  
  public to(...states: T[]) {
    this.toStates = states;
    this.fsm.addTransitions(this);
  }
  
  public toAny(states: any) {
    var toStates: T[] = [];
    for (var s in states) {
      if (states.hasOwnProperty(s)) {
        toStates.push(<T>states[s]);
      }
    }

    this.toStates = toStates;
    this.fsm.addTransitions(this);
  }
}


export class TransitionFunction<T> {
  constructor(
    public fsm: FiniteStateMachine<T>,
    public from: T,
    public to: T
  ) {}
}


export class FiniteStateMachine<T> {
  public currentState: T;
  private _startState: T;
  private _allowImplicitSelfTransition: boolean;
  private _transitionFunctions: TransitionFunction<T>[] = [];
  private _onCallbacks: {
    [key: string]: { (from: T, event?: any): void }[];
  } = {};
  private _exitCallbacks: {
    [key: string]: { (to: T): boolean | Promise<boolean> }[];
  } = {};
  private _enterCallbacks: {
    [key: string]: { (from: T, event?: any): boolean | Promise<boolean> }[];
  } = {};
  private _invalidTransitionCallback: (to?: T, from?: T) => boolean = null;

  constructor(startState: T, allowImplicitSelfTransition: boolean = false) {
    this.currentState = startState;
    this._startState = startState;
    this._allowImplicitSelfTransition = allowImplicitSelfTransition;
  }

  public addTransitions(fcn: Transitions<T>) {
    fcn.fromStates.forEach((from) => {
      fcn.toStates.forEach((to) => {
        
        if (!this._canGo(from, to)) {
          this._transitionFunctions.push(
            new TransitionFunction<T>(this, from, to)
          );
        }
      });
    });
  }

  
  public on(
    state: T,
    callback: (from?: T, event?: any) => any
  ): FiniteStateMachine<T> {
    var key = state.toString();
    if (!this._onCallbacks[key]) {
      this._onCallbacks[key] = [];
    }
    this._onCallbacks[key].push(callback);
    return this;
  }

  
  public onEnter(
    state: T,
    callback: (from?: T, event?: any) => boolean | Promise<boolean>
  ): FiniteStateMachine<T> {
    var key = state.toString();
    if (!this._enterCallbacks[key]) {
      this._enterCallbacks[key] = [];
    }
    this._enterCallbacks[key].push(callback);
    return this;
  }

  
  public onExit(
    state: T,
    callback: (to?: T) => boolean | Promise<boolean>
  ): FiniteStateMachine<T> {
    var key = state.toString();
    if (!this._exitCallbacks[key]) {
      this._exitCallbacks[key] = [];
    }
    this._exitCallbacks[key].push(callback);
    return this;
  }

  
  public onInvalidTransition(
    callback: (from?: T, to?: T) => boolean
  ): FiniteStateMachine<T> {
    if (!this._invalidTransitionCallback) {
      this._invalidTransitionCallback = callback;
    }
    return this;
  }

  
  public from(...states: T[]): Transitions<T> {
    var _transition = new Transitions<T>(this);
    _transition.fromStates = states;
    return _transition;
  }

  public fromAny(states: any): Transitions<T> {
    var fromStates: T[] = [];
    for (var s in states) {
      if (states.hasOwnProperty(s)) {
        fromStates.push(<T>states[s]);
      }
    }

    var _transition = new Transitions<T>(this);
    _transition.fromStates = fromStates;
    return _transition;
  }

  private _validTransition(from: T, to: T): boolean {
    return this._transitionFunctions.some((tf) => {
      return tf.from === from && tf.to === to;
    });
  }

  
  private _canGo(fromState: T, toState: T): boolean {
    return (
      (this._allowImplicitSelfTransition && fromState === toState) ||
      this._validTransition(fromState, toState)
    );
  }

  
  public canGo(state: T): boolean {
    return this._canGo(this.currentState, state);
  }

  
  public go(state: T, event?: any): Promise<void> {
    if (!this.canGo(state)) {
      if (
        !this._invalidTransitionCallback ||
        !this._invalidTransitionCallback(this.currentState, state)
      ) {
        throw new Error(
          'Error no transition function exists from state ' +
            this.currentState.toString() +
            ' to ' +
            state.toString()
        );
      }
    } else {
      return this._transitionTo(state, event);
    }
  }

  
  public onTransition(from: T, to: T) {
    
  }

  
  public reset(options?: ResetOptions) {
    options = { ...DefaultResetOptions, ...(options || {}) };
    this.currentState = this._startState;
    if (options.runCallbacks) {
      this._onCallbacks[this.currentState.toString()].forEach((fcn) => {
        fcn.call(this, null, null);
      });
    }
  }

  
  public is(state: T): boolean {
    return this.currentState === state;
  }

  private async _transitionTo(state: T, event?: any): Promise<void> {
    if (!this._exitCallbacks[this.currentState.toString()]) {
      this._exitCallbacks[this.currentState.toString()] = [];
    }

    if (!this._enterCallbacks[state.toString()]) {
      this._enterCallbacks[state.toString()] = [];
    }

    if (!this._onCallbacks[state.toString()]) {
      this._onCallbacks[state.toString()] = [];
    }

    var canExit = true;
    for (var exitCallback of this._exitCallbacks[
      this.currentState.toString()
    ]) {
      let returnValue: boolean | Promise<boolean> = exitCallback.call(
        this,
        state
      );
      
      if (returnValue === undefined) {
        
        returnValue = true;
      }
      
      if (returnValue !== false && returnValue !== true) {
        returnValue = await returnValue;
      }
      
      if (returnValue === undefined) {
        
        returnValue = true;
      }
      canExit = canExit && returnValue;
    }

    var canEnter = true;
    for (var enterCallback of this._enterCallbacks[state.toString()]) {
      let returnValue: boolean | Promise<boolean> = enterCallback.call(
        this,
        this.currentState,
        event
      );
      
      if (returnValue === undefined) {
        
        returnValue = true;
      }
      
      if (returnValue !== false && returnValue !== true) {
        returnValue = await returnValue;
      }
      
      if (returnValue === undefined) {
        
        returnValue = true;
      }
      canEnter = canEnter && returnValue;
    }

    if (canExit && canEnter) {
      var old = this.currentState;
      this.currentState = state;
      this._onCallbacks[this.currentState.toString()].forEach((fcn) => {
        fcn.call(this, old, event);
      });
      this.onTransition(old, state);
    }
  }
}


export interface ResetOptions {
  
  runCallbacks?: boolean;
}


export const DefaultResetOptions: ResetOptions = {
  runCallbacks: false,
};

export class typestate {}




