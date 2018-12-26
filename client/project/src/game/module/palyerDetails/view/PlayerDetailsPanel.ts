class PlayerDetailsPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// PalyerInfoSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected powerLabel: PowerLabel;
	protected vipCard: eui.Button;					 //复制昵称
	protected monthCard: eui.Button;
	protected roleShowPanel: RoleShowPanel;
	protected blacklist: GetwayLabel;
	protected playerAvatar: eui.Component;	             //玩家头像
	protected nickName: eui.Label;		             //玩家名称
	protected copyName: GetwayLabel;                 //复制昵称
	protected levelTxt: eui.Label;			             //等级
	protected sexTxt: eui.Label;			             //性别
	protected partnerTxt: eui.Label;			             //伴侣
	protected gangTxt: eui.Label;		             //帮会
	protected infoBtn1: eui.Button;
	protected infoBtn2: eui.Button;
	protected infoBtn3: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	private userChatData: Sproto.chat_data;
	private palyerId: number;
	private friend: boolean = true;

	public constructor() {
		super()
		this.skinName = "PlayerInfoSkin";
		this._AddClick(this.infoBtn1, this._OnClick)
		this._AddClick(this.infoBtn2, this._OnClick)
		this._AddClick(this.infoBtn3, this._OnClick)
		this._AddClick(this.monthCard, this._OnClick)
		this._AddClick(this.vipCard, this._OnClick)
		this.AddClick(this.blacklist, this.setBlackList);
		this.AddClick(this.copyName, this.setCopyName);
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "玩家信息"

		this.blacklist.textColor = Color.Green;
		this.blacklist.text = "拉黑";
		this.blacklist.label.size = 24;

		this.copyName.textColor = Color.Green;
		this.copyName.text = "复制昵称";
		this.copyName.label.size = 24;

		this.palyerId = param[0]
		GameGlobal.PlayerInfoModel.sendOtherId(this.palyerId);


		this.observe(MessageDef.PALYER_INFO, this.updateContent)
		this.observe(MessageDef.FRIEND_DATA_REFRESH, this.updateContent)
	}


	private updateContent(rsp?: Sproto.sc_show_other_player_request) {

		if (GameGlobal.FriendModel.isFriend(this.palyerId))
			this.infoBtn2.label = "取消关注"
		else
			this.infoBtn2.label = "关注"

		if (GameGlobal.FriendModel.isBlacklist(this.palyerId))
			this.blacklist.text = "取消拉黑";
		else
			this.blacklist.text = "拉黑"

		if (!rsp)
			return

		if (this.palyerId == GameGlobal.GameLogic.actorModel.actorID)
			this.currentState = "self"
		else
			this.currentState = "other"

		if (this.currentState == "other") {
			let studentData: Sproto.teachers_data[] = GameGlobal.TeacherController.teacherInfo.studentData;
			for (let val of studentData) {
				if (val.student == rsp.id) {
					this.infoBtn3.visible = false;
				}
			}
			let teacherData: Sproto.teachers_data = GameGlobal.TeacherController.teacherInfo.teacherData;
			if (teacherData.teacher == rsp.id) {
				this.infoBtn3.visible = false;
			}

			if (GameGlobal.actorModel.level - rsp.level >= 3) {
				this.infoBtn3.label = "收徒"
			}
			else
				this.infoBtn3.visible = false;
		}

		if (rsp.partner != "") {
			this.partnerTxt.text = "伴侣: " + rsp.partner;
		} else {
			this.partnerTxt.visible = false
		}

		if (!rsp.guildName) {
			this.gangTxt.visible = false
		} else {
			this.gangTxt.text = "帮会: " + rsp.guildName;
		}

		// this.roleShowPanel.SetAll(subRole)
		this.roleShowPanel.SetShowImage(rsp);

		this.playerAvatar["face"].source = ResDataPath.GetHeadImgName(rsp.job, rsp.sex);
		if (rsp.headframe)
			this.playerAvatar["imgFrame"].source = ResDataPath.GetHeadFrameImgName(rsp.headframe)

		this.powerLabel.text = rsp.power
		this.nickName.text = "昵称: " + rsp.name
		this.levelTxt.text = "等级: " + rsp.level
		this.sexTxt.text = "性别: " + (rsp.sex == 0 ? '男' : '女')

		this.userChatData = new Sproto.chat_data;
		this.userChatData.id = this.palyerId;
		this.userChatData.job = rsp.job;
		this.userChatData.sex = rsp.sex;
		this.userChatData.name = rsp.name;

		this.vipCard.filters = rsp.vip > 0 ? null : Color.GetFilter();
		this.monthCard.filters = GameGlobal.FuliModel.FuliData.month > 0 ? null : Color.GetFilter();
	}

	private _OnClick(e: egret.TouchEvent) {
		let role = SubRoles.ins().GetRoleData()
		switch (e.currentTarget) {
			case this.infoBtn1:
				if (this.infoBtn1.label == "开始聊天") {
					ViewManager.ins().open(PlayerChatpanel, this.userChatData);
				} else {
					ViewManager.ins().open(PlayerChangeNamePanel, this.palyerId)
					ViewManager.ins().close(PlayerDetailsPanel)
				}
				break;
			case this.infoBtn2:
				if (this.infoBtn2.label == "关注") {
					GameGlobal.FriendModel.sendAddFriend(this.palyerId);
				}
				else if (this.infoBtn2.label == "取消关注") {
					GameGlobal.FriendModel.sendDleFriend(this.palyerId);
				}
				else {
					ViewManager.ins().open(SystemSettingPanel, this.palyerId)
					ViewManager.ins().close(PlayerDetailsPanel)
				}
				break;
			case this.infoBtn3:
				let cost = GlobalConfig.ins().MasterBaseConfig.cost //收徒花费
				if (cost && Checker.Datas(cost)) {
					GameGlobal.TeacherManage.applyTeacher(this.palyerId)
				}
				break;
			case this.vipCard:
				ViewManager.ins().open(VipMainPanel)
				ViewManager.ins().close(PlayerDetailsPanel)
				break;
			case this.monthCard:
				for (let val of FuliWin.WelfareIcon) {
					if (val.cls == FuliMonthlyCardPanel) {
						ViewManager.ins().open(FuliWin, val.type)
						ViewManager.ins().close(PlayerDetailsPanel)
						break;
					}
				}
				break;
		}
	}

	//设置黑名单
	private setBlackList(e: egret.TextEvent) {
		if (this.blacklist.text == "拉黑") {
			this.blacklist.text = "取消拉黑"
			GameGlobal.FriendModel.sendAddBlacklist(this.palyerId);
		}
		else {
			this.blacklist.text = "拉黑"
			GameGlobal.FriendModel.sendRemoveBlacklist(this.palyerId);
		}
	}

	//复制昵称
	private setCopyName(e: egret.TextEvent) {
		// e.text
		CommonUtils.CopyToClipboard(this.name);
		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_COPY_NAME, this.userChatData.name);
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}