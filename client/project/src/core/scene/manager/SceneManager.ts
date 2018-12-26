class SceneManager {

	private static _ins: SceneManager

	public static ins(): SceneManager {
		if (!this._ins) {
			this._ins = new SceneManager
		}
		return this._ins
	}

	private _currScene: BaseScene;
    /**
     * 清空处理
     */
	public clear() {
		var nowScene = this._currScene;
		if (nowScene) {
			nowScene.onExit();
			this._currScene = undefined;
		}
	};
    /**
     * 切换场景
     * @param key 场景唯一标识
     */
	public runScene(SceneClass) {
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
    /**
     * 获取当前Scene
     * @returns {number}
     */
	public getCurrScene() {
		return this._currScene;
	};
}