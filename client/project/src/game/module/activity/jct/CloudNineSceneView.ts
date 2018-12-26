class CloudNineSceneView extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_BATTLE
	/////////////////////////////////////////////////////////////////////////////
	// CloudNineSceneSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected face: eui.Image;
	protected lbLev: eui.Label;
	protected lbName: eui.Label;
	protected powerLabel: PowerLabel;
	protected lvTxt: eui.Label;
	protected manualBtn: eui.Button;
	protected rankBtn: eui.Button;
	protected counterLabel: DurationLabel;
	protected taskTraceBtn: eui.Group;
	protected integralTxt: eui.Label;
	protected giftBagTxt: eui.Label;
	protected groupAdaptation: eui.Group
	protected giftTipsTxt: eui.Label
	/////////////////////////////////////////////////////////////////////////////
	protected nextGiftScore = 0;
	protected score = 0;
	protected maxScore = 0;

	public constructor() {
		super()
		this.skinName = "CloudNineSceneSkin"
		let scoretask = GameGlobal.Config.ClimbTowerBaseConfig.scoretask;
		for (let key in scoretask)
			this.maxScore = scoretask[key].score;
	}

	public OnOpen() {
		this.observe(MessageDef.CLOUD_NINE_GIFT_REFRES, this.RefresTaskTraceBtn)
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
		this._AddClick(this.manualBtn, this._OnClick)
		this._AddClick(this.rankBtn, this._OnClick)
		this._AddClick(this.taskTraceBtn, this._OnClick)

		let activityTime = GameGlobal.CloudNineModel.getActivityTime();
		this.counterLabel.SetColor(Color.Green);
		this.counterLabel.SetEndTime(activityTime, DurationLabel.TIMETEXT_TYPE_MMSS)

		this.RefreshHeadImg()
		this.powerLabel.text = GameLogic.ins().actorModel.power.toString()

		var lv = GameGlobal.actorModel.level || 0;
		this.lbLev.text = "lv." + lv
		this.lbName.text = GameGlobal.actorModel.name
		this.UpdataContent();
	}

	private UpdataContent() {
		this.lvTxt.text = GameGlobal.Config.MapConfig[GameMap.fubenID].name;
		this.AdaptationGroup()
		this.RefresTaskTraceBtn();
	}

	private AdaptationGroup() {
		MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 300;
	}

	private RefresTaskTraceBtn() {
		let score = GameGlobal.CloudNineModel.score;
		let rewardsocre = GameGlobal.CloudNineModel.rewardsocre;

		this.score = score;
		this.nextGiftScore = rewardsocre;

		let scoretask = GameGlobal.Config.ClimbTowerBaseConfig.scoretask;
		let itemConfig = GameGlobal.Config.ItemConfig;

		for (let key in scoretask)
			if (scoretask[key].score == rewardsocre) {
				this.giftBagTxt.textColor = ItemBase.GetColorByQuality(itemConfig[scoretask[key].item].quality)
				this.giftBagTxt.text = GameGlobal.Config.ItemConfig[scoretask[key].item].name;
			}
		this.integralTxt.textFlow = TextFlowMaker.generateTextFlow((this.score >= rewardsocre ? '|C:' + Color.Green + "&T:" : '|C:' + Color.Red + "&T:") + this.score + '|C:' + Color.Green + "&T:" + '/' + rewardsocre);
		if (this.score >= scoretask[scoretask.length - 1].score) {
			if (this.nextGiftScore != -1) {
				this.giftBagTxt.textColor = ItemBase.GetColorByQuality(itemConfig[scoretask[scoretask.length - 1].item].quality)
				this.giftBagTxt.text = GameGlobal.Config.ItemConfig[scoretask[scoretask.length - 1].item].name;
				this.giftTipsTxt.text = '奖励：';
			}
			else {
				this.giftBagTxt.textColor = Color.Red
				this.giftBagTxt.text = "积分目标已全部达成";
				this.integralTxt.text = this.score + '/' + scoretask[scoretask.length - 1].score;
				this.giftTipsTxt.text = '';
			}
		}
	}


	public OnClose() {
		this.removeObserve()
		TimerManager.ins().removeAll(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.manualBtn:
				ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.ClimbTowerBaseConfig.tips);
				break
			case this.rankBtn:
				ViewManager.ins().open(CloudNineRankPanel, CloudNineRankType.local)
				break
			case this.taskTraceBtn:
				if (this.score >= this.nextGiftScore) {
					if (this.nextGiftScore != -1)
						GameGlobal.CloudNineModel.sendGetGoods();
					else
						GameGlobal.UserTips.showTips("积分目标已全部达成")
				}
				else
					GameGlobal.UserTips.showTips("积分不足")
				break
		}
	}

	public RefreshHeadImg() {
		let role = SubRoles.ins().GetRoleData()
		if (role) {
			this.face.source = ResDataPath.GetHeadImgName(role.job, role.sex)
		}
	}
}