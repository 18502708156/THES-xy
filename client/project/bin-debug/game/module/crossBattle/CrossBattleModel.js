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
var CrossBattleModel = (function (_super) {
    __extends(CrossBattleModel, _super);
    function CrossBattleModel() {
        var _this = _super.call(this) || this;
        _this.UpGroup = true;
        _this.reborncout = 1; //复活时间 #复活倒计时 如果死亡状态的话
        _this.players = []; // 所有玩家
        _this.citys = [];
        _this.fighting = []; //战斗中的玩家 
        _this.transform = []; //变身中的玩家
        _this.camppoint = []; //所有城积分
        _this.citypoint = 0; //王城积分
        _this.commonpoint = 0; //个人积分
        _this.cityreward = []; //主城索引
        _this.commonreward = []; //个人索引
        _this.actcountdown = 0; //活动倒计时
        _this.CITYNAME = [
            "王城",
            "人族",
            "仙族",
            "魔族"
        ];
        _this.ZHENGNAME = [
            "公共",
            "人族阵营",
            "仙族阵营",
            "魔族阵营"
        ];
        _this.ZHENGTYPE = [
            "",
            "ui_hddt_bm_renzu",
            "ui_hddt_bm_xianzu",
            "ui_hddt_bm_mozu",
            "",
        ];
        _this.BUFFTYPE = [
            "",
            "ui_hddt_bm_renzubuff",
            "ui_hddt_bm_xianzubuff",
            "ui_hddt_bm_mozibuff"
        ];
        _this.TYPECOLOR = [
            ,
            "ui_hddt_bm_renzudian",
            "ui_hddt_bm_xianzudian",
            "ui_hddt_bm_mozudian"
        ];
        _this.MyShouCity = 99;
        _this.regNetMsg(S2cProtocol.sc_king_info, _this.getKingInfo); //跨服争霸数据
        //this.regNetMsg(S2cProtocol.sc_king_point_info,this.kingPointInfo)       //个人积分
        _this.regNetMsg(S2cProtocol.sc_king_begin_act, _this.startKingBegin); //活动开始 
        _this.regNetMsg(S2cProtocol.sc_king_city_data, _this.getKingCityData); //返回单个城池信息
        _this.regNetMsg(S2cProtocol.sc_king_status_change, _this.statusInfo); //状态变更 
        _this.regNetMsg(S2cProtocol.sc_king_player_enter, _this.goPlayer); //有玩家进去
        _this.regNetMsg(S2cProtocol.sc_king_player_leave, _this.levelPlayer); //有玩家离开
        _this.regNetMsg(S2cProtocol.sc_king_transform_change, _this.transformPlay); //变身状态变更
        _this.regNetMsg(S2cProtocol.sc_king_point_data, _this.getModel); //积分
        _this.regNetMsg(S2cProtocol.sc_king_attack_result, _this.AttackCityResult); //攻城结算
        _this.regNetMsg(S2cProtocol.sc_king_pk_result, _this.AttackPkResult); //PK结算
        _this.regNetMsg(S2cProtocol.sc_king_point_info, _this.uudatePointInfo);
        _this.regNetMsg(S2cProtocol.sc_king_reborn_countdown, _this.fuHuoTime);
        _this.regNetMsg(S2cProtocol.sc_king_my_guard_city, _this.myGuardCity);
        _this.regNetMsg(S2cProtocol.sc_king_update_city, _this.upDateCity);
        _this.regNetMsg(S2cProtocol.sc_king_info_update, _this.kingCitysUpdata);
        _this.regNetMsg(S2cProtocol.sc_king_fighting_change, _this.kingFightingChange);
        _this.regNetMsg(S2cProtocol.sc_king_report, _this.getEndAwardPanelData);
        return _this;
        //	this.regNetMsg(S2cProtocol.sc_king_transform_change,this.transformPlay)   
    }
    CrossBattleModel.prototype.getKingCityInfo = function () {
        var data = new Sproto.cs_king_city_data_request();
        data.camp = GameGlobal.GameLogic.actorModel.job;
        this.Rpc(C2sProtocol.cs_king_city_data, data);
    };
    CrossBattleModel.prototype.getCityInfo = function (index) {
        for (var i = 0; i < this.citys.length; i++) {
            if (this.citys[i].camp == index) {
                return this.citys[i].guards;
            }
        }
    };
    CrossBattleModel.prototype.getKingInfo = function (rsp) {
        this.camp = rsp.camp;
        this.status = rsp.status;
        this.reborncout = rsp.reborncout + GameServer.serverTime;
        this.players = rsp.players;
        this.citys = rsp.citys;
        //this.fighting =  rsp.fighting;
        this.camppoint = this.campPointPx(rsp.camppoint);
        this.transform = rsp.transform;
        this.actcountdown = rsp.actcountdown > 0 ? (rsp.actcountdown + GameServer.serverTime) : 0;
        this.addfightingIcon();
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOUCITY_UPDATE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_MAINJNFEN_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO);
        ViewManager.ins().close(ActivityWin);
        ViewManager.ins().close(GameCityPanel);
    };
    CrossBattleModel.prototype.bianShen = function () {
        var raid = GameGlobal.RaidMgr.mMapRaid;
        for (var i = 0; i < this.transform.length; i++) {
            if (raid.mEntityList[this.transform[i]]) {
                raid.ShapeShift(this.transform[i], "monster/warcar_001");
            }
        }
    };
    CrossBattleModel.prototype.campPointPx = function (points) {
        points.sort(function (lhs, rhs) {
            return rhs.point - lhs.point;
        });
        return points;
    };
    CrossBattleModel.prototype.getPlayerStatus = function (handle) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].dbid == handle) {
                return this.players[i].status;
            }
        }
        return 0;
    };
    CrossBattleModel.prototype.getPlayerCamp = function (handle) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].dbid == handle) {
                return this.players[i].camp;
            }
        }
        return 0;
    };
    CrossBattleModel.prototype.DelayAddfightingIcon = function () {
        var _this = this;
        TimerManager.ins().doTimer(200, 1, function () {
            if (egret.is(GameGlobal.RaidMgr.mMapRaid, "MapRaidCrossBattle")) {
                _this.addfightingIcon();
            }
        }, this);
    };
    CrossBattleModel.prototype.addfightingIcon = function () {
        var allEntityList = GameGlobal.RaidMgr.mMapRaid.mEntityList;
        for (var key in allEntityList) {
            allEntityList[key].ChageStatus(EntityStatusView.NONE);
        }
        for (var i = 0; i < this.fighting.length; i++) {
            var player = this.fighting[i];
            if (allEntityList[player]) {
                allEntityList[player].ChageStatus(EntityStatusView.ATK);
            }
        }
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            var entity = allEntityList[player.dbid];
            if (entity) {
                if (player.status == EntityStatusView.DIE) {
                    allEntityList[player.dbid].ChageStatus(EntityStatusView.DIE);
                }
                allEntityList[player.dbid].SetType(this.ZHENGTYPE[player.camp]);
            }
        }
        // let actorID = GameGlobal.actorModel.actorID
        // if (allEntityList[actorID]) {
        // 	allEntityList[actorID].visible = true
        // }
        GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO);
    };
    CrossBattleModel.prototype.getCitysInfo = function (camp) {
        for (var i = 0; i < this.citys.length; i++) {
            if (this.citys[i].camp == camp) {
                return this.citys[i];
            }
        }
        return;
    };
    CrossBattleModel.prototype.getPerJf = function () {
        var config = GameGlobal.Config.KingPointsRewardConfig;
        var configData = [];
        for (var data in config) {
            configData.push(data);
        }
        for (var i = 0; i < configData.length; i++) {
            if (this.commonpoint < config[configData[i]].partnerpoints) {
                return this.commonpoint + "/" + config[configData[i]].partnerpoints;
            }
            else {
                if (this.commonreward.indexOf(config[Number(configData[i])].id) == -1) {
                    return this.commonpoint + "/" + config[configData[i]].partnerpoints;
                }
            }
        }
        return this.commonpoint + "/" + config[configData[configData.length - 1]].partnerpoints;
    };
    // public getPerNextJf() {
    // 	let config = GameGlobal.Config.KingPointsRewardConfig
    // 	let configData = []
    // 	for(let data in config){
    //         configData.push(data);
    // 	}
    // 	for(let i = 0 ; i<configData.length ; i++){
    // 		 if(this.commonpoint < config[configData[i]].partnerpoints){
    // 			 return config[configData[i]].partnerpoints
    // 		 }
    // 		 return config[configData[configData.length-1]].partnerpoints
    // 	}		
    // }
    // public getCityNextJf() {
    // 	let config = GameGlobal.Config.KingWPointsRewardConfig
    // 	let configData = []
    // 	for(let data in config){
    //         configData.push(data);
    // 	}
    // 	for(let i = 0 ; i<configData.length ; i++){
    // 		 if(this.citypoint < config[configData[i]].citypoints){
    // 			 return config[configData[i]].citypoints
    // 		 }
    // 		 return config[configData[configData.length-1]].citypoints
    // 	}		
    // }	
    //获取BUFF效果
    CrossBattleModel.prototype.getBuff = function () {
        // let city = this.getCitysInfo(camp)
        // if(!city){
        // 	return 
        // }
        // if(city.camp == this.camp){
        // 	return  
        // }
        //return city.currcamp
        var buf = [];
        for (var i = 1; i < 4; i++) {
            var city = this.getCitysInfo(i);
            if (city && this.camp != city.camp && city.currcamp == this.camp) {
                buf.push(city.camp);
            }
        }
        return buf;
    };
    CrossBattleModel.prototype.kingFightingChange = function (rsp) {
        this.fighting = rsp.fighting;
        this.addfightingIcon();
    };
    CrossBattleModel.prototype.kingPointInfo = function (rsp) {
        // this.citypoint = rsp.citypoint;
        // this.commonpoint = rsp.commonpoint;
        // 奖励索引还没搞。
    };
    //玩家进入
    CrossBattleModel.prototype.goPlayer = function (rsp) {
        this.players.push(rsp.player);
        this.addfightingIcon();
    };
    //玩家离开
    CrossBattleModel.prototype.levelPlayer = function (rsp) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].dbid == rsp.dbid) {
                this.players.splice(i, 1);
                return;
            }
        }
    };
    //玩家状态信息 
    CrossBattleModel.prototype.statusInfo = function (rsp) {
        if (rsp.dbid == GameGlobal.GameLogic.actorModel.actorID) {
            this.status = rsp.status;
            if (rsp.status != 3) {
                this.reborncout = 1;
                GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO);
            }
        }
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].dbid == rsp.dbid) {
                this.players[i].status = rsp.status;
                this.addfightingIcon();
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOUCITY_UPDATE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO);
    };
    CrossBattleModel.prototype.startKingBegin = function () {
        console.log("活动开始"); //全部变自由
    };
    CrossBattleModel.prototype.SendRecruit = function () {
        this.Rpc(C2sProtocol.cs_king_team_recruit);
    };
    //请求单个城池数据
    CrossBattleModel.prototype.sendKingCityData = function (type) {
        var data = new Sproto.cs_king_city_data_request();
        data.camp = type;
        this.Rpc(C2sProtocol.cs_king_city_data, data);
    };
    //返回单个城池数据
    CrossBattleModel.prototype.getKingCityData = function (rsp) {
        this.oneCity = rsp;
        this.oneCity.guardtime = GameServer.serverTime - this.oneCity.guardtime;
        if (this.status == 1) {
            UserTips.InfoTip("活动还未开始");
        }
        if (rsp.currcamp == this.camp && this.getRoleBool(rsp.guards)) {
            ViewManager.ins().open(CrossBattleCityInfomaTion);
        }
        else {
            ViewManager.ins().open(CrossBattleCityInfoWarn);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_ONECITY_INFO);
    };
    //判断城池中是否自己在守城
    CrossBattleModel.prototype.getRoleBool = function (guards) {
        for (var i = 0; i < guards.length; i++) {
            if (guards[i].dbid == GameGlobal.GameLogic.actorModel.actorID) {
                return true;
            }
        }
        return false;
    };
    //攻城 
    CrossBattleModel.prototype.attackCity = function (camp) {
        var att = new Sproto.cs_king_city_attack_request();
        att.camp = camp;
        this.Rpc(C2sProtocol.cs_king_city_attack, att);
        GameGlobal.ViewManager.close(CrossBattleCityInfoWarn);
    };
    //防守 
    CrossBattleModel.prototype.fangShouCity = function (camp) {
        var att = new Sproto.cs_king_city_guard_request();
        att.camp = camp;
        this.Rpc(C2sProtocol.cs_king_city_guard, att);
        GameGlobal.ViewManager.close(CrossBattleCityInfoWarn);
    };
    //自由PK
    CrossBattleModel.prototype.freePk = function (id) {
        var roleID = new Sproto.cs_king_pk_request();
        roleID.targetid = id;
        this.Rpc(C2sProtocol.cs_king_pk, roleID);
    };
    //变身中的玩家状态变更
    CrossBattleModel.prototype.transformPlay = function (rsp) {
        // if(rsp.istransform){
        // 	this.transform.push(rsp.dbid)
        // }else{
        // 	this.transform.splice(this.transform.indexOf(rsp.dbid),1)
        // }
        this.chageBianShen(rsp);
    };
    CrossBattleModel.prototype.chageBianShen = function (rsp) {
        var raid = GameGlobal.RaidMgr.mMapRaid;
        if (!raid.mEntityList[rsp.dbid]) {
            return;
        }
        if (rsp.istransform) {
            this.transform.push(rsp.dbid);
            raid.ShapeShift(rsp.dbid, "monster/warcar_001");
        }
        else {
            this.transform.splice(this.transform.indexOf(rsp.dbid), 1);
            raid.replyShapeShift(rsp.dbid);
        }
    };
    //list列表移动
    CrossBattleModel.prototype.listMoveMap = function (data) {
        var config = GameGlobal.Config.KingBaseConfig.citypos;
        switch (data) {
            case 0:
                config = GameGlobal.Config.KingBaseConfig.citypos;
                break;
            case 1:
                config = GameGlobal.Config.KingBaseConfig.rcitypos;
                break;
            case 2:
                config = GameGlobal.Config.KingBaseConfig.mcitypos;
                break;
            case 3:
                config = GameGlobal.Config.KingBaseConfig.xcitypos;
                break;
        }
        GameGlobal.RaidMgr.mMapRaid.MoveOrder(data, config[0], config[1]);
    };
    //复活
    CrossBattleModel.prototype.fuHuo = function () {
        this.Rpc(C2sProtocol.cs_king_pay_revive);
    };
    CrossBattleModel.prototype.getModel = function (rsp) {
        if (this.citypoint != rsp.citypoint) {
            var num = rsp.citypoint - this.citypoint;
            if (num <= 0) {
                return;
            }
            UserTips.InfoTip("王城积分+" + num);
        }
        if (this.commonpoint != rsp.commonpoint) {
            var num = rsp.commonpoint - this.commonpoint;
            if (num <= 0) {
                return;
            }
            UserTips.InfoTip("贡献+" + num);
        }
        this.citypoint = rsp.citypoint;
        this.commonpoint = rsp.commonpoint;
        this.cityreward = rsp.cityreward;
        this.commonreward = rsp.commonreward;
        GameGlobal.MessageCenter.dispatch(MessageDef.JF_UPDATE_INFO);
    };
    CrossBattleModel.prototype.getCity = function (orderId, handle) {
        if (orderId != MoveTeam.NONE_ORDER && GameGlobal.GameLogic.actorModel.actorID != handle) {
            return;
        }
        this.sendKingCityData(orderId);
        //this.sendKingCityData()
    };
    //获取玩家积分数据
    CrossBattleModel.prototype.getJfModel = function () {
        this.Rpc(C2sProtocol.cs_king_point_data);
    };
    CrossBattleModel.prototype.huoQuJiangLi = function (type, index) {
        var data = new Sproto.cs_king_get_point_reward_request();
        data.pointtype = type;
        data.index = index;
        this.Rpc(C2sProtocol.cs_king_get_point_reward, data);
    };
    //变身请求
    CrossBattleModel.prototype.getBs = function () {
        if (GameGlobal.CrossBattleTeamModel.mTeamInfo.HasTeam()) {
            UserTips.ErrorTip("处于组队中，无法变身");
            return;
        }
        ViewManager.ins().close(CrossBattleChargeWarn);
        this.Rpc(C2sProtocol.cs_king_transform);
    };
    //攻城结果
    CrossBattleModel.prototype.AttackCityResult = function (rsp) {
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        if (raid) {
            var finishAction = new CrossFinishData;
            finishAction.iswin = rsp.iswin;
            finishAction.commonpoint = rsp.commonpoint;
            raid.SetFinishAction(finishAction);
        }
        // ViewManager.ins().open(rsp.iswin?CrossBattleResultWin:CrossBattleResultFailWin,null,() => {
        // 		GameGlobal.UserFb.sendExitFb();
        //         GameGlobal.RaidMgr.EnterCurMapRaid();
        // 	})
        //GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)
    };
    CrossBattleModel.prototype.AttackPkResult = function (rsp) {
        // ViewManager.ins().open(rsp.iswin?CrossBattleResultWin:CrossBattleResultFailWin,null,() => {
        // 		GameGlobal.UserFb.sendExitFb();
        //         GameGlobal.RaidMgr.EnterCurMapRaid();
        // 	})
        // //GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)	
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        if (raid) {
            var finishAction = new CrossFinishData;
            finishAction.iswin = rsp.iswin;
            finishAction.commonpoint = rsp.commonpoint;
            raid.SetFinishAction(finishAction);
        }
    };
    CrossBattleModel.prototype.uudatePointInfo = function (rsp) {
        this.camppoint = this.campPointPx(rsp.camppoint);
        GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_MAINJNFEN_INFO);
    };
    CrossBattleModel.prototype.fuHuoTime = function (rsp) {
        this.reborncout = rsp.reborncout + GameServer.serverTime;
        GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO);
    };
    CrossBattleModel.prototype.GetDeadTime = function () {
        if (this.reborncout) {
            return Math.max(this.reborncout - GameServer.serverTime, 0);
        }
        return 0;
    };
    CrossBattleModel.prototype.upDateCity = function (rsp) {
        this.citys = rsp.citys;
        GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO);
    };
    CrossBattleModel.prototype.kingLeave = function () {
        this.Rpc(C2sProtocol.cs_king_leave);
    };
    CrossBattleModel.prototype.myGuardCity = function (rsp) {
        this.MyShouCity = rsp.city;
        GameGlobal.MessageCenter.dispatch(MessageDef.SEND_CITY);
    };
    CrossBattleModel.prototype.myGuardCityCs = function () {
        this.Rpc(C2sProtocol.cs_king_my_guard_city);
    };
    CrossBattleModel.prototype.kingCitysUpdata = function (rsp) {
        for (var i = 0; i < this.citys.length; i++) {
            if (this.citys[i].camp == rsp.citys.camp) {
                this.citys.splice(i, 1);
                this.citys.push(rsp.citys);
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO);
    };
    CrossBattleModel.prototype.getEndAwardPanelData = function (rep) {
        if (rep) {
            var data = new activityEndAwardData();
            data.award = rep.rewards;
            data.paneltitle = "跨服争霸";
            var selfRank = 0;
            for (var key in rep.sharedata.rank) {
                if (rep.sharedata.rank[key] == rep.persondetail.camp) {
                    selfRank = parseInt(key) + 1;
                    break;
                }
            }
            data.rankTxt = "\u6211\u65B9\u9635\u8425\u6392\u540D\uFF1A\u7B2C" + selfRank + "\u540D";
            if (!rep.sharedata.rank)
                data.rankTxt = "\u672C\u6B21\u8DE8\u670D\u4E89\u9738\u65E0\u4EBA\u80DC\u51FA";
            var icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
            icon1Date.titleName = "本届跨服争霸胜方";
            // icon1Date.iconSrc = iconSrc
            if (rep.persondetail.camp == 1) {
                icon1Date.name = "人族阵营";
                icon1Date.iconSrc = "ui_hddt_bm_renzu";
            }
            else if (rep.persondetail.camp == 2) {
                icon1Date.name = "仙族阵营";
                icon1Date.iconSrc = "ui_hddt_bm_xianzu";
            }
            else if (rep.persondetail.camp == 3) {
                icon1Date.name = "魔族阵营";
                icon1Date.iconSrc = "ui_hddt_bm_mozu";
            }
            data.icon1 = icon1Date;
            ViewManager.ins().open(ActivityEndAwardPanel, data);
        }
    };
    return CrossBattleModel;
}(BaseSystem));
__reflect(CrossBattleModel.prototype, "CrossBattleModel");
//# sourceMappingURL=CrossBattleModel.js.map