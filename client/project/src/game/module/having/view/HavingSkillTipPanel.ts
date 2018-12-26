class HavingSkillTipPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // HavingSkillTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected descTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "HavingSkillTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		/**1 玄女， 2 天神 */
		let type = param[0];
		let str = '';
		if(1 == type) {
			str = '被动技能是由玄女法器洗出技能后获得';
		}
		else if(2 == type) {
			str = '被动技能是由天神突破天赋技能后获得';
		}
		this.descTxt.text = str;
	}
}