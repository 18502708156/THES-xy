class DestinyArrDescPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup;

    /////////////////////////////////////////////////////////////////////////////
    // DestinyArrTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected title: eui.Label;
    protected tdescL: eui.Label;
    protected tdescR: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "DestinyArrTipSkin";
		this._AddClick(this, this.CloseSelf)
	}

	public static Show(textL: string,textR: string, title: string) {
		let view = ViewManager.ins().open(DestinyArrDescPanel) as DestinyArrDescPanel
		view.SetDesc(textL,textR, title)
	}

	OnOpen(...args: any[]) {
		this.SetDesc(args[0]||"",args[1]||"",args[2] || "属性加成")
	}

	private SetDesc(textL: string,textR: string, title: string) {
		this.tdescL.multiline = this.tdescL.wordWrap = true;
		this.tdescR.multiline = this.tdescR.wordWrap = true;
		this.tdescL.textFlow = TextFlowMaker.generateTextFlow(textL);
		this.tdescR.textFlow = TextFlowMaker.generateTextFlow(textR);
		if(title){
           this.title.text = title
		}
	}
}