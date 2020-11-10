import { AudioManager } from "./AudioManager";
const { ccclass, property } = cc._decorator;
var radix = 12;
var base = 128 - radix;
function crypto(value) {
  value -= base;
  var h = Math.floor(value / radix) + base;
  var l = (value % radix) + base;
  return String.fromCharCode(h) + String.fromCharCode(l);
}
var encodermap = new Object();
var decodermap = new Object();
for (var i = 0; i < 256; ++i) {
  var code = null;
  var v = i + 1;
  if (v >= base) {
    code = crypto(v);
  } else {
    code = String.fromCharCode(v);
  }
  encodermap[i] = code;
  decodermap[code] = i;
}
function encode(data) {
  var content = "";
  var len = data.length;
  var a = (len >> 24) & 0xff;
  var b = (len >> 16) & 0xff;
  var c = (len >> 8) & 0xff;
  var d = len & 0xff;
  content += encodermap[a];
  content += encodermap[b];
  content += encodermap[c];
  content += encodermap[d];
  for (var i = 0; i < data.length; ++i) {
    content += encodermap[data[i]];
  }
  return content;
}
function getCode(content, index) {
  var c = content.charCodeAt(index);
  if (c >= base) {
    c = content.charAt(index) + content.charAt(index + 1);
  } else {
    c = content.charAt(index);
  }
  return c;
}
function decode(content) {
  var index = 0;
  var len = 0;
  for (var i = 0; i < 4; ++i) {
    var c = getCode(content, index);
    index += c.length;
    var v = decodermap[c];
    len |= v << ((3 - i) * 8);
  }
  var newData = new Uint8Array(len);
  var cnt = 0;
  while (index < content.length) {
    var c = getCode(content, index);
    index += c.length;
    newData[cnt] = decodermap[c];
    cnt++;
  }
  return newData;
}
@ccclass
export class VoiceManager {
  private ANDROID_API = "org/cocos2dx/sscq/voice/VoiceRecorder";
  private ANDROID_API_PLAYER = "org/cocos2dx/sscq/voice/VoicePlayer";
  private IOS_API = "VoiceSDK";
  private _voiceMediaPath = null;
  private static instance: VoiceManager = null;
  public static getInstance(): VoiceManager {
    if (this.instance == null) {
      this.instance = new VoiceManager();
      this.instance._init();
    }
    return this.instance;
  }
  _init() {
    this.init();
  }
  init() {
    if (cc.sys.isNative) {
      this._voiceMediaPath = jsb.fileUtils.getWritablePath() + "/voicemsgs/";
      this.setStorageDir(this._voiceMediaPath);
    }
  }
  prepare(filename) {
    if (!cc.sys.isNative) {
      return;
    }
    AudioManager.getInstance().pauseOrResume(true);
    this.clearCache(filename);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(
        this.ANDROID_API,
        "prepare",
        "(Ljava/lang/String;)V",
        filename
      );
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "prepareRecord:", filename);
    }
  }
  release() {
    if (!cc.sys.isNative) {
      return;
    }
    AudioManager.getInstance().pauseOrResume(false);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(this.ANDROID_API, "release", "()V");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "finishRecord");
    }
  }
  cancel() {
    if (!cc.sys.isNative) {
      return;
    }
    AudioManager.getInstance().pauseOrResume(false);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(this.ANDROID_API, "cancel", "()V");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "cancelRecord");
    }
  }
  writeVoice(filename, voiceData) {
    if (!cc.sys.isNative) {
      return;
    }
    if (voiceData && voiceData.length > 0) {
      var fileData = decode(voiceData);
      var url = this._voiceMediaPath + filename;
      this.clearCache(filename);
      jsb.fileUtils.writeDataToFile(fileData, url);
    }
  }
  clearCache(filename) {
    if (cc.sys.isNative) {
      var url = this._voiceMediaPath + filename;
      if (jsb.fileUtils.isFileExist(url)) {
        jsb.fileUtils.removeFile(url);
      }
      if (jsb.fileUtils.isFileExist(url + ".wav")) {
        jsb.fileUtils.removeFile(url + ".wav");
      }
    }
  }
  play(filename) {
    if (!cc.sys.isNative) {
      return;
    }
    AudioManager.getInstance().pauseOrResume(true);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(
        this.ANDROID_API_PLAYER,
        "play",
        "(Ljava/lang/String;)V",
        filename
      );
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "play:", filename);
    }
  }
  stop() {
    if (!cc.sys.isNative) {
      return;
    }
    AudioManager.getInstance().pauseOrResume(false);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(this.ANDROID_API_PLAYER, "stop", "()V");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "stopPlay");
    }
  }
  getVoiceLevel(maxLevel) {
    return Math.floor(Math.random() * maxLevel + 1);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      return jsb.reflection.callStaticMethod(
        this.ANDROID_API,
        "getVoiceLevel",
        "(I)I",
        maxLevel
      );
    } else {
      return Math.floor(Math.random() * maxLevel + 1);
    }
  }
  getVoiceData(filename) {
    if (cc.sys.isNative) {
      var url = this._voiceMediaPath + filename;
      var fileData = jsb.fileUtils.getDataFromFile(url);
      if (fileData) {
        var content = encode(fileData);
        return content;
      }
    }
    return "";
  }
  download() {
    return true;
  }
  setStorageDir(dir) {
    if (!cc.sys.isNative) {
      return;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod(
        this.ANDROID_API,
        "setStorageDir",
        "(Ljava/lang/String;)V",
        dir
      );
    } else if (cc.sys.os == cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("VoiceSDK", "setStorageDir:", dir);
      if (!jsb.fileUtils.isDirectoryExist(dir)) {
        jsb.fileUtils.createDirectory(dir);
      }
    }
  }
}
