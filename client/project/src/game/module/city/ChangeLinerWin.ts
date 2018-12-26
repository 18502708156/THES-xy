class ChangeLinerWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // ChangeLinerSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnChange: eui.Button;
	protected list: eui.List;
	protected imgBg: eui.Image;
	protected labLine: eui.Label;
	protected imgPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ChangeLinerSkin"

		this._AddClick(this.btnChange, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "切换线路"

		this.observe(MessageDef.CHANNEL_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.CHANNEL_UPDATE_LIST, this.UpdateList)

		GameGlobal.CommonRaidModel.SendGetChannelInfo()
		this.list.itemRenderer = LinerItem
		this.UpdateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private UpdateContent() {
		let info = GameGlobal.CommonRaidModel.mMainCityInfo
        if (info) 
		{
			this.labLine.text = `${info.channelid}线`
			this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.people)
			GameGlobal.CommonRaidModel.mRecordChannelId = info.channelid
		}

		let channelInfos = GameGlobal.CommonRaidModel.mChannelInfos
		this.list.dataProvider = new eui.ArrayCollection(channelInfos)
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}

	private _OnClick(e: egret.TouchEvent) {
		let info = GameGlobal.CommonRaidModel.mMainCityInfo
        if (!info) 
		{
			return
		}
		
		let lineNo = GameGlobal.CommonRaidModel.mRecordChannelId
		if (lineNo == info.channelid)
		{
			this.CloseSelf()
			return
		}

		GameGlobal.CommonRaidModel.SendEnterCity(lineNo)
		this.CloseSelf()
	}
}


class LinerItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// LinerItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected btn: eui.Button;
	protected imgPoint: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this)
	}

	public dataChanged() {
		let info: Sproto.maincity_channel_data = this.data
		this.btn.label = `${info.id}线`
		this.btn.enabled = info.id != GameGlobal.CommonRaidModel.mRecordChannelId
		this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.count)
	}

	private _OnBtnClicked(e: egret.TouchEvent) {
		GameGlobal.CommonRaidModel.mRecordChannelId = this.data.id
		GameGlobal.CommonRaidModel.RefreshChannelList()
	}
}
