/**
 * 八十一难 选择关卡列表
 */
class TsumKoCheckItemList extends BaseView 
{
    // TsumKoCheckItemListSkin.exml

    private checkpointList:eui.List;//关卡列表
	private beforeBtn:eui.Button;//上一页按钮
	private nextBtn:eui.Button;//下一页按钮
	private listCtrl: ListLRBtnCtrl//list滑动

	private chapterid=0;


	public constructor()
    {
        super()
	}

    public childrenCreated() 
	{
		this.chapterid=GameGlobal.TsumKoBaseModel.chapterid;
		this.listCtrl = new ListLRBtnCtrl(this.checkpointList, this.beforeBtn, this.nextBtn, 214);
		this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST,this.defaultValue);
		this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.updateList);
		this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.listDefaultPos);
		this.checkpointList.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onclick,this);
		this.listShow();
	}

	private updateList()
	{
		UIHelper.ListRefresh(this.checkpointList);
	}

	private listShow()
	{
		let list=[];
		let beganId=(this.chapterid-1)*9+1;
		for (let i=0; i<9; i++)
		{
			let config = GameGlobal.Config.DisasterFbConfig[beganId+i]
			list.push(config)
		}
		this.checkpointList.itemRenderer=TsumKoCheckpointListItem;
        this.checkpointList.dataProvider=new eui.ArrayCollection(list);
		let defaultId=this.defaultValue();
		// let index=defaultId-1;
		// this.selectedIndex(index);
		this.listDefaultPos();
		this.setListPos(defaultId);
		GameGlobal.TsumKoBaseModel.Record(defaultId);
		GameGlobal.TsumKoBaseModel.recordId=defaultId;
	}

	private listDefaultPos()
	{
		let defaultId=this.defaultValue();
		GameGlobal.TsumKoBaseModel.recordId=defaultId;
		MessageCenter.ins().dispatch(MessageDef.CHOICECHECKPOINT);
		if(GameGlobal.TsumKoBaseModel.isCurBuy==false && GameGlobal.TsumKoBaseModel.isCurClear==false)
		{	
			this.setListPos(defaultId);
		//let id=defaultId;
			// this.selectedIndex(defaultId);
		}
		this.selectedIndex(defaultId);
	}

	private onclick(e:eui.ItemTapEvent)
	{
		let id=this.chapterid*9-9+e.itemIndex+1;
		this.selectedIndex(id);
		GameGlobal.TsumKoBaseModel.recordId=id;
		MessageCenter.ins().dispatch(MessageDef.CHOICECHECKPOINT);
		GameGlobal.TsumKoBaseModel.Record(GameGlobal.TsumKoBaseModel.recordId);
	}

	//設置選中
	private selectedIndex(id:number)
	{
		let newindex=0;
		if(id>0&&id%9!=0) newindex=Math.ceil(id%9);
		else newindex=id-(id/9-1)*9;
		
		if(newindex-1<=0) newindex=0;
		else newindex-=1;
		this.checkpointList.selectedIndex=newindex;
	}

	//默認值
	private defaultValue():number
	{
		let id=0;
		if(GameGlobal.TsumKoBaseModel.chatXiD==0)
		{
			let nowId=GameGlobal.TsumKoBaseModel.info_clear+1;
			id=nowId;
			let nowChapterid=Math.ceil(nowId/9);
			if(nowChapterid!=GameGlobal.TsumKoBaseModel.chapterid)//不是選擇當前 在打的章節
			{
				id=this.chapterid*9-9+1;//默認第一個
			}
			if(id<=0) id=1;
		}
		else
			id=GameGlobal.TsumKoBaseModel.chatXiD;
		return id;
	}

	//移動位置
	public setListPos(id:number):void
	{
		this.checkpointList.validateNow();
		let num=id-this.chapterid*9;
		if(num<=0) num=id-(this.chapterid-1)*9;
		if(num<9 && num>=6)
			this.checkpointList.scrollH=1258;
		else if(num<6 && num>=3)
			this.checkpointList.scrollH=629;
		else if(num<3)
			this.checkpointList.scrollH=0;
	}
}


