export class EventProtocol {
  public static extend = function (object) {
    object.listeners_ = new Object();
    object.listenerHandleIndex_ = 0;
    object.addEventListener = function (eventName, listener, target) {
      if (object.listeners_[eventName] == null) {
        object.listeners_[eventName] = [];
      }
      object.listenerHandleIndex_ = object.listenerHandleIndex_ + 1;
      var handle = "HANDLE_" + object.listenerHandleIndex_;
      object.listeners_[eventName][handle] = listener;
      return handle;
    };
    object.dispatchEvent = function (event) {
      var eventName = event.name;
      if (object.listeners_[eventName] == null) return;
      event.target = object;
      var allListener = object.listeners_[eventName];
      for (var handle in allListener) {
        var listener = allListener[handle];
        if (listener) {
          var ret = listener(event);
          if (ret == false) break;
          else if (ret == "__REMOVE__")
            object.listeners_[eventName][handle] = null;
        }
      }
    };
    object.removeEventListener = function (eventName, key) {
      if (object.listeners_[eventName] == null) return;
      var allListener = object.listeners_[eventName];
      for (var handle in allListener) {
        var listener = allListener[handle];
        if (key == handle || key == listener) {
          object.listeners_[eventName][handle] = null;
        }
      }
    };
    object.removeAllEventListenersForEvent = function (eventName) {
      object.listeners_[eventName] = null;
    };
    object.removeAllEventListenersForHandle = function (handle) {
      if (handle == null) return;
      var _ = require("Underscore");
      var findOne = _.each(object.listeners_, function (v, k) {
        if (v) {
          object.removeEventListener(k, handle);
        }
      });
    };
    object.removeAllEventListeners = function () {
      object.listeners_ = new Object();
    };
  };
}
