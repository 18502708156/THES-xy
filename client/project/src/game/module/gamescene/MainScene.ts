class MainScene extends BaseScene {

    /**
     * 进入Scene调用
     */
	public onEnter() {
		super.onEnter();
		
		ViewManager.ins().open(GameSceneView);
		ViewManager.ins().open(MainTopPanel);
		ViewManager.ins().open(MainTop2Panel);
		ViewManager.ins().open(MainBottomPanel);
		ViewManager.ins().open(TipsView);

		// GameGlobal.SoundManager.PlayBg("guaji_mp3");
	}
}