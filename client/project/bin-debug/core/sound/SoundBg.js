var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    function SoundBg() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._currBg = "";
        return _this;
    }
    SoundBg.prototype.isPlay = function () {
        return this._currSoundChannel != null;
    };
    /**
     * 停止当前音乐
     */
    SoundBg.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    };
    /**
     * 播放某个音乐
     */
    SoundBg.prototype.play = function (effectName) {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        TimerManager.ins().doNext(this.ChangeSound, this);
    };
    SoundBg.prototype.ChangeSound = function () {
        if (!this._currBg) {
            return;
        }
        var sound = this.getSound(this._currBg);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * 播放
     */
    SoundBg.prototype.playSound = function (sound) {
        if (!sound) {
            return;
        }
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(0, 0);
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * 设置音量
     */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * 检测一个文件是否要清除
     */
    SoundBg.prototype.checkCanClear = function (key) {
        return this._currBg != key;
    };
    return SoundBg;
}(BaseSound));
__reflect(SoundBg.prototype, "SoundBg");
//# sourceMappingURL=SoundBg.js.map