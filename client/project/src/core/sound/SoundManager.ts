class SoundManager {

    private bgOn: boolean = false;
    private effectOn = false;
    private bgVolume: number = 0.5;
    private effectVolume = 0.5;
    private bg: SoundBg;

    private currBg: string;

    private m_DelayTime: boolean = true
    private m_DelaySetTime: boolean = true

    public constructor() {
        this.bg = new SoundBg();
        this.bg.setVolume(this.bgVolume);
        // this.effect = new SoundEffects();
        // this.effect.setVolume(this.effectVolume);
    }

    /**
     * 播放音效
     */
    public PlayEffect(effectName) {
        if (!this.effectOn)
            return;
        // this.effect.play(effectName);
    }

    /**
     * 播放背景音乐
     */
    public PlayBg(bgName: string) {
        this.currBg = bgName;
        if (!this.GetBgOn()) {
            return;
        }
        if (this.m_DelayTime) {
            if (this.m_DelaySetTime) {
                this.m_DelaySetTime = null
                TimerManager.ins().doTimer(2500, 1, this.DelayPlay, this)
            }
            return
        }
        this.bg.play(bgName);
    }

    private DelayPlay() {
        this.m_DelayTime = null
        if (!this.GetBgOn()) {
            return;
        }
        if (this.currBg) {
            this.bg.play(this.currBg);
        }
    }

    /**
     * 停止背景音乐
     */
    public StopBg() {
        this.bg.stop();
    }

    /**
     * 设置音效是否开启
     */
    public SetEffectOn($isOn) {
        this.effectOn = $isOn;
    }

    /**
     * 设置背景音乐是否开启
     */
    public SetBgOn(isOn: boolean) {
        this.bgOn = isOn;
        let on = this.GetBgOn()
        if (!on) {
            this.StopBg();
        } else {
            if (this.currBg) {
                this.PlayBg(this.currBg);
            }
        }
    }

    private GetBgOn(): boolean {
        return this.bgOn && !StartMain.instance.mIsPauseApp
    }

    public UpdateBgOn(): void {
        this.SetBgOn(this.bgOn)
    }

    /**
     * 设置背景音乐音量
     */
    public SetBgVolume(volume) {
        volume = MathUtils.Clamp(volume, 0, 1);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    }

    /**
     * 获取背景音乐音量
     */
    public getBgVolume() {
        return this.bgVolume;
    }

    /**
     * 设置音效音量
     */
    public setEffectVolume(volume: number) {
        volume = MathUtils.Clamp(volume, 0, 1);
        this.effectVolume = volume;
        // this.effect.setVolume(this.effectVolume);
    }

    /**
     * 获取音效音量
     */
    public getEffectVolume() {
        return this.effectVolume;
    }

    /**
     * 音乐文件清理时间
     */
    public static CLEAR_TIME = 3 * 60 * 1000;
}