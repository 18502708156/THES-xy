class XianlvSkillTipPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // XianlvSkillTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected mainGroup: eui.Group;
	protected bgImg: eui.Image;
    protected skillIcon: eui.Component;
    protected skillName: eui.Label;
    protected starNum: eui.Label;
    protected skillDesc: eui.Label;
	protected nextEff: eui.Label;
	protected nextSkillDesc: eui.Label;
	protected condition: eui.Label;
	protected condiDesc: eui.Label;
	protected curGroup: eui.Label;
	protected nextGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "XianlvSkillTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		let skillId = param[0]
		let nextSkillId = param[1]
		let starCount = Math.max(param[2], 1)
		PetSkillIconItem.SetContent(this.skillIcon as any, skillId, 0)
		this.skillName.text = PetConst.GetSkillName(skillId)
		this.skillDesc.text = PetConst.GetSkillDesc(skillId)
		this.starNum.text = starCount.toString()
		if (starCount >= GameGlobal.XianlvModel.MAX_STAR)
		{
			this.nextGroup.visible = false
			this.bgImg.$setHeight(280)
			this.curGroup.$setY(132)
			this.mainGroup.$setY(360)
			return
		}
		this.nextSkillDesc.text = PetConst.GetSkillDesc(nextSkillId)
		let str = "仙侣星级达到|C:0x2ECA22&T:" + (starCount+1) + "|星"
		this.condiDesc.textFlow = TextFlowMaker.generateTextFlow(str)
	}

	public OnClose() {
		
	}
}