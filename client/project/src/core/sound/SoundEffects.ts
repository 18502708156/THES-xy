class SoundEffects extends BaseSound {

    private _volume: number

	/**
     * 播放一个音效
     */
    public play(effectName) {
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    }

    /**
     * 播放
     */
    public playSound(sound) {
        var channel = sound.play(0, 1);
        channel.volume = this._volume;
    }

    /**
     * 设置音量
     */
    public setVolume(volume) {
        this._volume = volume;
    }

    /**
     * 资源加载完成后处理播放
     */
    public loadedPlay(key) {
        this.playSound(RES.getRes(key));
    }
}