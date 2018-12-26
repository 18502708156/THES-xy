class GangJuanXianListWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GangJuanXianListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected listGang: eui.List;
    protected addPowerGroup: eui.Group;
    protected lbAlert0: eui.Label;
    protected get_txt1: GetwayLabel;
    protected get_txt2: GetwayLabel;
    /////////////////////////////////////////////////////////////////////////////



	public constructor() {
		super()
		this.skinName = "GangJuanXianListSkin"
		this.commonWindowBg.SetTitle("帮会捐献")	
	}

	public childrenCreated() {
		this.listGang.itemRenderer = GangJanXianItem
		this.listGang.dataProvider = new eui.ArrayCollection([])
		this.get_txt1.text = "帮会副本"
		this.get_txt2.text = "帮会地图"
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.AddClick(this.get_txt1, this.openGetWin)
		this.AddClick(this.get_txt2, this.openGetWin)
		this.observe(MessageDef.BAG_ITEM_COUNT_CHANGE,this.UpdateContent)
			
		this.UpdateContent();
	}
	private openGetWin(e:egret.TouchEvent){
		if(e.target == this.get_txt1) {
			ViewManager.ins().close(this);
			ViewManager.ins().openIndex(GangMainWin, 1)
			return;
		}
		if(e.target == this.get_txt2){
			if (!UserFb.CheckFighting())
                return
				
			GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid)
			ViewManager.ins().close(this)
            ViewManager.ins().close(GangMainWin)
		}
	}
	private UpdateContent() {
		var itemLists = [];
		var config = GameGlobal.Config.GuildDonateConfig;
		for(var key in config)
		{
			itemLists.push(config[key])
		}
		(this.listGang.dataProvider as eui.ArrayCollection).replaceAll(itemLists);
	}

	public OnClose() {
	}
}

class GangJanXianItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangJuanXianListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgIcon: ItemBase;
    protected itemName: eui.Label;
    protected desc_txt: eui.Label;
    protected btnApply: eui.Button;
	protected had_txt:eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	//private needName = "";
	public childrenCreated() {
		this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let cost = this.data.cost;
		var itemConfig = GameGlobal.Config.ItemConfig[cost.id];
		this.itemName.text = itemConfig.name;
		this.imgIcon.isShowName(false);
		this.imgIcon.setDataByConfig(itemConfig);
		this.imgIcon.setCount("");
		this.desc_txt.text = itemConfig.desc
		var hadCount= GameGlobal.UserBag.GetCount(cost.id)
		this.had_txt.text = "（拥有："+ hadCount + "）"
	}

	private _OnBtnClick(e: egret.TouchEvent) 
	{
		if (GameGlobal.GangModel.mCoutributeCount >= GameGlobal.Config.GuildConfig.maxcount)
		{
			UserTips.ins().showTips(`捐献次数已达上限,每天可捐献${GameGlobal.Config.GuildConfig.maxcount}次`)
			return
		}
		
		var id = this.data.id
		if (Checker.Data(this.data.cost))
			GameGlobal.GangModel.SendGetJuanXuanList(id)
	}
	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();

        if(this.btnApply) this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP,this._OnBtnClick,this)
	}
}