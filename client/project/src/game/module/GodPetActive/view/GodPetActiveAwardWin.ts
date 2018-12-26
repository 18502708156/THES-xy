class GodPetActiveAwardWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GodPetActiveAwardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
	protected labTime: eui.Label;
	protected labCostNum: eui.Label;
	protected labGoto: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GodPetActiveAwardSkin"
		this.commonWindowBg.SetTitle("神兽降临")
	}

	public childrenCreated() {
		this.list.itemRenderer = GodPetAwardItem
		UIHelper.SetLinkStyleLabel(this.labGoto)

		this._AddClick(this.labGoto, this._OnClicked)
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.GODPETACTIVE_UPDATE_INFO, this.UpdateContent)

		this.UpdateContent()
		this.AddTimer(1000, 0, this.updateTime)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private updateTime() {
		let duration = GameGlobal.GodPetActiveModel.GetEndtime() - GameServer.serverTimeMilli
		this.labTime.text = DateUtils.format_17(duration)

		if (duration > 0)
			return

		this.labTime.text = ""
		this.CloseSelf()
		TimerManager.ins().removeAll(this)
	}

	private _OnClicked() {
		ViewManager.ins().open(GodPetActiveLotteryWin)
	}

	private UpdateContent() {
		this.labCostNum.text = `${GameGlobal.GodPetActiveModel.GetCashCount()}元宝`

		let datas = CommonUtils.GetArray(GameGlobal.Config.BeastAwardConfig, "id")
		let getWeight = function (config) {
			let confId = config.id
			if (GameGlobal.GodPetActiveModel.HasRewardGained(confId)) {
				return confId + 10000
			}

			if (GameGlobal.GodPetActiveModel.IsTargetDone(confId)) {
				return confId - 10000
			} 

			return confId
		}

		datas.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(datas)
	}

}

class GodPetAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GodPetActiveAwardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labText: eui.Label;
	protected btnGain: eui.Button;
	protected list: eui.List;
	protected imgGained: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
		this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let config = this.data
		this.btnGain.name = config.id
		this.imgGained.visible = GameGlobal.GodPetActiveModel.HasRewardGained(config.id)
		this.btnGain.visible = !this.imgGained.visible
		this.btnGain.enabled = GameGlobal.GodPetActiveModel.IsTargetDone(config.id)
		this.btnGain.label = this.btnGain.enabled ? "领取" : "未达到"
		UIHelper.ShowRedPoint(this.btnGain, this.btnGain.visible && this.btnGain.enabled)
		this.labText.text = `累积消费：${config.money}元宝`

		this.list.dataProvider = new eui.ArrayCollection(config.reward)
	}

	private _OnBtnClick(e: egret.TouchEvent) {
		let targetId = parseInt(e.currentTarget.name)
		GameGlobal.GodPetActiveModel.SendGainAward(targetId)
	}	
}