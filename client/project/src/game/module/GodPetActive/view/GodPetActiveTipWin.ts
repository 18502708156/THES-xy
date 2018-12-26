class GodPetActiveTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GodPetActiveTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected item: ItemBaseNotName;
	protected labName: eui.Label;
	protected cmlabText: CmLabel;
	protected labGoto1: eui.Label;
	protected labGoto2: eui.Label;
	protected labGoto3: eui.Label;
	protected btnConfirm: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GodPetActiveTipSkin"
		this._AddClick(this.btnConfirm, this.CloseSelf)
		
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "获取途径"
		this.cmlabText.text = "其他获取途径"

		this._AddClick(this.labGoto1, this._OnClicked)
		this._AddClick(this.labGoto2, this._OnClicked)
		this._AddClick(this.labGoto3, this._OnClicked)

		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		let itemConfig = GlobalConfig.ins().ItemConfig[cost.id]
		let color = ItemBase.QUALITY_COLOR[itemConfig.quality]
		this.labName.text = itemConfig.name
		this.labName.textColor = color
		this.item.setItemAward(cost.type, cost.id, cost.count)

		let config = GameGlobal.Config.GainItemConfig[cost.id]
		if (!config)
			return

		let idx = 1
		for (let getway of config.gainWay)
		{
			if (this[`labGoto${idx}`])
			{
				this[`labGoto${idx}`].visible = true
				this[`labGoto${idx}`].text = getway[0]
				UIHelper.SetLinkStyleLabel(this[`labGoto${idx}`])
			}
			idx++
		}
	}

	private _OnClicked(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.labGoto1:
				this.HandleClick(0)
			break
			case this.labGoto2:
				this.HandleClick(1)
			break
			case this.labGoto3:
				this.HandleClick(2)
			break
		}

	}

	private HandleClick(idx) {
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		let config = GameGlobal.Config.GainItemConfig[cost.id]
		let info = config.gainWay[idx]
		if (!info)
			return

		ViewManager.ins().Guide(info[1][0], info[1][1])
		if (info[1][0] == ViewIndexDef.TYPE_2000 || info[1][0] == ViewIndexDef.TYPE_2001)
			return
			
		ViewManager.ins().close(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

}