class ActivityAdvance {
	private m_component = null;
	constructor(component: egret.DisplayObjectContainer) {
		this.m_component = component;
		this.show();
	}
	show() {
		let config = GameGlobal.Config.ActivityPreviewConfig;
		for (let key in config) {
			if (Deblocking.Check(config[key].openlv, true)) {
				if (GameGlobal.Config[config[key].tablename] && !this.m_component.getChildByName(`advanceBtn${key}`)) {
					let activityData = GameGlobal.Config[config[key].tablename]
					let opendayData = activityData[config[key].acday];

					let date = new Date(GameServer.serverTime * 1000);
					let weekDay = DateUtils.GetDay(date)
					let _key = config[key].actime;
					let endtime = activityData[_key][Object.keys(activityData[_key])[1]];
					let time = DateUtils.FormatTimeString(endtime)

					for (let index in opendayData) {
						if (opendayData[index] == weekDay && date.getTime() <= time) {
							let activityAdvanceBtn = new ActivityAdvanceBtn(activityData);
							activityAdvanceBtn.type = config[key].type;
							activityAdvanceBtn.name = `advanceBtn${key}`
							this.m_component.addChild(activityAdvanceBtn)
							break;
						}
					}
				}
			}
		}
	}
}

class ActivityAdvanceBtn extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// AcitivityAdvanceBtnSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected iconDisplay: eui.Image;
	protected timeGroup: eui.Group;
	protected tipsLabel: eui.Label;
	protected redPoint: eui.Image;
	protected runImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////


	type = -1;
	private m_BaseConfig = null;
	private m_bIsOpen = false;
	private m_bOpenTime = 0;
	private m_cTipsPanelDate: TipsPanelDate = new TipsPanelDate;
	private m_activityConfig;
	public constructor(config) {
		super();
		this.m_BaseConfig = config;
		this.skinName = "AcitivityAdvanceBtnSkin"
	}

	createChildren() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this)
		this.m_activityConfig = GameGlobal.Config.ActivityPreviewConfig;
		this.iconDisplay.source = this.m_activityConfig[this.type].nameicon;

		let key = this.m_activityConfig[this.type].actime;
		let opentime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[0]];
		let arr = opentime.split(":")
		this.m_bOpenTime = arr[0]
		this.tipsLabel.text = `${this.m_bOpenTime}点开启`
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		TimerManager.ins().doTimer(1000, 0, this.timer, this)
	}

	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		TimerManager.ins().removeAll(this)
	}

	private tap() {
		if (this.m_bIsOpen) {
			switch (this.type) {
				case 1:
					ViewManager.ins().open(GangBossPanel)
					break;
				case 2:
					GameGlobal.ActivityModel.sendActivityEnter(ActivityModel.TYPE_CROSS_BATTLE);
					break;
				case 3:
					ViewManager.ins().open(GBattleMainWin)
					break;
				case 4:
					GameGlobal.CloudNineModel.sendLeaveTime();
					break;
				case 5:
					ViewManager.ins().open(CrossMainPanel, 1)
					break;
				case 6:
					ViewManager.ins().open(ArenaWin, 1)
					break;
				default:
					break;
			}
		}
		else {
			this.showTipsPanel();
		}
	}

	showTipsPanel() {

		this.m_cTipsPanelDate.iocn = this.m_activityConfig[this.type].nameicon;
		this.m_cTipsPanelDate.tips1Txt = `${this.m_bOpenTime}点`
		let str = "周";
		for (let key in this.m_BaseConfig[this.m_activityConfig[this.type].acday]) {
			str += this.m_BaseConfig[this.m_activityConfig[this.type].acday][key] + "、"
		}
		this.m_cTipsPanelDate.tips2Txt = str;
		this.m_cTipsPanelDate.detailsTxt = this.m_activityConfig[this.type].illustrate;
		let awardDate = this.m_BaseConfig[this.m_activityConfig[this.type].showitem2]
		if (awardDate)
			this.m_cTipsPanelDate.award = awardDate
		let auctionDate = this.m_BaseConfig[this.m_activityConfig[this.type].showitem1]
		if (auctionDate)
			this.m_cTipsPanelDate.auction = auctionDate

		ViewManager.ins().open(ActivityAdvanceTispPanel, this.m_cTipsPanelDate);
	}

	timer() {

		let key = this.m_activityConfig[this.type].actime;
		let opentime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[0]];
		let time = DateUtils.FormatTimeString(opentime)

		if (time <= GameServer.serverTime * 1000) {
			this.m_bIsOpen = true;
			// this.tipsLabel.text = "进行中"
			this.timeGroup.visible = false
			this.runImg.visible = true
		}

		let endtime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[1]];
		time = DateUtils.FormatTimeString(endtime)

		if (time <= GameServer.serverTime * 1000) {
			this.m_bIsOpen = true;
			TimerManager.ins().remove(this.timer, this)
			DisplayUtils.removeFromParent(this);
		}
	}
}

class TipsPanelDate {
	title: string;
	iocn: string;
	tips1Txt: string;
	tips2Txt: string;
	detailsTxt: string;
	auction: any;
	award: any
}