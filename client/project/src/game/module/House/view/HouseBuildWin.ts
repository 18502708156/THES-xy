class HouseBuildWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // HouseBuildSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected cmLabName: CmLabel;
	protected imgIcon: eui.Image;
	protected consumeLabel: ConsumeTwoLabel;
	protected btnNext: eui.Button;
	protected btnPrev: eui.Button;
	protected labPower: eui.Label;
	protected btnBuild: eui.Button;
	protected item1: ItemBaseNotName;
	protected item2: ItemBaseNotName;
	protected labName: eui.Label;
	protected groupBuild: eui.Group;
	protected labMaxGrade: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private mCurChoose
	private mBuildList

	public constructor() {
		super()
		this.skinName = "HouseBuildSkin"
		this.commonWindowBg.SetTitle("房屋装修")

		this._AddClick(this.btnPrev, this._OnClick)	
		this._AddClick(this.btnNext, this._OnClick)	
		this._AddClick(this.btnBuild, this._OnClick)
	}

	public childrenCreated() {
		this.labMaxGrade.visible = false
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.DoSingle)

		this.UpdateContent()
	}

	public SetChooseItemInfo() {
		let config = this.mBuildList[this.mCurChoose-1]
		this.imgIcon.source = config.image
		this.cmLabName.text = config.name
		this.labName.text = config.name
		this.consumeLabel.Set([GameGlobal.YingYuanModel.GetBuildCost(config.house)])

		let grade = GameGlobal.YingYuanModel.GetHouseGrade()
		this.btnPrev.visible = this.mCurChoose > 1
		this.btnNext.visible = this.mCurChoose < this.mBuildList.length
		this.btnBuild.visible = config.house > grade

		let [houseLv, houseUpnum] = GameGlobal.YingYuanModel.GetHouseLv()
		let power = HouseConst.GetPower(config.house, houseLv, houseUpnum) - GameGlobal.YingYuanModel.GetPower()
		this.labPower.text = power.toString()

		let itemInfo1 = config.id[0]
		this.item1.visible = itemInfo1 != null
		if (itemInfo1)
		{
			this.item1.setItemAward(itemInfo1.type, itemInfo1.id, itemInfo1.count)
		}
		
		let itemInfo2 = config.id[1]
		this.item2.visible = itemInfo2 != null
		if (itemInfo2)
		{
			this.item2.setItemAward(itemInfo2.type, itemInfo2.id, itemInfo2.count)
		}
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnNext:
				this.mCurChoose = Math.min(this.mCurChoose + 1, this.mBuildList.length)
				this.SetChooseItemInfo()
			break
			case this.btnPrev:
				this.mCurChoose = Math.max(this.mCurChoose - 1, 1)
				this.SetChooseItemInfo()
			break
			case this.btnBuild:
				let config = this.mBuildList[this.mCurChoose-1]
				ViewManager.ins().open(HouseBuildTipWin, config.house)
			break
		}
	}

	private UpdateContent() {
		if (!GameGlobal.YingYuanModel.iSMarry())
		{
			return
		}

		this.mCurChoose = 1
		let grade = GameGlobal.YingYuanModel.GetHouseGrade()
		this.mBuildList = HouseConst.GetBuildList(grade)
		if (this.mBuildList.length == 0)
		{
			this.groupBuild.visible = false
			this.labMaxGrade.visible = true
			return
		}

		this.SetChooseItemInfo()
	}

	private DoSingle() {
		UserTips.ins().showTips("您的伴侣已经离开了你")
		this.CloseSelf()
	}
}
