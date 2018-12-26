class CrossBattleWin extends BaseEuiView {
	public static NAME = "跨服争霸"
	public static LAYER_LEVEL = LayerManager.UI_GAME_MAP;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM

	public miniMap: MiniMap;
	public time: eui.Label;
	public title1: eui.Label;
	public title2: eui.Label;
	public title3: eui.Label;
	public mydata: eui.Label;
	public list: eui.List;
	public taskTraceBtn: eui.Group;
	public change: eui.Button;
	public fuhuo: eui.Group;
	public fuhuoTime: eui.Label;
	public fuhuoPrice: PriceIcon;
	public fuhuoBnt: eui.Button;
	public taskTraceText: eui.Label
	public groupAdaptation: eui.Group
	public team: eui.Button
	public bgMain: eui.Image
	public buf1: eui.Image
	public buf2: eui.Image
	public buf3: eui.Image
	public shouChen: eui.Button

	public constructor() {
		super();
		this.skinName = "CrossBattleMainSkin";
		this.list.itemRenderer = CityTypeItem;
	}

	OnOpen(...param: any[]) {
		this.observe(MessageDef.MINI_MAP_UPDATE_LIST, this.UpdateMiniMap);
		this.observe(MessageDef.KFZB_MAINJNFEN_INFO, this.kingPointInfo);
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
		this.observe(MessageDef.TEAM_UPDATE_MAP_LIST, this.TeamInfo)
		this.observe(MessageDef.JF_UPDATE_INFO, this.taskTraceBtnUpdate)
		this.observe(MessageDef.MOVE_UPDATE_INFO, this.showBnt)
		this.observe(MessageDef.CITYTYPE_UPDATE_INFO, this.UpdateMiniCity)
		this.observe(MessageDef.UP_GROUP_SHOW, this.upGroupShow)
		this.observe(MessageDef.SHOUCITY_UPDATE_INFO, this.ShowShouCity)
		this.observe(MessageDef.SEND_CITY, this.SendShouCity)
		this.observe(MessageDef.JF_UPDATE_INFO, this.taskTraceBtnUpdate);
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.clickList, this)
		this._AddClick(this.fuhuoBnt, this._click)
		this._AddClick(this.change, this._click)
		this._AddClick(this.taskTraceBtn, this._click)
		this._AddClick(this.team, this._click)
		this._AddClick(this.shouChen, this._click)

		GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

		this.groupAdaptation.touchEnabled = false
		GameGlobal.CrossBattleModel.getJfModel()   //请求数据
		for (let i = 1; i < 4; i++) {
			this._AddClick(this["buf" + i], this._bufclick)
		}
		GameGlobal.CrossBattleModel.addfightingIcon()
		this.UpdateContent();
		this.ShowShouCity()
		this.mapCityData()
	}

	mapCityData() {
		for (let i = 0; i < 4; i++) {
			let data = GameGlobal.CrossBattleModel.getCityInfo(i)
			GameMap.GetMap().MainCityView.setRoleHead(i, data)
		}
	}

	clickList() {
		GameGlobal.CrossBattleModel.listMoveMap(this.list.selectedIndex)
	}

	ShowShouCity() {
		this.shouChen.visible = GameGlobal.CrossBattleModel.status == 4
	}

	_bufclick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.buf1:
				ViewManager.ins().open(CrossBattleTipPanel, 1);
				break;
			case this.buf2:
				ViewManager.ins().open(CrossBattleTipPanel, 2);
				break;
			case this.buf3:
				ViewManager.ins().open(CrossBattleTipPanel, 3);
				break;
		}

	}

	showBnt(x, y) {
		let camp = GameGlobal.CrossBattleModel.camp;
		let config
		switch (camp) {
			case 1:
				config = GameGlobal.Config.KingBaseConfig.rbronpos
				break;
			case 2:
				config = GameGlobal.Config.KingBaseConfig.xcitypos
				break;
			case 3:
				config = GameGlobal.Config.KingBaseConfig.mcitypos
				break;
		}
		if (!config) {
			return
		}
		if (x > config[0][0] && x < config[1][0] && y > config[0][1] && y < config[1][1]) {
			this.change.visible = true
			this.team.visible = false
		} else {
			this.change.visible = false
			this.team.visible = true
		}
		if (GameGlobal.CrossBattleModel.transform.indexOf(GameGlobal.actorModel.actorID) != -1) {
			this.team.visible = false
			this.change.visible = false
		}
	}

	_click(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.change:
				ViewManager.ins().open(CrossBattleChargeWarn);
				break;
			case this.fuhuoBnt:
				let config = GameGlobal.Config.KingBaseConfig
				if (Checker.Money(config.revivecost.id, config.revivecost.count, Checker.YUNBAO_FRAME)) {
					GameGlobal.CrossBattleModel.fuHuo();
				}
				break;
			case this.taskTraceBtn:

				// ViewManager.ins().open(CrossBattleJfWin);

				CrossBattleWin.SendGetPoint()

				break;
			case this.team:
				if (GameGlobal.CrossBattleTeamModel.mTeamInfo.HasTeam()) {//已有队伍
					ViewManager.ins().open(CrossBattleTeamPanel);
				}
				else ViewManager.ins().open(CrossBattleTeamWin);
				break;
			case this.shouChen:
				GameGlobal.CrossBattleModel.myGuardCityCs();


				break;
		}
	}

	public SendShouCity() {
		if (GameGlobal.CrossBattleModel.MyShouCity == 99) {
			return
		}
		GameGlobal.CrossBattleModel.sendKingCityData(GameGlobal.CrossBattleModel.MyShouCity);
	}

	public TeamInfo() {
		let Raid = GameGlobal.RaidMgr.mMapRaid as MapRaidCrossBattle
		if (egret.is(Raid, "MapRaidCrossBattle")) {
			Raid.DelayUpdateTeam()
		}
	}

	public upGroupShow(bool: boolean) {
		this.groupAdaptation.visible = bool
	}

	public OnClose() {
		this.removeObserve();
	}

	public UpdateContent() {
		this.list.dataProvider = new eui.ArrayCollection([1, 2, 3, 4]);
		this.UpdateMiniMap()
		this.kingPointInfo()
		//this.fuHuoUpData()
		this.buffShow()
		this.UpdateMiniCity()
		this.AdaptationGroup()
		this.taskTraceBtnUpdate()
		this.buffShow()
		GameGlobal.CrossBattleModel.addfightingIcon()
		GameGlobal.CrossBattleModel.bianShen()
		this.mapCityData()
	}

	public taskTraceBtnUpdate() {
		let id = CrossBattleWin.GetPointIndex()
		if (!id) {
			this.taskTraceText.text = "全部领取"
		} else {
			this.taskTraceText.textFlow = ConsumeLabel.GetValueColor2(GameGlobal.CrossBattleModel.citypoint, GameGlobal.Config.KingWPointsRewardConfig[id].citypoints, Color.GREEN_LIGHT)
		}
	}

	public static SendGetPoint() {
		let id = this.GetPointIndex()
		if (!id) {
			return
		}
		if (GameGlobal.CrossBattleModel.citypoint < GameGlobal.Config.KingWPointsRewardConfig[id].citypoints) {
			UserTips.InfoTip("积分不足")
			return
		}
		GameGlobal.CrossBattleModel.huoQuJiangLi(1, id)
	}

	private static GetPointIndex() {
		let config = CommonUtils.GetArray(GameGlobal.Config.KingWPointsRewardConfig, "id")
		let cityPoint = GameGlobal.CrossBattleModel.citypoint
		for (let data of config) {
			let id = data.id
			if (GameGlobal.CrossBattleModel.cityreward.indexOf(id) == -1) {

				return id
			}
		}
		return null
	}

	public startTimer
	public kingPointInfo() {
		this.startTimer = TimerManager.ins().doTimer(1000, 0, this.kingPointInfo, this)
		let data = GameGlobal.CrossBattleModel.camppoint;
		for (let i = 0; i < data.length; i++) {
			//this["title" + data[i].camp].text = GameGlobal.CrossBattleModel.CITYNAME[data[i].camp] + "阵营   王城积分 ：" + data[i].point;
			/*if(data[i].camp == GameGlobal.CrossBattleModel.camp){
				this["title" + data[i].camp].textColor = 0xE87E27
			}*/
			this["title" + (i + 1)].text = GameGlobal.CrossBattleModel.CITYNAME[data[i].camp] + "阵营   王城积分 ：" + data[i].point;
		}
		this["title1"].textColor = 0xE87E27
		this.mydata.text = "我的王城积分：" + GameGlobal.CrossBattleModel.citypoint
		if (GameGlobal.CrossBattleModel.actcountdown > 0) {
			if (GameGlobal.CrossBattleModel.status == 1) {
				this.time.text = "活动开始倒计时" + (GameGlobal.CrossBattleModel.actcountdown - GameServer.serverTime) + "秒"
			} else {
				this.time.text = "活动结束倒计时" + (GameGlobal.CrossBattleModel.actcountdown - GameServer.serverTime) + "秒"
			}
		}
	}

	public UpdateMiniMap() {
		let raid = GameGlobal.RaidMgr.mMapRaid
		this.miniMap._setBg("resource/assets/map/map311/pk_preview.jpg")
		this.miniMap._removeAll();
		for (let key in raid.cTeam) {
			this.miniMap._setRole(raid.cTeam[key]);
		}
	}

	public UpdateMiniCity() {
		for (let i = 0; i < 4; i++) {
			this.miniMap.citySet(i)
		}
	}

	public AdaptationGroup() {
		MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 211
	}

	public buffShow() {
		let buf = GameGlobal.CrossBattleModel.getBuff()
		for (let i = 1; i < 4; i++) {
			//this["buf"+i].visible = false     
			this["buf" + i].filters = Color.GetFilter()
		}
		for (let n = 0; n < buf.length; n++) {
			//this["buf"+buf[n]].visible = true
			this["buf" + buf[n]].filters = []
		}
	}
}

