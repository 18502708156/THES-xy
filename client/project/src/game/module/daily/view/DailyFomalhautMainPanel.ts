/**
 * 师门任务 
 */
class DailyFomalhautMainPanel extends BaseView implements ICommonWindowTitle
{
    //SkinName
    //
    //DailyFomalhautMainSkin.exml
    //

    public static LAYER_LEVEL = LayerManager.UI_Main;
    public static NAME = "师门任务"
    
    //刷新时间Label
    private refreshTimeLabel:eui.Label;
    //怪物次数
    private monstersCountLabel:eui.Label;
    //进度条
    private progressBar:eui.ProgressBar;
    //进度条描述
    private tabLab:eui.Label;
    //一键完成
    private oneKeyBtn:eui.Button;
    //进入任务
    private taskBtn:eui.Button;
    //透明 進入任務
    private labBtn:eui.Label;
    //表
    private dailyBonusConfigTab:any;
    private dailyBaseConfigTab:any;
    //itemList
    private itemList:eui.List;
    
    private monsterInfo:MonsterInfo;
    //进入任务读表Id
    // private id=0;
    private index=0;
    // //玩家等级
    private playLv=0;

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.taskBtn
		}
	}

    public constructor()
    {
        super()
        // this.skinName = "DailyFomalhautMainSkin";

        this.playLv=GameGlobal.actorModel.level;

        let tabArr=GameGlobal.Config.DailyBonusConfig[1][0];
        let tabId=1;
        
        for(let i=0;i<tabArr.length;i++)
        {
            let arr=tabArr[i].level;
            if(arr.length==2)
            {
                if(this.playLv>=arr[0]&&this.playLv<=arr[1])
                {
                    tabId=i;
                    break;
                }
            }
            else
            {
                if(this.playLv>=arr[0])
                {
                    tabId=i;
                    break;
                }
            }
            
        }
        this.dailyBonusConfigTab=GameGlobal.Config.DailyBonusConfig[1][0][tabId];

        this.dailyBaseConfigTab=GameGlobal.Config.DailyBaseConfig;
        this.monsterInfo=GameGlobal.DailyModel.monsterInfo;
	}

    public childrenCreated() 
    {
        
        
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.getIndex);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateShow);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateBtn);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateTimeLabel);
        this.itemList.itemRenderer=ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);

        this._AddClick(this.taskBtn,this._OnClick);
        this._AddClick(this.oneKeyBtn,this._OnClick);
        this._AddClick(this.labBtn,this._OnClick);
    }
    public OnOpen(...param: any[])
    {

        
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyBonusConfigTab.itemid);
        //this.id=this.monsterInfo.monsterList[0];
        this.labBtn.visible=false;
        
        this.updateShow();
        this.updateBtn();
        this.updateTimeLabel();
        
	}
    public UpdateContent() 
    {
        
    }

    public _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.oneKeyBtn:
                if(this.monsterInfo.num>=this.dailyBaseConfigTab.monster)
                {
                    this.oneKeyBtn.label="领取奖励";
                    GameGlobal.DailyModel.SendGainAward(1,this.dailyBonusConfigTab.reward);
                }
                else
                {
                    this.oneKeyBtn.label="一键完成";
                    let item=this.dailyBaseConfigTab.monstercost[0];
                    let lostCount=this.dailyBaseConfigTab.monster-this.monsterInfo.num;
                    let needGold=item.count*lostCount;
                    WarnWin.show("是否花费"+needGold+" 元宝快速完成？",()=>{
                        if (Checker.Money(item.id,needGold))
                        {
                            GameGlobal.DailyModel.SendQuilkDone(1);
                        }
                    },this);
                }
                break;
            case this.taskBtn: 
                ViewManager.ins().open(DailyFomalhautTaskPanel,this.index);
                break;
            case this.labBtn:
                UserTips.ins().showTips("目前地图已无妖魔,请等待下次刷新");
                break;
        }
    }

    private getIndex():number
    {
        return 0;
    }
    private updateShow():void
    {
        //进度条
        this.progressBar.value=this.monsterInfo.num;
        this.progressBar.maximum=this.dailyBaseConfigTab.monster;
        this.tabLab.text="完成次数:"+this.monsterInfo.num+"/"+this.dailyBaseConfigTab.monster;

        this.monstersCountLabel.text=GameGlobal.DailyModel.monsterInfo.monsterList.length+"/"+this.dailyBaseConfigTab.monlimit;
        //this.refreshTimeLabel.text=DateUtils.format_1(this.monsterInfo.timeout*1000);
     }
     
     private updateBtn():void
     {
         if(this.monsterInfo.num>=this.dailyBaseConfigTab.monster)
        {
            this.oneKeyBtn.label="领取奖励";
            if(GameGlobal.DailyModel.IsGetItem()==true)
            {
                this.oneKeyBtn.enabled=false;
            }
        }
        else
        {
            this.oneKeyBtn.label="一键完成";
        }
        if(GameGlobal.DailyModel.monsterInfo.monsterList.length==0)
        {
            this.taskBtn.enabled=false;
            this.labBtn.visible=true;
        }
        else
        {
            this.taskBtn.enabled=true;
            this.labBtn.visible=false;
        }
     }
     //
     private updateTimeLabel():void
     {
         if(GameGlobal.DailyModel.monsterInfo.monsterList.length!=this.dailyBaseConfigTab.monlimit)
         {
             let time=this.monsterInfo.timeout-GameServer.serverTime;
             if(time<=0)
                this.refreshTimeLabel.text=DateUtils.format_1(0);
             else
                this.refreshTimeLabel.text=DateUtils.format_1(time*1000);
             TimerManager.ins().doTimer(1000,0, ()=>
             {
                 time=this.monsterInfo.timeout-GameServer.serverTime;
                 if(time<=0)
                    this.refreshTimeLabel.text=DateUtils.format_1(0);
                 else 
                    this.refreshTimeLabel.text=DateUtils.format_1(time*1000);
                if(GameServer.serverTime>=this.monsterInfo.timeout) //+1800
                {
                    TimerManager.ins().removeAll(this);
                    return;
                }
            }, this);
         }
         else
         {
             this.refreshTimeLabel.text=DateUtils.format_1(0);
         }
     }
    
}