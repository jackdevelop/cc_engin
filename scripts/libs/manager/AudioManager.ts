import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameHelp } from '../utils/GameHelp';
import { GameLoader } from '../utils/GameLoader';

const { ccclass, property } = cc._decorator;

export enum AudioId {
  /** bg*/ bg_hall,
  /** bg2*/ bg2,
  /** btnSound*/ btnSound,
}

@ccclass
export class AudioManager /* extends cc.Component */ {
  // public static readonly instance = new AudioManager();

  private mBgmAudioUrl = null; //当前正在播放的背景音乐
  getBgmAudioUrl() {
    return this.mBgmAudioUrl;
  }
  private mBgmAudioId = -1; /** 是否第一次播放 播放音乐id*/
  getBgmAudioId() {
    return this.mBgmAudioId;
  }
  private mBgmVolume = 0.75; // 默认背景声音大小
  private mSfxVolume = 0.75; // 默认音效声音大小
  private uid = 0; // 用户id
  private m_isPause = 0; //暂停
  private m_sfs_audioid = null; //记录当前播放的sfs音效

  private static instance: AudioManager = null;
  public static getInstance(): AudioManager {
    if (this.instance == null) {
      this.instance = new AudioManager();
      this.instance._init();
    }
    return this.instance;
  }

  // _init() {
  //   this.init();
  //   // this.addEvent();
  // }

  // addEvent() {
  //cc.log("App init............type:", SDKManager.phoneType);
  // 总控制事件-后台前台注册事件
  // cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
  // cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
  // }
  // onDestroy() {
  //     // cc.audioEngine.stopAll();
  //     cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
  //     cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
  //    cc.log("App onDestroy............");
  // }
  // private _pausedCallback(e) {
  //   // AudioManager.getInstance().pauseOrResume(true);
  //   cc.audioEngine.pauseAll();
  //   cc.log('App pause.............');
  // }
  // private _restoreCallback(e) {
  //   // AudioManager.getInstance().pauseOrResume();
  //   cc.audioEngine.resumeAll();
  //   cc.log('App resume.............');
  // }

  _init() {
    // cc.audioEngine.setMaxAudioInstance(10);
    this.uid = cc.sys.localStorage.getItem('uid') || 0; // 获取uid 根据每个用户进行定制声音播放情况

    let bv = cc.sys.localStorage.getItem('mBgmVolume' + this.uid);
    if (bv) this.mBgmVolume = parseFloat(bv);
    let bs = cc.sys.localStorage.getItem('mSfxVolume' + this.uid);
    if (bs) this.mSfxVolume = parseFloat(bs);

    let m_isPause = cc.sys.localStorage.getItem('m_isPause' + this.uid);
    this.m_isPause = parseInt(m_isPause);
    // if (m_isPause) this.m_isPause = m_isPause;

    //cc.log("type:", SDKManager.phoneType, "mBgmVolume", bv, this.mBgmVolume, "mSfxVolume:", bs, this.mSfxVolume);
  }

  // public lateUpdate() {
  //   // 谷歌最新版本 规定不能自动播放 需要用户手动播放 规避这种情况 游戏选择自动播放
  //   if (cc.sys.isBrowser) {
  //     let context = (<any>cc.sys).__audioSupport.context;
  //     if (context.state === 'suspended') {
  //       // google chrome latest version need set running
  //       context.resume().then((e) => {
  //         cc.log(context.state);
  //       });
  //       cc.log(context.state);
  //     }
  //   }
  // }

  //统一获取地址
  private getUrl(url: string): string {
    // 统一获取url
    // let addPath = '';
    // if (url.indexOf("_") != -1) addPath = "sj/";
    // return cc.url.raw("resources/sounds/" + addPath + url + ".m" + "p3");
    return GameConstants.AUDIO_DIR + url;
  }