class CityTypeItem extends eui.ItemRenderer {
	public cityName: eui.Label;
	public title: eui.Label;
	public title0: eui.Label;

	public constructor() {
		super();
		this.skinName = "CityTypeSkin"
	}

	public childrenCreated() {

	}

	CITYNAME = [
		"王城",
		"人族边城",
		"仙族边城",
		"魔族边城"
	]

	public dataChanged() {
		let data = this.data;
		let Config = GameGlobal.Config.KingCityConfig[data][10];
		this.cityName.text = this.CITYNAME[Config.id - 1];
		// if (Config.type == 0) {
		this.title.text = "每分钟 + " + Config.citypoints + "积分";
		// } else {
		// 	this.title.text = "每分钟 + " + Config.guardpoints + "积分";
		// }
		if (Config.type == GameGlobal.CrossBattleModel.camp) {
			this.title0.textColor = 0x019704
			this.title0.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>前往守卫</u></a>");
		} else {
			this.title0.textColor = 0xFF0000
			this.title0.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>前往攻击</u></a>");
		}
	}
}


class Chest extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}
	private boxName: eui.Label;
	private title: eui.Label;

	public set _boxName(str) {
		this.boxName.text = str
	}

	public set _title(str) {
		this.title.text = str
	}
}

class RoleHeadItem extends eui.ItemRenderer {
	public typeImg: eui.Image;
	//public head:eui.Image;
	public typeName: eui.Label;
	public username: eui.Label;
	public deal: eui.Label;
	public face: eui.Component;

