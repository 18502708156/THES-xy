class PetXilianTipPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // PetXilianTip2Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected petName: eui.Label;
    protected descTxt: eui.Label;
    protected refreshCount: eui.Label;
    protected tipLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.SetSkinName()
		this._AddClick(this, this.CloseSelf)
	}

	protected SetSkinName() {
		// this.skinName = "PetXilianTipSkin"
		this.skinName = "PetXilianTip2Skin"
		
	}

	// 0 名字， 1 描述， 2 次数， 3 名字颜色
	public OnOpen(...param: any[]) {
		this.descTxt.text = param[1];
		this.refreshCount.text = param[2];
		this.petName.text = param[0];
		this.petName.textColor = param[3];

		let configList = param[4]
		let item1 = ""
		let item2 = ""
		if (configList) {
			let data1 = configList[0].itemId
			let data2 = configList[1].itemId
			item1 = GameGlobal.Config.ItemConfig[data1].name
			item2 = GameGlobal.Config.ItemConfig[data2].name
		}
		this.tipLabel.text = `刷新的次数越多，获得高品质技能概率越大\n使用【${item1}】洗练，洗练次数可增加1次\n使用【${item2}】洗练，洗练次数可增加10次`
	}

	public OnClose() {

	}
}

// class LingtongXilianTipPanel extends PetXilianTipPanel {

// 	protected SetSkinName() {
// 		this.skinName = "PetXilianTip2Skin"
// 	}
// }