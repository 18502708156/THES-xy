class QujingEscortItem extends BaseView {
	protected item: eui.Group;
	protected labName: eui.Label;
	protected imgIcon: eui.Image;
	protected durationLab: DurationLabel;
	protected labPower: eui.Label;

	private mDoneTime: number
	private mPlayerId: number
	private mRobbedCount: number
	private mInfo

	public constructor() {
		super()
		this.setSkin(new QujingEscortItemSkin)
		this._AddClick(this.item, this._OnClick)
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.OnRemove, this)
	}

	public SetItem(escortInfo: EscortInfo, delayTime: number, info)
	{
		this.mDoneTime = escortInfo.mFinishTime
		this.mPlayerId = escortInfo.mPlayerId
		this.mRobbedCount = escortInfo.mRobbedCount
		this.mInfo = info

		let quality = escortInfo.mQuality
		this.labName.textColor = ItemBase.GetColorByQuality(quality-1)
		this.durationLab.SetColor(ItemBase.GetColorByQuality(quality-1))
		this.durationLab.SetEndTime(this.mDoneTime, DurationLabel.TIMETEXT_TYPE_MMSS)
		this.durationLab.SetCallbackFunc(() =>{
			this.parent.removeChild(this)
		})

		let config = GameGlobal.QujingModel.GetConfigByQuality(quality)
		this.imgIcon.source = config.icon
		this.labName.text = escortInfo.mPlayerName
		this.labPower.text = `战力:${CommonUtils.overLength(escortInfo.mPower)}`

		this.AddTimer(delayTime, 1, this._SetAnimation)
		
	}

	private _OnClick() {
		if (GameGlobal.Config.EscortBaseConfig.robnum <= this.mRobbedCount)
		{
			UserTips.ins().showTips("已经被抢光了")
			return
		}

		if (GameGlobal.QujingModel.CanRob(this.mPlayerId))
			GameGlobal.QujingModel.SendGetEscortInfo(this.mPlayerId)
	}

	private _SetAnimation() {
		let tw = egret.Tween.get(this.item, {loop:true})
		tw.to({x:900}, this.mInfo.time*1000).wait((26-this.mInfo.time) * 1000)
	}

	public OnRemove() {
		egret.Tween.removeTweens(this.item)
	}
}