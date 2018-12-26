/**
 * 系统预告
 */
class FateMainPanel extends BaseEuiView implements ICommonWindow 
{

	//skinName
	//FateMainSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup

	//描述文本
	private describeLab:eui.Label;
	//确定按钮
	private exchangeBtn:eui.Button;
    //logo
	// private logoImg:eui.Image;
	//Bg
    private commonDialog:CommonDialog;
    //itemList
    private itemList:eui.List;
    //模型
    private fateModelItem:FateModelItemPanel;
	//Tab
    //功能预告表
	private funcNoticeConfigTab:any;	
	

	public constructor() {
		super()
		this.skinName = "FateMainSkin"; 
	}

	public childrenCreated() 
    {
		this.commonDialog.OnAdded(this);
		this.commonDialog.showReturnBtn(false);
		this.commonDialog.title="功能预告";
        this._AddClick(this.exchangeBtn,this.onClick);
	

		this.funcNoticeConfigTab=GameGlobal.Config.FuncNoticeConfig;
		
		
    }

	OnOpen(id) 
	{
         this.itemList.itemRenderer=ItemBase;
         this.itemList.dataProvider=new eui.ArrayCollection([]);
         this.describeLab.text="";
         if(id!=0)
         {
            if(id!=0)
            {
                this.itemList.dataProvider=new eui.ArrayCollection(this.funcNoticeConfigTab[id].reward);
            }
            let arr=this.funcNoticeConfigTab[id].openLv;
             let str=this.funcNoticeConfigTab[id].des3;
            if(arr[0]==1)
            {
                
                this.describeLab.text=str.replace("%s",arr[1]);
            }
            else if(arr[0]==2)
            {
                
                this.describeLab.text=str.replace("%s",arr[1]);
            }
            else if(arr[0]==3)
            {
                // let number=0;
                // if(GameGlobal.UserTask.mainTaskData!=undefined)
                // {
                //     if(GameGlobal.UserTask.mainTaskData[0]!=undefined)
                //     {
                //         if(GameGlobal.UserTask.mainTaskData[0].id!=undefined)
                //             number=arr[1]-GameGlobal.UserTask.mainTaskData[0].id;
                //     }
                // }
                this.describeLab.text=str.replace("%s",arr[1]);
            }
         }
        this.fateModelItem.typeView=1;
        let modelType=this.funcNoticeConfigTab[id].type;
        let pid=this.funcNoticeConfigTab[id].pid;
        if(pid!=undefined)
        {
           
            if(pid[1]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[id].pid[0],this.funcNoticeConfigTab[id].pid[1]);
            else if(pid[0]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[id].pid[0]);
            else
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[id].pid);

        }
	}

	OnClose() {
		this.commonDialog.OnRemoved();
		
	}

	update()//arr: Sproto.sc_raid_chapter_offline_reward_request) 
	{
		
	}

	onClick(e:egret.TouchEvent) 
	{
		switch (e.currentTarget) 
        {
			case this.exchangeBtn:
				ViewManager.ins().close(FateMainPanel);
			    break;
		}
	}
}




