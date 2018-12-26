class GangMemberListWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GangMemberListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
	protected labContributeTIp: eui.Label;
	protected labPowerTip: eui.Label;
    protected listMember: eui.List;
	protected labOffice: eui.Label;
	protected labContribute: eui.Label;
	protected btnExit: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangMemberListSkin"
		this.commonWindowBg.SetTitle("成员列表")
		this._AddClick(this.btnExit, this._OnClick)
		this._AddClick(this.labContributeTIp, this._OnClick)
		this._AddClick(this.labPowerTip, this._OnClick)

		GameGlobal.GangModel.SendGetMemberList()
	}

	public childrenCreated() {
		this.listMember.itemRenderer = GangMemberItem

		this.labContributeTIp.textFlow = (new egret.HtmlTextParser).parser("<font color='#6e330b'><u>"+ "历史贡献" +"</u></font>")
		this.labPowerTip.textFlow = (new egret.HtmlTextParser).parser("<font color='#6e330b'><u>"+ "战力" +"</u></font>")

		let myGangInfo = GameGlobal.GangModel.myGangInfo
		let officeName = GangConst.OFFICE_TO_TEXT[myGangInfo.mOffice]
		this.labOffice.text = `我的职位：${officeName}`
		this.labContribute.text = `历史贡献：${CommonUtils.overLength(myGangInfo.mContribute)}`
	}

	public OnOpen(...args) {
		this.observe(MessageDef.GANG_UPDATE_MEMBER_LIST, this.UpdateContent)
		this.observe(MessageDef.GANG_EXIT_NOTICE, this.HandleExit)

		this.commonWindowBg.OnAdded(this)
	}

	private UpdateContent() {
		this.ResortByPower()
	}

	private ResortByContribute() {
		let memberList = GameGlobal.GangModel.memberList
		memberList.sort(function (lhs, rhs) {
			if (rhs.mContribute == lhs.mContribute)
				return rhs.mOffice - lhs.mOffice

			return rhs.mContribute - lhs.mContribute
		})

		this.listMember.dataProvider = new eui.ArrayCollection(memberList)
	}

	private ResortByPower() {
		let memberList = GameGlobal.GangModel.memberList
		memberList.sort(function (lhs, rhs) {
			if (rhs.mPower == lhs.mPower)
				return rhs.mOffice - lhs.mOffice
				
			return rhs.mPower - lhs.mPower
		})

		this.listMember.dataProvider = new eui.ArrayCollection(memberList)
	}

	public OnClose() {
	}

	private HandleExit() {
		ViewManager.ins().close(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
            case this.btnExit:
				WarnWin.show("是否要退出帮会？", () => {
					GameGlobal.GangModel.SendExit()
				}, this)
			break
			case this.labContributeTIp:
				this.ResortByContribute()
			break
			case this.labPowerTip:
				this.ResortByPower()
			break
		}
	}
}

class GangMemberItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangMemberListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgFace: eui.Image;
	protected labOfficeName: eui.Label;
    protected labPlayerName: eui.Label;
    protected labContribute: eui.Label;
    protected labPower: eui.Label;
	protected labLogoutTime: eui.Label;
	protected btnAffair: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btnAffair.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let memberInfo = this.data
		this.btnAffair.name = memberInfo.mPlayerId
		this.imgFace.source = ResDataPath.GetHeadImgName(memberInfo.mJob, memberInfo.mSex)
		this.labOfficeName.text = `【${GangConst.OFFICE_TO_TEXT[memberInfo.mOffice]}】`
		this.labPlayerName.text = memberInfo.mPlayerName
		this.labContribute.text = memberInfo.mContribute
		this.labPower.text = memberInfo.mPower
		this.SetLogoutTimeInfo(memberInfo.mLogoutTime)

		this.btnAffair.visible = memberInfo.mPlayerId != GameGlobal.actorModel.actorID
		
	}

	private SetLogoutTimeInfo(logoutTime) {
		if (logoutTime == 0) 
		{
			this.labLogoutTime.text = "在线"
			this.labLogoutTime.textColor = Color.l_green_1
		}
		else
		{
			let diffTime = GameServer.serverTime - logoutTime
			this.labLogoutTime.textColor = Color.Red
			if (diffTime < 60)
			{
				this.labLogoutTime.text = "离线少于1分钟"
				return
			}
				
			if (diffTime < 3600)
			{
				this.labLogoutTime.text = `离线${Math.floor(diffTime/60)}分钟`
				return
			}

			this.labLogoutTime.text = `离线${Math.floor(diffTime/3600)}小时`
		}
	}

	private _OnBtnClick(e: egret.TouchEvent) {
		let playerId = parseInt(e.currentTarget.name)
		
		ViewManager.ins().open(GangMemberInfoView, playerId)
	}
}