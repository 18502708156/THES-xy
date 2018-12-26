var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseSound = (function () {
    function BaseSound() {
        this._cache = {};
        this._loadingCache = [];
        // TimerManager.ins().doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * 处理音乐文件的清理
     */
    // public dealSoundTimer() {
    //     var currTime = egret.getTimer();
    //     for (let key in this._cache) {
    //          if (!this.checkCanClear(key)) {
    //             continue;
    //          }
    //          if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
    //             delete this._cache[key];
    //             RES.destroyRes(key);
    //         }
    //     }
    // }
    /**
     * 获取Sound
     */
    BaseSound.prototype.getSound = function (key) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        }
        else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    };
    /**
     * 资源加载完成
     */
    BaseSound.prototype.onResourceLoadComplete = function (data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    };
    /**
     * 资源加载完成后处理播放，子类重写
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * 检测一个文件是否要清除，子类重写
     */
    BaseSound.prototype.checkCanClear = function (key) {
        return true;
    };
    return BaseSound;
}());
__reflect(BaseSound.prototype, "BaseSound");
//# sourceMappingURL=BaseSound.js.map