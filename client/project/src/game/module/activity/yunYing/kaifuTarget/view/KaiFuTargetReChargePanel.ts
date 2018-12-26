class KaiFuTargetReChargePanel extends KaiFuTargetBasePanel
{
    
	public constructor()
    {
        super()
        this.activityType = ActivityKaiFuFuncType.ACT_3_RechargeContinue
        this.skinName = "KaiFuTargetReChargePanelSkin";
    }
    protected _OnClick(e: egret.TouchEvent)
    {
        RechargeWin.Open();
    }
}
