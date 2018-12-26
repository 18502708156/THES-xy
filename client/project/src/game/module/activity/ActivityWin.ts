class ActivityWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main;

	/////////////////////////////////////////////////////////////////////////////
	// ActivityWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ActivityWinSkin"
		this.commonWindowBg.SetTitle('活动大厅')
	}

	public childrenCreated() {
		this.list.itemRenderer = ActivityItem
		let activityList = CommonUtils.GetArray(GameGlobal.Config.ActivityListConfig, "orderpos")
		for (let i = activityList.length - 1; i >= 0; --i) {
			if (GameGlobal.actorModel.level < activityList[i].showlv) {
				activityList.splice(i, 1)
			}
		}
		this.list.dataProvider = new eui.ArrayCollection(activityList)
	}

	OnOpen(...args: any[]) {
		this.commonWindowBg.OnAdded(this);
		
		this.observe(MessageDef.GANGBATTLE_OPEN_GATEVIEW, this.CloseSelf)
		this.observe(MessageDef.ACTIVITY_LIST_INFO, this.UpdateList)

		GameGlobal.ActivityModel.sendActivityList()
		GameGlobal.ActivityModel.sendActivityInfoReq()
	}

	OnClose() {
		this.removeObserve();
		this.commonWindowBg.OnRemoved();
	};

	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_121)
	}

}

class ActivityItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// ActivityItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected typeImg: eui.Image;
	protected titleImg: eui.Image;
	protected descGroup: eui.Group;
	protected tipTxt: eui.Label;
	protected timeDesc0: eui.Label;
	protected timeDesc1: eui.Label;
	protected list: eui.List;
	protected ranKBtn: eui.Button;
	protected goTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////
	/**活动类型*/
	private type: number;
	/**说明ID */
	private descID: number;
	/**解锁ID */
	private openID: number;



	childrenCreated() {
		this.tipTxt.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>说明</u></a>");
		this.goTxt.textFlow = (new egret.HtmlTextParser).parser("<a href='event:go'><u>马上前往</u></a>");

		this.tipTxt.addEventListener(egret.TextEvent.LINK, this.showTip, this);
		this.goTxt.addEventListener(egret.TextEvent.LINK, this.gotoHandler, this);
		this.ranKBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);

		this.list.itemRenderer = ItemBaseNotName;
		this.list.dataProvider = null;
	}

	private showTip(e) {
		ViewManager.ins().open(ActivityDescPanel, this.descID);
	}

	private gotoHandler(e) {
		if (!Deblocking.Check(this.openID)) {
			return;
		}
		let isopen = GameGlobal.ActivityModel.activityList[this.type];
		//帮会战和帮会BOSS无论开启与否。都可以点击进入里面的界面
		if (!isopen && this.type != ActivityModel.TYPE_GANG_BATTLE && this.type != ActivityModel.TYPE_GANG_BOSS) {
			GameGlobal.UserTips.showTips('活动未开启')
			return
		}
		switch (this.type) {
			case ActivityModel.TYPE_ANSWER:
				// if(GameGlobal.AnswerManage.openAnswer())
				if (GameGlobal.AnswerController.bOpenAnswer()) {
					ViewManager.ins().open(AnswerLayer);
				}
				else {
					GameGlobal.UserTips.showTips('活动未开启')
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)
				break;
			case ActivityModel.TYPE_QUJING:
				ViewManager.ins().open(QujingMainWin);
				break;
			case ActivityModel.TYPE_GANG_BOSS:
				if (!GameGlobal.actorModel.HasGuild()) {
					GameGlobal.UserTips.showTips('请先加入帮派');
					return;
				}
				ViewManager.ins().open(GangBossPanel);
				break;
			case ActivityModel.TYPE_GANGMINE:
				if (!GameGlobal.actorModel.HasGuild()) {
					GameGlobal.UserTips.showTips('请先加入帮派');
					return;
				}
				ViewManager.ins().open(GangMinePanel);
				break;
			case ActivityModel.TYPE_CROSS_BATTLE:
				GameGlobal.ActivityModel.sendActivityEnter(this.type);
				// ViewManager.ins().open(CrossBattleWin);
				break;
			case ActivityModel.TYPE_GANG_BATTLE:
				if (!Deblocking.Check(DeblockingType.TYPE_56))
					return

				if (!GameGlobal.actorModel.HasGuild()) {
					GameGlobal.UserTips.showTips('请先加入帮派')
					return
				}

				GameGlobal.GangBattleModel.SendEnterBattle()
				break;
			case ActivityModel.TYPE_WULIN_ZHENGBA:
				break;
			case ActivityModel.TYPE_CLOUD_NINE:
				GameGlobal.CloudNineModel.sendLeaveTime();
				break;
		}
	}

	private rankHandler(e) {
		switch (this.type) {
			case ActivityModel.TYPE_ANSWER:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DATI])
				break;
			case ActivityModel.TYPE_QUJING:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING])
				break;
			case ActivityModel.TYPE_GANGMINE:
				ViewManager.ins().open(GangMineCrossRankPanel);
				break;
			case ActivityModel.TYPE_CLOUD_NINE:
				ViewManager.ins().open(CloudNineRankPanel, CloudNineRankType.legendOfEmpire);
				break;
			case ActivityModel.TYPE_GANG_BOSS:
			case ActivityModel.TYPE_GANG_BATTLE:
			case ActivityModel.TYPE_CROSS_BATTLE:
				ActivityRewardShowWin.Open(this.type)
				break;
			case ActivityModel.TYPE_WULIN_ZHENGBA:
				break;
			
		}
	}

	dataChanged() {
		let config = this.data
		this.descID = config.illustrate
		this.type = config.type
		this.openID = config.openlv

		this.descGroup.visible = config.illustrate > 0
		this.typeImg.source = config.icon
		this.titleImg.source = config.nameicon
		this.list.dataProvider = new eui.ArrayCollection(config.rewardshow)

		let iconPath = ActivityModel.ICONSOURCE_MAP[config.type]
		this.ranKBtn.icon = iconPath

		let [strDes, descText] = this._GetDesc(config)
		this.timeDesc1.textFlow = TextFlowMaker.generateTextFlow(strDes)
		this.timeDesc0.text = descText
	}

	private _GetDesc(config) {
		let strDes = config.acday
		let descText = config.actime
		switch (config.type) {
			case ActivityModel.TYPE_ANSWER:
				strDes = `|C:0xe6f1f4&T:${config.acday}:|C:0x019704&T:${(GameGlobal.ActivityKaiFuModel.answerFisrstNe || "")}|`
				break;
			case ActivityModel.TYPE_QUJING:
				let baseInfo = GameGlobal.QujingModel.baseInfo
				let escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum
				strDes = `|C:0xe6f1f4&T:${config.acday} |C:0x019704&T:${escortMaxCount - baseInfo.mEscortCount}/${escortMaxCount}|`
				descText = GameGlobal.QujingModel.GetDoubleTimeDesc()
				break;
			case ActivityModel.TYPE_GANG_BOSS:
				break;
			case ActivityModel.TYPE_GANGMINE:
				break;
			case ActivityModel.TYPE_CROSS_BATTLE:
				break;
			case ActivityModel.TYPE_GANG_BATTLE:
				break;
			case ActivityModel.TYPE_WULIN_ZHENGBA:
				break;
			case ActivityModel.TYPE_CLOUD_NINE:
				break;
		}

		return [strDes, descText]
	}
}