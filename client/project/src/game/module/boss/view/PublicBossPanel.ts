class PublicBossPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "全民BOSS"
	/////////////////////////////////////////////////////////////////////////////
	// PublicBossSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected list: eui.List;
	protected replyTime_txt: eui.Label;
	protected buyBtn: eui.Button;
	protected num_txt: eui.Label;
	protected tips_txt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "PublicBossSkin"
		this.list.itemRenderer = PublicBossItem
		this.list.dataProvider =  new eui.ArrayCollection([])
	}
	childrenCreated(): void {
		super.childrenCreated()
		UIHelper.SetLinkStyleLabel(this.tips_txt, "BOSS提醒设置")
	}

	public OnOpen() {
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_REBORN, null, false);
		this.observe(MessageDef.PUBLIC_BOSS_UPDATE, this.UpdateContent)
		this.AddClick(this.tips_txt, this.onTap)
		this.AddClick(this.buyBtn, this.onTap);


		this.AddTimer(1000, 0, this.timeReplyHandler)
		this.UpdateContent();
	}

	public OnClose() {

		this.removeObserve();
		TimerManager.ins().remove(this.timeReplyHandler, this);
	}

	public UpdateContent() {

		let list = GameGlobal.BossModel.GetBossInfos(Enum_BOSSTYPE.public_boss)
		let arr = [];
		let i: number;
		let len: number = list.length;
		for (i = 0; i < len; i++) {
			arr.push(list[i]);
			if (GameGlobal.actorModel.level < list[i].level) {
				break;
			}
		}
		SortTools.sortMap(arr, 'Weight', true);

		(this.list.dataProvider as eui.ArrayCollection).replaceAll(arr);

		let bossModel: BossModel = GameGlobal.BossModel;
		let baseConfg = GameGlobal.Config.PublicBossBaseConfig;
		this.num_txt.text = bossModel.pBossChallengenum + "/" + baseConfg.maxCount

		this.buyBtn.visible = bossModel.pBossChallengenum <= 0;

	}
	private timeReplyHandler(): void {

		let bossModel: BossModel = GameGlobal.BossModel;
		if (bossModel.pBossChallengenum >= GameGlobal.Config.PublicBossBaseConfig.maxCount) {
			this.replyTime_txt.text = "--"
		} else {
			this.replyTime_txt.text = DateUtils.format_3((bossModel.pBossRecovertiem - GameServer.serverTime) * 1000);
		}
		let i: number;
		let len: number = this.list.numChildren;
		for (i = 0; i < len; i++) {
			(<any>this.list.getChildAt(i)).updaterebirthTime()
		}
	}
	private onTap(e): void {
		switch (e.currentTarget) {
			case this.buyBtn:
				GameGlobal.BossModel.buyFunc()
				break;
			case this.tips_txt:
				ViewManager.ins().open(BossTipsPanel)
				break;
		}

	}


}

class PublicBossItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// PublicBossItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected bossName: eui.Label;
	protected people_txt: eui.Label;
	protected record_txt: eui.Label;
	protected rebirthTime_txt: eui.Label;
	protected rebirthTimes_txt: eui.Label;
	protected enterInfoLabel: eui.Label;
	protected goBtn: eui.Button;
	protected petShowPanel: PetShowPanel;
	protected bar: eui.ProgressBar;
	protected thumb: eui.Image;
	protected labelDisplay: eui.Label;
	protected goodsGroup: eui.Group;
	protected goodsNum_txt: eui.Label;
	protected priceIcon: PriceIcon;
	protected list: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.bar.snapInterval = 0
		this.bar.labelFunction = function (cur, max) {
			return Math.floor(cur * 100 / max) + "%"
		}
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.list.itemRenderer = ItemBaseNotName;
		this.record_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.people_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		UIHelper.SetLinkStyleLabel(this.record_txt, "查看击杀")

	}

	private _OnClick(e) {
		let data: PublicBossInfo = this.data
		let config = data.GetConfig()

		switch (e.currentTarget) {
			case this.goBtn:

				if (!UserFb.CheckFighting()) {
					return
				}
				if (GameGlobal.actorModel.level < config.level) {
					UserTips.ErrorTip("主角等级不足")
					return
				}
				if (GameGlobal.BossModel.pBossChallengenum == 0) {
					GameGlobal.BossModel.buyFunc()
					return
				}
				if (data.isKill) {
					if (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].purchasingtimes - GameGlobal.BossModel.reborncount <= 0) {
						UserTips.InfoTip("复活次数已达上限");
						return;
					}
					if (this.goodsGroup.visible) {
						if (UserFb.FinishAndCheckFighting()) {
							GameGlobal.BossModel.sendPublicReBornChallenge(data.id);
						}
					} else {
						if (Checker.Money(config.needmoney.id, config.needmoney.count, true) == true) {
							if (UserFb.FinishAndCheckFighting()) {
								GameGlobal.BossModel.sendPublicReBornChallenge(data.id);
							}
						}
					}
					return;
				}
				if (UserFb.FinishAndCheckFighting()) {
					GameGlobal.BossModel.sendPublicChallenge(data.id)
				}
				break;
			case this.record_txt:
				ViewManager.ins().open(BossKillRecordPanel, data.id)
				break;
			case this.people_txt:
				ViewManager.ins().open(BossHurtRecordPanel, data.id)
				break;
		}

	}

	public dataChanged() {
		let data: PublicBossInfo = this.data
		let config = data.GetConfig()
		if (GameGlobal.actorModel.level >= config.level) {
			this.goBtn.visible = true
			this.enterInfoLabel.visible = false
		} else {
			this.goBtn.visible = false
			this.enterInfoLabel.visible = true
			this.enterInfoLabel.text = "主角" + config.level + "级可进入"
		}
		this.list.dataProvider = new eui.ArrayCollection(config.showitem)
		let monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
		this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" + monsterCfg[GameGlobal.Config.MonstersConfig_keys.level] + "级)";
		this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));

		this.record_txt.visible = data.isDie;
		this.people_txt.visible = !data.isDie
		UIHelper.SetLinkStyleLabel(this.people_txt, "争夺人数：" + data.fightnum)

		this.rebirthTime_txt.visible = data.isDie;
		this.rebirthTimes_txt.visible = data.isDie;
		this.priceIcon.visible = false;
		this.goodsGroup.visible = false;

		this.goBtn.label = data.isKill ? "复活并挑战" : "挑战"
		UIHelper.ShowRedPoint(this.goBtn, GameGlobal.BossModel.pBossChallengenum > 0 && !data.isKill)
		if (data.isDie) {
			let myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needprops.id);
			if (myCount > 0) {
				this.goodsGroup.visible = true;
				this.goodsNum_txt.text = "x" + config.needprops.count;
				if (config.needprops.count > myCount) {
					this.goodsNum_txt.textColor = 0xff0000
				} else {
					this.goodsNum_txt.textColor = 0x019704
				}
			} else {
				this.priceIcon.setType(config.needmoney.id);
				this.priceIcon.price = config.needmoney.count;
				this.priceIcon.setEnoughCount(GameGlobal.actorModel.yb)
				this.priceIcon.visible = true;
			}
			this.rebirthTimes_txt.text = "剩余复活次数：" + (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].purchasingtimes - GameGlobal.BossModel.reborncount)
			this.updaterebirthTime();
		}
		this.bar.value = data.hp;

	}
	public updaterebirthTime(): void {
		if (this.data.isDie) {
			this.rebirthTime_txt.text = DateUtils.format_3((this.data.reborntime - GameServer.serverTime) * 1000) + "后复活"
		}
	}
}