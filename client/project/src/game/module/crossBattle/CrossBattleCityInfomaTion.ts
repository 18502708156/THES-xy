class CrossBattleCityInfomaTion extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main_2

	public constructor() {
		super()
	}

	public CommonWindowBg: CommonWindowBg;
	public list: eui.List;
	public pro: eui.ProgressBar;
	public title: eui.Label;
	public typeImg: eui.Image;
	public typeName: eui.Label;
	public all: eui.Label;
	public typeBuff: eui.Image;
	public bloom: eui.Image;
	public scsjText: eui.Label;
	public wcljText: eui.Label;
	public jilulist: eui.List;
	public lvse: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "CrossBattleCityInfomaTionSkin"
		this.list.itemRenderer = RoleHeadItem
		this.jilulist.itemRenderer = jiLuItem
	}

	OnOpen() {
		this.CommonWindowBg.OnAdded(this);
		this.observe(MessageDef.KFZB_ONECITY_INFO, this.UpdateContent);
		this._AddClick(this.bloom, this.bloomOnTop)
		UIHelper.SetLinkStyleLabel(this.lvse)
		this._AddClick(this.lvse, this.lvseOntop)
		GameGlobal.MessageCenter.dispatch(MessageDef.UP_GROUP_SHOW, false)

		this.AddLoopTimer(1000, this.Update)
	}

	bloomOnTop() {
		ViewManager.ins().open(CrossBattleTipPanel, 4);
	}

	lvseOntop() {
		CrossBattleWin.SendGetPoint()
	}

	OnClose() {
		this.removeObserve();
		this.removeEvents();
		this.CommonWindowBg.OnRemoved();
		GameGlobal.MessageCenter.dispatch(MessageDef.UP_GROUP_SHOW, true)
		// TimerManager.ins().remove(this.startTimer, this);
	};

	private Update() {
		if (!GameGlobal.CrossBattleModel.oneCity) {
			return
		}
		let time = GameServer.serverTime - GameGlobal.CrossBattleModel.oneCity.guardtime
		this.scsjText.text = "守城时间：" + Math.max(time, 0) + "秒"
	}

	public UpdateContent() {
		let data: Sproto.sc_king_city_data_request = GameGlobal.CrossBattleModel.oneCity
		if (!data) {
			return
		}
		for (let i = data.guards.length; i < 3; i++) {
			data.guards.push(null)
		}
		this.list.dataProvider = new eui.ArrayCollection(data.guards);

		this.pro.maximum = data.maxhp;
		this.pro.value = data.currhp;
		// let time2 = GameServer.serverTime + GameGlobal.CrossBattleModel.oneCity.pointtime
		this.wcljText.text = "累计王城积分：" + data.point + "分（5/分）" /*+在坚持 GameServer.GetPkTime(time2) + "后可获得"*/;
		// GameGlobal.CrossBattleModel.oneCity.pointtime--
		this.jilulist.dataProvider = new eui.ArrayCollection(data.record);
	}
}

class jiLuItem extends eui.ItemRenderer {
	public text: eui.Label
	public constructor() {
		super();
		this.skinName = "jiLuitemSkin"
	}

	TYPECOLOR = [
		"#019704",
		"#DB0000",
		"#F77C67"
	]
	public childrenCreated() {

	}
	public dataChanged() {
		let data = this.data as Sproto.king_guard_record;
		let str = GameServer.PanTaoHui(data.time) + "";
		str += '<font color = "' + this.TYPECOLOR[data.camp - 1] + '">' + GameGlobal.CrossBattleModel.CITYNAME[data.camp] + '</font>';
		for (let i = 0; i < data.names.length; i++) {
			str += data.names[i] + " ";
		}
		str += "队伍攻城，被我方在3个回合击败，城池受到了" + data.changhp + "点伤害";
		this.text.textFlow = (new egret.HtmlTextParser()).parser(str);
	}
}