class TipsGoodEquip extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
	// OrangeEquipNoticeSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected itemName: eui.Label;
	protected desc: eui.Label;
	protected item: ItemBaseNotName;
	/////////////////////////////////////////////////////////////////////////////

	public isUsing = false

	private mc: MovieObject

	public constructor() {
		super()
		this.skinName = "OrangeEquipNoticeSkin";
	}

	set data(item) {
		this.item.data = item;
		this.item.isShowName(false)

		this.itemName.text = item.itemConfig.name;
		this.itemName.textColor = ItemBaseEffe.QUALITY_TIP_COLOR[item.itemConfig.quality];

		if (!this.mc) {
			this.mc = new MovieObject
			this.mc.x = 230
			this.mc.y = 75
			this.mc.scaleX = 1.14
			this.mc.scaleY = 1.2
		}
		this.addChild(this.mc)
		this.mc.LoadByUrl(ResDataPath.GetUIEffePath("ui_yhy004"), -1, true)
	}
}