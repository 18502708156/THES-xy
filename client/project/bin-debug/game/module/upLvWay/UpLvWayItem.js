var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UpLvWayItem = (function (_super) {
    __extends(UpLvWayItem, _super);
    function UpLvWayItem() {
        //skinName
        //UpLvWayItemSkin2
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rewardStr = "奖励积分:";
        _this.TypeID = 0;
        _this.BtnName = "前往挑战";
        return _this;
    }
    UpLvWayItem.prototype.childrenCreated = function () {
        var _this = this;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (ViewManager.ins().isShow(UpLvWayMainPanel) == true)
                ViewManager.ins().close(UpLvWayMainPanel);
            if (ViewManager.ins().isShow(UpLvWayMainWin) == true)
                ViewManager.ins().close(UpLvWayMainWin);
            if (_this.TypeID == 1037)
                ViewManager.ins().open(DailyMainWin, 1);
            else
                ViewManager.ins().Guide(_this.TypeID);
        }, this);
    };
    UpLvWayItem.prototype.dataChanged = function () {
        var data = this.data;
        this.countLabel.visible = false;
        // this.okImg.visible=false;
        this.logoImg.source = data.icon;
        this.titleNameLabel.text = data.name;
        this.describeLabel.text = data.des;
        this.TypeID = data.taget;
        var starCount = data.start;
        this.rewardScore.visible = false;
        this.countLabel.textColor = 0x6E330B; //灰色
        if (data.points != undefined) {
            this.rewardScore.visible = true;
            this.rewardScore.text = this.rewardStr + data.points;
        }
        if (data.btnname != undefined)
            this.btn.label = data.btnname;
        else
            this.btn.label = this.BtnName;
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = starCount > i ? "ui_bm_star022" : "ui_bm_star021";
        }
        // this.btn.visible=true;
        this.countLabel.visible = false;
        // this.okImg.visible=false;
        if (data.type != undefined) {
            if (data.type == 1) {
                this.countLabel.visible = false;
            }
            else {
                this.countLabel.visible = true;
            }
            if (data.time != undefined && data.points != undefined) {
                if (GameGlobal.UpLvWayModel.isFinish(data.id, data.time) == false) {
                    var count = 0;
                    if (GameGlobal.UpLvWayModel.dic[data.id] != undefined)
                        count = GameGlobal.UpLvWayModel.dic[data.id];
                    // this.countLabel.visible=true;
                    this.countLabel.text = "(" + count + "/" + data.time + ")";
                }
                else {
                    // this.btn.visible=false;
                    this.countLabel.textColor = 0x019704;
                    this.countLabel.text = "(已完成)";
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
    };
    UpLvWayItem.prototype.ImgisShow = function (tabCount, count) {
        // let tabCount=GameGlobal.Config.CrossTeamConfig.rewardCount;
        // let count=GameGlobal.CrossTeamModel.mCount-tabCount;
        if (count >= tabCount) {
            this.btn.visible = false;
            this.countLabel.visible = false;
            this.okImg.visible = true;
        }
        else {
            this.countLabel.visible = true;
            this.btn.visible = true;
            this.countLabel.text = "(" + count + "/" + tabCount + ")";
        }
    };
    return UpLvWayItem;
}(eui.ItemRenderer));
__reflect(UpLvWayItem.prototype, "UpLvWayItem");
//# sourceMappingURL=UpLvWayItem.js.map