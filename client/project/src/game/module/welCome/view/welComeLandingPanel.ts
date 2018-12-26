/**
 * 欢迎登陆_
 */
class WelComeLandingPanel extends BaseEuiView 
{

    public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // welComeLandingSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected com: eui.Component;
    protected gotoImg: eui.Group;
    protected item0: ItemBaseNotName;
    protected item1: ItemBaseNotName;
    protected effGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	protected _resources = ["ui_xsyd_bg", "xinshouyindao_json"]

	public initUI() {
		super.initUI()

		this.skinName = "welComeLandingSkin";
		this._AddClick(this.gotoImg,this._onclick);
        this._AddClick(this.com,this._onclick);
    }

	public OnOpen(...param: any[]) {
		// let tab=GameGlobal.Config.GuideBaseConfig;
        // this.item0.setItemData(tab.givepet);
        // this.item1.setItemData(tab.givebyuan);

		GameGlobal.GuideUtil.Finish(this, this.gotoImg)
	}

	private _onclick(e: egret.TouchEvent)
	{
		// this.CloseSelf()
		this.Play()
	}

	private Play() {
		this.touchEnabled = false
		this.touchChildren = false
		egret.setTimeout(this.CloseSelf, this, 350)

		let item = new GoldFlyEff(); 
		item.mGap=50; 
		item.mCount=16; 
		item.mMax=16; 
		item.mSource="ui_bm_qianb3";

		let pos = egret.$TempPoint
		DisplayUtils.GetGlobalPos(this.effGroup, pos)

		let targetPos = new egret.Point
		targetPos.x = 561
		targetPos.y = 0
		let view = ViewManager.ins().getView(MainTopPanel) as MainTopPanel
		if (view) {
			DisplayUtils.GetGlobalPos(view.byb, targetPos as any)
		}
		
		item.Play(new egret.Rectangle(pos.x, pos.y, this.effGroup.width, this.effGroup.height), targetPos.x, targetPos.y)
	}

	public OnClose() {
		GameLogic.SendWelcome();
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MAIN_TASK)
	}
}