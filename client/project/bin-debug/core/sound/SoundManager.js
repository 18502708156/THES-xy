var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SoundManager = (function () {
    function SoundManager() {
        this.bgOn = false;
        this.effectOn = false;
        this.bgVolume = 0.5;
        this.effectVolume = 0.5;
        this.m_DelayTime = true;
        this.m_DelaySetTime = true;
        this.bg = new SoundBg();
        this.bg.setVolume(this.bgVolume);
        // this.effect = new SoundEffects();
        // this.effect.setVolume(this.effectVolume);
    }
    /**
     * 播放音效
     */
    SoundManager.prototype.PlayEffect = function (effectName) {
        if (!this.effectOn)
            return;
        // this.effect.play(effectName);
    };
    /**
     * 播放背景音乐
     */
    SoundManager.prototype.PlayBg = function (bgName) {
        this.currBg = bgName;
        if (!this.GetBgOn()) {
            return;
        }
        if (this.m_DelayTime) {
            if (this.m_DelaySetTime) {
                this.m_DelaySetTime = null;
                TimerManager.ins().doTimer(2500, 1, this.DelayPlay, this);
            }
            return;
        }
        this.bg.play(bgName);
    };
    SoundManager.prototype.DelayPlay = function () {
        this.m_DelayTime = null;
        if (!this.GetBgOn()) {
            return;
        }
        if (this.currBg) {
            this.bg.play(this.currBg);
        }
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.StopBg = function () {
        this.bg.stop();
    };
    /**
     * 设置音效是否开启
     */
    SoundManager.prototype.SetEffectOn = function ($isOn) {
        this.effectOn = $isOn;
    };
    /**
     * 设置背景音乐是否开启
     */
    SoundManager.prototype.SetBgOn = function (isOn) {
        this.bgOn = isOn;
        var on = this.GetBgOn();
        if (!on) {
            this.StopBg();
        }
        else {
            if (this.currBg) {
                this.PlayBg(this.currBg);
            }
        }
    };
    SoundManager.prototype.GetBgOn = function () {
        return this.bgOn && !StartMain.instance.mIsPauseApp;
    };
    SoundManager.prototype.UpdateBgOn = function () {
        this.SetBgOn(this.bgOn);
    };
    /**
     * 设置背景音乐音量
     */
    SoundManager.prototype.SetBgVolume = function (volume) {
        volume = MathUtils.Clamp(volume, 0, 1);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = MathUtils.Clamp(volume, 0, 1);
        this.effectVolume = volume;
        // this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    /**
     * 音乐文件清理时间
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    return SoundManager;
}());
__reflect(SoundManager.prototype, "SoundManager");
//# sourceMappingURL=SoundManager.js.map