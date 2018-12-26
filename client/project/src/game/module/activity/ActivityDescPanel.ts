class ActivityDescPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup;

	/////////////////////////////////////////////////////////////////////////////
    // ActivityTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tdesc: eui.Label;
	protected title:eui.Label
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ActivityTipSkin";
		this._AddClick(this, this.CloseSelf)
	}

	public static Show(desc: string, title: string) {
		let view = ViewManager.ins().open(ActivityDescPanel) as ActivityDescPanel
		view.SetDesc(desc, title)
	}

	OnOpen(...args: any[]) {
		let config = GameGlobal.Config.HelpInfoConfig[args[0]];
		if (config) {
			this.SetDesc(config.text, args[1] || config.title)
		}
	}

	private SetDesc(text: string, title: string) {
		this.tdesc.multiline = this.tdesc.wordWrap = true;
		this.tdesc.textFlow = TextFlowMaker.generateTextFlow(text);
		if(title){
           this.title.text = title
		}
	}
}