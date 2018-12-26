/**
 * 师门任务-领取任务界面
 */
class DailyFomalhautTaskPanel extends BaseEuiView implements ICommonWindow
{
    //SkinName
    //
    //DailyFomalhautTaskSkin.exml
    //
    public static LAYER_LEVEL = LayerManager.UI_Main;

    //当前位置
    private positionLaber:eui.Label;
    //回合
    private roundLaber:eui.Label;
    //星星组件
    private starGroup:eui.Group;
    //挑战Btn
    private challengeBtn:eui.Button;
    //添加按钮
    private addBtn:eui.Button;
    //表
    private dailyExpDungeonStarTab:any;
    //itemList
    private itemList:eui.List;
    //Bg
    private commonWindowBg:CommonWindowBg;
    //怪物模型
    private extraPanel:PetShowPanel;

    private refreshcost:any;

    private index=0;
    private id=1;
    public constructor()
    {
        super()
        this.skinName = "DailyFomalhautTaskSkin";
        this.dailyExpDungeonStarTab=GameGlobal.Config.DailyExpDungeonStar;
        
	}

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.challengeBtn
		}
	}

    public childrenCreated() 
    {

        this.itemList.itemRenderer=ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this._AddClick(this.addBtn,this._OnClick);
        this._AddClick(this.challengeBtn,this._OnClick);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.GetStar);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateItemList);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateMonster);
    }

    public OnOpen(index:number)
    {
        this.index=index;
        this.id=GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyExpDungeonStarTab[this.id].reward);
        this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle("师门任务");
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(this.dailyExpDungeonStarTab[this.id].showid))//显示怪物
        //位置
        let name=this.GetPosName();
        this.positionLaber.text=name;
        this.GetStar();
        if(this.dailyExpDungeonStarTab[this.id].star<7)
            this.refreshcost=this.dailyExpDungeonStarTab[this.id].refreshcost[0];
	}
    public UpdateContent() 
    {
        
        
    }
    
    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.addBtn:
               if(this.dailyExpDungeonStarTab[this.id].star<7)
               {
                   WarnWin.show("是否花费"+this.refreshcost.count+"绑元提升到满星？",()=>
                   {
							 if(Checker.Money(this.refreshcost.id,this.refreshcost.count)==true)
                            {
                                GameGlobal.DailyModel.SendUpStar(this.index+1);
                            }
				   },this);
                }
               else
               {
                   UserTips.ins().showTips("无法继续升星");
               }
            break;
            case this.challengeBtn:
                if (UserFb.CheckFighting()) 
                    GameGlobal.DailyModel.SendKoMonster(this.index+1);
            break;
        }
    }
    public OnClose() 
	{
		this.commonWindowBg.OnRemoved();
	}
    /**获取章节名字 */
    private GetPosName()
    {
        let name="";
        let userFb = GameGlobal.UserFb;
        userFb.chapterId
        let id=GameGlobal.Config.ChaptersRewardConfig[userFb.chapterId].mapid
        name=GameGlobal.Config.ChaptersMapConfig[id].name;
        return name;
    }
    /**获得回合数 */
    private Getround(id:number)
    {
        let tround=0;
        let fbid=GameGlobal.Config.ChaptersRewardConfig[id].dungeon;
        tround=GameGlobal.Config.ChaptersRewardConfig[fbid].totalTime;
        return tround;
    }
   //星星
    private GetStar()
    {
       this.id=GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
       let starCount =this.dailyExpDungeonStarTab[this.id].star;

       for (let i = 0; i < this.starGroup.numChildren; i++) {
			let item = this.starGroup.getChildAt(i) as eui.Image
			item.source = starCount > i ? "ui_bm_star022" : "ui_bm_star021"
		}
    }
    //刷新道具
    private updateItemList()
    {
        //this.monsterInfo.monsterList[0]
        let monsterIndex=GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyExpDungeonStarTab[monsterIndex].reward);
    }
    //刷新怪物
    private updateMonster():void
    {
        this.id=GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(this.dailyExpDungeonStarTab[this.id].showid));//显示怪物
    }
}