class KaiFuTargetUpLevelPanel extends KaiFuTargetBasePanel
{
    private value_txt: eui.Label
	public constructor()
    {
        super()
        this.activityType = ActivityKaiFuFuncType.ACT_1_Upgrade
        this.skinName = "KaiFuTargetUpLevelPanelSkin";
    }
	
    public UpdateContent() 
    {
        super.UpdateContent();
        this.value_txt.text = "当前等级："+ GameGlobal.actorModel.level 
	}
}
