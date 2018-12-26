class WorldMapTipPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // WorldMapTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected mapName: eui.Label;
	protected clearanceTIp: eui.Label;
	protected groupTip: eui.Group;
	protected levelTip: eui.Label;
	protected bossTip: eui.Label;
	protected btnEnter: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "WorldMapTipSkin"
		this._AddClick(this, this.CloseSelf)
		this._AddClick(this.btnEnter, this._onClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "提示"

		let mapId = param[0]

		let config = GameGlobal.Config.ChaptersMapConfig[mapId]
		if (!config)
			return

		this.mapName.text = config.name

		let curChapterId = GameGlobal.UserFb.chapterId
		let chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[curChapterId]
		this.clearanceTIp.visible = chapterRewardConfig.mapid >= mapId
		this.groupTip.visible = chapterRewardConfig.mapid < mapId

		this.mapName.$setX(305)
		if (chapterRewardConfig.mapid > mapId)
			return

		if (chapterRewardConfig.mapid == mapId)
		{
			this.clearanceTIp.text = "正在冒险中..."
			return
		}
			
		this.mapName.$setX(121)
		this.levelTip.text = "角色等级达到" + config.needLevel + "级"
		let prevConfig = GameGlobal.Config.ChaptersMapConfig[mapId-1]
		this.bossTip.text = "击败" + prevConfig.name + "所有BOSS"
		
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _onClick(e) {
		switch (e.currentTarget) {
			case this.btnEnter:
				ViewManager.ins().close(this)
				break
		}
	}
}