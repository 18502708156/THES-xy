class BossKillRecordPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // BossKillRecordSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected rank_txt: eui.Label;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		
		this.skinName = "BossKillRecordSkin"
		this.list.itemRenderer = KillBossRecordItem;
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.title = "击杀记录"
		this.observe(MessageDef.PUBLIC_BOSS_RECORD_KILL, this.updateContent)
		
		GameGlobal.BossModel.sendPublicKillRecord(parseInt(param[0]))
		
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	private updateContent(data) {
		this.list.dataProvider = new eui.ArrayCollection(data)
		// let rank = data[0];
		// if (rank == 0)
		// {
		// 	this.rank_txt.text = "未上榜"
		// } else {
		// 	this.rank_txt.text = "第" + rank + "名";
		// }
	}
	// public GetLayerLevel() {
    //     return LayerManager.UI_Popup
    // }
	
}
/**
 * BossRecordItem
 */
class KillBossRecordItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
    // KillBossItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected time_txt: eui.Label;
    protected name_txt: eui.Label;
    protected fight_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	constructor() {
		super();
	}
	public childrenCreated() {
		
	}

	public dataChanged() {
		let data: Sproto.public_kill_info = this.data;
		this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02"
		this.time_txt.text = DateUtils.format_6(data.killtime * 1000);
		this.name_txt.text = data.name;
		this.fight_txt.text = data.power + "";
	}
}