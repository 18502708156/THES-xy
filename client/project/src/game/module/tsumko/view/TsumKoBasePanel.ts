/**
 81难-生死劫(小关卡选择界面)
 */
// TsumKoBaseSkin.exml
class TsumKoBasePanel extends BaseEuiView implements ICommonWindow
{
	public static LAYER_LEVEL = LayerManager.UI_Main;
	private shopBtn:eui.Button;//商店 
	private recordLabel:eui.Label;//查看记录
	
	private countLabel:eui.Label;//人数
	private commonWindowBg: CommonWindowBg;//背景框
	private title0:eui.Label;//標題0
	private itemList:eui.List;//itemList
	private title1:eui.Label;//標題2

	//选择关卡介面
	private checkpointPanel:TsumKoCheckItemList;
	//扫荡介面
	private eliminatePanel:TsumKoBaseMoppingUpPanel;
	//挡板
	private baffleImg:eui.Group;
	//组队组件 
	private teamPanel:TsumKoBaseMemberPanel;

	public constructor()
    {
        super()
        this.skinName = "TsumKoBaseSkin";
		this.teamPanel.mModel=GameGlobal.TsumKoModel;
		this._AddClick(this.shopBtn,this._OnClick);
		this._AddClick(this.recordLabel,this._OnClick);
		this._AddClick(this.eliminatePanel.onceBtn,this._OnClick);

		this.teamPanel.checkBox0.addEventListener(egret.Event.CHANGE, this._OnClick, this);
		this.teamPanel.checkBox1.addEventListener(egret.Event.CHANGE, this._OnClick, this);

		this.observe(MessageDef.TEAM_UPDATE_LEAVE,this.removeChatID);

		// this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.updateModelView);

		this.observe(MessageDef.CHOICECHECKPOINT, this.updateModelView);
		this.observe(MessageDef.CHOICECHECKPOINT, this.updateShow);
	}
	public childrenCreated() 
	{
		this.teamPanel.mNotAutoJoint=true;
		this.teamPanel.SetTime(10,60);

	}

	public OnOpen(...param: any[]) 
	{
		this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle("八十一难");
		this.teamPanel.DoOpen(null)
		this.teamPanel.checkBox1.selected=GameGlobal.TsumKoModel.btnSign1?true:false;
		this.teamPanel.checkBox0.selected=GameGlobal.TsumKoModel.btnSign0?true:false;
		if(this.isTeaming()==true)
		{
			this.teamPanel.checkBox1.selected=true;
			this.teamPanel.checkBox0.selected=true;
		}
		// let count1=GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
		// let helpCount=GameGlobal.TsumKoBaseModel.info_helpReward;
		// if(helpCount==undefined)helpCount=0;
		// let count=count1-helpCount;
		// this.countLabel.text="("+count+"/"+count1+")";
		this.updateModelView();
		let defaultID=GameGlobal.TsumKoBaseModel.recordId;
		this.setLabel(defaultID);
		this.setItemList(defaultID);
		this.updateLabel();
	}

	

