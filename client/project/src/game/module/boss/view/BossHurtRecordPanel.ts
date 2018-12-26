class BossHurtRecordPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // BossHurtRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected rank_txt: eui.Label;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		
		this.skinName = "BossHurtRankSkin"
		this.list.itemRenderer = HurtBossRecordItem;
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.title = "伤害记录"
		this.observe(MessageDef.PUBLIC_BOSS_RECORD, this.updateContent)
		
		GameGlobal.BossModel.sendPublicRecord(parseInt(param[0]))
		
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	private updateContent(data) {
		this.list.dataProvider = new eui.ArrayCollection(data[1])
		let rank = data[0];
		if (rank == 0)
		{
			this.rank_txt.text = "未上榜"
		} else {
			this.rank_txt.text = "第" + rank + "名";
		}
	}
	
}
/**
 * BossRecordItem
 */
class HurtBossRecordItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
    // BossHurtItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected rank_txt: eui.Label;
    protected name_txt: eui.Label;
    protected fight_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	constructor() {
		super();
	}
	public childrenCreated() {
		
	}

	public dataChanged() {
		let data: Sproto.public_attack_info = this.data;
		this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02"
		this.rank_txt.text = (this.itemIndex + 1) + ""
		this.name_txt.text = data.name;
		this.fight_txt.text = data.injure + "";
	}
}