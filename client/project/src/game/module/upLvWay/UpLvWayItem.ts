class UpLvWayItem extends eui.ItemRenderer
{
	//skinName
	//UpLvWayItemSkin2

	//logoImg
	private logoImg:eui.Image;
	//starGroup
	private starGroup:eui.Group;
	//次数
	private countLabel:eui.Label;
	//titleNameLabel
	private titleNameLabel:eui.Label;
	//描述
	private describeLabel:eui.Label;
	//Btn
	private btn:eui.Button;
	//已完成Img
	private okImg:eui.Image;
	//奖励积分Label
	private rewardScore:eui.Label;
	private rewardStr="奖励积分:";

	TypeID=0;
	private BtnName="前往挑战";
	public childrenCreated()
    {
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			if(ViewManager.ins().isShow(UpLvWayMainPanel)==true)
				ViewManager.ins().close(UpLvWayMainPanel);
			if(ViewManager.ins().isShow(UpLvWayMainWin)==true)
				ViewManager.ins().close(UpLvWayMainWin);
			if(this.TypeID==1037)
				ViewManager.ins().open(DailyMainWin,1)
			else
				ViewManager.ins().Guide(this.TypeID);
		},this);
	}

	dataChanged()
    {
		let data=this.data;
		this.countLabel.visible=false;
		// this.okImg.visible=false;
		this.logoImg.source=data.icon;
		this.titleNameLabel.text=data.name;
		this.describeLabel.text=data.des;
		this.TypeID=data.taget;
		let starCount =data.start;
		this.rewardScore.visible=false;
		this.countLabel.textColor=0x6E330B;//灰色
		if(data.points!=undefined)
		{
			this.rewardScore.visible=true;
			this.rewardScore.text=this.rewardStr+data.points;
		}
		if(data.btnname!=undefined)
			this.btn.label=data.btnname;
		else
			this.btn.label=this.BtnName;
		for (let i = 0; i < this.starGroup.numChildren; i++) 
		{
			let item = this.starGroup.getChildAt(i) as eui.Image
			item.source = starCount > i ? "ui_bm_star022" : "ui_bm_star021"
		}

		// this.btn.visible=true;
		this.countLabel.visible=false;
		// this.okImg.visible=false;
		
		if(data.type!=undefined)//我要变强 undefined是升级途径介面
		{
			if (data.type == 1) {
				this.countLabel.visible=false
			} else {
				this.countLabel.visible=true;
			}
			if(data.time!=undefined && data.points!=undefined)
			{
				if(GameGlobal.UpLvWayModel.isFinish(data.id,data.time)==false)
				{
					let count=0;
					if(GameGlobal.UpLvWayModel.dic[data.id]!=undefined)
						count=GameGlobal.UpLvWayModel.dic[data.id];
					// this.countLabel.visible=true;
					this.countLabel.text="("+count+"/"+data.time+")";
				}
				else
				{

					// this.btn.visible=false;
					this.countLabel.textColor=0x019704; 
					this.countLabel.text="(已完成)";
					// this.okImg.visible=true;
				}
			}
		}

		// if(data.type==undefined )
		// {
		// 	// if(data.id==2)//"师门任务"
		// 	// {	
		// 	// 	let count=GameGlobal.DailyModel.monsterInfo.num;
		// 	// 	let tabCount=GameGlobal.Config.DailyBaseConfig.monster;
		// 	// 	this.ImgisShow(tabCount,count);
		// 	// }
		// 	// else if(data.id==3)//"跨服组队"
		// 	// {
		// 	// 	let tabCount=GameGlobal.Config.CrossTeamConfig.rewardCount;
		// 	// 	let count=tabCount-GameGlobal.CrossTeamModel.mCount;
		// 	// 	this.ImgisShow(tabCount,count);
		// 	// }
		// }
		// else if(data.type==2)
		// {
		// 	if(data.id==14)//"师门任务"
		// 	{	
		// 		// let count=GameGlobal.DailyModel.monsterInfo.num;
		// 		// let tabCount=GameGlobal.Config.DailyBaseConfig.monster;
		// 		// this.ImgisShow(tabCount,count);
		// 	}
		// 	else if(data.id==15)//"跨服组队"
		// 	{
		// 		let tabCount=GameGlobal.Config.CrossTeamConfig.rewardCount;
		// 		let count=tabCount-GameGlobal.CrossTeamModel.mCount;
		// 		this.ImgisShow(tabCount,count);
		// 	}
		// }
		// else if(data.type==3)
		// {
		// 	if(data.id==19) //材料副本
		// 	{
		// 		let fbObj = GameGlobal.UserFb.fbModel;
		// 		let fbArr = [];
		// 		let KoCount=0;
		// 		for (let obj in fbObj) 
		// 		{
		// 			let  config = GlobalConfig.ins().DailyFubenConfig;
		// 			if (GameLogic.ins().actorModel.level < config[fbObj[obj].fbID].levelLimit) 
		// 				break;
		// 			fbArr.push(fbObj[obj]);
		// 			//if(config[fbObj[obj].fbID].needsuccess > fbObj[obj].totalCount)
		// 			if(fbObj[obj].useCount>=config[fbObj[obj].fbID].freeCount)
		// 				KoCount++;
		// 		};
		// 		this.ImgisShow(fbArr.length,KoCount);
		// 	}
		// 	else if(data.id==20) //个人boss
		// 	{
		// 		let KoCount=0;
		// 		let allCount=0;
		// 		let list = GameGlobal.UserFb.getPersonBoss();
		// 		let arr = [];
		// 		let i:number;
		// 		let len:number = list.length;
		// 		for( i = 0 ; i < len ;i ++ )
		// 		{
		// 			if (GameGlobal.actorModel.level < list[i].levelLimit)
		// 				break;
					
		// 			arr.push(list[i]);
		// 			if(list[i].useCount>0)KoCount+=list[i].useCount;
		// 			let config=GameGlobal.Config.DailyFubenConfig[list[i].fbID];
		// 			allCount+=config.freeCount + list[i].vipBuyCount;
					
		// 		}
		// 		this.ImgisShow(allCount,KoCount);
		// 	}
		// 	else if(data.id==21)//全民Boss
		// 	{
		// 		let bossModel: BossModel = GameGlobal.BossModel;
		// 		let baseConfg = GameGlobal.Config.PublicBossBaseConfig;
		// 		this.ImgisShow(baseConfg.maxCount,baseConfg.maxCount-bossModel.pBossChallengenum);
		// 	}
		// 	else if(data.id==22)//野外Boss
		// 	{
		// 		let list = GameGlobal.BossModel.GetBossInfos(Enum_BOSSTYPE.field_boss)
		// 		let arr = [];
		// 		let i:number;
		// 		let len:number = list.length;
		// 		let koCount=0;
		// 		//let allCount=0;
		// 		for( i = 0 ; i < len ;i ++ )
		// 		{
		// 			if (GameGlobal.actorModel.level < list[i].level)
		// 				break;
					
		// 			arr.push(list[i]);
		// 			let data=list[i] as FieldBossInfo;

		// 			if(data.isDie || data.IsClose())
		// 			{
		// 				koCount++;
		// 			}

		// 		}
				
		// 		this.ImgisShow(arr.length,koCount);
		// 	}
		// 	else if(data.id==23)//至尊Boss
		// 	{
		// 		let list = GameGlobal.BossModel.getVipBossInfo();
		// 		let arr = [];
		// 		let count=0;
		// 		for (let data of list) {
		// 			if (GameGlobal.actorModel.level >= data.levelLimit 
		// 				|| GameGlobal.actorModel.vipLv >= data.viplvlimit)
		// 			{
		// 				arr.push(data)

		// 				let nVipLv = UserVip.ins().lv
		// 				let nLeftTime =  (data.vipCount[nVipLv]||1)
		// 				if (data.daycount >= nLeftTime) 
		// 					count++;
		// 			} 
		// 			else
		// 			{
		// 				break
		// 			}
		// 		}

		// 		this.ImgisShow(arr.length,count);
		// 	}
			// else if(data.id==6)//"跨服组队  
			// {
			// 	let tabCount=GameGlobal.Config.CrossTeamConfig.rewardCount;
			// 	let count=tabCount-GameGlobal.CrossTeamModel.mCount;
			// 	this.ImgisShow(tabCount,count);
			// }
			// else if(data.id==24)//幫會副本
			// {
			// 	if(GameGlobal.actorModel.HasGuild())//有班會
			// 	{
			// 		let count=GameGlobal.Config.GuildFubenBaseConfig.profitCount;
			// 		let koCount=count-GameGlobal.GuildTeamModel.GetProfitCount();
			// 		this.ImgisShow(count,koCount);
			// 	}
			// 	else
			// 	{
			// 		this.btn.visible=true;
			// 		this.countLabel.visible=false;
			// 		this.okImg.visible=false;
			// 	}
			// }
		// }

	}

	private ImgisShow(tabCount,count):void
	{
		// let tabCount=GameGlobal.Config.CrossTeamConfig.rewardCount;
		// let count=GameGlobal.CrossTeamModel.mCount-tabCount;
		if(count>=tabCount)//任务完成
		{
			this.btn.visible=false;
			this.countLabel.visible=false;
			this.okImg.visible=true;
		}
		else
		{
			this.countLabel.visible=true;
			this.btn.visible=true;
			this.countLabel.text="("+count+"/"+tabCount+")";
		}
	}

}