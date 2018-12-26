class DeityEquipItem extends eui.Component implements  eui.UIComponent {

	////////////////////////////////////////////
	// DeityEquipItemSkin.exml
	////////////////////////////////////////////
	protected item: ItemBaseNotName;
	protected redPoint: eui.Image;
	protected labLv: eui.Label;
	protected labDesc: eui.Label;
	////////////////////////////////////////////

	private mPos: number
	private mModel: Role

	public constructor() {
		super()
	}

	childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.OpenEquipDetails, this)
	}

	public SetItemInfo(data: EquipsData, pos: number, showName: boolean = false) {
		this.mPos = pos
		this.item.data = data.item

		if (!data.item.configID || !DeityEquipConst.IsDeityEquip(data.item.configID))
		{
			this.item.clear()
			this.item.setItemImg(ResDataPath.GetEquipDefaultGreyIcon(pos))
			this.labLv.text = ""
			this.labDesc.text = ""
			this.item.setItemCount(false)
			return
		}

		this.item.data = data.item
		if (showName)
		{
			this.labLv.text = data.item.itemConfig.name
			this.labDesc.text = `Lv.${data.item.itemConfig.level}`
			this.labLv.textColor = ItemBase.GetColorByQuality(data.item.itemConfig.quality)
		}
		else
		{
			this.labLv.text = `Lv.${data.item.itemConfig.level}`
		}
		
	}

	public SetItemConfigId(id) {
		this.item.data = id
		let config = GameGlobal.Config.ItemConfig[id]
		this.labLv.text = config ? config.name : ""
		this.labDesc.text = config ? `Lv.${config.level}` : ""

		if (config)
			this.labLv.textColor = ItemBase.GetColorByQuality(config.quality)
	}

	public UnshowDetail() {
		this.item.destruct()
	}

	public ChooseItem(b) {
		this.item.imgChoose.visible = b
	}

	public SetModel(m: Role) {
		this.mModel = m
	}

	public OpenEquipDetails() {
		if (!this.mModel || !this.item.data.configID || !DeityEquipConst.IsDeityEquip(this.item.data.configID))
			return

		ViewManager.ins().open(EquipUserDetailedWin, this.item.data.handle, this.item.data.configID, this.item.data, this.mModel)
	}
}