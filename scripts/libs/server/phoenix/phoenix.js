

const globalSelf = typeof self !== "undefined" ? self : null
const phxWindow = typeof window !== "undefined" ? window : null
const global = globalSelf || phxWindow || this
const DEFAULT_VSN = "2.0.0"
const SOCKET_STATES = {connecting: 0, open: 1, closing: 2, closed: 3}
const DEFAULT_TIMEOUT = 10000
const WS_CLOSE_NORMAL = 1000
const CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving",
}
const CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
}
const CHANNEL_LIFECYCLE_EVENTS = [
  CHANNEL_EVENTS.close,
  CHANNEL_EVENTS.error,
  CHANNEL_EVENTS.join,
  CHANNEL_EVENTS.reply,
  CHANNEL_EVENTS.leave
]
const TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
}


let closure = (value) => {
  if(typeof value === "function"){
    return value
  } else {
    let closure = function(){ return value }
    return closure
  }
}


class Push {
  constructor(channel, event, payload, timeout){
    this.channel      = channel
    this.event        = event
    this.payload      = payload || function(){ return {} }
    this.receivedResp = null
    this.timeout      = timeout
    this.timeoutTimer = null
    this.recHooks     = []
    this.sent         = false
  }

  
  resend(timeout){
    this.timeout = timeout
    this.reset()
    this.send()
  }

  
  send(){ if(this.hasReceived("timeout")){ return }
    this.startTimeout()
    this.sent = true
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload(),
      ref: this.ref,
      join_ref: this.channel.joinRef()
    })
  }

  
  receive(status, callback){
    if(this.hasReceived(status)){
      callback(this.receivedResp.response)
    }

    this.recHooks.push({status, callback})
    return this
  }

  
  reset(){
    this.cancelRefEvent()
    this.ref          = null
    this.refEvent     = null
    this.receivedResp = null
    this.sent         = false
  }

  
  matchReceive({status, response, ref}){
    this.recHooks.filter( h => h.status === status )
                 .forEach( h => h.callback(response) )
  }

  
  cancelRefEvent(){ if(!this.refEvent){ return }
    this.channel.off(this.refEvent)
  }

  
  cancelTimeout(){
    clearTimeout(this.timeoutTimer)
    this.timeoutTimer = null
  }

  
  startTimeout(){ if(this.timeoutTimer){ this.cancelTimeout() }
    this.ref      = this.channel.socket.makeRef()
    this.refEvent = this.channel.replyEventName(this.ref)

    this.channel.on(this.refEvent, payload => {
      this.cancelRefEvent()
      this.cancelTimeout()
      this.receivedResp = payload
      this.matchReceive(payload)
    })

    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {})
    }, this.timeout)
  }

  
  hasReceived(status){
    return this.receivedResp && this.receivedResp.status === status
  }

  
  trigger(status, response){
    this.channel.trigger(this.refEvent, {status, response})
  }
}


export class Channel {
  constructor(topic, params, socket) {
    this.state       = CHANNEL_STATES.closed
    this.topic       = topic
    this.params      = closure(params || {})
    this.socket      = socket
    this.bindings    = []
    this.bindingRef  = 0
    this.timeout     = this.socket.timeout
    this.joinedOnce  = false
    this.joinPush    = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout)
    this.pushBuffer  = []
    this.stateChangeRefs = [];

