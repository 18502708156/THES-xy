class GangMapTaskItem extends eui.Component implements  eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
	// YuanfenHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected groupType1: eui.Group;
	protected groupType2: eui.Image;
	protected list: eui.List;
	protected labName: eui.Label;
	protected btnGain: eui.Button;
	protected priceicon: PriceIcon;
	/////////////////////////////////////////////////////////////////////////////

	private mConfig

	public constructor() {
		super()
	}

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
		this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this)
	}

	public SetTaskInfo(idx, config) {
		this.mConfig = config
		this.groupType1.visible = idx == 1
		this.groupType2.visible = idx == 2
		
		let taskInfo = GameGlobal.GangMapModel.GetTaskInfo(config.id)

		this.labName.text = `${config.type == 0 ? "帮会怪物" : "帮会采集"}(${Math.min(taskInfo.mCount, config.number)}/${config.number})`
		this.list.dataProvider = new eui.ArrayCollection(config.reward)
		this.priceicon.setColor(Color.White)

		if (GameGlobal.GangMapModel.IsTaskDone(config.id))
		{
			this.btnGain.label = GameGlobal.GangMapModel.HasGainTaskReward(config.id) ? "重置" : "领取"
			this.priceicon.type = config.resetcost.id
			this.priceicon.price = config.resetcost.count
			this.priceicon.visible = GameGlobal.GangMapModel.HasGainTaskReward(config.id)
		}
		else
		{
			this.priceicon.type = config.onekeycost.id
			this.priceicon.price = config.onekeycost.count
			this.priceicon.visible = true
			this.btnGain.label = "一键完成"
		}
	}

	private _OnBtnClicked(e: egret.TouchEvent) {
		if (!this.mConfig) {
			return
		}
		if (!GameGlobal.GangMapModel.IsTaskDone(this.mConfig.id))
		{
			let oneKeyCost = this.mConfig.onekeycost
			WarnWin.show(`是否花费${oneKeyCost.count}${GameGlobal.actorModel.GetCurrencyName(oneKeyCost.id)}直接完成任务？`, () => {
				Checker.Money(oneKeyCost.id, oneKeyCost.count, true, null, ()=>{
					GameGlobal.GangMapModel.SendOneKeyFinish(this.mConfig.id)
				})
			}, this)
			return
		}
			
		if (!GameGlobal.GangMapModel.HasGainTaskReward(this.mConfig.id))
		{
			GameGlobal.GangMapModel.SendGainReward(this.mConfig.id)
			return
		}
		
		if (!GameGlobal.GangMapModel.CanResetTask(this.mConfig.id))
		{
			UserTips.ins().showTips("重置次数不足")
			return
		}

		ViewManager.ins().open(GangMapResetTipWin, this.mConfig)
	}
}