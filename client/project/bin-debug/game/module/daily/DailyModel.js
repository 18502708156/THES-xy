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
var DailyModel = (function (_super) {
    __extends(DailyModel, _super);
    function DailyModel() {
        var _this = _super.call(this) || this;
        _this.mFindCount = 0;
        _this.mRedPoint = new DailyModelRedPoint(_this);
        _this.mBaseInfo = new DailyBaseInfo;
        _this.mTeamActionInfo = new OtherActiveInfo;
        _this.mPeaceActionInfo = new OtherActiveInfo;
        _this.monsterInfo = new MonsterInfo;
        _this.regNetMsg(S2cProtocol.sc_dailyTask_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_dailyTask_update, _this._DoUpdate);
        return _this;
    }
    DailyModel.prototype.Init = function () {
    };
    DailyModel.prototype._DoInitInfo = function (rsp) {
        this.mBaseInfo.UpdateInfo(rsp);
        this.mTeamActionInfo.UpdateInfo(rsp.teamFB);
        this.mPeaceActionInfo.UpdateInfo(rsp.chapterWar);
        this.monsterInfo.UpdateInfo(rsp.monster);
        GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_FOMALHAUT_MONSTERID);
        this.mTaskList = new Array();
        this._UpdateTaskInfoList(this.mTaskList, rsp.today);
        this.mYesterdayTaskMap = {};
        this._UpdateTaskInfoMap(this.mYesterdayTaskMap, rsp.yesterday);
        this.mRetrieveExpMap = {};
        this._UpdateTaskInfoMap(this.mRetrieveExpMap, rsp.findExp);
        this.mRetrieveResMap = {};
        this._UpdateTaskInfoMap(this.mRetrieveResMap, rsp.findItem);
        if (rsp.find > this.mFindCount) {
            this.mFindCount = rsp.find;
            this.mViewExp = false;
            this.mViewRes = false;
            this.mViewBindGoldRes = false;
            this.mViewGoldRes = false;
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW);
        }
    };
    DailyModel.prototype._DoUpdate = function (rsp) {
        if (rsp.lv)
            this.mBaseInfo.mLevel = rsp.lv;
        if (rsp.exp) {
            this.mBaseInfo.mExp = rsp.exp;
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE);
        }
        if (rsp.active) {
            this.mBaseInfo.mCurActive = rsp.active;
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_ACTIVE_UPDATE);
        }
        if (rsp.activeReward)
            this.mBaseInfo.mActiveReward = rsp.activeReward;
        if (rsp.find) {
            this.mBaseInfo.mFindFlag = rsp.find != 0;
        }
        if (rsp.teamFB) {
            this.mTeamActionInfo.UpdateInfo(rsp.teamFB);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_TEAM_UPDATE);
        }
        if (rsp.chapterWar) {
            this.mPeaceActionInfo.UpdateInfo(rsp.chapterWar);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_PEACE_UPDATE);
        }
        if (rsp.today) {
            this.mTaskList = new Array();
            this._UpdateTaskInfoList(this.mTaskList, rsp.today);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_TASKLIST_UPDATE);
        }
        if (rsp.yesterday) {
            this.mYesterdayTaskMap = {};
            this._UpdateTaskInfoMap(this.mYesterdayTaskMap, rsp.yesterday);
        }
        if (rsp.findExp) {
            this.mRetrieveExpMap = {};
            this._UpdateTaskInfoMap(this.mRetrieveExpMap, rsp.findExp);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE);
        }
        if (rsp.findItem) {
            this.mRetrieveResMap = {};
            this._UpdateTaskInfoMap(this.mRetrieveResMap, rsp.findItem);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE);
        }
        if (rsp.monster) {
            this.monsterInfo.UpdateInfo(rsp.monster);
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_FOMALHAUT_MONSTERID);
        }
    };
    DailyModel.prototype._UpdateTaskInfoList = function (taskInfoList, infoList) {
        for (var _i = 0, infoList_1 = infoList; _i < infoList_1.length; _i++) {
            var info = infoList_1[_i];
            var tempInfo = new DailyTaskInfo;
            tempInfo.UpdateInfo(info);
            taskInfoList.push(tempInfo);
        }
    };
    DailyModel.prototype._UpdateTaskInfoMap = function (taskInfoMap, infoList) {
        for (var _i = 0, infoList_2 = infoList; _i < infoList_2.length; _i++) {
            var info = infoList_2[_i];
            var tempInfo = new DailyTaskInfo;
            tempInfo.UpdateInfo(info);
            taskInfoMap[info.no] = tempInfo;
        }
    };
    DailyModel.prototype.SendGainAward = function (type, rewardId) {
        var req = new Sproto.cs_dailyTask_otherActivity_reward_request;
        req.otherActivity = type;
        req.reward = rewardId;
        this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_reward, req);
    };
    //一键完成进度 1->师门,2->300,3->组队副本
    DailyModel.prototype.SendQuilkDone = function (type) {
        var req = new Sproto.cs_dailyTask_otherActivity_complete_request;
        req.otherActivity = type;
        this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_complete, req);
    };
    DailyModel.prototype.SendUpgradeMedal = function () {
        var _this = this;
        var req = new Sproto.cs_dailyTask_up_level_request;
        this.Rpc(C2sProtocol.cs_dailyTask_up_level, req, function (rsp) {
            if (rsp.ret) {
                _this.mBaseInfo.mLevel = rsp.lv;
                _this.mBaseInfo.mExp = rsp.exp;
                GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE);
            }
        }, this);
    };
    DailyModel.prototype.SendGainActiveAward = function (rewardId) {
        var _this = this;
        var req = new Sproto.cs_dailyTask_activity_reward_request;
        req.rewardNo = rewardId;
        this.Rpc(C2sProtocol.cs_dailyTask_activity_reward, req, function (rsp) {
            if (rsp.ret) {
                _this.mBaseInfo.mActiveReward = rsp.activityReward;
                GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_ACTIVE_UPDATE);
            }
        }, this);
    };
    DailyModel.prototype.SendRetrieve = function (taskId, costType, findType, num) {
        var _this = this;
        var req = new Sproto.cs_dailyTask_activity_find_request;
        req.activityNo = taskId;
        req.cashtype = costType;
        req.findType = findType;
        req.num = num;
        this.Rpc(C2sProtocol.cs_dailyTask_activity_find, req, function (rsp) {
            if (rsp.ret) {
                _this.mBaseInfo.mExp = rsp.exp;
                GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE);
                if (rsp.findType == DailyConst.TASK_RETRIEVE_TYPE_EXP) {
                    var retrieveExpInfo = _this.mRetrieveExpMap[rsp.activityNo];
                    if (!retrieveExpInfo) {
                        retrieveExpInfo = new DailyTaskInfo;
                        retrieveExpInfo.mTaskId = rsp.activityNo;
                        _this.mRetrieveExpMap[rsp.activityNo] = retrieveExpInfo;
                    }
                    retrieveExpInfo.mCount = rsp.num;
                    UserTips.ins().showTips("\u5DF2\u627E\u56DE" + (rsp.findExpNum || 0) + "\u70B9\u5386\u7EC3\u7ECF\u9A8C");
                }
                else {
                    var retrieveResInfo = _this.mRetrieveResMap[rsp.activityNo];
                    if (!retrieveResInfo) {
                        retrieveResInfo = new DailyTaskInfo;
                        retrieveResInfo.mTaskId = rsp.activityNo;
                        _this.mRetrieveResMap[rsp.activityNo] = retrieveResInfo;
                    }
                    retrieveResInfo.mCount = rsp.num;
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE);
            }
        }, this);
    };
    DailyModel.prototype.SendRetrieveExp = function () {
        var req = new Sproto.cs_dailyTask_activity_find_all_exp_request;
        this.Rpc(C2sProtocol.cs_dailyTask_activity_find_all_exp, req, function (rsp) {
            if (rsp.ret) {
                UserTips.ins().showTips("\u5DF2\u627E\u56DE" + (rsp.findExpNum || 0) + "\u70B9\u5386\u7EC3\u7ECF\u9A8C");
            }
        }, this);
    };
    //师门打怪
    DailyModel.prototype.SendKoMonster = function (no) {
        var req = new Sproto.cs_dailyTask_otherActivity_monster_request;
        req.no = no;
        this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_monster, req);
    };
    //师门升星
    DailyModel.prototype.SendUpStar = function (no) {
        var req = new Sproto.cs_dailyTask_up_monster_request;
        req.no = no;
        this.Rpc(C2sProtocol.cs_dailyTask_up_monster, req);
    };
    Object.defineProperty(DailyModel.prototype, "peaceInfo", {
        get: function () {
            return this.mPeaceActionInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DailyModel.prototype, "teamInfo", {
        get: function () {
            return this.mTeamActionInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DailyModel.prototype, "baseInfo", {
        get: function () {
            return this.mBaseInfo;
        },
        enumerable: true,
        configurable: true
    });
    //是否领取
    DailyModel.prototype.IsGetItem = function () {
        return this.monsterInfo.reward > 0;
    };
    DailyModel.prototype.IsTeamTargetDone = function () {
        return this.mTeamActionInfo.mCurValue >= GameGlobal.Config.DailyBaseConfig.teamFB;
    };
    DailyModel.prototype.HasGainedTeamReward = function () {
        return this.mTeamActionInfo.mReward > 0;
    };
    DailyModel.prototype.IsPeaceTargetDone = function (targetVal) {
        return this.mPeaceActionInfo.mCurValue >= targetVal;
    };
    DailyModel.prototype.HasGainedPeaceReward = function (rewardNum) {
        return (this.mPeaceActionInfo.mReward & Math.pow(2, rewardNum)) > 0;
    };
    DailyModel.prototype.IsActiveTargetDone = function (targetVal) {
        return this.mBaseInfo.mCurActive >= targetVal;
    };
    DailyModel.prototype.HasGainedActiveReward = function (rewardNum) {
        return (this.mBaseInfo.mActiveReward & Math.pow(2, rewardNum)) > 0;
    };
    DailyModel.prototype.RecordResRetrieveFlag = function (type, b) {
        if (type == DailyConst.TASK_RETRIEVE_COST_BINDGOD) {
            if (b && !this.mViewGoldRes)
                return;
            this.mViewBindGoldRes = b;
        }
        else {
            this.mViewGoldRes = b;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW);
    };
    DailyModel.prototype.RecordExpFlag = function (b) {
        this.mViewExp = b;
        GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW);
    };
    DailyModel.prototype.RecordResFlag = function (b) {
        this.mViewRes = b;
        GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW);
    };
    DailyModel.prototype.GetMonsterList = function () {
        var monIdList = [];
        var monList = this.monsterInfo.monsterList;
        for (var _i = 0, monList_1 = monList; _i < monList_1.length; _i++) {
            var taskId = monList_1[_i];
            var monsterId = DailyConst.GetMonsterId(taskId);
            monIdList.push(monsterId);
        }
        return monIdList;
    };
    DailyModel.prototype.GetTaskIndex = function (monsterId) {
        var index = 0;
        for (var _i = 0, _a = this.monsterInfo.monsterList; _i < _a.length; _i++) {
            var taskId = _a[_i];
            if (monsterId == DailyConst.GetMonsterId(taskId)) {
                return index;
            }
            index++;
        }
        return -1;
    };
    DailyModel.prototype.GetTimeReach = function (level) {
        var curLevel = this.mBaseInfo.mLevel;
        var totalExp = 0;
        for (var id in GameGlobal.Config.DailyAttrsConfig) {
            var config = GameGlobal.Config.DailyAttrsConfig[id];
            if (config.level > curLevel && config.level <= level + 1) {
                totalExp += config.proexp;
            }
        }
        var maxExpPerDay = DailyConst.GetMaxExpPerDay();
        return Math.ceil((totalExp - this.mBaseInfo.mExp) / maxExpPerDay);
    };
    DailyModel.prototype.GetTaskCount = function (rewardNum) {
        for (var _i = 0, _a = this.mTaskList; _i < _a.length; _i++) {
            var taskInfo = _a[_i];
            if (taskInfo.mTaskId == rewardNum)
                return taskInfo.mCount;
        }
        return 0;
    };
    DailyModel.prototype.GetRetrieveExpList = function () {
        if (!this.mBaseInfo.mFindFlag) {
            return [];
        }
        var retrieveExpList = new Array();
        var taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id");
        for (var _i = 0, taskList_1 = taskList; _i < taskList_1.length; _i++) {
            var config = taskList_1[_i];
            var yesterInfo = this.mYesterdayTaskMap[config.id];
            var yesterCount = yesterInfo ? yesterInfo.mCount : 0;
            var retrieveExpInfo = this.mRetrieveExpMap[config.id];
            var retrieveExpCount = retrieveExpInfo ? retrieveExpInfo.mCount : 0;
            var count = config.maxtimes - yesterCount - retrieveExpCount;
            var retriveConfig = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP);
            if (retriveConfig && count > 0) {
                var tempInfo = new DailyTaskInfo;
                tempInfo.mTaskId = config.id;
                tempInfo.mCount = count;
                retrieveExpList.push(tempInfo);
            }
        }
        return retrieveExpList;
    };
    DailyModel.prototype.HasFomalhautReward = function () {
        if (this.monsterInfo.num < GameGlobal.Config.DailyBaseConfig.monster) {
            return false;
        }
        return !this.IsGetItem();
    };
    DailyModel.prototype.HasMonsterAtk = function () {
        return this.monsterInfo.monsterList.length > 0;
    };
    DailyModel.prototype.GetRetrieveResList = function () {
        if (!this.mBaseInfo.mFindFlag) {
            return [];
        }
        var retrieveResList = new Array();
        var taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id");
        for (var _i = 0, taskList_2 = taskList; _i < taskList_2.length; _i++) {
            var config = taskList_2[_i];
            var yesterInfo = this.mYesterdayTaskMap[config.id];
            var yesterCount = yesterInfo ? yesterInfo.mCount : 0;
            var retrieveResInfo = this.mRetrieveResMap[config.id];
            var retrieveResCount = retrieveResInfo ? retrieveResInfo.mCount : 0;
            var count = config.maxtimes - yesterCount - retrieveResCount;
            var retriveConfig1 = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_RES);
            var retriveConfig2 = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_BINDGOD, DailyConst.TASK_RETRIEVE_TYPE_RES);
            if ((retriveConfig1 || retriveConfig2) && count > 0) {
                var tempInfo = new DailyTaskInfo;
                tempInfo.mTaskId = config.id;
                tempInfo.mCount = count;
                retrieveResList.push(tempInfo);
            }
        }
        return retrieveResList;
    };
    DailyModel.prototype.GetRetrieveResListByType = function (type) {
        var resRetrieveList = this.GetRetrieveResList();
        var dataList = [];
        for (var _i = 0, resRetrieveList_1 = resRetrieveList; _i < resRetrieveList_1.length; _i++) {
            var taskInfo = resRetrieveList_1[_i];
            var config = DailyConst.GetRetrieveConfig(taskInfo.mTaskId, type, DailyConst.TASK_RETRIEVE_TYPE_RES);
            if (config)
                dataList.push(taskInfo);
        }
        return dataList;
    };
    DailyModel.prototype.GetRetrieveExpCost = function () {
        var cost = { id: 0, count: 0, exp: 0 };
        var expList = this.GetRetrieveExpList();
        for (var _i = 0, expList_1 = expList; _i < expList_1.length; _i++) {
            var expInfo = expList_1[_i];
            var retrieveConf = DailyConst.GetRetrieveConfig(expInfo.mTaskId, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP);
            var config = GameGlobal.Config.DailyProgressConfig[expInfo.mTaskId];
            cost.id = retrieveConf.cost[0].id;
            cost.count += retrieveConf.cost[0].count * expInfo.mCount;
            cost.exp += config.exp * expInfo.mCount;
        }
        return cost;
    };
    DailyModel.prototype.CanMedalUpgrade = function () {
        return DailyConst.CanMedalUpgrade(this.mBaseInfo.mLevel, this.mBaseInfo.mExp);
    };
    DailyModel.prototype.HasBoxReward = function () {
        var boxList = CommonUtils.GetArray(GameGlobal.Config.DailyActiveConfig, "id");
        for (var _i = 0, boxList_1 = boxList; _i < boxList_1.length; _i++) {
            var config = boxList_1[_i];
            if (this.IsActiveTargetDone(config.target) && !this.HasGainedActiveReward(config.id))
                return true;
        }
        return false;
    };
    DailyModel.prototype.HasPeaceReward = function () {
        var peaceList = DailyConst.GetPeaceList();
        for (var _i = 0, peaceList_1 = peaceList; _i < peaceList_1.length; _i++) {
            var config = peaceList_1[_i];
            if (this.IsPeaceTargetDone(config.target) && !this.HasGainedPeaceReward(config.reward))
                return true;
        }
        return false;
    };
    DailyModel.prototype.HasTeamReward = function () {
        return this.IsTeamTargetDone() && !this.HasGainedTeamReward();
    };
    DailyModel.prototype.IsRedPointDaily = function (type) {
        return this.mRedPoint.IsRedAct(type);
    };
    DailyModel.prototype.IsRedPoint = function () {
        this.mRedPoint.Get(DailyModelRedPoint.INDEX_ACT);
        return this.mRedPoint.IsRedPoint();
    };
    return DailyModel;
}(BaseSystem));
__reflect(DailyModel.prototype, "DailyModel");
var DailyModelRedPoint = (function (_super) {
    __extends(DailyModelRedPoint, _super);
    function DailyModelRedPoint(model) {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        _this.mModel = model;
        return _this;
    }
    DailyModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.DAILY_MEDAL_UPDATE, MessageDef.DAILY_ACTIVE_UPDATE,
            MessageDef.DAILY_RETRIEVELIST_UPDATE, MessageDef.DAILY_PEACE_UPDATE,
            MessageDef.DAILY_TEAM_UPDATE, MessageDef.DAILY_FOMALHAUT_MONSTERID,
            MessageDef.DAILY_UPDATE_RETREVE_VIEW, MessageDef.TEAM_FUBEN_INFO];
    };
    DailyModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[DailyModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    DailyModelRedPoint.prototype.OnChange = function (index) {
        if (index == DailyModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_REDPOINT_NOTICE);
        }
    };
    DailyModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    DailyModelRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[DailyModelRedPoint.MEDAL_UPGRADE] = this.mModel.CanMedalUpgrade();
        this.mRedPointMap[DailyModelRedPoint.ACTIVE_BOX_REWARD] = this.mModel.HasBoxReward();
        this.mRedPointMap[DailyModelRedPoint.RES_RETRIEVE] = this.mModel.GetRetrieveResList().length > 0 && !this.mModel.mViewRes;
        this.mRedPointMap[DailyModelRedPoint.EXP_RETRIEVE] = this.mModel.GetRetrieveExpList().length > 0 && !this.mModel.mViewExp;
        this.mRedPointMap[DailyModelRedPoint.PEACE_REWARD] = this.mModel.HasPeaceReward();
        this.mRedPointMap[DailyModelRedPoint.TEAM_REWARD] = this.mModel.HasTeamReward() || GameGlobal.CrossTeamModel.GetCount() > 0;
        this.mRedPointMap[DailyModelRedPoint.FOMALHAUT_NOTICE] = this.mModel.HasFomalhautReward() || this.mModel.HasMonsterAtk();
    };
    DailyModelRedPoint.prototype.IsRedAct = function (type) {
        this.Get(DailyModelRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    DailyModelRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    DailyModelRedPoint.MEDAL_UPGRADE = 1;
    DailyModelRedPoint.ACTIVE_BOX_REWARD = 2;
    DailyModelRedPoint.RES_RETRIEVE = 3;
    DailyModelRedPoint.EXP_RETRIEVE = 4;
    DailyModelRedPoint.PEACE_REWARD = 5;
    DailyModelRedPoint.TEAM_REWARD = 6;
    DailyModelRedPoint.FOMALHAUT_NOTICE = 7;
    return DailyModelRedPoint;
}(IRedPoint));
__reflect(DailyModelRedPoint.prototype, "DailyModelRedPoint");
//# sourceMappingURL=DailyModel.js.map