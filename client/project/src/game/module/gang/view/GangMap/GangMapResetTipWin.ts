class GangMapResetTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangMapTaskResetTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnConfirm: eui.Button;
	protected btnCancel: eui.Button;
	protected labTip: eui.Label;
	protected priceicon: PriceIcon;
	protected labCount: eui.Label;
	protected labVipTip: eui.Label;
	protected labToVIp: eui.Label;
	protected groupVip: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private mConfig

	public constructor() {
		super()
		this.skinName = "GangMapTaskResetTipSkin"

		this._AddClick(this.btnConfirm, this._OnClick)
		this._AddClick(this.btnCancel, this.CloseSelf)
		this._AddClick(this.labToVIp, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "任务重置"
		UIHelper.SetLinkStyleLabel(this.labToVIp)

		this.mConfig = param[0]

		let cost = this.mConfig.resetcost
		this.priceicon.type = cost.id
		this.priceicon.price = cost.count

		let taskName = this.mConfig.type == 0 ? "帮会怪物" : "帮会采集"
		this.labTip.text = `重置${taskName}任务？`
		
		let vipLv = GameGlobal.actorModel.vipLv
		let vipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv]
		let taskInfo = GameGlobal.GangMapModel.GetTaskInfo(this.mConfig.id)
		let count = vipConfig.buyreset - taskInfo.mResetCount
		this.labCount.text = `${count}次`

		let nextVipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv+1]
		if (!nextVipConfig)
		{
			this.groupVip.visible = false
			return
		}

		let vipText = `|C:0x019704&T:VIP${vipLv+1}|可再购买|C:0x019704&T:${nextVipConfig.buyreset - vipConfig.buyreset}|次`
		this.labVipTip.textFlow = TextFlowMaker.generateTextFlow(vipText)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnConfirm:
				let cost = this.mConfig.resetcost
				Checker.Money(cost.id, cost.count, true, null, ()=>{
					GameGlobal.GangMapModel.SendResetTask(this.mConfig.id)
				})
				this.CloseSelf()
			break
			case this.labToVIp:
				ViewManager.ins().open(VipMainPanel)
			break
		}
		
	}
}