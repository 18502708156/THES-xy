/**
 * 福利_搖錢樹-vip弹窗
 */
class FuliGoldTreeVipPanel extends BaseEuiView
{
	//skinName
	//FuliGoldTreeVIPCountSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup;
	
	//BG
	private commonDialog: CommonDialog;
	//描述Label
	private describeLabel:eui.Label;
	//okBtn
	private okBtn:eui.Button;
	private goBtn:eui.Button;

	public constructor()
    {
        super()
        this.skinName = "FuliGoldTreeVIPCountSkin";
    }

	public childrenCreated() 
    {
		this._AddClick(this.okBtn,this._OnClick);
		this._AddClick(this.goBtn,this._OnClick);
    }

	public OnOpen(str)
    {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "提 示";
		this.describeLabel.textFlow=(new egret.HtmlTextParser).parser (str);

	}
	
	private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.okBtn:
				ViewManager.ins().close(FuliGoldTreeVipPanel);
            break;
			case this.goBtn:
				ViewManager.ins().close(FuliGoldTreeVipPanel);
				ViewManager.ins().open(RechargeWin)
			break;
        }
    }

    public OnClose() 
	{
		this.commonDialog.OnRemoved()
	}
}