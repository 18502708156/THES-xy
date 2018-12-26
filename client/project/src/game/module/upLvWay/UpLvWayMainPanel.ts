/**
 * 升级途径
 */
class UpLvWayMainPanel extends BaseEuiView implements ICommonWindow
{
	//skinName
    // UpLvWayMainSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup

	//BG
	private commonDialog:CommonDialog
	//Name
	private BgName="升级途径";
	//Lv
	// private lbSort:eui.BitmapLabel;

	//list
	private list:eui.List;

	public constructor() 
    {
		super()
		this.skinName="UpLvWayMainSkin";
		this.list.dataProvider=new eui.ArrayCollection([]);

	}




	public OnOpen(...param: any[]) 
	{
		this.commonDialog.OnAdded(this);
		this.commonDialog.title=this.BgName;

		// this.lbSort.text=GameGlobal.actorModel.level.toString();

		this.list.itemRenderer=UpLvWayItem;
		let list=[];

		for(let key in GameGlobal.Config.LevelMethodConfig)
		{
			let openid=GameGlobal.Config.LevelMethodConfig[key].openid;
			// if(GameGlobal.actorModel.level>=GameGlobal.Config.FuncOpenConfig[openid].conditionnum)
			// {
			if(Deblocking.Check(openid, true))	
				list.push(GameGlobal.Config.LevelMethodConfig[key]);
			// }

		
		}
		this.list.dataProvider=new eui.ArrayCollection(list);

	}

	public OnClose() 
	{
		this.commonDialog.OnRemoved();
	}
}




