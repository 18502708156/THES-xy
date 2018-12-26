class BaseSound {

    private _cache: {[key: string]: number} = {}
    private _loadingCache: string[] = []

    public constructor() {
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
    public getSound(key: string) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        } else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    }

    /**
     * 资源加载完成
     */
    public onResourceLoadComplete(data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    }

    /**
     * 资源加载完成后处理播放，子类重写
     */
    public loadedPlay(key) {
    }

    /**
     * 检测一个文件是否要清除，子类重写
     */
    public checkCanClear(key) {
        return true;
    }
}