    this.rejoinTimer = new Timer(() => {
      if(this.socket.isConnected()){ this.rejoin() }
    }, this.socket.rejoinAfterMs)
    this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()))
    this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset()
        if(this.isErrored()){ this.rejoin() }
      })
    )
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined
      this.rejoinTimer.reset()
      this.pushBuffer.forEach( pushEvent => pushEvent.send() )
      this.pushBuffer = []
    })
    this.joinPush.receive("error", () => {
      this.state = CHANNEL_STATES.errored
      if(this.socket.isConnected()){ this.rejoinTimer.scheduleTimeout() }
    })
    this.onClose(() => {
      this.rejoinTimer.reset()
      if(this.socket.hasLogger()) this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`)
      this.state = CHANNEL_STATES.closed
      this.socket.remove(this)
    })
    this.onError(reason => {
      if(this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason)
      if(this.isJoining()){ this.joinPush.reset() }
      this.state = CHANNEL_STATES.errored
      if(this.socket.isConnected()){ this.rejoinTimer.scheduleTimeout() }
    })
    this.joinPush.receive("timeout", () => {
      if(this.socket.hasLogger()) this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout)
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout)
      leavePush.send()
      this.state = CHANNEL_STATES.errored
      this.joinPush.reset()
      if(this.socket.isConnected()){ this.rejoinTimer.scheduleTimeout() }
    })
    this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload)
    })
  }

  
  join(timeout = this.timeout){
    if(this.joinedOnce){
      throw new Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`)
    } else {
      this.timeout = timeout
      this.joinedOnce = true
      this.rejoin()
      return this.joinPush
    }
  }

  
  onClose(callback){
    this.on(CHANNEL_EVENTS.close, callback)
  }

  
  onError(callback){
    return this.on(CHANNEL_EVENTS.error, reason => callback(reason))
  }

  
  on(event, callback){
    let ref = this.bindingRef++
    this.bindings.push({event, ref, callback})
    return ref
  }

  
  off(event, ref){
    this.bindings = this.bindings.filter((bind) => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref))
    })
  }

  
  canPush(){ return this.socket.isConnected() && this.isJoined() }

  
  push(event, payload, timeout = this.timeout){
    if(!this.joinedOnce){
      throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`)
    }
    let pushEvent = new Push(this, event, function(){ return payload }, timeout)
    if(this.canPush()){
      pushEvent.send()
    } else {
      pushEvent.startTimeout()
      this.pushBuffer.push(pushEvent)
    }

    return pushEvent
  }

  
  leave(timeout = this.timeout){
    this.rejoinTimer.reset()
    this.joinPush.cancelTimeout()

    this.state = CHANNEL_STATES.leaving
    let onClose = () => {
      if(this.socket.hasLogger()) this.socket.log("channel", `leave ${this.topic}`)
      this.trigger(CHANNEL_EVENTS.close, "leave")
    }
    let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout)
    leavePush.receive("ok", () => onClose() )
             .receive("timeout", () => onClose() )
    leavePush.send()
    if(!this.canPush()){ leavePush.trigger("ok", {}) }

    return leavePush
  }

  
  onMessage(event, payload, ref){ return payload }

  
  isLifecycleEvent(event) { return CHANNEL_LIFECYCLE_EVENTS.indexOf(event) >= 0 }

  
  isMember(topic, event, payload, joinRef){
    if(this.topic !== topic){ return false }

    if(joinRef && joinRef !== this.joinRef() && this.isLifecycleEvent(event)){
      if (this.socket.hasLogger()) this.socket.log("channel", "dropping outdated message", {topic, event, payload, joinRef})
      return false
    } else {
      return true
    }
  }

  
  joinRef(){ return this.joinPush.ref }

  
  rejoin(timeout = this.timeout){ if(this.isLeaving()){ return }
    this.socket.leaveOpenTopic(this.topic)
    this.state = CHANNEL_STATES.joining
    this.joinPush.resend(timeout)
  }

  
  trigger(event, payload, ref, joinRef){
    let handledPayload = this.onMessage(event, payload, ref, joinRef)
    if(payload && !handledPayload){ throw new Error("channel onMessage callbacks must return the payload, modified or unmodified") }

    let eventBindings = this.bindings.filter(bind => bind.event === event)

    for (let i = 0; i < eventBindings.length; i++) {
      let bind = eventBindings[i]
      bind.callback(handledPayload, ref, joinRef || this.joinRef())
    }
  }

  
  replyEventName(ref){ return `chan_reply_${ref}` }

  
  isClosed() { return this.state === CHANNEL_STATES.closed }

  
  isErrored(){ return this.state === CHANNEL_STATES.errored }

  
  isJoined() { return this.state === CHANNEL_STATES.joined }

  
  isJoining(){ return this.state === CHANNEL_STATES.joining }

  
  isLeaving(){ return this.state === CHANNEL_STATES.leaving }
}


export let Serializer = {
  encode(msg, callback){
    let payload = [
      msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload
    ]
    return callback(JSON.stringify(payload))
  },

  decode(rawPayload, callback){
    let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload)

    return callback({join_ref, ref, topic, event, payload})
  }
}



export class Socket {
  constructor(endPoint, opts = {}){
    this.stateChangeCallbacks = {open: [], close: [], error: [], message: []}
    this.channels             = []
    this.sendBuffer           = []
    this.ref                  = 0
    this.timeout              = opts.timeout || DEFAULT_TIMEOUT
    this.transport            = opts.transport || global.WebSocket || LongPoll
    this.defaultEncoder       = Serializer.encode
    this.defaultDecoder       = Serializer.decode
    this.closeWasClean        = false
    this.unloaded             = false
    this.binaryType           = opts.binaryType || "arraybuffer"
    if(this.transport !== LongPoll){
      this.encode = opts.encode || this.defaultEncoder
      this.decode = opts.decode || this.defaultDecoder
    } else {
      this.encode = this.defaultEncoder
      this.decode = this.defaultDecoder
    }
    if(phxWindow && phxWindow.addEventListener){
      phxWindow.addEventListener("unload", e => {
        if(this.conn){
          this.unloaded = true
          this.abnormalClose("unloaded")
        }
      })
    }
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000
    this.rejoinAfterMs = (tries) => {
      if(opts.rejoinAfterMs){
        return opts.rejoinAfterMs(tries)
      } else {
        return [1000, 2000, 5000][tries - 1] || 10000
      }
    }
    this.reconnectAfterMs = (tries) => {
      if(this.unloaded){ return 100 }
      if(opts.reconnectAfterMs){
        return opts.reconnectAfterMs(tries)
      } else {
        return [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] || 5000
      }
    }
    this.logger               = opts.logger || null
    this.longpollerTimeout    = opts.longpollerTimeout || 20000
    this.params               = closure(opts.params || {})
    this.endPoint             = `${endPoint}/${TRANSPORTS.websocket}`
    this.vsn                  = opts.vsn || DEFAULT_VSN
    this.heartbeatTimer       = null
    this.pendingHeartbeatRef  = null
    this.reconnectTimer       = new Timer(() => {
      this.teardown(() => this.connect())
    }, this.reconnectAfterMs)
  }

  
  protocol(){ return location.protocol.match(/^https/) ? "wss" : "ws" }

  
  endPointURL(){
    let uri = Ajax.appendParams(
      Ajax.appendParams(this.endPoint, this.params()), {vsn: this.vsn})
    if(uri.charAt(0) !== "/"){ return uri }
    if(uri.charAt(1) === "/"){ return `${this.protocol()}:${uri}` }

    return `${this.protocol()}://${location.host}${uri}`
  }

  
  disconnect(callback, code, reason){
    this.closeWasClean = true
    this.reconnectTimer.reset()
    this.teardown(callback, code, reason)
  }

  
  connect(params){
    if(params){
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor")
      this.params = closure(params)
    }
    if(this.conn){ return }
    this.closeWasClean = false
    this.conn = new this.transport(this.endPointURL())
    this.conn.binaryType = this.binaryType
    this.conn.timeout    = this.longpollerTimeout
    this.conn.onopen     = () => this.onConnOpen()
    this.conn.onerror    = error => this.onConnError(error)
    this.conn.onmessage  = event => this.onConnMessage(event)
    this.conn.onclose    = event => this.onConnClose(event)
  }

  
  log(kind, msg, data){ this.logger(kind, msg, data) }

  
  hasLogger(){ return this.logger !== null }

  
  onOpen(callback){
    let ref = this.makeRef()
    this.stateChangeCallbacks.open.push([ref, callback])
    return ref
  }

  
  onClose(callback){
    let ref = this.makeRef()
    this.stateChangeCallbacks.close.push([ref, callback])
    return ref
  }

  
  onError(callback){
    let ref = this.makeRef()
    this.stateChangeCallbacks.error.push([ref, callback])
    return ref
  }

  
  onMessage(callback){
    let ref = this.makeRef()
    this.stateChangeCallbacks.message.push([ref, callback])
    return ref
  }

  
  onConnOpen(){
    if(this.hasLogger()) this.log("transport", `connected to ${this.endPointURL()}`)
    this.unloaded = false
    this.closeWasClean = false
    this.flushSendBuffer()
    this.reconnectTimer.reset()
    this.resetHeartbeat()
    this.stateChangeCallbacks.open.forEach(([, callback]) => callback() )
  }

  

  resetHeartbeat(){ if(this.conn && this.conn.skipHeartbeat){ return }
    this.pendingHeartbeatRef = null
    clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs)
  }

  teardown(callback, code, reason){
    if (!this.conn) {
      return callback && callback()
    }

    this.waitForBufferDone(() => {
      if (this.conn) {
        if(code){ this.conn.close(code, reason || "") } else { this.conn.close() }
      }

      this.waitForSocketClosed(() => {
        if (this.conn) {
          this.conn.onclose = function(){} 
          this.conn = null
        }

        callback && callback()
      })
    })
  }

  waitForBufferDone(callback, tries = 1) {
    if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
      callback()
      return
    }

    setTimeout(() => {
      this.waitForBufferDone(callback, tries + 1)
    }, 150 * tries)
  }

  waitForSocketClosed(callback, tries = 1) {
    if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
      callback()
      return
    }

    setTimeout(() => {
      this.waitForSocketClosed(callback, tries + 1)
    }, 150 * tries)
  }

  onConnClose(event){
    if (this.hasLogger()) this.log("transport", "close", event)
    this.triggerChanError()
    clearInterval(this.heartbeatTimer)
    if(!this.closeWasClean){
      this.reconnectTimer.scheduleTimeout()
    }
    this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event) )
  }

  
  onConnError(error){
    if (this.hasLogger()) this.log("transport", error)
    this.triggerChanError()
    this.stateChangeCallbacks.error.forEach(([, callback]) => callback(error) )
  }

  
  triggerChanError(){
    this.channels.forEach( channel => {
      if(!(channel.isErrored() || channel.isLeaving() || channel.isClosed())){
        channel.trigger(CHANNEL_EVENTS.error)
      }
    })
  }

  
  connectionState(){
    switch(this.conn && this.conn.readyState){
      case SOCKET_STATES.connecting: return "connecting"
      case SOCKET_STATES.open:       return "open"
      case SOCKET_STATES.closing:    return "closing"
      default:                       return "closed"
    }
  }

  
  isConnected(){ return this.connectionState() === "open" }

  
  remove(channel){
    this.off(channel.stateChangeRefs)
    this.channels = this.channels.filter(c => c.joinRef() !== channel.joinRef())
  }

  
  off(refs) {
    for(let key in this.stateChangeCallbacks){
      this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
        return refs.indexOf(ref) === -1
      })
    }
  }

  
  channel(topic, chanParams = {}){
    let chan = new Channel(topic, chanParams, this)
    this.channels.push(chan)
    return chan
  }

  
  push(data){
    if (this.hasLogger()) {
      let {topic, event, payload, ref, join_ref} = data
      this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload)
    }

    if(this.isConnected()){
      this.encode(data, result => this.conn.send(result))
    } else {
      this.sendBuffer.push(() => this.encode(data, result => this.conn.send(result)))
    }
  }

  
  makeRef(){
    let newRef = this.ref + 1
    if(newRef === this.ref){ this.ref = 0 } else { this.ref = newRef }

    return this.ref.toString()
  }

  sendHeartbeat(){
    if(!this.isConnected()){ return }
    if(this.pendingHeartbeatRef){
      this.pendingHeartbeatRef = null
      if (this.hasLogger()) this.log("transport", "heartbeat timeout. Attempting to re-establish connection")
      this.abnormalClose("heartbeat timeout")
      return
    }
    this.pendingHeartbeatRef = this.makeRef()
    this.push({topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef})
  }

  abnormalClose(reason){
    this.closeWasClean = false
    this.conn.close(WS_CLOSE_NORMAL, reason)
  }

  flushSendBuffer(){
    if(this.isConnected() && this.sendBuffer.length > 0){
      this.sendBuffer.forEach( callback => callback() )
      this.sendBuffer = []
    }
  }

  onConnMessage(rawMessage){
    this.decode(rawMessage.data, msg => {
      let {topic, event, payload, ref, join_ref} = msg
      if(ref && ref === this.pendingHeartbeatRef){ this.pendingHeartbeatRef = null }

      if (this.hasLogger()) this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload)

      for (let i = 0; i < this.channels.length; i++) {
        const channel = this.channels[i]
        if(!channel.isMember(topic, event, payload, join_ref)){ continue }
        channel.trigger(event, payload, ref, join_ref)
      }

      for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
        let [, callback] = this.stateChangeCallbacks.message[i]
        callback(msg)
      }
    })
  }

  leaveOpenTopic(topic){
    let dupChannel = this.channels.find(c => c.topic === topic && (c.isJoined() || c.isJoining()))
    if(dupChannel){
      if(this.hasLogger()) this.log("transport", `leaving duplicate topic "${topic}"`)
      dupChannel.leave()
    }
  }
}


