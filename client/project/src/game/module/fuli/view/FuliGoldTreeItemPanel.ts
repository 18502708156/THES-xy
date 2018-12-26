/**
 * 福利_搖錢樹-道具弹窗
 */
class FuliGoldTreeItemPanel extends BaseEuiView
{
	//skinName
	//FuliGoldTreeItemSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup;
	
	//BG
	private commonDialog: CommonDialog;
	//描述Label
	private describeLabel:eui.Label;
	private describeLabel2:eui.Label;
	//okBtn
	private okBtn:eui.Button;
	//宝箱配置表
	private Tab_CashCowBoxConfig;
	//itemList
	private itemList:eui.List;

	public constructor()
    {
        super()
        this.skinName = "FuliGoldTreeItemSkin";
    }
	
	public childrenCreated() 
    {
		this._AddClick(this.okBtn,this._OnClick);
		this.Tab_CashCowBoxConfig=GameGlobal.Config.CashCowBoxConfig;
		this.itemList.itemRenderer=ItemBase;
		this.itemList.dataProvider=new eui.ArrayCollection([]);
    }

	public OnOpen(index,needCount)
    {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		// this.commonDialog.dialogMask.alpha=0;
		this.commonDialog.title = "金币宝箱";
		this.describeLabel2.visible=false;
		// let lv=GameGlobal.FuliModel.FuliData.level+1;
		// let shakeCount=GameGlobal.FuliModel.FuliData.shake;
		// let maxCount=GameGlobal.Config.CashCowAmplitudeConfig[lv].needExp;
		//needCount=maxCount-shakeCount;


		let item=this.Tab_CashCowBoxConfig[index+1].box;
		let count=this.Tab_CashCowBoxConfig[index+1].time;
		this.describeLabel.textFlow=(new egret.HtmlTextParser).parser
		("<a color=0x6E330B>今日使用摇钱树</a><a color=0x00AD00>" + needCount +"次</a><a color=0x6E330B>,可额外获得:</a>");
		if(needCount<=0)
		{	
			this.describeLabel.visible=false;
		}
		if(GameGlobal.FuliModel.FuliData.drawBin[2]==4)
		{
			this.describeLabel2.visible=true;
		}
		this.itemList.dataProvider=new eui.ArrayCollection(item);
		// if(GameGlobal.FuliModel.FuliData.drawBin[index-1]==3)
		// 	this.okBtn.label="领取";
		// else
		// 	this.okBtn.label="确定";
		
	}
	
	private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.okBtn:
				ViewManager.ins().close(FuliGoldTreeItemPanel);
            break;
        }
    }

    public OnClose() 
	{
		this.commonDialog.OnRemoved()
	}
}