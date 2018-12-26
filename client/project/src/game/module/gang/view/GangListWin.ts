class GangListWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GangListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected listGang: eui.List;
	protected btnCreate: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangListSkin"
		this.commonWindowBg.SetTitle("帮会列表")
        this.commonWindowBg["helpBtn"].visible = true
		this.commonWindowBg.setHelp(21,"规则说明")
		this._AddClick(this.btnCreate, this._OnClick)
		GameGlobal.GangModel.SendGetGangList()
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_50)
	}

	public childrenCreated() {
		this.listGang.itemRenderer = GangItem
		this.btnCreate.visible = !GameGlobal.GangModel.HasGang()
	}

	public OnOpen(...args) {
		this.observe(MessageDef.GANG_UPDATE_LIST, this.UpdateContent)
		this.observe(MessageDef.GANG_UPDATE_APPLIED_LIST, this.UpdateList)
		this.observe(MessageDef.GANG_INIT, this.InitGang)

		this.commonWindowBg.OnAdded(this)
	}

	private UpdateContent() {
		let gangList = GameGlobal.GangModel.gangList
		gangList.sort(function (lhs, rhs) {	
			return rhs.mMemberCount - lhs.mMemberCount
		})
		
		this.listGang.dataProvider = new eui.ArrayCollection(gangList)

		GameGlobal.GangModel.SendGetApplyList()
	}

	private InitGang() {
		ViewManager.ins().open(GangMainWin)
		ViewManager.ins().close(this)
	}

	public OnClose() {
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().open(GangCreateView)
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.listGang)
	}
}

class GangItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labListNo: eui.Label;
    protected imgFace: eui.Image;
	protected labBangName: eui.Label;
    protected labBangMaster: eui.Label;
    protected labMemberCount: eui.Label;
    protected labPowerTip: eui.Label;
	protected btnApply: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let gangInfo = this.data
		this.btnApply.name = gangInfo.mGangId
		this.imgFace.source = ResDataPath.GetHeadImgName(gangInfo.mJob, gangInfo.mSex)
		this.labListNo.text = `${this.itemIndex+1}`
		this.labBangName.text = `${gangInfo.mGangName}（Lv.${gangInfo.mLevel}）`
		this.labBangMaster.text = `【帮主】：${gangInfo.mGangMasterName}`
		this.labMemberCount.text = `人数：${gangInfo.mMemberCount}/${GangConst.GetMaxMemberCount(gangInfo.mLevel)}`
		let powerTip = gangInfo.mNeedPower >= 10000 ? `${Math.floor(gangInfo.mNeedPower/10000)}万` : gangInfo.mNeedPower
		this.labPowerTip.text = `需战力：${powerTip}`
		this.labPowerTip.visible = gangInfo.mNeedPower > 0

		if (GameGlobal.GangModel.HasGang())
		{
			this.btnApply.visible = false
			this.labPowerTip.visible = false
			return
		}

		if (GameGlobal.GangModel.IsApplied(gangInfo.mGangId))
		{
			this.btnApply.label = "已申请"
			if (this.btnApply.filters == null)
				this.btnApply.filters = Color.GetFilter()
		}
		else
		{
			this.btnApply.label = "申请"
			this.btnApply.filters = null
		}
	}

	private _OnBtnClick(e: egret.TouchEvent) {
		let gangId = parseInt(e.currentTarget.name)
		if (GameGlobal.GangModel.IsApplied(gangId))
			return

		let gangInfo = this.data as GangInfo
		if (gangInfo.mMemberCount >= GangConst.GetMaxMemberCount(gangInfo.mLevel))
		{
			UserTips.ins().showTips("该帮会人数已满，不可申请")
			return
		}

		if (gangInfo && gangInfo.mNeedPower) {
			if (GameGlobal.actorModel.power < gangInfo.mNeedPower) {
				UserTips.ins().showTips("战力不足")
				return
			}
		}

		if (GameGlobal.GangModel.mAppliedCount >= GameGlobal.Config.GuildConfig.applycount)
		{
			UserTips.ins().showTips(`最多可同时向${GameGlobal.Config.GuildConfig.applycount}个帮会申请`)
			return
		}

		GameGlobal.GangModel.SendJoinGang(gangId)
	}
}