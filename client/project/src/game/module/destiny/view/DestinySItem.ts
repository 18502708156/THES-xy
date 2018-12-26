class DestinySItem extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
	// DestinyItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected imgBg: eui.Image;
	protected imgSelect: eui.Image;
	protected imgAdd: eui.Image;
	protected imgIcon: eui.Image;
	protected imgRed: eui.Image;
	protected lbLv: eui.Label;
	protected lbLock: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "DestinyItemSkin";
		this.imgSelect.visible = false
		this.lbLock.visible = false
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)

	}

	private data: DestinyData
	private index: number

	public onUpdate(index: number, _data: DestinyData) {
		this.index = index
		this.data = _data
		this.imgAdd.visible = !_data || !_data.level
		if (this.imgAdd.visible) {
			this.lbLv.text = ""
			this.imgIcon.visible = false
			this.imgBg.source = ResDataPath.GetItemQualityName(0)
		} else {
			this.lbLv.text = "Lv." + _data.level
			this.imgIcon.visible = true
			let config = GlobalConfig.ins().ItemConfig[_data.item]
			this.imgIcon.source = ResDataPath.GetItemFullPath(config.icon)
			this.imgBg.source = ResDataPath.GetItemQualityName(config.quality)
		}
		this.imgRed.visible = GameGlobal.DestinyController.mRedPoint.IsRedUp(index)
	}

	private onClick(e: egret.TouchEvent) {
		ViewManager.ins().open(DestinyEquipLayer, this.data, this.index, true)
	}
}

