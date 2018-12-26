class HouseUpgradeTipWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // HouseUpgradeTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog:CommonDialog;
	protected list:eui.List;
	protected labCount:eui.Label;
	protected btnGain:eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "HouseUpgradeTipSkin"

		this._AddClick(this.btnGain, this._OnClick)		
	}

	public childrenCreated() {
		this.list.itemRenderer = HouseUpgradeItem
	}

	public OnOpen(...args) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "升阶进度领取"

		this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.DoNotice)

		let shareBuildUpInfo = GameGlobal.YingYuanModel.shareUpInfo
		let list = shareBuildUpInfo.times
		this.list.dataProvider = new eui.ArrayCollection(list) 
		this.labCount.text = `${GameGlobal.YingYuanModel.GetHouseUpnum() * shareBuildUpInfo.upnum}`
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	public DoNotice() {
		if (!GameGlobal.YingYuanModel.iSMarry())
		{
			UserTips.ins().showTips("您的伴侣已经离开了你")
			this.CloseSelf()
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnGain:
				GameGlobal.YingYuanModel.SendAddHouseShareExp()
				this.CloseSelf()
			break
		}
	}

}

class HouseUpgradeItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // HouseUpgradeTipItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected imgBg: eui.Image;
	protected labTime: eui.Label;
	protected labText: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let time = this.data
		this.imgBg.visible = this.itemIndex % 2 == 0

		this.labTime.text = GameServer.PanTaoHui(time)
		let count = GameGlobal.YingYuanModel.GetHouseUpnum()
		let text = `您的伴侣升阶房屋，您可领取共享进阶进度|C:0x019704&T:${count}点|`
		this.labText.textFlow = TextFlowMaker.generateTextFlow(text)
	}
}