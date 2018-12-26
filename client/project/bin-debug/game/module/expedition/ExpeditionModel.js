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
var ExpeditionModel = (function (_super) {
    __extends(ExpeditionModel, _super);
    function ExpeditionModel() {
        var _this = _super.call(this) || this;
        _this.lingtongInTaskMap = {};
        _this.recordIds = [];
        _this.regNetMsg(S2cProtocol.sc_baby_explore_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_baby_explore_task_result, _this._DoTaskResult);
        return _this;
    }
    ExpeditionModel.prototype.Init = function () {
    };
    ExpeditionModel.prototype._DoInitInfo = function (rsp) {
        this.taskUsedTimes = rsp.usedTimes;
        this.taskRestoreTime = rsp.restoreTime;
        this.taskBuyTimes = rsp.buyTimes;
        this.taskTaskIds = rsp.taskIds;
        this.taskAdventureList = rsp.taskList;
        this.setLingTongTaskMap(this.taskAdventureList);
        this.taskRefreshTimes = rsp.refreshTimes ? rsp.refreshTimes : 0;
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_ADVENTURE_INFO);
        // egret.callLater(this.IsRedPointExpedition,this);
        TimerManager.ins().remove(this.updateTimes, this);
        if (this.taskAdventureList && this.taskAdventureList.length > 0) {
            TimerManager.ins().doTimer(5000, 0, this.updateTimes, this);
        }
    };
    ExpeditionModel.prototype._DoTaskResult = function (rsp) {
        ViewManager.ins().open(PetExpeditionResultPanel, rsp);
    };
    ExpeditionModel.prototype.setLingTongTaskMap = function (list) {
        this.lingtongInTaskMap = {};
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var taskInfo = list_1[_i];
            for (var _a = 0, _b = taskInfo.petIds; _a < _b.length; _a++) {
                var id = _b[_a];
                this.lingtongInTaskMap[id] = taskInfo.taskId;
            }
        }
    };
    ExpeditionModel.prototype.SendGetExpeditionInfo = function () {
        var req = new Sproto.cs_baby_explore_info_request;
        this.Rpc(C2sProtocol.cs_baby_explore_info, req);
    };
    ExpeditionModel.prototype.SendExpeditionBuyCount = function () {
        var req = new Sproto.cs_baby_explore_buy_request;
        this.Rpc(C2sProtocol.cs_baby_explore_buy, req);
    };
    ExpeditionModel.prototype.SendExpeditionRefresh = function () {
        var req = new Sproto.cs_baby_explore_refresh_request;
        this.Rpc(C2sProtocol.cs_baby_explore_refresh, req);
    };
    ExpeditionModel.prototype.SendExpedtionStart = function (taskId, ids) {
        var req = new Sproto.cs_baby_explore_start_request;
        req.taskId = taskId;
        req.petIds = ids;
        this.Rpc(C2sProtocol.cs_baby_explore_start, req);
    };
    ExpeditionModel.prototype.SendExpedtionEnd = function (taskId) {
        var req = new Sproto.cs_baby_explore_finish_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_baby_explore_finish, req);
    };
    ExpeditionModel.prototype.SendExpedtionQuilkFinish = function (taskId) {
        var req = new Sproto.cs_baby_explore_quick_request;
        req.taskId = taskId;
        this.Rpc(C2sProtocol.cs_baby_explore_quick, req);
    };
    ExpeditionModel.prototype.checkTaskOpenTime = function () {
        // let isOpen = Deblocking.Check(DeblockingType.TYPE_43, true);
        // if(isOpen == false)
        // {
        // 	return false;
        // }
        var openTime = GameGlobal.Config.ExploreBaseConfig.openTime;
        var newDate = DateUtils.getGMT8Date(GameServer.serverTime * 1000);
        var h = newDate.getHours();
        var m = newDate.getMinutes();
        var t1 = openTime[0].split(":");
        var t2 = openTime[1].split(":");
        if (h >= parseInt(t1[0]) && h <= parseInt(t2[0])) {
            if (h == parseInt(t1[0]) && m < parseInt(t1[1])) {
                return false;
            }
            if (h == parseInt(t2[0]) && m > parseInt(t2[1])) {
                return false;
            }
        }
        else {
            return false;
        }
        return true;
    };
    ExpeditionModel.prototype.updateTimes = function () {
        var len = this.taskAdventureList ? this.taskAdventureList.length : 0;
        // this.IsRedPointExpedition();
        var t = (this.taskRestoreTime - GameServer.serverTime) * 1000;
        if (t <= 0) {
            TimerManager.ins().remove(this.updateTimes, this);
            if (this.taskRestoreTime != -1)
                this.SendGetExpeditionInfo();
        }
    };
    ExpeditionModel.prototype.GetFinishTaskCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.taskAdventureList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.timestamp < GameServer.serverTime)
                count++;
        }
        return [count, this.taskAdventureList.length];
    };
    ExpeditionModel.prototype.GetFreeList = function () {
        var list = GameGlobal.LingtongPetModel.GetList();
        var freeList = [];
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var info = list_2[_i];
            if (!this.lingtongInTaskMap[info.mId])
                freeList.push(info);
        }
        return freeList;
    };
    ExpeditionModel.prototype.getIds = function (taskId) {
        var freeList = this.GetFreeList();
        var config = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        if (!config)
            return [];
        var ids = [];
        var list = [];
        for (var _i = 0, freeList_1 = freeList; _i < freeList_1.length; _i++) {
            var info = freeList_1[_i];
            if (info.mLevel >= config.levellimit)
                list.push(info);
        }
        var getWeight = function (info) {
            return info.mLevel;
        };
        list.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
    };
    ExpeditionModel.prototype.CalcuAllRate = function (taskId, ids) {
        var rate = 0;
        var index = 0;
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            var lingTongInfo = GameGlobal.LingtongPetModel.GetInfo(id);
            rate += ExpeditionConst.GetFightRate(lingTongInfo.getPower(), taskId, index);
            index++;
        }
        return Math.min(rate, 100);
    };
    ExpeditionModel.prototype.GetNextOpenConfig = function () {
        var list = GameGlobal.LingtongPetModel.GetList();
        for (var key in GameGlobal.Config.ExploreTaskOpenConfig) {
            var config = GameGlobal.Config.ExploreTaskOpenConfig[key];
            var needCount = config.petnum;
            var needLv = config.level;
            var count = 0;
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var info = list_3[_i];
                if (info.mLevel >= needLv)
                    count++;
            }
            if (count < needCount)
                return config;
        }
    };
    ExpeditionModel.prototype.GetLingTongCount = function (level) {
        var list = GameGlobal.LingtongPetModel.GetList();
        var count = 0;
        for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
            var info = list_4[_i];
            if (info.mLevel >= level)
                count++;
        }
        return count;
    };
    ExpeditionModel.prototype.getOptimalPetsDodTask = function (taskId) {
        var petTaskItemObj = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        var fightPets = [];
        var i;
        var len = this.taskAdventureList ? this.taskAdventureList.length : 0;
        for (i = 0; i < len; i++) {
            var k = void 0;
            var kLen = this.taskAdventureList[i].petIds.length;
            for (k = 0; k < kLen; k++) {
                if (fightPets.indexOf(this.taskAdventureList[i].petIds[k]) == -1) {
                    fightPets.push(this.taskAdventureList[i].petIds[k]);
                }
            }
        }
        var tempPetInfos = [];
        for (var id in GameGlobal.LingtongPetModel.mInfo) {
            var petInfo = GameGlobal.LingtongPetModel.mInfo[id];
            if (fightPets.indexOf(petInfo.getId()) == -1) {
                if (petInfo.mLevel >= petTaskItemObj.levellimit) {
                    tempPetInfos.push(petInfo);
                }
            }
        }
        //战斗力从低到高排
        tempPetInfos.sort(this._SortPet2);
        var resultPetsId = [];
        var j;
        var jLen = petTaskItemObj.pet.length;
        for (j = 0; j < jLen; j++) {
            var findedPet = void 0;
            len = tempPetInfos.length;
            var tempPet1 = void 0;
            var tempPet2 = void 0;
            var tempPet3 = void 0;
            for (i = 0; i < len; i++) {
                var petInfo = tempPetInfos[i];
                var otherPet = petTaskItemObj.pet[j];
                var power = petInfo.getPower();
                var r = (power - otherPet.ce) / otherPet.ce * 100;
                var petHunSuitObj = void 0;
                if (petTaskItemObj.type == petInfo.suitConfigId && petInfo.getSuitId() > 0)
                    petHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() - 1];
                var suitRate = petHunSuitObj ? petHunSuitObj.attrs : 0;
                if (r >= GameGlobal.Config.ExploreBaseConfig.successfulRate) {
                    //完胜，
                    if (tempPet1) {
                        if (tempPet1.suitRate < suitRate) {
                            tempPet1 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                        }
                    }
                    else {
                        tempPet1 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                    }
                }
                else if (r <= -GameGlobal.Config.ExploreBaseConfig.successfulRate) {
                    //失败，
                    if (tempPet2) {
                        if (tempPet2.suitRate < suitRate) {
                            tempPet2 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                        }
                    }
                    else {
                        tempPet2 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                    }
                }
                else {
                    if (tempPet3) {
                        if (tempPet3.suitRate < suitRate) {
                            tempPet3 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                        }
                    }
                    else {
                        tempPet3 = { "id": petInfo.getId(), "suitRate": suitRate, "i": i };
                    }
                }
            }
            if (tempPet1) {
                tempPetInfos.splice(tempPet1.i, 1);
                resultPetsId.push(tempPet1.id);
            }
            else if (tempPet3) {
                tempPetInfos.splice(tempPet3.i, 1);
                resultPetsId.push(tempPet3.id);
            }
            else if (tempPet2) {
                tempPetInfos.splice(tempPet2.i, 1);
                resultPetsId.push(tempPet2.id);
            }
        }
        return resultPetsId;
    };
    ExpeditionModel.prototype._SortPet2 = function (lInfo, rInfo) {
        var lPower = lInfo.getPower();
        var rPower = rInfo.getPower();
        return lPower - rPower;
    };
    return ExpeditionModel;
}(BaseSystem));
__reflect(ExpeditionModel.prototype, "ExpeditionModel");
//# sourceMappingURL=ExpeditionModel.js.map