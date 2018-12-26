/**
 * 组队_选择列表List
 */
class TeamCheckItemList extends eui.Component
{
    //SkinName
    //TeamCheckItemListSkin

    private checkpointList:eui.List;//关卡列表
	private beforeBtn:eui.Button;//上一页按钮
	private nextBtn:eui.Button;//下一页按钮
	private listCtrl: ListLRBtnCtrl//list滑动
	public m_Model: CrossTeamBaseModel
    public index=0;

    public childrenCreated() 
	{
        this.listCtrl = new ListLRBtnCtrl(this.checkpointList, this.beforeBtn, this.nextBtn, 214);
		this.checkpointList.dataProvider=new eui.ArrayCollection([])
		this.checkpointList.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onclick,this);
    }
//this.m_Model.index

    public showCheckItemList(index)
    {
        //this.m_Model=m_Model;
        this.index=index;
        let configList = this.m_Model.GetConfig();
		let list =[];
		let tabIndex=0;
		for(let key in configList)
		{
			let dic={};
			dic=configList[key];
			dic["model"]=this.m_Model;
			dic["index"]=tabIndex;
			list.push(dic);
			tabIndex++;
		}

        this.checkpointList.itemRenderer=TeamItemCom;
        this.checkpointList.dataProvider=new eui.ArrayCollection(list);
		if(this.m_Model.index==-1)
			this.checkpointList.selectedIndex=index;
		else
			this.checkpointList.selectedIndex=this.m_Model.index;
		this.setListPos(index);
    }

	private onclick(e:eui.ItemTapEvent)
	{
		this.m_Model.index=e.itemIndex;
	}
    //移動位置
	public setListPos(id:number):void
	{
		this.checkpointList.validateNow();
		let num=id//id-this.chapterid*9;
		// if(num<=0) num=id-(this.chapterid-1)*9;
		if(num<9 && num>=6)
			this.checkpointList.scrollH=1258;
		else if(num<6 && num>=3)
			this.checkpointList.scrollH=629;
		else if(num<3)
			this.checkpointList.scrollH=0;
	}
}