export class LongPoll {

  constructor(endPoint){
    this.endPoint        = null
    this.token           = null
    this.skipHeartbeat   = true
    this.onopen          = function(){} 
    this.onerror         = function(){} 
    this.onmessage       = function(){} 
    this.onclose         = function(){} 
    this.pollEndpoint    = this.normalizeEndpoint(endPoint)
    this.readyState      = SOCKET_STATES.connecting

    this.poll()
  }

  normalizeEndpoint(endPoint){
    return(endPoint
      .replace("ws://", "http://")
      .replace("wss://", "https://")
      .replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll))
  }

  endpointURL(){
    return Ajax.appendParams(this.pollEndpoint, {token: this.token})
  }

  closeAndRetry(){
    this.close()
    this.readyState = SOCKET_STATES.connecting
  }

  ontimeout(){
    this.onerror("timeout")
    this.closeAndRetry()
  }

  poll(){
    if(!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)){ return }

    Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), (resp) => {
      if(resp){
        var {status, token, messages} = resp
        this.token = token
      } else{
        var status = 0
      }

      switch(status){
        case 200:
          messages.forEach(msg => this.onmessage({data: msg}))
          this.poll()
          break
        case 204:
          this.poll()
          break
        case 410:
          this.readyState = SOCKET_STATES.open
          this.onopen()
          this.poll()
          break
        case 403:
          this.onerror()
          this.close()
          break
        case 0:
        case 500:
          this.onerror()
          this.closeAndRetry()
          break
        default: throw new Error(`unhandled poll status ${status}`)
      }
    })
  }

  send(body){
    Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), (resp) => {
      if(!resp || resp.status !== 200){
        this.onerror(resp && resp.status)
        this.closeAndRetry()
      }
    })
  }

  close(code, reason){
    this.readyState = SOCKET_STATES.closed
    this.onclose()
  }
}

