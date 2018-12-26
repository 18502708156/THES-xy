/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 11:01
 * @meaning: 法宝图鉴详情
 * 
 **/

class TreasureShowPanel extends BaseView implements ICommonWindowTitle {


	tPanelData = [];//界面总体数据数据

	private listView:eui.List;


    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TreasureShowSkin"
        this.listView.itemRenderer = TreasureShowItem;
	}

	public childrenCreated() {
       
    }

	public OnOpen(...param: any[]) {

        this.UpdateContent()
	}

	public UpdateContent()
	{
		  if(this.tPanelData.length)
		  this.listView.dataProvider = new eui.ArrayCollection(this.tPanelData)
	}



	public setData(_type)
	{
 		this.tPanelData =  GameGlobal.TreasureModel.getShowConByType(_type)
	}


}



class TreasureShowFirPanel extends TreasureShowPanel
{
	public static readonly NAME = "传说";
	public OnOpen(...param: any[]) {
		this.setData(1)
        this.UpdateContent()
	}

};

class TreasureShowSecPanel extends TreasureShowPanel
{
	public static readonly NAME = "完美";
	public OnOpen(...param: any[]) {
		this.setData(2)
        this.UpdateContent()
	}	
	
};
class TreasureShowThrPanel extends TreasureShowPanel
{
	public static readonly NAME = "其它";
	public OnOpen(...param: any[]) {
		this.setData(3)
        this.UpdateContent()
	}		
}

