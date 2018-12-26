class DeityEquipDetailWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// DeityEquipDetailSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected labAttrTotal: eui.Label;
	protected labInjectAttr0: eui.Label;
	protected labInjectAttr1: eui.Label;
	protected labInjectAttr2: eui.Label;
	protected labInjectAttr3: eui.Label;
	protected groupNext: eui.Group;
	protected labNextTotalAttr: eui.Label;
	protected labInjectNextAttr0: eui.Label;
	protected labInjectNextAttr1: eui.Label;
	protected labInjectNextAttr2: eui.Label;
	protected labInjectNextAttr3: eui.Label;
	protected groupNum: eui.Group;
	protected labAwake0: eui.Label;
	protected labAwake1: eui.Label;
	protected labAwake2: eui.Label;
	protected labAwake3: eui.Label;
	protected labAwake4: eui.Label;
	protected labAwake5: eui.Label;
	protected labAwake6: eui.Label;
	protected labAwake7: eui.Label;
	protected labAwake8: eui.Label;
	protected labAwake9: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "DeityEquipDetailSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		this.SetInjectInfo()
		this.SetNextInjectInfo()
		this.SetDeityEquipNumInfo()
	}

	public OnClose() {

	}

	private SetInjectInfo() {
		let curInjectLv = GameGlobal.UserEquip.GetDeityEquipInjectLevel()
		let injectConfig = DeityEquipConst.GetCurInjectConfig(curInjectLv)
		let totalText = `注灵总等级：${curInjectLv}/${injectConfig.level}级`
		totalText = totalText + (curInjectLv >= injectConfig.level ? `(已激活)` : `(未激活)`)
		this.labAttrTotal.text = totalText

		let injectAttrs = injectConfig.attrpower
		for (let idx=0; idx<4; idx++)
		{
			let attr = injectAttrs[idx]
			this[`labInjectAttr${idx}`].visible = attr != null
			if (attr)
			{
				this[`labInjectAttr${idx}`].text = `${AttributeData.getAttrStrByType(attr.type)}: ${attr.value}`
			}
		}
	}

	private SetNextInjectInfo() {
		let curInjectLv = GameGlobal.UserEquip.GetDeityEquipInjectLevel()
		let nextInjectConfig = DeityEquipConst.GetNextInjectConfig(curInjectLv)
		if (!nextInjectConfig)
		{
			this.groupNext.visible = false
			this.groupNum.y = this.groupNext.y + 15
			return
		}

		this.labNextTotalAttr.text = `下一级: 需${nextInjectConfig.level}级`
		let injectAttrs = nextInjectConfig.attrpower
		for (let idx=0; idx<4; idx++)
		{
			let attr = injectAttrs[idx]
			this[`labInjectNextAttr${idx}`].visible = attr != null
			if (attr)
			{
				this[`labInjectNextAttr${idx}`].text = `${AttributeData.getAttrStrByType(attr.type)}: ${attr.value}`
			}
		}
	}

	private SetDeityEquipNumInfo() {
		let deityEquipNum = GameGlobal.UserEquip.GetDeityEquipNum()
		let textList = DeityEquipConst.GetDeityEquipActTextList(deityEquipNum)
		for (let idx=0; idx<10; idx++)
		{
			let text = textList[idx]
			this[`labAwake${idx}`].visible = text != null
			if (text)
			{
				 this[`labAwake${idx}`].textFlow = TextFlowMaker.generateTextFlow(text)
			}
		}
	}
}