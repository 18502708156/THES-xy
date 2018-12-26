class XiandaoApplyView extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoApplySkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected firstLabel: CmLabel;
    protected list: eui.List;
    protected goBtn: eui.Button;
    protected stateLabel: eui.Label;
    protected closeLabel: eui.Label;
    protected ruleLabel: eui.Label;
    protected firstGroup: eui.Group;
    protected head1: eui.Component;
    protected head2: eui.Component;
    protected videoLabel: eui.Label;
    protected roleShowPanel: RoleShowPanel;
    /////////////////////////////////////////////////////////////////////////////
	
	public constructor() {
		super()
		this.skinName = "XiandaoApplySkin"
		UIHelper.SetLinkStyleLabel(this.ruleLabel)
		UIHelper.SetLinkStyleLabel(this.videoLabel)
		this.list.itemRenderer = ItemBaseNotName
	}

	childrenCreated() {
		this._AddClick(this.ruleLabel, this._OnClick)
		this._AddClick(this.videoLabel, this._OnClick)
		this._AddClick(this.goBtn, this._OnClick)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.ruleLabel:
				ViewManager.ins().open(ActivityDescPanel, 39);
			break
			case this.videoLabel:
				// GameGlobal.XiandaoModel.SendVideo(2, 1, 1)	
				ViewManager.ins().open(XiandaoVideoPanel, 3, 0)
			break
			case this.goBtn:
				if (GameGlobal.XiandaoModel.IsApply()) {
					GameGlobal.XiandaoModel.SendApply()
				} else {
					GameGlobal.XiandaoModel.EnterPreliminaries()
				}
			break
		}
	}

	public OnOpen() {
		this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent)
		this.UpdateContent()
		this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.XianDuMatchBaseConfig.showItem)
	}

	public UpdateContent() {
		let model = GameGlobal.XiandaoModel	
		this.stateLabel.visible = false
		this.goBtn.visible = false
		if (model.mType == XiandaoState._2_FINAL_DONE) {
			this.closeLabel.visible = true
			this.closeLabel.text = "仙道会已经结束"
		} else {
			if (model.IsClose()) {
				this.closeLabel.visible = true
				this.closeLabel.text = "仙道会已经关闭"
			} else {
				this.closeLabel.visible = false
				this.goBtn.visible = true
				if (model.CanEnter()) {
					if (model.mSign) {
						this.goBtn.label = "进入"
						this.stateLabel.visible = true
					} else {
						this.closeLabel.visible = true
						this.closeLabel.text = "未报名"
						this.goBtn.visible = false
					}
				} else if (model.mSign) {
					this.closeLabel.visible = true
					this.closeLabel.text = "已报名"
					this.goBtn.visible = false
				} else {
					this.goBtn.label = "报名"
				}
			}
		}
		let turnData: XiandaoKnockoutTurn
		let last = model.GetLast()
		if (last) {
			let turnDatas = model.GetKnockoutData().turnDatas[3]
			if (turnDatas) {
				turnData = turnDatas[0]
			}
		}
		if (turnData) {
			this.firstGroup.visible = true	
			let roleA = model.GetRoleData(turnData.noA)
			let roleB = model.GetRoleData(turnData.noB)
			let role = last == turnData.noA ? roleA : roleB
			this.firstLabel.text = GameString.GetSerAndName(role.serverId, role.roleName) 
			UIHelper.SetHead(this.head1, roleA.shows.job, roleA.shows.sex)
			UIHelper.SetHead(this.head2, roleB.shows.job, roleB.shows.sex)
			this.roleShowPanel.SetShowImage(role.shows)
		} else {
			this.firstGroup.visible = false
			this.firstLabel.text = "暂无"
		}
	}
}