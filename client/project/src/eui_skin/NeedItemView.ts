class NeedItemView extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
    // NeedItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected matLabel: eui.Label;
    protected useCountLabel: eui.Label;
    protected item: ItemBaseNotName;
    /////////////////////////////////////////////////////////////////////////////

	public mItemId: number

	public constructor() {
		super()
	}

	public SetItemId(id: number, count: number) {
		let config = GameGlobal.Config.ItemConfig[id]
		if (!config) {
			return
		}
		this.mItemId = id
		this.item.data = id
		StringUtils.addColor
		UIHelper.SetLabelText(this.matLabel, StringUtils.addColor(config.name, ItemBase.QUALITY_COLOR[config.quality]), "*" + count)
		UIHelper.SetLabelText(this.useCountLabel, "拥有：", GameGlobal.UserBag.GetCount(id) + "")
	}
}