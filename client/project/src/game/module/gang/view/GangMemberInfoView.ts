class GangMemberInfoView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangMemberInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
    protected powerLabel: PowerLabel;
	protected roleShowPanel: RoleShowPanel;
	protected imgVIp: eui.Image;
	protected imgMouthVip: eui.Image;
	protected imgFace: eui.Image;
	protected labPlayerName: eui.Label;
	protected labSex: eui.Label;
	protected labLevel: eui.Label;
	protected labOffice: eui.Label;
	protected labContribute: eui.Label;
	protected btnChat: eui.Button;
	protected btnConcern: eui.Button;
	protected btnOffice: eui.Button;
	protected btnKickOut: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private mPlayerId: number
	private userChatData: Sproto.chat_data;

	public constructor() {
		super()
		this.skinName = "GangMemberInfoSkin"
		this._AddClick(this.btnChat, this._OnClick)
		this._AddClick(this.btnConcern, this._OnClick)
		this._AddClick(this.btnOffice, this._OnClick)
		this._AddClick(this.btnKickOut, this._OnClick)
		this._AddClick(this.imgVIp, this._OnClick)
		this._AddClick(this.imgMouthVip, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.mPlayerId = param[0]

		this.commonDialog.OnAdded(this)

		this.commonDialog.title = "玩家信息"

		this.observe(MessageDef.GANG_UPDATE_MEMBER_INFO, this.UpdateContent)
		this.observe(MessageDef.PALYER_INFO, this.UpdatePlayerInfo)
		this.observe(MessageDef.FRIEND_DATA_REFRESH, this.HandleAddFriend)
		this.UpdateContent()

		GameGlobal.PlayerInfoModel.sendOtherId(this.mPlayerId)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private UpdateContent() {
		let memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId)
		this.labOffice.text = `职位：${GangConst.OFFICE_TO_TEXT[memberInfo.mOffice]}`
		this.labContribute.text = `贡献：${memberInfo.mContribute}`

		let myGangInfo = GameGlobal.GangModel.myGangInfo
		if (myGangInfo.mOffice == GangConst.MASTER_OFFICE)
		{
			this.btnOffice.label = memberInfo.mOffice == GangConst.DEPUTY_OFFICE ? "降职" : "升职"
			return
		}

		this.btnOffice.visible = false
		if (myGangInfo.mOffice == GangConst.DEPUTY_OFFICE)
		{
			this.btnKickOut.$setX(this.btnOffice.$getX())
			return 
		}

		this.btnKickOut.visible = false
	}

	private UpdatePlayerInfo(playerInfo: Sproto.sc_show_other_player_request) {
		this.imgFace.source = ResDataPath.GetHeadImgName(playerInfo.job, playerInfo.sex)
		this.labPlayerName.text = `昵称：${playerInfo.name}`
		this.labSex.text = `性别：${playerInfo.sex == 1 ? "女" : "男"}`
		this.labLevel.text = `等级：${playerInfo.level}`
		this.powerLabel.text = playerInfo.power

		this.userChatData = new Sproto.chat_data
		this.userChatData.id = this.mPlayerId
		this.userChatData.job = playerInfo.job
		this.userChatData.sex = playerInfo.sex
		this.userChatData.name = playerInfo.name

		this.imgVIp.filters = playerInfo.vip > 0 ? null : Color.GetFilter();
		this.imgMouthVip.filters = GameGlobal.FuliModel.FuliData.month > 0 ? null : Color.GetFilter()

		this.roleShowPanel.SetShowImage(playerInfo)
	}

	private HandleAddFriend() {
		UserTips.ins().showTips("关注成功")
	}

	private _OnClick(e: egret.TouchEvent) {
		
		switch (e.currentTarget) {
			case this.btnChat:
				ViewManager.ins().open(PlayerChatpanel, this.userChatData)
			break
			case this.btnConcern:
				if (GameGlobal.FriendModel.isFriend(this.mPlayerId))
				{
					UserTips.ins().showTips("你们已经是好友了")
					return
				}
				GameGlobal.FriendModel.sendAddFriend(this.mPlayerId)
			break
			case this.btnOffice:
				this.HandleExchangOffice()
			break
			case this.btnKickOut:
				this.HandleKickOutMember()
			break
			case this.imgVIp:
				ViewManager.ins().open(VipMainPanel, this.mPlayerId)
				ViewManager.ins().close(GangMemberInfoView)
				break
			case this.imgMouthVip:
				for (let val of FuliWin.WelfareIcon) {
					if (val.cls == FuliMonthlyCardPanel) {
						ViewManager.ins().open(FuliWin, val.type)
						ViewManager.ins().close(GangMemberInfoView)
						break
					}
				}
			break
		}
		
	}

	private HandleExchangOffice() {
		let memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId)
		let office = memberInfo.mOffice == GangConst.DEPUTY_OFFICE ? GangConst.MEMBER_OFFICE : GangConst.DEPUTY_OFFICE
		if (office == GangConst.DEPUTY_OFFICE
			&& GameGlobal.GangModel.GetDeputyCount() >= GameGlobal.Config.GuildConfig.management) 
		{
			UserTips.ins().showTips(`副帮主只有${GameGlobal.Config.GuildConfig.management}位`)
			return
		}
		GameGlobal.GangModel.SendExchangOffice(this.mPlayerId, office)
	}

	private HandleKickOutMember() {
		let myGangInfo = GameGlobal.GangModel.myGangInfo
		if (!GangConst.GetKickOutRight(myGangInfo.mOffice))
		{
			UserTips.ins().showTips("你没有这个权限")
			return
		}

		let memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId)
		if (memberInfo.mOffice != GangConst.MEMBER_OFFICE)
		{
			UserTips.ins().showTips("不可踢出管理人员")
			return
		}

		WarnWin.show("是否要将该成员踢出帮会？", () => {
			GameGlobal.GangModel.SendKickOutMember(this.mPlayerId)
			ViewManager.ins().close(this)
		}, this)
		
	}
}