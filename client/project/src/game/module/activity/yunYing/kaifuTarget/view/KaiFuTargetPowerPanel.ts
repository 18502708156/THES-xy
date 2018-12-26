class KaiFuTargetPowerPanel extends KaiFuTargetBasePanel
{
    private value_txt: eui.Label
    
	public constructor()
    {
        super()
        this.activityType = ActivityKaiFuFuncType.ACT_20_RechargeGroupon
        this.skinName = "KaiFuTargetPowerPanelSkin";
    }
    
    public UpdateContent() 
    {
        super.UpdateContent();
        this.value_txt.text = "当前战力："+ CommonUtils.overLength( GameGlobal.actorModel.power)
	}

}
