class BaseScene {

	/**
     * 进入Scene调用
     */
    public onEnter () {
    }

    /**
     * 退出Scene调用
     */
    public onExit () {
        ViewManager.ins().closeAll();
    }
}