class UpLvWayMainPanel2 extends BaseView implements ICommonWindowTitle
{
	//SkinName
	//UpLvWayViewSkin
	
	protected list:eui.List;//Item_list
	protected data:any;
	protected Type=0;
	//进度条
	private rewardBar:eui.ProgressBar;
	//宝箱
	private item0:ItemBase;
	private item1:ItemBase;
	private item2:ItemBase;
	private item3:ItemBase;

	private group0:eui.Group;
	private group1:eui.Group;
	private group2:eui.Group;
	private group3:eui.Group;
	//已领取
	private receiveImg0:eui.Image;
	private receiveImg1:eui.Image;
	private receiveImg2:eui.Image;
	private receiveImg3:eui.Image;

	private img01:eui.Image;
	private img02:eui.Image;
	private img03:eui.Image;
	private img04:eui.Image;

	//积分
	private scoreLabel:eui.Label;
	//盒子数量
	private boxCount=4;
	//我要变强_周奖励表
	private RewardConfig:any;
	//我要变强_基础表
	private BaseConfig:any;
	//我要变强_表
	private MethodConfig:any;
	private TabID=0;

	public constructor()
    {
		super()
        this.skinName = "UpLvWayViewSkin";
		this.MethodConfig=GameGlobal.Config.BianQiangMethodConfig;
		this.BaseConfig=GameGlobal.Config.BianQiangBaseConfig;
		this.RewardConfig=GameGlobal.Config.BianQiangRewardConfig;
		
		this._AddClick(this.item0,this._onclick);
		this._AddClick(this.item1,this._onclick);
		this._AddClick(this.item2,this._onclick);
		this._AddClick(this.item3,this._onclick);
    }

	public UpdateContent()
	{
	
	}

	public childrenCreated():void
	{
		this.list.itemRenderer=UpLvWayItem;
		this.list.dataProvider=new eui.ArrayCollection([]);
	}

	public OnOpen():void
	{
		this.rewardBar.slideDuration=0;
		// GameGlobal.BossModel.sendCallVipBossList()
		// GameGlobal.BossModel.sendCallFieldBossList()
		// this.observe(MessageDef.PUBLIC_BOSS_UPDATE, this.UpdateList)
		// this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateList)
		this.observe(MessageDef.UPLVWAY_ACQUIRE_ITEM,this.changeBar);
		
		let list=[];
		list=this.tabConfigList(this.MethodConfig);
		this.list.dataProvider=new eui.ArrayCollection(list);
		for(let i=0;i<this.boxCount;i++)
		{
			//this["receiveImg"+i].visible=false;
			this["item"+i].setItemData(this.RewardConfig[i+1].rewards[0]);
		}
		this.changeBar();
		//this.updateScore();
		this.itemEffShow();
	}	

	private _onclick(e:egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.item0:
				this.TabID=1;
				if(GameGlobal.UpLvWayModel.score>=this.RewardConfig[this.TabID].points)
                {
					// UIHelper.SetBtnEffe(this.item0,"ui_zhy001",false,1,1,55,55);
					if (this.eff) {
						this.eff.visible=false;
					}
					GameGlobal.UpLvWayModel._Reward(this.TabID);
				}
                break;
			case this.item1:
				this.TabID=2;
				if(GameGlobal.UpLvWayModel.score>=this.RewardConfig[this.TabID].points)
				{
					if (this.eff) {
						this.eff.visible=false;
					}
					GameGlobal.UpLvWayModel._Reward(this.TabID);
				}
				break;
			case this.item2:
				this.TabID=3;
				if(GameGlobal.UpLvWayModel.score>=this.RewardConfig[this.TabID].points)
				{
					if (this.eff) {
						this.eff.visible=false;
					}
					GameGlobal.UpLvWayModel._Reward(this.TabID);
				}
				break;
			case this.item3:
				this.TabID=4;
				if(GameGlobal.UpLvWayModel.score>=this.RewardConfig[this.TabID].points)
				{
					if (this.eff) {
						this.eff.visible=false;
					}
					GameGlobal.UpLvWayModel._Reward(this.TabID);
				}
				break;
        }
    }

	//设置进度条
	private changeBar():void
	{
		this.rewardBar.maximum=this.BaseConfig.maxvalue;

		let score = GameGlobal.UpLvWayModel.score
		this.rewardBar.value=score;

		for (let i = 1; i <= this.boxCount; i++) {
			let img = this["img0" + i] as eui.Image
			if (img) {
				img.source = score >= (i * 25) ? "ui_fb_bm_xiaodian01" : "ui_fb_bm_xiaodian02"
			}
		}

		for(let i=0;i<this.boxCount;i++)
		{
			this["receiveImg"+i].visible=false;
			if(GameGlobal.UpLvWayModel.rewards[i]!=undefined)
			{
				if(GameGlobal.UpLvWayModel.rewards[i]==i+1)
				{
					this["receiveImg"+i].visible=true;
				}
			}
		}
		this.updateScore();
	}
	//积分
	private updateScore():void
	{
		this.scoreLabel.text=GameGlobal.UpLvWayModel.score.toString();
	}

	//获取列表
	private tabConfigList(tab):any[]
	{
		let list=[];
		let arr=[];
		for(let key in tab)
		{
			if(this.Type==tab[key].type)
			{
				let openid=tab[key].openid;
				if(Deblocking.Check(openid, true))	
					arr.push(tab[key]);
			}
		}
		return arr;
	}
	//展示道具特效
	private itemEffShow():void
	{
		let score=GameGlobal.UpLvWayModel.score;
		for(let i=this.boxCount;i>0;i--)
		{
			if(score>=this.RewardConfig[i].points && GameGlobal.UpLvWayModel.rewards.indexOf(i)==-1)
			{
				let itemNum=i-1;
				this.showEff(this["item"+itemNum],itemNum);
				break;
			}
		}
	}
	private eff:MovieClip;
	private showEff(item,itemNum):void
    {
        this.eff = new MovieClip;
        this.eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_005"), true, 0);
        // this.eff.x = item.x-27;
        // this.eff.y = item.y+113;
		this.eff.x = item.x+40;
		this.eff.y = item.y+38;
        this.eff.scaleX =1.2;
        this.eff.scaleY =1.2;
        this["group"+itemNum].addChild(this.eff);
	}
	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}
	
}

class X1Panel extends UpLvWayMainPanel2 
{
	public static NAME = "我要变强"
	protected Type=0;
}

class X2Panel extends UpLvWayMainPanel2 
{
	public static NAME = "我要升级"
	protected Type=0;
}
class X3Panel extends UpLvWayMainPanel2 
{
	public static NAME = "我要材料"
	protected Type=0;
}