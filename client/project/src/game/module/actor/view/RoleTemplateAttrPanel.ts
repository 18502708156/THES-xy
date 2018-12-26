class RoleTemplateAttrPanel  extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	
    /////////////////////////////////////////////////////////////////////////////
    // RoleRideAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected powerLabel: PowerLabel;
    protected levelAttr: eui.Label;
    protected equipAttr: eui.Label;
    protected skinLabel: eui.Label;
    protected skinAttr: eui.Label;
    protected drugAttr: eui.Label;
    protected skillAttr: eui.Label;
    protected showPanel: PetShowPanel;
    protected ridePanel: RideShowPanel;
    protected roleShowPanel: RoleShowPanel;
    /////////////////////////////////////////////////////////////////////////////

	protected mModel: UserTemplate


	public constructor() {
		super()
		this.skinName = "RoleRideAttrSkin"
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0] as UserTemplate
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = param[1]
		let pid = param[2]
		var art =  param[3]

		if(!art)
		{
			let attr1 = this.mModel.GetCurAttr()
			// this.levelAttr.textFlow = AttributeData.GetAttrTabString(attr1)
			this.changeLaber(attr1);
			let attr2 = this.mModel.GetCurEquipAttr()
			if (attr2 && attr2.length) {
				this.equipAttr.textFlow = AttributeData.GetAttrTabString(attr2)
			} else {
				UIHelper.SetVisible(this.equipAttr.parent, false)
			}
			this.equipAttr.textFlow = AttributeData.GetAttrTabString(attr2)
			let attr3 = this.UpdateSkinLabel()
			let attr4 = this.mModel.GetCurDrugAttr()
			this.drugAttr.textFlow = AttributeData.GetAttrTabString(attr4)

			let attr5 = this.UpdateSkillLabel()

			let power = 0
			power += ItemConfig.CalcAttrScoreValue(attr1)
			power += ItemConfig.CalcAttrScoreValue(attr2)
			power += ItemConfig.CalcAttrScoreValue(attr3)
			power += ItemConfig.CalcAttrScoreValue(attr4)
			power += ItemConfig.CalcAttrScoreValue(attr5)
			this.powerLabel.text = power
		}
		else
		{
			this.currentState = "active"
			this.levelAttr.textFlow = AttributeData.GetAttrTabString(art)
			this.powerLabel.text =  ItemConfig.CalcAttrScoreValue(art)
		}
		this.ShowModel(pid)
	}

	//更改文本描述
	private changeLaber(attr1)
	{
		let att=[];
		let num=0;
		num=GameGlobal.UserTitle.GetAddAttrRate(this.mModel.mTemplateType);
		for(let i=0;i<attr1.length;i++)
		{
			let pow=0;
			if(attr1[i].value!=undefined)
				pow=attr1[i].value;
			att.push({type:attr1[i].type, value: Math.floor(pow+pow*num)})
		}
		this.levelAttr.textFlow = AttributeData.GetAttrTabString(att);
	}

	protected UpdateSkillLabel() {
		let attr5 = this.mModel.GetCurSkillAttr()
		if (attr5 && attr5.length) {
			this.skillAttr.textFlow = AttributeData.GetAttrTabString(attr5)
		} else {
			UIHelper.SetVisible(this.skillAttr.parent, false)
		}
		return attr5
	}

	protected UpdateSkinLabel() {
		let attr3 = this.mModel.GetCurDressAttr()
		if (attr3 && attr3.length) {
			this.skinAttr.textFlow = AttributeData.GetAttrTabString(attr3)
		} else {
			UIHelper.SetVisible(this.skinAttr.parent, false)
		}
		return attr3
	}

	protected ShowModel(pid) {
		if (this.mModel.mTemplateType == UserTemplate.TYPE_RIDE) {
			this.ridePanel.SetBodyId(pid)
		} else {
			this.showPanel.SetBody(AppearanceConfig.GetUIPath(pid))
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}