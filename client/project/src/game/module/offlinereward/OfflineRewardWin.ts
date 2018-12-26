/**
 * 离线奖励
 */
class OfflineRewardWin extends BaseEuiView implements ICommonWindow
{
	public static LAYER_LEVEL = LayerManager.UI_Popup
	//skinName
	//OfflineRewardSkin

	// //前往激活Btn
	// activationBtn:eui.Button;
	//确定按钮
	okBtn:eui.Button;
	//离线时间Lab
	time:eui.Label;
	//自动出售
	bagFull:eui.Label;
	//装备Lab
	label5:eui.Label;
	//前往按鈕
	open:eui.Button;

	protected _resources = ["lixianshouyi_json"]
 
	//Bg
    private commonDialog: CommonDialog;

	public constructor() {
		super()
	}
	
	public initUI() {
		super.initUI()
		this.skinName = "OfflineRewardSkin"; 
    }

	OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.showReturnBtn(false);
		this.commonDialog.title="获得奖励";
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.open.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		for (let i = 1; i <= 5; ++i) {
			this["label" + i].text = "0"
		}
		this.update(param[0]);
		if(GameGlobal.FuliModel.FuliData.month>0)
		{
			this.open.visible=false;
		}
		else
		{
			this.open.visible=true;
		}
	}

	OnClose() {
		this.commonDialog.OnRemoved();
		this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.open.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	update(arr: Sproto.sc_raid_chapter_offline_reward_request) {
		this.time.text = "离线时间：" + DateUtils.getFormatBySecond(arr.offlineTime, DateUtils.TIME_FORMAT_9);
		// this.exp.text = "" + arr.exp;
		// this.money.text = "" + arr.money;
		this.label5.text = "" + (arr.equipNum1 + arr.equipNum2)
		if (arr.equipNum2 == 0) {
			this.bagFull.visible = false;
		} else {
			this.bagFull.visible = true;
			this.bagFull.textFlow = (new egret.HtmlTextParser).parser("背包已满，自动出售<a color=0x00FF00>" + arr.equipNum2 + "</a>件装备");
		}
		if (arr.offlineData.length > 0) 
		{
			for (var i = 0; i < arr.offlineData.length; i++) 
			{
				var obj = arr.offlineData[i];
				let index = (obj.type * 2) - 1
				if (this["label" + index]) {
					this["label" + index].text = obj.gold
				}
				if (this["label" + (index + 1)]) {
					this["label" + (index + 1)].text = obj.exp
				}
			}
		}
	}

	onClick(e: egret.TouchEvent) 
	{
		switch (e.currentTarget) 
        {
			case this.okBtn:
				ViewManager.ins().close(this);
			break;
			case this.open:
				ViewManager.ins().close(OfflineRewardWin);
				RechargeWin.Open();
				//打开月卡介面
			break;
		}
	}
}