export class Ajax {

  static request(method, endPoint, accept, body, timeout, ontimeout, callback){
    if(global.XDomainRequest){
      let req = new XDomainRequest() 
      this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback)
    } else {
      let req = new global.XMLHttpRequest(); 
      this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback)
    }
  }

  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback){
    req.timeout = timeout
    req.open(method, endPoint)
    req.onload = () => {
      let response = this.parseJSON(req.responseText)
      callback && callback(response)
    }
    if(ontimeout){ req.ontimeout = ontimeout }

    
    req.onprogress = () => {}

    req.send(body)
  }

  static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback){
    req.open(method, endPoint, true)
    req.timeout = timeout
    req.setRequestHeader("Content-Type", accept)
    req.onerror = () => { callback && callback(null) }
    req.onreadystatechange = () => {
      if(req.readyState === this.states.complete && callback){
        let response = this.parseJSON(req.responseText)
        callback(response)
      }
    }
    if(ontimeout){ req.ontimeout = ontimeout }

    req.send(body)
  }

  static parseJSON(resp){
    if(!resp || resp === ""){ return null }

    try {
      return JSON.parse(resp)
    } catch(e) {
      console && console.log("failed to parse JSON response", resp)
      return null
    }
  }

  static serialize(obj, parentKey){
    let queryStr = []
    for(var key in obj){ if(!obj.hasOwnProperty(key)){ continue }
      let paramKey = parentKey ? `${parentKey}[${key}]` : key
      let paramVal = obj[key]
      if(typeof paramVal === "object"){
        queryStr.push(this.serialize(paramVal, paramKey))
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal))
      }
    }
    return queryStr.join("&")
  }

  static appendParams(url, params){
    if(Object.keys(params).length === 0){ return url }

    let prefix = url.match(/\?/) ? "&" : "?"
    return `${url}${prefix}${this.serialize(params)}`
  }
}

