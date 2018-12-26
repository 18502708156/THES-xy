class GodPetActiveLotteryIcon extends eui.Component implements  eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
	// GodPetActiveLotteryIconSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemBaseNotName;
	protected imgGain: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	public setItemAward(itemData) {
		this.item.setItemAward(itemData.type, itemData.id, itemData.count)
		this.imgGain.visible = GameGlobal.GodPetActiveModel.HasGain(itemData.id)
	}

	public showChoose(b) {
		this.item.imgChoose.visible = b
	}
}