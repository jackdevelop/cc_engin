import { GameConstants } from '../../../../cc_own/constants/GameConstants';
import { GameHelp } from '../utils/GameHelp';
import { GameLoader } from '../utils/GameLoader';

const { ccclass, property } = cc._decorator;

export enum AudioId {
   bg_hall,
   bg2,
   btnSound,
}

@ccclass
export class AudioManager  {
  

  private mBgmAudioUrl = null; 
  getBgmAudioUrl() {
    return this.mBgmAudioUrl;
  }
  private mBgmAudioId = -1; 
  getBgmAudioId() {
    return this.mBgmAudioId;
  }
  private mBgmVolume = 0.75; 
  private mSfxVolume = 0.75; 
  private uid = 0; 
  private m_isPause = 0; 
  private m_sfs_audioid = null; 

  private static instance: AudioManager = null;
  public static getInstance(): AudioManager {
    if (this.instance == null) {
      this.instance = new AudioManager();
      this.instance._init();
    }
    return this.instance;
  }

  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  _init() {
    
    this.uid = cc.sys.localStorage.getItem('uid') || 0; 

    let bv = cc.sys.localStorage.getItem('mBgmVolume' + this.uid);
    if (bv) this.mBgmVolume = parseFloat(bv);
    let bs = cc.sys.localStorage.getItem('mSfxVolume' + this.uid);
    if (bs) this.mSfxVolume = parseFloat(bs);

    let m_isPause = cc.sys.localStorage.getItem('m_isPause' + this.uid);
    this.m_isPause = parseInt(m_isPause);
    

    
  }

  
  
  
  
  
  
  
  
  
  
  
  
  

  
  private getUrl(url: string): string {
    
    
    
    
    return GameConstants.AUDIO_DIR + url;
  }

  
  private async play(
    url: string | cc.AudioClip,
    loop,
    volume
  ): Promise<number | any> {
    if (url instanceof cc.AudioClip) {
      let audioID = cc.audioEngine.play(url, loop, volume);
      
      
      
      
      
      
      
      
      return audioID;
    } else {
      let clip = await GameLoader.load(url, cc.AudioClip);
      if (clip) {
        let audioID = cc.audioEngine.play(clip, loop, volume);
        
        return audioID;
      }
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
  }

  
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

  
  public getBGMVolume() {
    return this.mBgmVolume;
  }
  
  public getSFXVolume() {
    return this.mSfxVolume;
  }

  public stopSFX(id: AudioId) {
    if (!id) {
      return;
    }
    
    cc.audioEngine.stopEffect(id);
    cc.audioEngine.stop(id);
  }
  public stopAll() {
    cc.audioEngine.stopAll();
  }

  
  
  

  
  public setSFXVolume(v: number = 0) {
    if (this.mSfxVolume != v) {
      
      cc.sys.localStorage.setItem('mSfxVolume' + this.uid, v); 
      cc.sys.localStorage.setItem('mSfxVolume0', v); 
      this.mSfxVolume = v;

      
      
    }
  }

  
  public setBGMVolume(v: number = 0, isPlay: boolean = true) {
    
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
      
    } else {
      this.playBGM(this.mBgmAudioUrl);
    }

    if (this.mBgmVolume != v) {
      cc.sys.localStorage.setItem('mBgmVolume' + this.uid, v); 
      cc.sys.localStorage.setItem('mBgmVolume0', v); 
      this.mBgmVolume = v;
      if (this.mBgmAudioId >= 0) {
        if (v > 0) {
          cc.audioEngine.setVolume(this.mBgmAudioId, v);
        }
      }
      
    }
  }

  
  public async pauseOrResume(isPause?: boolean) {
    let isPause_int = 0;
    if (isPause) {
      isPause_int = 1;
    }
    this.m_isPause = isPause_int;
    cc.sys.localStorage.setItem('m_isPause' + this.uid, isPause_int); 
    cc.sys.localStorage.setItem('m_isPause', isPause_int); 

    if (isPause) {
      cc.audioEngine.pauseAll();
    } else {
      cc.audioEngine.resumeAll();

      let mBgmAudioUrl = this.mBgmAudioUrl;
      let is_player = this.isBGMPlaying();
      if (!is_player) await this.playBGM(mBgmAudioUrl);
    }
    return true;
    
  }

  
  public async playBGM(id: AudioId | string | cc.AudioClip = AudioId.bg_hall) {
    if (!id && id != 0) {
      return;
    }

    this.mBgmAudioUrl = id;
    let audioUrl =
      id instanceof cc.AudioClip
        ? id
        : this.getUrl(typeof id == 'string' ? id : AudioId[id]);
    
    if (this.mBgmAudioId >= 0) cc.audioEngine.stop(this.mBgmAudioId);
    if (this.mBgmVolume == 0) return;
    if (!this.isSupportAudio()) return; 
    if (this.m_isPause) return;

    cc.audioEngine.stopAll(); 
    this.mBgmAudioId = await this.play(audioUrl, true, this.mBgmVolume); 
    

    return this.mBgmAudioId;
  }

  
  
  
  
  
  
  
  
  
  

  
  public async playSFX(url: string | cc.AudioClip, loop: boolean) {
    if (!url) {
      cc.log("当前音乐为空")
      return;
    }

    let audioUrl = url instanceof cc.AudioClip ? url : this.getUrl(url);
    
    
    if (!this.isSupportAudio()) return; 

    if (this.mSfxVolume > 0) {
      
      if (this.m_sfs_audioid) {
        cc.audioEngine.stop(this.m_sfs_audioid);
      }

      let sfs_audioid = await this.play(
        audioUrl,
        loop || false,
        this.mSfxVolume
      ); 

      this.m_sfs_audioid = sfs_audioid;
      return sfs_audioid;
    }
    
  }

  
  public isBGMPlaying() {
    return this.m_isPause;
    
  }
}