  /** 统一音频播放入口 */
  private async play(
    url: string | cc.AudioClip,
    loop,
    volume
  ): Promise<number | any> {
    if (url instanceof cc.AudioClip) {
      let audioID = cc.audioEngine.play(url, loop, volume);
      // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
      // if (this.isFristPlay) {
      //     this.isFristPlay = false;
      // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
      // }
      //cc.log("audioID:", audioID);
      // resolve(audioID);
      // return;
      return audioID;
    } else {
      let clip = await GameLoader.load(url, cc.AudioClip);
      if (clip) {
        let audioID = cc.audioEngine.play(clip, loop, volume);
        // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
        return audioID;
      }
    }

    // return new Promise((resolve, reject) => {
    //     if (url instanceof cc.AudioClip) {
    //         let audioID = cc.audioEngine.play(url, loop, volume);
    //         if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    //         // if (this.isFristPlay) {
    //         //     this.isFristPlay = false;
    //         // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    //         // }
    //         //cc.log("audioID:", audioID);
    //         resolve(audioID);
    //         return;
    //     }
    //
    //     cc.loader.loadRes(url, cc.AudioClip, (err, clip) => {
    //         let audioID = cc.audioEngine.play(clip, loop, volume);
    //         if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    //         // if (this.isFristPlay) {
    //         //     this.isFristPlay = false;
    //         // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    //         // }
    //         //cc.log("audioID:", audioID);
    //         resolve(audioID);
    //     });
    // });

    // let audioID = cc.audioEngine.play(url, loop, volume);
    // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    // // if (this.isFristPlay) {
    // //     this.isFristPlay = false;
    // //     if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好
    // // }
    // return audioID;
  }

