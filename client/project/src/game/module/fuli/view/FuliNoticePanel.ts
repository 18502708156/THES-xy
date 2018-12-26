/**
 * 福利公告
 */
class FuliNoticePanel extends BaseEuiView
{
	//skinName
	//FuliLvNoticeSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;
	
    // FuliLvNoticeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbNotice: eui.Label;
    /////////////////////////////////////////////////////////////////////////////



	public constructor()
    {
        super()
        this.skinName = "FuliLvNoticeSkin";
    }
	public childrenCreated() 
    {

    }
	public OnOpen()
    {
		this.UpdateContent()
	}
    public UpdateContent() 
    {
        let strText = GlobalConfig.ins().NoticeConfig[1].notice || ""
        this.lbNotice.textFlow = TextFlowMaker.generateTextFlow(strText);
	}
   

}