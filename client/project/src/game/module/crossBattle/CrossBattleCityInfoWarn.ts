class CrossBattleCityInfoWarn extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main_2

	public constructor() {
		super()
	}
	public commonDialog: CommonDialog;
	public sureBtn: eui.Button;
	public list: eui.List;
	public pro: eui.ProgressBar;
	public title: eui.Label;
	public title0: eui.Label;
	public typeImg: eui.Image;
	public typeName: eui.Label;
	public all: eui.Label;
	public typeBuff: eui.Image;
	public bloom: eui.Image;
	public list0:eui.List;
	public GwHeadItem:eui.List
	public text:eui.BitmapLabel

	initUI() {
		super.initUI()
		this.skinName = "CrossBattleCityInfoSkin"
		this.list.itemRenderer = RoleHeadItem
		this.GwHeadItem.itemRenderer = GwHeadItem
	}

	OnOpen() {
		this.commonDialog.OnAdded(this)
		this.commonDialog.setBgVisible(true)
		this.observe(MessageDef.KFZB_ONECITY_INFO, this.UpdateContent);
		this.AddClick(this.sureBtn, this.onTap);
		this.AddClick(this.bloom,this.bloomTap)
	}

	OnClose() {
		this.commonDialog.OnRemoved()
		this.removeEvents()
	}

	public UpdateContent() {
		let data: Sproto.sc_king_city_data_request = GameGlobal.CrossBattleModel.oneCity
		// this.text.text = "边城"  //GameGlobal.CrossBattleModel.CITYNAME[data.currcamp]
		this.text.text = data.camp == 0 ? "王城" :  "边城"
		//CrossBattleCityInfoWarn.NAME = GameGlobal.CrossBattleModel.ZHENGNAME[data.currcamp]
		if (data.currcamp == GameGlobal.CrossBattleModel.camp) {
			this.currentState = "shou"
			this.all.visible = data.guards.length == 3
			this.sureBtn.visible = data.guards.length != 3
		} else {
			this.currentState = "gong"
		}

		for (let i = data.guards.length; i < 3; i++) {
			data.guards.push(null)
		}
		
		let rolenum = 0;
		for(let i = 0;i < data.guards.length; i++) {
           if(data.guards[i] != null){
			   rolenum++
		   }
		}
		
		if(rolenum == 0){
			this.list.visible = false
			this.GwHeadItem.visible = true
		}else{
			this.list.visible = true
			this.GwHeadItem.visible = false
		}
		//GameGlobal.Config.KingCityConfig[data.camp]
		let Config = GameGlobal.Config.KingCityConfig[data.camp + 1][10]
		let boos = {
			bossicon:"",
			name:""
		}
		let booss = []
		for(let i = 0;i<Config.bossicon.length;i++){
		    boos.bossicon =  Config.bossicon[i]
			boos.name = Config.name[i]
			booss.push(boos);
		}
		this.list.dataProvider = new eui.ArrayCollection(data.guards);
		this.GwHeadItem.dataProvider = new eui.ArrayCollection(booss)
		this.pro.maximum = data.maxhp;
		this.pro.value = data.currhp;
		this.typeBuff.source = GameGlobal.CrossBattleModel.BUFFTYPE[data.currcamp]
		this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[data.currcamp]
		this.typeName.text = GameGlobal.CrossBattleModel.ZHENGNAME[data.currcamp]
	}

	public bloomTap() {
		 ViewManager.ins().open(CrossBattleTipPanel,4);
	}

	public onTap() {
		let data: Sproto.sc_king_city_data_request = GameGlobal.CrossBattleModel.oneCity
		if (this.currentState == "gong") {
			if (GameGlobal.CrossBattleModel.status == 1) {
				UserTips.ErrorTip("无法攻击，处于准备状态")
				return
			}
			if (GameGlobal.CrossBattleModel.status == 3) {
				UserTips.ErrorTip("无法攻击，处于死亡状态")
				return
			}
			if (GameGlobal.CrossBattleModel.status == 4) {
				UserTips.ErrorTip("无法攻击，处于守城状态")
				return
			}
			GameGlobal.CrossBattleModel.attackCity(data.camp); //请求战斗
		} else {
			if (GameGlobal.CrossBattleModel.status == 1) {
				UserTips.ErrorTip("无法守城，处于准备状态")
				return
			}
			if (GameGlobal.CrossBattleModel.status == 3) {
				UserTips.ErrorTip("无法守城，处于死亡状态")
				return
			}
			if (GameGlobal.CrossBattleModel.status == 4) {
				UserTips.ErrorTip("无法守城，处于守城状态")
				return
			}
			GameGlobal.CrossBattleModel.fangShouCity(data.camp)
		}
	}

	public buffShow() {

	}
}