	public constructor() {
		super();
		this.skinName = "RoleHeadSkin"
	}

	public childrenCreated() {

	}

	public dataChanged() {
		let data = this.data
		if (!data) {
			return
		}
		this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[GameGlobal.CrossBattleModel.oneCity.currcamp];
		this.typeName.text = GameGlobal.CrossBattleModel.ZHENGNAME[GameGlobal.CrossBattleModel.oneCity.currcamp];
		this.username.text = data.name;
		this.deal.visible = data.isdead;
		this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex)
	}
}

class GwHeadItem extends eui.ItemRenderer {

	public head: eui.Image;
	public username: eui.Label;
	public constructor() {
		super();
		this.skinName = "GwHeadSkin"
	}

	public childrenCreated() {
	}

	public dataChanged() {
		let data = this.data
		if (!data) {
			return
		}

		// this.head.source = "resource/assets/atlas/image/head/pet/" + data.bossicon + ".png";
		this.head.source = data.bossicon
		this.username.text = data.name;
	}
}

class HeadItem extends eui.ItemRenderer {

	public head: eui.Image;
	public username: eui.Label;
	public constructor() {
		super();
		this.skinName = "GwHeadSkin"
	}

	public childrenCreated() {
	}

	public dataChanged() {
		let data = this.data
		if (!data) {
			return
		}

		// this.head.source = "resource/assets/atlas/image/head/pet/" + data.bossicon + ".png";
		this.head.source = ResDataPath.GetHeadImgName(data.job, data.sex)
		this.username.text = data.name;
	}
}

