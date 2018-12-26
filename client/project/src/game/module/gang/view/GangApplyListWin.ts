class GangApplyListWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GangApplyListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected listApply: eui.List;
	protected btnSet: eui.Button;
	protected checkBox: eui.CheckBox;
	protected input: eui.TextInput;
	protected groupSetting: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangApplyListSkin"
		this.commonWindowBg.SetTitle("申请列表")

		this._AddClick(this.btnSet, this._OnClick)
		GameGlobal.GangModel.SendGetApplicantList()
		let myGangInfo = GameGlobal.GangModel.myGangInfo
		if (!GangConst.GetAuditingRight(myGangInfo.mOffice)) 
		{
			this.groupSetting.visible = false
		}
	}

	public childrenCreated() {
		this.listApply.itemRenderer = GangApplyItem
		this.input.restrict = '0-9'
	}

	public OnOpen(...args) {
		this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)
		this.UpdateSettingInfo()
	}

	public OnClose() {
		MainBottomPanel.CloseNav(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		let power = parseInt(this.input.text)
		if (power == NaN)
		{
			UserTips.ins().showTips("请输入正确的战斗力")
			return
		}
			
		let auto = this.checkBox.selected ? 1 : 0
		GameGlobal.GangModel.SendAutoJoin(auto, power)
	}

	private UpdateContent() {
		let applicantList = GameGlobal.GangModel.applicantList
		this.listApply.dataProvider = new eui.ArrayCollection(applicantList)
	}

	private UpdateSettingInfo() {
		let myGangInfo = GameGlobal.GangModel.myGangInfo
		this.checkBox.selected =  myGangInfo.mAutoJoin == 1
		this.input.text = myGangInfo.mNeedPower.toString()
	}
}

class GangApplyItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangApplyListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgFace: eui.Image;
	protected labRoleName: eui.Label;
    protected labLevel: eui.Label;
    protected labPower: eui.Label;
    protected labLogoutTime: eui.Label;
	protected btnAgree: eui.Button;
	protected btnRefuse: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btnAgree.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAgreeBtnClick, this)
		this.btnRefuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRefuseBtnClick, this)
	}

	public dataChanged() {
		let applicantInfo = this.data
		this.btnAgree.name = applicantInfo.mPlayerId
		this.btnRefuse.name = applicantInfo.mPlayerId
		this.imgFace.source = ResDataPath.GetHeadImgName(applicantInfo.mJob, applicantInfo.mSex)
		this.labRoleName.text = "名字：" + applicantInfo.mPlayerName
		this.labLevel.text = "等级：" + applicantInfo.mLevel
		this.labPower.text = "战力：" + applicantInfo.mPower

		this.SetLogoutTimeInfo(applicantInfo.mLogoutTime)
	}

	private _OnAgreeBtnClick(e: egret.TouchEvent) {
		let playerId = parseInt(e.currentTarget.name)
		this._sendHandleApplicant(playerId, true)
	}

	private _OnRefuseBtnClick(e: egret.TouchEvent) {
		let playerId = parseInt(e.currentTarget.name)
		this._sendHandleApplicant(playerId, false)
	}

	private _sendHandleApplicant(playerId, isAgree) {
		GameGlobal.GangModel.SendSetApply(playerId, isAgree)
		GameGlobal.GangModel.HandleApplicant(playerId)
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
}