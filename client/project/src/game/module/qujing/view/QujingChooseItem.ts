class QujingChooseItem extends eui.Component implements  eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
	// QujingChooseItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected labName: eui.Label;
	protected imgIcon: eui.Image;
	protected item1: ItemBase;
	protected item2: ItemBase;
	protected item3: ItemBase;
	protected item4: ItemBase;
	protected imgChoose: eui.Image;

	private mQuality: number

	public constructor() {
		super()
	}

	public SetItemData(config) {
		this.labName.text = config.name
		this.labName.textColor = ItemBase.GetColorByQuality(config.quality-1)
		this.imgIcon.source = config.icon
		this.mQuality = config.quality

		let idx = 1
		for (let reward of config.reward)
		{
			let itemName = `item${idx}`
			if (this[itemName])
			{
				this[itemName].visible = true
				this[itemName].setItemData(reward)
			}
			
			idx++
		}

		this.imgChoose.visible = GameGlobal.QujingModel.IsCurQuality(config.quality)
	}

	public SetChooseState(quality) {
		this.imgChoose.visible = quality == this.mQuality
	}
}