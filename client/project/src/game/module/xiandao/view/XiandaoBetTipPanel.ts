class XiandaoBetTipPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoBetTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected loseDesc: eui.Label;
    protected winDesc: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "XiandaoBetTipSkin"
		this._AddClick(this, this.CloseSelf)
	}


	public OnOpen(...param: any[]) {
		let type = param[0]
		let config = GameGlobal.Config.XianDuMatchStakeBaseConfig[type + 1]
		if (!config) {
			return
		}
		this.winDesc.textFlow = TextFlowMaker.generateTextFlow(this.GetStr(config.rewardwin, config.pointswin))
		this.loseDesc.textFlow = TextFlowMaker.generateTextFlow(this.GetStr(config.rewardlose, config.pointslose))
	}

	private GetItemStr(data) {
		if (data.type == 0) {
			return MoneyConstToName[data.id] + "*" + data.count
		}
		let config = GameGlobal.Config.ItemConfig[data.id]
		return `|C:${Color.GetStr(ItemBase.QUALITY_COLOR[config.quality])}&T:${config.name}*${data.count}|`
	}

	private GetStr(items, point: number) {
		let list = []
		for (let data of items) {
			list.push(this.GetItemStr(data))
		}
		// return `可获得|C:${Color.GetStr(ItemBase.QUALITY_COLOR[4])}&T:天下第一积分*${point}|、${list.join('、')}`
		return `可获得${list.join('、')}`
	}

	public OnClose() {
		
	}
}