Ajax.states = {complete: 4}


export class Presence {

  constructor(channel, opts = {}){
    let events = opts.events || {state: "presence_state", diff: "presence_diff"}
    this.state = {}
    this.pendingDiffs = []
    this.channel = channel
    this.joinRef = null
    this.caller = {
      onJoin: function(){},
      onLeave: function(){},
      onSync: function(){}
    }

    this.channel.on(events.state, newState => {
      let {onJoin, onLeave, onSync} = this.caller

      this.joinRef = this.channel.joinRef()
      this.state = Presence.syncState(this.state, newState, onJoin, onLeave)

      this.pendingDiffs.forEach(diff => {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave)
      })
      this.pendingDiffs = []
      onSync()
    })

    this.channel.on(events.diff, diff => {
      let {onJoin, onLeave, onSync} = this.caller

      if(this.inPendingSyncState()){
        this.pendingDiffs.push(diff)
      } else {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave)
        onSync()
      }
    })
  }

  onJoin(callback){ this.caller.onJoin = callback }

  onLeave(callback){ this.caller.onLeave = callback }

  onSync(callback){ this.caller.onSync = callback }

  list(by){ return Presence.list(this.state, by) }

  inPendingSyncState(){
    return !this.joinRef || (this.joinRef !== this.channel.joinRef())
  }

  

  
  static syncState(currentState, newState, onJoin, onLeave){
    let state = this.clone(currentState)
    let joins = {}
    let leaves = {}

    this.map(state, (key, presence) => {
      if(!newState[key]){
        leaves[key] = presence
      }
    })
    this.map(newState, (key, newPresence) => {
      let currentPresence = state[key]
      if(currentPresence){
        let newRefs = newPresence.metas.map(m => m.phx_ref)
        let curRefs = currentPresence.metas.map(m => m.phx_ref)
        let joinedMetas = newPresence.metas.filter(m => curRefs.indexOf(m.phx_ref) < 0)
        let leftMetas = currentPresence.metas.filter(m => newRefs.indexOf(m.phx_ref) < 0)
        if(joinedMetas.length > 0){
          joins[key] = newPresence
          joins[key].metas = joinedMetas
        }
        if(leftMetas.length > 0){
          leaves[key] = this.clone(currentPresence)
          leaves[key].metas = leftMetas
        }
      } else {
        joins[key] = newPresence
      }
    })
    return this.syncDiff(state, {joins: joins, leaves: leaves}, onJoin, onLeave)
  }

  
  static syncDiff(currentState, {joins, leaves}, onJoin, onLeave){
    let state = this.clone(currentState)
    if(!onJoin){ onJoin = function(){} }
    if(!onLeave){ onLeave = function(){} }

    this.map(joins, (key, newPresence) => {
      let currentPresence = state[key]
      state[key] = newPresence
      if(currentPresence){
        let joinedRefs = state[key].metas.map(m => m.phx_ref)
        let curMetas = currentPresence.metas.filter(m => joinedRefs.indexOf(m.phx_ref) < 0)
        state[key].metas.unshift(...curMetas)
      }
      onJoin(key, currentPresence, newPresence)
    })
    this.map(leaves, (key, leftPresence) => {
      let currentPresence = state[key]
      if(!currentPresence){ return }
      let refsToRemove = leftPresence.metas.map(m => m.phx_ref)
      currentPresence.metas = currentPresence.metas.filter(p => {
        return refsToRemove.indexOf(p.phx_ref) < 0
      })
      onLeave(key, currentPresence, leftPresence)
      if(currentPresence.metas.length === 0){
        delete state[key]
      }
    })
    return state
  }

  
  static list(presences, chooser){
    if(!chooser){ chooser = function(key, pres){ return pres } }

    return this.map(presences, (key, presence) => {
      return chooser(key, presence)
    })
  }

  

  static map(obj, func){
    return Object.getOwnPropertyNames(obj).map(key => func(key, obj[key]))
  }

  static clone(obj){ return JSON.parse(JSON.stringify(obj)) }
}



class Timer {
  constructor(callback, timerCalc){
    this.callback  = callback
    this.timerCalc = timerCalc
    this.timer     = null
    this.tries     = 0
  }

  reset(){
    this.tries = 0
    clearTimeout(this.timer)
  }

  
  scheduleTimeout(){
    clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      this.tries = this.tries + 1
      this.callback()
    }, this.timerCalc(this.tries + 1))
  }
}