	private _OnClick(e: egret.TouchEvent)
	{
        switch (e.currentTarget) 
		{
			case this.shopBtn:
					ViewManager.ins().open(ShopLayer,[ShopController.EN_SHOP_BASHI]);
				break;
			case this.recordLabel:
				//ViewManager.ins().close(TsumKoBasePanel);
				ViewManager.ins().open(TsumKoBaseRecordPanel);
				// GameGlobal.TsumKoBaseModel2.Record(GameGlobal.TsumKoBaseModel2.recordId);
				break;
			case this.teamPanel.checkBox0:
                GameGlobal.TsumKoModel.btnSign0=this.teamPanel.checkBox0.selected;
                break;
			case this.teamPanel.checkBox1:
				GameGlobal.TsumKoModel.btnSign1=this.teamPanel.checkBox1.selected;
				break;
			case this.eliminatePanel.onceBtn:
				// this.updateModelView();
				let selectID=GameGlobal.TsumKoBaseModel.recordId;//選中ID
				this.isShowView(this.teamPanel);
				this.teamPanel.UpdateKey(GameGlobal.Config.DisasterFbConfig[selectID].id);
				this.setLabel(selectID);
				break;
		}
	}
	private updateLabel():void
	{
		let count1=GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
		let helpCount=GameGlobal.TsumKoBaseModel.info_helpReward;
		if(helpCount==undefined)helpCount=0;
		let count=count1-helpCount;
		this.countLabel.text="("+count+"/"+count1+")";
	}
	//更新顯示模塊
	private updateModelView():void
	{
		let selectID=GameGlobal.TsumKoBaseModel.recordId;//選中ID
		let config = GameGlobal.Config.DisasterFbConfig[selectID]
		if (!config) {
			return
		}


		let currentID=GameGlobal.TsumKoBaseModel.info_clear;//以前通關ID
		let selsectChapter=GameGlobal.TsumKoBaseModel.chapterid;//選中的章節
		if(this.isTeaming()==false)//未組隊的情況
		{
			if(GameGlobal.TsumKoBaseModel.chatXiD==0)//不對話ID
			{
				if(selectID>currentID+1)//未通關
				{
					this.isShowView(this.baffleImg);
				}
				else
				{
					if(selectID>currentID)//首通
					{
						this.isShowView(this.teamPanel);
						this.teamPanel.UpdateKey(config.id);
						this.setLabel(selectID);
					}
					else
					{
						let id=config.sectionid;
						if(GameGlobal.TsumKoBaseModel.IsClearance(selsectChapter,id)==true)//今日是否通關
						{
							this.isShowView(this.teamPanel);
							this.teamPanel.UpdateKey(config.id);
							this.setLabel(selectID);
						}
						else
						{
							this.isShowView(this.eliminatePanel);
						}
					}
				}
			}
			else
			{
				this.isShowView(this.teamPanel);
				this.teamPanel.UpdateKey(config.id);
				this.setLabel(selectID);
			}
		}
		else
		{
			this.isShowView(this.teamPanel);
			this.teamPanel.UpdateKey(config.id);
			this.setLabel(selectID);
		}
	}

	private updateShow()
	{
		let newId=GameGlobal.TsumKoBaseModel.recordId;
		this.setLabel(newId);
		this.setItemList(newId);
		this.updateLabel();
	}

	private setLabel(id:number):void
	{
		let chatXiD=GameGlobal.TsumKoBaseModel.chatXiD;
		this.title0.text=GameGlobal.Config.DisasterFbConfig[id].name
		if(chatXiD!=0)
		{
			this.title0.text=GameGlobal.Config.DisasterFbConfig[chatXiD].name
			this.title1.text=GameGlobal.Config.DisasterFbConfig[chatXiD].name;
			let chapterid=GameGlobal.TsumKoBaseModel.chapterid;
			if(chapterid!=0 &&chapterid!=Math.ceil(chatXiD/9))
				this.title0.text=GameGlobal.Config.DisasterFbConfig[chapterid*9-9+1].name;
			if(id!=chatXiD)
				this.title0.text=GameGlobal.Config.DisasterFbConfig[id].name
		}
		else
		{
			this.title1.text=GameGlobal.Config.DisasterFbConfig[id].name;
		}
	}

	//是否存在組隊
	private isTeaming():boolean
	{
		return GameGlobal.TsumKoModel.mTeamInfo.HasTeam()?true:false;
	}

	private  setItemList(id):void
	{
		this.itemList.itemRenderer=ItemBase;
		this.itemList.dataProvider = new eui.ArrayCollection([]);
		this.itemList.dataProvider= new eui.ArrayCollection(GameGlobal.Config.DisasterFbConfig[id].showdrop);
	}

	//顯示其中一個介面
	private isShowView(view)
	{
		this.eliminatePanel.visible=false;
		this.teamPanel.visible=false;
		this.baffleImg.visible=false;
		view.visible=true;
	}

	//離開隊伍 chatX清0
	public removeChatID()
	{
		GameGlobal.TsumKoBaseModel.chatXiD=0;
	}
	


	public OnClose() 
	{
		this.commonWindowBg.OnAdded(this);
		if(GameGlobal.TsumKoModel.mTeamInfo.HasTeam()==false)
			GameGlobal.TsumKoBaseModel.chatXiD=0;
		this.teamPanel.DoClose()
		// this.T1.DoClose()
	}
	
}

class TsumKoBaseMemberPanel extends TeamBaseMemberView
{
	//skinName 
	//TsumKoBaseMemberSkin.exml

	checkBox1:eui.CheckBox;
	checkBox0:eui.CheckBox;
	btnCulture:eui.Button;
	public constructor()
    {
        super()
        this.skinName = "TsumKoBaseMemberSkin";
		//this.checkBox1.label = this.mTime.mAutoOpen + TeamBaseMemberView.LABEL.FULL_OPEN2
	}

}
