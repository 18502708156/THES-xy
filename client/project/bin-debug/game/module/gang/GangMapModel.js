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
var GangMapModel = (function (_super) {
    __extends(GangMapModel, _super);
    function GangMapModel() {
        var _this = _super.call(this) || this;
        _this.mTaskInfoMap = {};
        _this.mRobotList = [];
        _this.regNetMsg(S2cProtocol.sc_guild_map_reward, _this._DoGangMapReward);
        _this.regNetMsg(S2cProtocol.sc_guild_map_one_update, _this._DoUpdateGangMapInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_robot_datas, _this._DoGetRobotList);
        return _this;
    }
    GangMapModel.prototype._DoGangMapReward = function (rsp) {
        var tipText = "";
        for (var _i = 0, _a = rsp.reward; _i < _a.length; _i++) {
            var reward = _a[_i];
            UserTips.ins().showTips("\u83B7\u5F97 " + GangMapConst.GetGangMapItemName(reward.id) + "*" + reward.count);
        }
        this.mGMExchangeInfo.UpdateBagInfo(rsp.reward);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO);
    };
    GangMapModel.prototype._DoUpdateGangMapInfo = function (rsp) {
        this._UpdateTaskInfo(rsp);
    };
    GangMapModel.prototype._DoGetRobotList = function (rsp) {
        this.mRobotList = rsp.robotlist || [];
    };
    GangMapModel.prototype._UpdateTaskInfo = function (taskInfo) {
        if (!this.mTaskInfoMap[taskInfo.id])
            return;
        this.mTaskInfoMap[taskInfo.id].UpdateInfo(taskInfo);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_TASKINFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_UPDATEENTITY);
    };
    GangMapModel.prototype.SendGetMapTaskInfo = function () {
        var _this = this;
        var req = new Sproto.cs_guild_map_task_info_request;
        this.Rpc(C2sProtocol.cs_guild_map_task_info, req, function (rsp) {
            for (var _i = 0, _a = rsp.taskInfo; _i < _a.length; _i++) {
                var taskInfo = _a[_i];
                var gmTaskInfo = _this.mTaskInfoMap[taskInfo.id];
                if (!gmTaskInfo) {
                    gmTaskInfo = new GangMapTaskInfo;
                    _this.mTaskInfoMap[taskInfo.id] = gmTaskInfo;
                }
                gmTaskInfo.UpdateInfo(taskInfo);
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_TASKINFO);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_MAPENTITY_INIT);
        }, this);
    };
    GangMapModel.prototype.SendFinishTask = function (taskId) {
        var req = new Sproto.cs_guild_map_task_complete_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_guild_map_task_complete, req);
    };
    GangMapModel.prototype.SendResetTask = function (taskId) {
        var _this = this;
        var req = new Sproto.cs_guild_map_task_reset_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_guild_map_task_reset, req, function (rsp) {
            if (rsp.ret) {
                _this._UpdateTaskInfo(rsp.taskInfo);
                GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_RESET_MAPENTITY);
            }
        }, this);
    };
    GangMapModel.prototype.SendOneKeyFinish = function (taskId) {
        var _this = this;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_ONEKEYFINISH);
        var req = new Sproto.cs_guild_map_task_quick_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_guild_map_task_quick, req, function (rsp) {
            if (rsp.ret) {
                _this._UpdateTaskInfo(rsp.taskInfo);
            }
        }, this);
    };
    GangMapModel.prototype.SendGainReward = function (taskId) {
        var req = new Sproto.cs_guild_map_reward_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_guild_map_reward, req, function (rsp) {
            if (rsp.ret) {
            }
        });
    };
    GangMapModel.prototype.SendGetExchange = function () {
        var _this = this;
        var req = new Sproto.cs_guild_map_exchange_info_request;
        this.Rpc(C2sProtocol.cs_guild_map_exchange_info, req, function (rsp) {
            _this.mGMExchangeInfo = new GangMapExchangInfo;
            _this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo);
            _this.StartTimer(rsp.exchangeInfo.refreshTime || 0);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO);
        }, this);
    };
    GangMapModel.prototype.SendRefreshExchange = function () {
        var _this = this;
        var req = new Sproto.cs_guild_map_exchange_refresh_request;
        this.Rpc(C2sProtocol.cs_guild_map_exchange_refresh, req, function (rsp) {
            _this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo);
            _this.StartTimer(rsp.exchangeInfo.refreshTime || 0);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO);
        }, this);
    };
    GangMapModel.prototype.SendExchange = function (id) {
        var _this = this;
        var req = new Sproto.cs_guild_map_exchange_pay_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_guild_map_exchange_pay, req, function (rsp) {
            _this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO);
        }, this);
    };
    GangMapModel.prototype.GetTaskInfo = function (taskId) {
        return this.mTaskInfoMap[taskId];
    };
    GangMapModel.prototype.IsTaskDone = function (taskId) {
        var taskInfo = this.mTaskInfoMap[taskId];
        if (!taskInfo)
            return false;
        var taskConfig = GameGlobal.Config.GuildMapTaskConfig[taskInfo.mTaskId];
        if (!taskConfig)
            return false;
        return taskConfig.number <= taskInfo.mCount;
    };
    GangMapModel.prototype.HasGainTaskReward = function (taskId) {
        var taskInfo = this.mTaskInfoMap[taskId];
        if (!taskInfo)
            return false;
        return taskInfo.mRewardStatus;
    };
    GangMapModel.prototype.CanResetTask = function (taskId) {
        var taskInfo = this.mTaskInfoMap[taskId];
        if (!taskInfo)
            return false;
        var vipLv = GameGlobal.actorModel.vipLv;
        var vipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv];
        if (!vipConfig)
            return false;
        return taskInfo.mResetCount < vipConfig.buyreset;
    };
    Object.defineProperty(GangMapModel.prototype, "gangMapExchangeInfo", {
        get: function () {
            return this.mGMExchangeInfo;
        },
        enumerable: true,
        configurable: true
    });
    GangMapModel.prototype.GetGangMapItemNum = function (gmItemId) {
        return this.mGMExchangeInfo.GetGangMapItemNum(gmItemId);
    };
    GangMapModel.prototype.HasExchangeItem = function (itemId) {
        return this.mGMExchangeInfo.HasExchangeItem(itemId);
    };
    GangMapModel.prototype.CanItemExchange = function () {
        if (!GameGlobal.GangModel.HasGang() || !this.mGMExchangeInfo)
            return false;
        return this.mGMExchangeInfo.CanItemExchange();
    };
    GangMapModel.prototype.StartPickPlantNotice = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_START_PICKPLANT_NOTICY);
    };
    GangMapModel.prototype.SetAutoTask = function (autoFlag) {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_AUTO_TASK, autoFlag);
    };
    GangMapModel.prototype.HidePickProgressNoticy = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_HIDEPICKPROGRESS);
    };
    GangMapModel.prototype.StartTimer = function (endTime) {
        TimerManager.ins().removeAll(this);
        var diffTime = Math.max(endTime - GameServer.serverTime, 0);
        TimerManager.ins().doTimer(diffTime * 1000, 1, this.SendGetExchange, this);
    };
    return GangMapModel;
}(BaseSystem));
__reflect(GangMapModel.prototype, "GangMapModel");
//# sourceMappingURL=GangMapModel.js.map