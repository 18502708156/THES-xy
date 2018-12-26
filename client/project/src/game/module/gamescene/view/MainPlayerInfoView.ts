class MainPlayerInfoView extends BaseView {
	
    /////////////////////////////////////////////////////////////////////////////
    // MainTop2PanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected face: eui.Image;
    protected lbLev: eui.Label;
    protected powerLabel: PowerLabel;
    protected rechargeBtn: eui.Button;
    protected rankBtn: eui.Button;
    protected lbName: eui.Label;
    protected vipBtn: VipIcon;
    protected redPointImg: eui.Image;
    protected XinWu: eui.Group;
    protected XinWulist: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	childrenCreated() {
		this.face.source = ""
		this.face.touchEnabled = true;

		this.XinWulist.itemRenderer = ItemBaseNotName
	}

	public RefreshHeadImg() {
		let role = SubRoles.ins().GetRoleData()
		if (role) {
			this.face.source = ResDataPath.GetHeadImgName(role.job, role.sex)
		}
	}
	
	public OnOpen() {
		this.AddClick(this.face, this.onClick);
		this.AddClick(this.rankBtn, this.onClick);
		this.AddClick(this.rechargeBtn, this.onClick);
		this.observe(MessageDef.SUB_ROLE_CHANGE, this.UpdateContent);
		this.observe(MessageDef.LEVEL_CHANGE, this.UpdateContent);
		this.observe(MessageDef.UPDATA_VIP_EXP, this.changeExpBtn);
		this.observe(MessageDef.UPDATA_VIP_AWARDS, this.showVipRedPoint);
		this.observe(MessageDef.VIP_LEVEL_CHANGE, this.UpdateContent);
		this.observe(MessageDef.POWER_CHANGE, this.UpdateContent)
		this.observe(MessageDef.NAME_CHANGE, this.UpdateContent)
		this.observe(MessageDef.IS_MARRY_INFO, this.ShowXinWu)

		this.observe(MessageDef.PHB_REPOINT_UPDATE ,this.showRankRedPoint)
		this.observe(MessageDef.LEVEL_CHANGE ,this.showRankRedPoint)
        
		this.showRankRedPoint()
		this.showVipRedPoint()
		this.UpdateContent()
		this.ShowXinWu()
	}

	public UpdateContent() {
		this.RefreshHeadImg()
		// this.powerLabel.text = "战 " + GameLogic.ins().actorModel.power.toString()
		this.powerLabel.text = GameLogic.ins().actorModel.power.toString()

		var lv = GameGlobal.actorModel.level || 0;
		this.lbLev.text = "Lv." + lv
		this.lbName.text = GameGlobal.actorModel.name
		this.vipBtn.setVipLv(GameGlobal.actorModel.vipLv);
		this.changeExpBtn()
	}

	public showRankRedPoint() {
	    UIHelper.ShowRedPoint(this.rankBtn, GameGlobal.RankingModel.isRedPoint()&&Deblocking.Check(DeblockingType.TYPE_86, true))
	};

	public showVipRedPoint() {
		this.redPointImg.visible = UserVip.ins().CheckRedPoint()
	}

	public changeExpBtn() {
		this.vipBtn.setVipLv(GameGlobal.actorModel.vipLv)
	}

	public onClick(e) {
		switch (e.currentTarget) {
			case this.face:
				ViewManager.ins().open(PlayerDetailsPanel, GameGlobal.GameLogic.actorModel.actorID)
				break;
			case this.rechargeBtn:
				RechargeWin.Open();
				break;
			case this.rankBtn:
				ViewManager.ins().open(RankingWin);
				break;
		}
	};

	
	public ShowXinWu() {
		this.XinWu.visible = GameGlobal.YingYuanModel.iSMarry()
		if (this.XinWu.visible) {
			let Config = GameGlobal.Config.MarryConfig[GameGlobal.YingYuanModel.marryInfo.grade]
			this.XinWulist.dataProvider = new eui.ArrayCollection([Config.id[0]])
		}
	}
}