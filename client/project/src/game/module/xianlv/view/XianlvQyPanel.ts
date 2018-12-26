class XianlvQyPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // XianlvQySkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected levelLabel: eui.Label;
    protected curGroup: eui.Group;
    protected curValue: eui.Label;
    protected nextGroup: eui.Group;
    protected nextValue: eui.Label;
    protected infoGroup: eui.Group;
    protected conLabel: eui.Label;
    protected curAllLevel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "XianlvQySkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen() {
		let model = GameGlobal.XianlvModel
		let allLevel = model.GetAllLevel()
		let config = GameGlobal.Config.partnerFreshSkillConfig
		let level = 0
		for (let i = 1; i < 99; i++) {
			let configData = config[i]
			if (!configData) {
				break
			}
			if (allLevel < configData.lv) {
				break
			}
			level = i
		}
		if (level < 1) {
			UIHelper.SetVisible(this.curGroup, false)
		} else if (level >= model.MAX_QY_LEVEL) {
			UIHelper.SetVisible(this.nextGroup, false)
		} else {
		}
		let configData = config[level]
		if (configData) {
			this.levelLabel.textFlow = TextFlowMaker.generateTextFlow("等级|C:0x019704:&T:" + configData.lv + "|")
			this.curValue.text = AttributeData.getAttStr(configData.attrs, 1)
		} else {
			this.levelLabel.textFlow = TextFlowMaker.generateTextFlow("|C:0x019704:&T:未激活|")
		}
		let nextConfigData = config[level + 1]
		if (nextConfigData) {
			this.nextValue.text = AttributeData.getAttStr(nextConfigData.attrs, 1)
			this.conLabel.textFlow = TextFlowMaker.generateTextFlow("仙侣总等阶达到|C:0x019704:&T:" + nextConfigData.lv + "阶|可激活")
			this.curAllLevel.text = "当前总等阶段：" + allLevel
		}
	}

	public OnClose() {

	}
}