class HouseUpgradePanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "房屋"

    /////////////////////////////////////////////////////////////////////////////
    // HouseUpgradeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnBuild: eui.Button;
	protected groupUpgrade: eui.Group;
	protected btnAdd: eui.Button;
	protected btnCulture: eui.Button;
	protected bar: eui.ProgressBar;
	protected labCount: eui.Label;
	protected groupMaxLv: eui.Group;
	protected groupSingle: eui.Group;
	protected powerLabel: PowerLabel;
	protected cmLabName: CmLabel;
	protected groupLv: eui.Group;
	protected labLev: eui.Label;
	protected imgIcon: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	private mFormationId: number

    private mRoleAutoSendData: RoleAutoSendData
    private mHouseSendCheckData: HouseSendCheckData

	public constructor() {
		super()

		this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this._SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnCulture.label = "停止"
            } else {
                this.btnCulture.label = "自动升阶"
            }
        })

        this.mHouseSendCheckData = new HouseSendCheckData((type) => {
            GameGlobal.YingYuanModel.SendAddHouseExp()
        }, () => {
			return GameGlobal.YingYuanModel.GetCostIntimacy()
        })
	}

	public childrenCreated() {
		this._AddClick(this.btnBuild, this._OnClick)
		this._AddClick(this.btnAdd, this._OnClick)
		this._AddClick(this.btnCulture, this._OnClick)
		this._AddClick(this.powerLabel, this._OnClick)
	}

	OnOpen() {
		this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.DoSingle)

		this.UpdateContent()
	}

	OnClose() {
		this.mRoleAutoSendData.Stop()
	}

	public UpdateContent() {
		this.groupMaxLv.visible = GameGlobal.YingYuanModel.IsMaxLevel()
		this.groupSingle.visible = !GameGlobal.YingYuanModel.iSMarry() && GameGlobal.YingYuanModel.GetHouseGrade() > 0 && !this.groupMaxLv.visible
		this.groupUpgrade.visible = !this.groupMaxLv.visible && !this.groupSingle.visible

		this.UpdateExp()

		let grade = GameGlobal.YingYuanModel.GetHouseGrade()
		let config = HouseConst.GetHouseShowConfig(grade)
		if (!config)
		{
			return
		}

		this.cmLabName.text = config.name
		this.imgIcon.source = config.image
	}

	public UpdateExp() {
		this.powerLabel.text = GameGlobal.YingYuanModel.GetPower()

		if (!GameGlobal.YingYuanModel.iSMarry())
		{
			return
		}

		let [houseLv, houseUpnum] = GameGlobal.YingYuanModel.GetHouseLv()
		if (GameGlobal.YingYuanModel.IsMaxLevel()) //最高级
		// if (houseLv > 1 && houseUpnum == 0) //升级
		{
			this.mRoleAutoSendData.Stop()
		}
		else
		{
			this.mRoleAutoSendData.Continue()
		}
		
		this.labLev.text = `${houseLv}`

		let grade = GameGlobal.YingYuanModel.GetHouseGrade()
		let houseConfig = HouseConst.GetHouseConfig(grade, houseLv)
		if (!houseConfig)
		{
			return
		}

		this.bar.maximum = houseConfig.proexp
		this.bar.value = houseUpnum

		let curIntimacy = GameGlobal.YingYuanModel.GetIntimacy()
		this.labCount.text = `${curIntimacy}/${houseConfig.Intimacy}`
		this.labCount.textColor = curIntimacy >= houseConfig.Intimacy ? 0x019704 : 0xdb0000
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnBuild:
				if (!GameGlobal.YingYuanModel.iSMarry())
				{
					UserTips.ins().showTips("只有结婚才可以进行房屋装修升级")
					return
				}
				if (GameGlobal.YingYuanModel.IsMaxGrage())
				{
					UserTips.ins().showTips("您的房屋已是最高档，不需要再继续装修")
					return
				}
				ViewManager.ins().open(HouseBuildWin)
			break
			case this.btnAdd:
				this._SendUp()
			break
			case this.btnCulture:
				this.mRoleAutoSendData.Toggle()
			break
			case this.powerLabel:
				ViewManager.ins().open(HouseDetailWin)
			break
		}
	}

	private _SendUp(): boolean {
        return this.mHouseSendCheckData.SendUp()
    }

	private DoSingle() {
		UserTips.ins().showTips("您的伴侣已经离开了你")
		ViewManager.ins().close(YingYuanWin)
	}
}
