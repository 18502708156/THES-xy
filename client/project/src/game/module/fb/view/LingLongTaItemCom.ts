class LingLongTaItemCom extends eui.Component {
	public pass_img: eui.Image;
	public lvTxt: eui.Label;
	public itemList: eui.List;
	public totalLayer: number = 400;
	public showPanel: PetShowPanel;
	

	public constructor() {
		super();
		this.skinName = "LingLongTaItemSkin";
	}

	childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName;
	}

	onUpdate(data: LingLongTaModel, n: number): void {
		var config;
		let nowLy = data.layer ||0
		let baseLayer = Math.floor(nowLy/3)*3 
		config = GameGlobal.Config.WildgeeseFbConfig[baseLayer+n];
		if (config && config.id <= data.layer) {
			this.pass_img.visible = true;
		} else {
			this.pass_img.visible = false;
		}
		if (config) {
			this.visible = true
			this.lvTxt.text = "第" + config.id + "层";
			this.itemList.dataProvider = new eui.ArrayCollection(config.firstAwardshow);
			this.showPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.monsterId)))
		}
		else
		{
			this.visible = false
		}

	}
}