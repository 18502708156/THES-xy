class FieldBossDetailPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// FieldBossDetailSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected bossName: eui.Label;
	protected bar: eui.ProgressBar;
	protected thumb: eui.Image;
	protected labelDisplay: eui.Label;
	protected challengeLabel: eui.Label;
	protected enterLabel: eui.Label;
	protected runLabel: eui.Label;
	protected list1: eui.List;
	protected list2: eui.List;
	protected headComp: eui.Component;
	protected bossOwnerLabel: eui.Label;
	protected goBtn: eui.Button;
	protected addBtn: eui.Button;
	protected petShowPanel: PetShowPanel;
	protected challengeCard_txt: eui.Label
	protected challengeCardGroup: eui.Group
	/////////////////////////////////////////////////////////////////////////////

	private m_LeftTime: number
	private m_bossId: number

	private m_owner: string
	private m_ownerTime: number

	public constructor() {
		super()

		this.skinName = "FieldBossDetailSkin"
		this.list1.itemRenderer = ItemBaseNotName
		this.list2.itemRenderer = ItemBaseNotName

		this.bar.labelFunction = function (cur, max) {
			return Math.floor(cur * 100 / max) + "%"
		}
	}

	public OnOpen(...param: any[]) {
		this.m_bossId = param[0]
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "野外BOSS"
		let config = GameGlobal.Config.FieldBossConfig[this.m_bossId]
		this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)))
		this.list1.dataProvider = new eui.ArrayCollection(config.fixedshowitem)
		this.list2.dataProvider = new eui.ArrayCollection(config.showitem)
		let monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
		this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" + monsterCfg[GameGlobal.Config.MonstersConfig_keys.level] + "级)"
		let bossInfo: FieldBossInfo = <FieldBossInfo>GameGlobal.BossModel.GetBossInfoById(Enum_BOSSTYPE.field_boss, config.id)
		this.bar.maximum = monsterCfg[GameGlobal.Config.MonstersConfig_keys.hp]
		this.bar.value = bossInfo.hp;

		this.challengeLabel.text = config.level + "级"
		let canEnter = GameGlobal.actorModel.level >= config.level;// && GameGlobal.BossModel.IsChallengeTime() && bossInfo.status == FieldBossState.OPEN
		let leftTime = 0
		if (canEnter && !bossInfo.isDie && !GameGlobal.BossModel.IsRun()) {
			if (config.needbossprops) {
				let myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id);
				if (config.needbossprops.count > myCount) {
					this.enterLabel.text = "未满足";
					this.enterLabel.textColor = 0xff0000;
				}
			}
			else {
				this.enterLabel.text = "已满足";
				this.enterLabel.textColor = 0x6E330B;
			}
			leftTime = this.m_LeftTime = GameGlobal.BossModel.GetRunLeftTime()
			this.runLabel.text = DateUtils.format_3(leftTime);//GameGlobal.BossModel.GetRunTime();
			this.runLabel.textColor = 0x6E330B;
		}
		else {
			if (bossInfo.isDie || GameGlobal.BossModel.IsRun()) {
				this.runLabel.text = "Boss刷新后25分钟";
				this.runLabel.textColor = 0xff0000;
			}
			else {
				leftTime = this.m_LeftTime = GameGlobal.BossModel.GetRunLeftTime()
				this.runLabel.text = DateUtils.format_3(leftTime);//GameGlobal.BossModel.GetRunTime();
				this.runLabel.textColor = 0x6E330B;
			}
			this.enterLabel.text = "未满足";
			this.enterLabel.textColor = 0xff0000;
		}
		if (bossInfo.ownerId && bossInfo.leftTime > 0) {
			this.m_owner = bossInfo.ownerName;
			this.m_ownerTime = bossInfo.leftTime;
			this.bossOwnerLabel.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T:BOSS当前归属：|C:0x2F6FF6&T:${bossInfo.ownerName}|C:0xd27701&T:(${bossInfo.leftTime}s)|`);
			UIHelper.SetHeadByHeadId(this.headComp, bossInfo.ownerHeadId, false);
			this.AddTimer(1000, this.m_ownerTime, this.UpdateOwnTime);
		} else {
			this.bossOwnerLabel.text = "BOSS当前归属：无";
			UIHelper.SetHeadByHeadId(this.headComp, 0, false);
		}
		if (leftTime) {
			this.AddTimer(1000, Math.ceil(leftTime * 0.001), this.UpdateTime);
		}
		this.challengeCardGroup.visible = !bossInfo.ischallenge;
		if (config.needbossprops) {
			let myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id);//GameGlobal.UserBag.GetCount(200495)
			this.challengeCard_txt.textFlow = TextFlowMaker.consumeLabel(myCount, config.needbossprops.count);
		} else {
			this.challengeCardGroup.visible = false;
		}
		this.AddClick(this.goBtn, this.OnTap)
		this.AddClick(this.addBtn, this.OnTap);
	}

	public OnClose() {
		GameGlobal.BossModel.sendCallFieldBossList();
		this.commonDialog.OnRemoved()
		TimerManager.ins().remove(this.UpdateTime, this);
	}

	private UpdateOwnTime() {
		if (this.m_ownerTime) {
			this.bossOwnerLabel.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T:BOSS当前归属：|C:0x2F6FF6&T:${this.m_owner}|C:0xd27701&T:(${this.m_ownerTime}s)|`);
			this.m_ownerTime--;
			if (this.m_ownerTime <= 0) {
				TimerManager.ins().remove(this.UpdateOwnTime, this);
				this.m_ownerTime = 0;
				this.bossOwnerLabel.text = "BOSS当前归属：无";
			}
		}
	}
	private UpdateTime() {
		if (this.m_LeftTime) {
			this.runLabel.text = DateUtils.format_3(this.m_LeftTime);
			this.m_LeftTime -= 1000;
			if (this.m_LeftTime <= 0) {
				TimerManager.ins().remove(this.UpdateTime, this);
				this.m_LeftTime = 0;
				this.runLabel.text = "已逃跑";
				this.runLabel.textColor = 0xff0000;
			}
		}
	}
	private OnTap(e: egret.TouchEvent): void {
		let config = GameGlobal.Config.FieldBossConfig[this.m_bossId]
		switch (e.target) {
			case this.goBtn:
				let bossInfo: FieldBossInfo = <FieldBossInfo>GameGlobal.BossModel.GetBossInfoById(Enum_BOSSTYPE.field_boss, config.id)
				if (!bossInfo && bossInfo.hp <= 0) {
					return;
				}
				if (GameGlobal.actorModel.level < config.level) {
					UserTips.ErrorTip("主角等级不足")
					return
				}
				else if (bossInfo.isDie) {
					UserTips.ErrorTip("BOSS已击杀")
					return
				}
				else if (bossInfo.IsClose()) {
					UserTips.ErrorTip("BOSS已关闭");
					return
				} else if (GameGlobal.BossModel.IsRun()) {
					UserTips.ErrorTip("BOSS已逃跑");
					return
				}
				else if (!bossInfo.ischallenge) {
					if (config.needbossprops) {
						let myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id);
						if (config.needbossprops.count > myCount) {
							UserTips.ErrorTip(GameGlobal.Config.ItemConfig[config.needbossprops.id].name + "不足")
							return;
						}
					}
				}
				if (!UserFb.FinishAndCheckFighting2()) {

				} else {
					GameGlobal.BossModel.sendChallenge(this.m_bossId);
					this.CloseSelf();
				}
				break;
			case this.addBtn:
				UserWarn.ins().setBuyGoodsWarn(config.needbossprops.id, config.needbossprops.count);
				break;
		}
	}
}