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
var CloudNineModel = (function (_super) {
    __extends(CloudNineModel, _super);
    function CloudNineModel() {
        var _this = _super.call(this) || this;
        _this.monsterId = {};
        _this.regNetMsg(S2cProtocol.sc_climb_score_info, _this.getGoodsSucceed);
        _this.regNetMsg(S2cProtocol.sc_climb_all_rank, _this.getAllRank);
        _this.regNetMsg(S2cProtocol.sc_climb_curr_rank, _this.getLocalRank);
        _this.regNetMsg(S2cProtocol.sc_climb_refresh_mon, _this.refreshMonsters);
        _this.regNetMsg(S2cProtocol.sc_climb_fighting_change, _this.updataFightingState);
        _this.regNetMsg(S2cProtocol.sc_climb_info, _this.getSceneInfo);
        _this.regNetMsg(S2cProtocol.sc_climb_report, _this.getEndAwardPanelData);
        return _this;
    }
    CloudNineModel.prototype.checkPk = function (playerId) {
        for (var i = 0; i < this.fighting.length; i++)
            if (this.fighting[i] == playerId) {
                return true;
            }
        return false;
    };
    CloudNineModel.prototype.addfightingIcon = function () {
        var allMentityList = GameGlobal.RaidMgr.mMapRaid.mEntityList;
        for (var data in allMentityList) {
            allMentityList[data].ChageStatus(EntityStatusView.NONE);
        }
        for (var i = 0; i < this.fighting.length; i++) {
            if (allMentityList[this.fighting[i]]) {
                allMentityList[this.fighting[i]].ChageStatus(EntityStatusView.ATK);
            }
        }
        allMentityList[GameGlobal.GameLogic.actorModel.actorID].ChageStatus(EntityStatusView.NONE);
    };
    CloudNineModel.prototype.getActivityTime = function () {
        var endTime = GameGlobal.Config.ClimbTowerBaseConfig.opentime.endtime;
        var index = endTime.indexOf(':');
        var endHours = endTime.substr(0, index);
        var endMinutes = endTime.substr(index + 1, endTime.length);
        var date = new Date(GameServer.serverTime * 1000);
        date.setHours(endHours, endMinutes, 0, 0);
        var commonTime = date.getTime() / 1000;
        return commonTime;
    };
    CloudNineModel.prototype.getMonsterServersId = function (handle) {
        if (this.monsterId[handle] != null)
            return this.monsterId[handle];
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CloudNineModel.prototype.sendCrimbJoin = function () {
        var req = new Sproto.cs_crimb_join_request;
        this.Rpc(C2sProtocol.cs_crimb_join, req, this.getJoinSucceed, this);
    };
    CloudNineModel.prototype.getJoinSucceed = function (req) {
        if (req.ret) {
        }
    };
    CloudNineModel.prototype.sendLeaveTime = function () {
        var req = Sproto.cs_climb_leave_time_request;
        this.Rpc(C2sProtocol.cs_climb_leave_time, req, this.getLeaveTime, this);
    };
    CloudNineModel.prototype.getLeaveTime = function (req) {
        var joinDelayTimer = req.time + GameGlobal.Config.ClimbTowerBaseConfig.cd - GameServer.serverTime;
        if (joinDelayTimer <= 0)
            GameGlobal.ActivityModel.sendActivityEnter(ActivityModel.TYPE_CLOUD_NINE);
        else {
            GameGlobal.UserTips.showTips(joinDelayTimer + "秒后可以进入");
        }
    };
    //请求Pk
    CloudNineModel.prototype.sendPk = function (id) {
        var roleID = new Sproto.cs_crimb_pk_request();
        roleID.targetid = id;
        this.Rpc(C2sProtocol.cs_crimb_pk, roleID);
    };
    //请求奖励
    CloudNineModel.prototype.sendGetGoods = function () {
        var req = new Sproto.cs_climb_get_reward_request();
        this.Rpc(C2sProtocol.cs_climb_get_reward, req);
    };
    CloudNineModel.prototype.getGoodsSucceed = function (req) {
        this.score = req.score;
        this.rewardsocre = req.rewardsocre;
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_GIFT_REFRES);
    };
    //请求本地排行
    CloudNineModel.prototype.sendLocalRank = function () {
        var req = new Sproto.cs_climb_curr_rank_request();
        this.Rpc(C2sProtocol.cs_climb_curr_rank, req);
    };
    CloudNineModel.prototype.getLocalRank = function (req) {
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_RANK, req);
        this.rankType = CloudNineRankType.local;
    };
    //请求跨服排行    
    CloudNineModel.prototype.sendAllRank = function () {
        var req = new Sproto.cs_climb_all_rank_request();
        this.Rpc(C2sProtocol.cs_climb_all_rank, req);
    };
    CloudNineModel.prototype.getAllRank = function (req) {
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_RANK, req);
        this.rankType = CloudNineRankType.legendOfEmpire;
    };
    //请求离开
    CloudNineModel.prototype.sendLeave = function () {
        var req = new Sproto.cs_climb_leave_request();
        this.Rpc(C2sProtocol.cs_climb_leave, req);
    };
    CloudNineModel.prototype.refreshMonsters = function (req) {
        if (req.flag) {
            for (var key in this.monsterId) {
                GameGlobal.RaidMgr.mMapRaid.RemoveEntity(parseInt(key));
            }
            this.monsterId = {};
        }
        else {
            for (var i = 0; i < req.monsters.length; i++)
                this.fighting.splice(this.fighting.indexOf(req.monsters[i].id), 1);
        }
        for (var i = 0; i < req.monsters.length; i++) {
            var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(req.monsters[i].monsterid, (req.monsters[i].x), (req.monsters[i].y));
            this.monsterId[entity.GetHandle()] = req.monsters[i].id;
        }
    };
    CloudNineModel.prototype.updataFightingState = function (req) {
        if (req.isfighting) {
            this.fighting.push(req.dbid);
        }
        else {
            this.fighting.splice(this.fighting.indexOf(req.dbid), 1);
        }
        this.addfightingIcon();
    };
    CloudNineModel.prototype.getSceneInfo = function (req) {
        this.fighting = req.fighting;
        this.score = req.score;
        this.rewardsocre = req.rewardsocre;
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_SCENE_INIT);
        this.addfightingIcon();
        this.monsterId = {};
        for (var i = 0; i < req.monsters.length; i++) {
            var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(req.monsters[i].monsterid, (req.monsters[i].x), (req.monsters[i].y));
            this.monsterId[entity.GetHandle()] = req.monsters[i].id;
            // this.monsterId[req.monsters[i].id] = entity.GetHandle()
        }
    };
    CloudNineModel.prototype.getEndAwardPanelData = function (rep) {
        if (rep) {
            var data = new activityEndAwardData();
            data.award = rep.rewards;
            data.paneltitle = "九重天";
            if (rep.sharedata.shows) {
                data.shows = rep.sharedata.shows;
            }
            ViewManager.ins().open(ActivityEndAwardPanel, data);
        }
    };
    return CloudNineModel;
}(BaseSystem));
__reflect(CloudNineModel.prototype, "CloudNineModel");
var CloudNineRankType;
(function (CloudNineRankType) {
    CloudNineRankType[CloudNineRankType["local"] = 1] = "local";
    CloudNineRankType[CloudNineRankType["legendOfEmpire"] = 2] = "legendOfEmpire";
})(CloudNineRankType || (CloudNineRankType = {}));
//# sourceMappingURL=CloudNineModel.js.map