  /**
   *  是否支持播放音乐
   */
  private isSupportAudio(): boolean {
    if (!cc.sys.isBrowser) return true;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      return true;
    } else {
      if (
        (<any>cc.sys).__audioSupport.WEB_AUDIO &&
        !(
          (<any>cc.sys).__audioSupport.context &&
          (<any>cc.sys).__audioSupport.context['createGain']
        )
      )
        return false;
      return true;
    }
  }

  //背景音量
  public getBGMVolume() {
    return this.mBgmVolume;
  }
  //音效音量
  public getSFXVolume() {
    return this.mSfxVolume;
  }

  public stopSFX(id: AudioId) {
    if (!id) {
      return;
    }
    // isPause ? cc.audioEngine.pauseAll() : cc.audioEngine.resumeAll();
    cc.audioEngine.stopEffect(id);
    cc.audioEngine.stop(id);
  }
  public stopAll() {
    cc.audioEngine.stopAll();
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////公共方法 ///////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  /**
   *  设置音效的音量
   *
   * @param v
   */
  public setSFXVolume(v: number = 0) {
    if (this.mSfxVolume != v) {
      // if (this.uid === 0) HttpService.instance && HttpService.instance.userinfo && (this.uid = HttpService.instance.userinfo.userId); // 如果是新用户进行设置
      cc.sys.localStorage.setItem('mSfxVolume' + this.uid, v); // 用户音频设置记录
      cc.sys.localStorage.setItem('mSfxVolume0', v); // 默认账户记录
      this.mSfxVolume = v;

      // setEffectsVolume
      // cc.audioEngine.setEffectsVolume(v);
    }
  }

  /**
   * 设置背景音乐音量
   * @param v
   * @param isPlay
   */
  public setBGMVolume(v: number = 0, isPlay: boolean = true) {
    // if (this.uid === 0) HttpService.instance && HttpService.instance.userinfo && (this.uid = HttpService.instance.userinfo.userId); // 如果是新用户进行设置
    if (this.mBgmAudioId >= 0) {
      let status: cc.audioEngine.AudioState = cc.audioEngine.getState(
        this.mBgmAudioId
      );
      if (v > 0) {
        if (status == cc.audioEngine.AudioState.ERROR) {
          cc.audioEngine.stop(this.mBgmAudioId);
          this.mBgmAudioId = -1;
        } else if (status != cc.audioEngine.AudioState.PLAYING)
          cc.audioEngine.resume(this.mBgmAudioId);
      } else {
        if (status != cc.audioEngine.AudioState.PAUSED)
          cc.audioEngine.pause(this.mBgmAudioId);
      }
      // cc.audioEngine.setVolume(this.bgmVolume);
    } else {
      this.playBGM(this.mBgmAudioUrl);
    }

    if (this.mBgmVolume != v) {
      cc.sys.localStorage.setItem('mBgmVolume' + this.uid, v); // 用户音频设置记录
      cc.sys.localStorage.setItem('mBgmVolume0', v); // 默认账户记录
      this.mBgmVolume = v;
      if (this.mBgmAudioId >= 0) {
        if (v > 0) {
          cc.audioEngine.setVolume(this.mBgmAudioId, v);
        }
      }
      // if(this.mBgmAudioId>0) cc.audioEngine.resume(this.mBgmAudioId);
    }
  }

  /**
   *  暂停或者播放所有音乐
   * @param isPause
   */
  public async pauseOrResume(isPause?: boolean) {
    let isPause_int = 0;
    if (isPause) {
      isPause_int = 1;
    }
    this.m_isPause = isPause_int;
    cc.sys.localStorage.setItem('m_isPause' + this.uid, isPause_int); // 用户音频设置记录
    cc.sys.localStorage.setItem('m_isPause', isPause_int); // 默认账户记录

    if (isPause) {
      cc.audioEngine.pauseAll();
    } else {
      cc.audioEngine.resumeAll();

      let mBgmAudioUrl = this.mBgmAudioUrl;
      let is_player = this.isBGMPlaying();
      if (!is_player) await this.playBGM(mBgmAudioUrl);
    }
    return true;
    // isPause ? cc.audioEngine.pauseAll() : cc.audioEngine.resumeAll();
  }

  /**
   * 播放背景音乐
   * 设置背景音乐 两个参数必须取一个
   *
   * @param id
   */
  public async playBGM(id: AudioId | string | cc.AudioClip = AudioId.bg_hall) {
    if (!id && id != 0) {
      return;
    }

    this.mBgmAudioUrl = id;
    let audioUrl =
      id instanceof cc.AudioClip
        ? id
        : this.getUrl(typeof id == 'string' ? id : AudioId[id]);
    // cc.log(this.mBgmAudioId, audioUrl);
    if (this.mBgmAudioId >= 0) cc.audioEngine.stop(this.mBgmAudioId);
    if (this.mBgmVolume == 0) return;
    if (!this.isSupportAudio()) return; // 不支持播放音乐
    if (this.m_isPause) return;

    cc.audioEngine.stopAll(); //.stopMusic(); // 这里应该放在load的播放前
    this.mBgmAudioId = await this.play(audioUrl, true, this.mBgmVolume); // cc.audioEngine.play(audioUrl, true, this.mBgmVolume);
    // cc.log(this.mBgmAudioId, audioUrl);

    return this.mBgmAudioId;
  }

  // /**
  //  *  根据 AudioId  播放特殊音效
  //  * @param id
  //  * @param isMan
  //  */
  // private playSFXById(id: AudioId | cc.AudioClip, isMan: boolean = true) {
  //   // let url = "cc-" + (isMan ? 1 : 0) + "-" + id;
  //   let audioUrl = id instanceof cc.AudioClip ? id : AudioId[id];
  //   return this.playSFX(audioUrl, null);
  // }

  /**
   *  播放音效
   * @param url
   */
  public async playSFX(url: string | cc.AudioClip, loop: boolean) {
    if (!url) {
      cc.log("当前音乐为空")
      return;
    }

    let audioUrl = url instanceof cc.AudioClip ? url : this.getUrl(url);
    //cc.log("playSFX:",audioUrl, this.mSfxVolume);
    // cc.audioEngine.stopAllEffects();
    if (!this.isSupportAudio()) return; // 不支持播放音乐

    if (this.mSfxVolume > 0) {
      //设置永远只播放一个音效
      if (this.m_sfs_audioid) {
        cc.audioEngine.stop(this.m_sfs_audioid);
      }

      let sfs_audioid = await this.play(
        audioUrl,
        loop || false,
        this.mSfxVolume
      ); // cc.audioEngine.play(audioUrl, false, this.mSfxVolume);

      this.m_sfs_audioid = sfs_audioid;
      return sfs_audioid;
    }
    // if (this.mSfxVolume > 0) return await cc.audioEngine.playEffect(audioUrl, loop || false);
  }

  /**
   *  isMusicPlaying 背景音乐是否正在播放
   * @param id
   * @param isMan
   */
  public isBGMPlaying() {
    return this.m_isPause;
    // return cc.audioEngine.isMusicPlaying();
  }
}
