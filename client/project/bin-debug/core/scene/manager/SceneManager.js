var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SceneManager = (function () {
    function SceneManager() {
    }
    SceneManager.ins = function () {
        if (!this._ins) {
            this._ins = new SceneManager;
        }
        return this._ins;
    };
    /**
     * 清空处理
     */
    SceneManager.prototype.clear = function () {
        var nowScene = this._currScene;
        if (nowScene) {
            nowScene.onExit();
            this._currScene = undefined;
        }
    };
    ;
    /**
     * 切换场景
     * @param key 场景唯一标识
     */
    SceneManager.prototype.runScene = function (SceneClass) {
        if (SceneClass == null) {
            console.log("runScene:scene is null");
            return;
        }
        var oldScene = this._currScene;
        if (oldScene) {
            oldScene.onExit();
            oldScene = undefined;
        }
        var s = new SceneClass();
        s.onEnter();
        this._currScene = s;
    };
    ;
    /**
     * 获取当前Scene
     * @returns {number}
     */
    SceneManager.prototype.getCurrScene = function () {
        return this._currScene;
    };
    ;
    return SceneManager;
}());
__reflect(SceneManager.prototype, "SceneManager");
//# sourceMappingURL=SceneManager.js.map