class GangRecordListWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// GangRecordListSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected recordlist: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangRecordListSkin"
		this.commonWindowBg.SetTitle("帮会记录")
	}

	public childrenCreated() {
		this.recordlist.itemRenderer = GangRecordItem
		this.recordlist.dataProvider = new eui.ArrayCollection([])
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.UpdateContent();
	}

	private UpdateContent() {
		let itemLists = GameGlobal.GangModel.gangRecordInfo.historyRecords;
		(this.recordlist.dataProvider as eui.ArrayCollection).replaceAll(itemLists);
	}
}

class GangRecordItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// GangRecordListItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected bg_image: eui.Image;
	protected desc_txt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////


	public childrenCreated() {

	}

	public dataChanged() {
		if (this.itemIndex % 2 == 0) {
			this.bg_image.visible = false;
		} else {
			this.bg_image.visible = true;
		}
		if (!this.data) return;
		let info = this.data as Sproto.guild_history;
		this.desc_txt.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.GangModel.gangRecordInfo.getTypeName(info.type, info.time, info.name1));
	}
}