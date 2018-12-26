class BossTipsPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // BossTipsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "BossTipsSkin"

		this.list.itemRenderer = BossTipsItem
	}
	initUI()
	{
		super.initUI()
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "BOSS提醒"
	}

	public OnOpen(...param: any[]) {
		
		let arr = []
		let config = GameGlobal.Config.PublicBossConfig
		for (let key in config) {
			arr.push(parseInt(key))
		}
		this.list.dataProvider = new eui.ArrayCollection(arr);
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}
class BossTipsItem extends eui.ItemRenderer
{
    /////////////////////////////////////////////////////////////////////////////
    // BossTipsItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected lv_txt: eui.Label;
    protected name_txt: eui.Label;
    protected showCheck: eui.CheckBox;
    protected open_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	constructor()
	{
		super()

	}
	childrenCreated(): void
	{
		super.childrenCreated()
		this.showCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		
	}
	private onClick(e): void
	{
		GameGlobal.BossModel.setRemind(1 << (this.itemIndex + 1));
	}
	dataChanged(): void
	{
		this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02"
		let config = GameGlobal.Config.PublicBossConfig[this.data]
		this.name_txt.text = GameGlobal.Config.MonstersConfig[config.bossid][GameGlobal.Config.MonstersConfig_keys.name]
		this.lv_txt.text = GameGlobal.Config.MonstersConfig[config.bossid][GameGlobal.Config.MonstersConfig_keys.level] + "级";
		if (GameGlobal.actorModel.level >= config.level) {
			this.open_txt.visible = false;
		} else {
			this.open_txt.visible = true;
			this.open_txt.text = config.level + "级可进入"
		}
		this.showCheck.visible = GameGlobal.actorModel.level >= config.level;
		this.showCheck.selected = GameGlobal.BossModel.getRemindByIndex(this.itemIndex)
		
	}
}