class SoundBg extends BaseSound {

    private _currBg: string = "";
    private _currSoundChannel: egret.SoundChannel;
    private _currSound: egret.Sound;
    private _volume: number;

    public isPlay(): boolean {
        return this._currSoundChannel != null
    }

	/**
     * 停止当前音乐
     */
    public stop() {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    }

    /**
     * 播放某个音乐
     */
    public play(effectName: string) {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        TimerManager.ins().doNext(this.ChangeSound, this)
    }

    private ChangeSound() {
        if (!this._currBg) {
            return
        }
        var sound = this.getSound(this._currBg);
        if (sound) {
            this.playSound(sound);
        }
    }

    /**
     * 播放
     */
    private playSound(sound: egret.Sound) {
        if (!sound) {
            return
        }
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(0, 0);
        this._currSoundChannel.volume = this._volume;
    }

    /**
     * 设置音量
     */
    public setVolume(volume: number) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    }
    
    /**
     * 资源加载完成后处理播放
     */
    public loadedPlay(key: string) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    }

    /**
     * 检测一个文件是否要清除
     */
    public checkCanClear(key) {
        return this._currBg != key;
    }
}