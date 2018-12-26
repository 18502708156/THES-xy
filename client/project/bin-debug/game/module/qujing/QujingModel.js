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
var QujingModel = (function (_super) {
    __extends(QujingModel, _super);
    function QujingModel() {
        var _this = _super.call(this) || this;
        _this.mEscortBaseInfo = new EscortBaseInfo;
        _this.regNetMsg(S2cProtocol.sc_escort_info_update, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_escort_reward_show, _this._RecvRewardShow);
        _this.regNetMsg(S2cProtocol.sc_escort_record_data, _this._RecvRecordList);
        _this.regNetMsg(S2cProtocol.sc_escort_record_update, _this._RecvUpdateRecord);
        return _this;
    }
    QujingModel.prototype.Init = function () {
    };
    QujingModel.prototype._DoInitInfo = function (rsp) {
        this.mEscortBaseInfo.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_BASEINFO);
    };
    QujingModel.prototype._RecvRewardShow = function (rsp) {
        GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_SHOW_REWARD, rsp);
    };
    QujingModel.prototype._RecvRecordList = function (rsp) {
        this.mRecordList = new Array();
        for (var _i = 0, _a = rsp.records; _i < _a.length; _i++) {
            var record = _a[_i];
            if (record.type == 2) {
                var tempRecordInfo = new RecordInfo;
                tempRecordInfo.UpdateInfo(record);
                this.mRecordList.push(tempRecordInfo);
            }
        }
    };
    QujingModel.prototype._RecvUpdateRecord = function (rsp) {
        if (rsp.record.type != 2)
            return;
        var updateFlag = false;
        for (var _i = 0, _a = this.mRecordList; _i < _a.length; _i++) {
            var record = _a[_i];
            if (record.mRecordId == rsp.record.recordId) {
                record.UpdateInfo(rsp.record);
                updateFlag = true;
                break;
            }
        }
        if (!updateFlag) {
            var tempRecordInfo = new RecordInfo;
            tempRecordInfo.UpdateInfo(rsp.record);
            this.mRecordList.push(tempRecordInfo);
            this.RecordRobbedFlag(true);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_RECORD);
    };
    QujingModel.prototype.SendEnterEscortView = function () {
        this.Rpc(C2sProtocol.cs_escort_enter, new Sproto.cs_escort_enter_request);
    };
    QujingModel.prototype.SendRefreshQuality = function (type) {
        var req = new Sproto.cs_escort_refresh_quality_request;
        req.type = type;
        this.Rpc(C2sProtocol.cs_escort_refresh_quality, req);
    };
    QujingModel.prototype.SendStartEscort = function () {
        this.Rpc(C2sProtocol.cs_escort_perform, new Sproto.cs_escort_perform_request);
    };
    QujingModel.prototype.SendGainAward = function () {
        this.Rpc(C2sProtocol.cs_escort_get_reward, new Sproto.cs_escort_get_reward_request);
    };
    QujingModel.prototype.SendQuilkFinish = function () {
        this.Rpc(C2sProtocol.cs_escort_quick_complete, new Sproto.cs_escort_quick_complete_request);
    };
    QujingModel.prototype.SendRevenge = function (recordId) {
        this.mEscortFightType = QujingModel.ESCORT_FIGHT_TYPE_REVENGE;
        var req = new Sproto.cs_escort_avenge_request;
        req.recordId = recordId;
        this.Rpc(C2sProtocol.cs_escort_avenge, req);
    };
    QujingModel.prototype.SendEscortList = function () {
        var _this = this;
        this.Rpc(C2sProtocol.cs_escort_rob_list, new Sproto.cs_escort_rob_list_request, function (rsp) {
            _this.mEscortList = new Array();
            for (var _i = 0, _a = rsp.escortList; _i < _a.length; _i++) {
                var escortInfo = _a[_i];
                var tempEscortInfo = new EscortInfo;
                tempEscortInfo.UpdateInfo(escortInfo);
                _this.mEscortList.push(tempEscortInfo);
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_ESCORTLIST);
        }, this);
    };
    QujingModel.prototype.SendRob = function (playerId) {
        this.mEscortFightType = QujingModel.ESCORT_FIGHT_TYPE_ROB;
        var req = new Sproto.cs_escort_rob_perform_request;
        req.playerId = playerId;
        this.Rpc(C2sProtocol.cs_escort_rob_perform, req);
    };
    QujingModel.prototype.SendGetEscortInfo = function (playerId) {
        var _this = this;
        var req = new Sproto.cs_escort_catch_info_request;
        req.playerId = playerId;
        this.Rpc(C2sProtocol.cs_escort_catch_info, req, function (rsp) {
            if (!rsp || !rsp.escortInfo) {
                return;
            }
            var tempEscortInfo = _this.GetEscortInfo(rsp.escortInfo.playerid);
            tempEscortInfo.UpdateInfo(rsp.escortInfo);
            if (tempEscortInfo.mRobbedCount >= GameGlobal.Config.EscortBaseConfig.robnum) {
                UserTips.ins().showTips("已经被抢光了");
                return;
            }
            if (rsp.escortInfo.robMark) {
                UserTips.ins().showTips("已经拦截过该玩家");
                return;
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_SHOW_ROBVIEW, rsp.escortInfo.playerid);
        }, this);
    };
    Object.defineProperty(QujingModel.prototype, "baseInfo", {
        get: function () {
            return this.mEscortBaseInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QujingModel.prototype, "recordList", {
        get: function () {
            return this.mRecordList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QujingModel.prototype, "escortList", {
        get: function () {
            return this.mEscortList;
        },
        enumerable: true,
        configurable: true
    });
    QujingModel.prototype.GetRecordInfo = function (recordId) {
        for (var _i = 0, _a = this.mRecordList; _i < _a.length; _i++) {
            var record = _a[_i];
            if (record.mRecordId == recordId)
                return record;
        }
    };
    QujingModel.prototype.GetEscortInfo = function (playerId) {
        for (var _i = 0, _a = this.mEscortList; _i < _a.length; _i++) {
            var escortInfo = _a[_i];
            if (escortInfo.mPlayerId == playerId)
                return escortInfo;
        }
    };
    QujingModel.prototype.IsDoudleAwardTime = function () {
        var doubleTime = GameGlobal.Config.EscortBaseConfig.doubletime;
        return this._IsBetween(doubleTime[0]) || this._IsBetween(doubleTime[1]);
    };
    QujingModel.prototype._IsBetween = function (doubleTime) {
        var date = new Date(GameServer.serverTimeMilli);
        var curTime = GameServer.serverTimeMilli;
        var strArr = doubleTime.star.split(":");
        var startHour = parseInt(strArr[0]);
        var startMinutes = parseInt(strArr[1]);
        date.setHours(startHour, startMinutes);
        var startTime = date.getTime();
        strArr = doubleTime.ends.split(":");
        var endHour = parseInt(strArr[0]);
        var endMinutes = parseInt(strArr[1]);
        date.setHours(endHour, endMinutes);
        var endTime = date.getTime();
        if (endHour >= startHour)
            return curTime >= startTime && curTime <= endTime;
        date.setHours(23, 59, 59);
        var startTime1 = startTime;
        var endTime1 = date.getTime();
        var startTime2 = date.setHours(0, 0, 0);
        var endTime2 = endTime;
        return (curTime >= startTime1 && curTime <= endTime1) || (curTime >= startTime2 && curTime <= endTime2);
    };
    QujingModel.prototype.GetDoubleTimeDesc = function () {
        var doubleTimeArr = GameGlobal.Config.EscortBaseConfig.doubletime;
        var strArr = doubleTimeArr[0].star.split(":");
        var hour1 = parseInt(strArr[0]);
        var min1 = parseInt(strArr[1]);
        var date1 = new Date(GameServer.serverTimeMilli);
        date1.setHours(hour1, min1);
        var time1 = date1.getTime();
        strArr = doubleTimeArr[1].ends.split(":");
        var hour2 = parseInt(strArr[0]);
        var min2 = parseInt(strArr[1]);
        var date2 = new Date(GameServer.serverTimeMilli);
        date2.setHours(hour2, min2);
        var time2 = date2.getTime();
        if (GameServer.serverTimeMilli <= time1 && GameServer.serverTimeMilli >= time2)
            return "\u62A4\u9001\u65F6\u95F4\uFF1A\u5168\u5929 " + doubleTimeArr[0].star + "-" + doubleTimeArr[0].ends + "\u53CC\u500D";
        return "\u62A4\u9001\u65F6\u95F4\uFF1A\u5168\u5929 " + doubleTimeArr[1].star + "-" + doubleTimeArr[1].ends + "\u53CC\u500D";
    };
    QujingModel.prototype.IsCurQuality = function (quality) {
        return this.mEscortBaseInfo.mQuality == quality;
    };
    QujingModel.prototype.IsMaxQuality = function () {
        return this.mEscortBaseInfo.mQuality == 5;
    };
    QujingModel.prototype.GetConfigByQuality = function (quality) {
        for (var key in GameGlobal.Config.EscortAwardConfig) {
            var config = GameGlobal.Config.EscortAwardConfig[key];
            if (config.quality == quality)
                return config;
        }
    };
    QujingModel.prototype.CanRob = function (playerId) {
        if (playerId == GameGlobal.actorModel.actorID) {
            UserTips.ins().showTips("不可拦截自己");
            return false;
        }
        if (this.mEscortBaseInfo.mRobCount >= GameGlobal.Config.EscortBaseConfig.robtime) {
            UserTips.ins().showTips("拦截次数已经用完了");
            return false;
        }
        return true;
    };
    QujingModel.prototype.HasAward = function () {
        if (!this.mEscortBaseInfo)
            return false;
        return this.mEscortBaseInfo.mState == QujingModel.ESCORT_STATE_DONE;
    };
    QujingModel.prototype.HasRobbed = function () {
        return this.mRobbedFlag;
    };
    QujingModel.prototype.RecordRobbedFlag = function (b) {
        this.mRobbedFlag = b;
        GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_ROBBEDFLAG_CHANGE);
    };
    QujingModel.REFRESH_TYPE_ITEM = 1;
    QujingModel.REFRESH_TYPE_QUILK = 2;
    QujingModel.REFRESH_TYPE_NORMAL = 3;
    QujingModel.ESCORT_STATE_FREE = 1;
    QujingModel.ESCORT_STATE_DOING = 2;
    QujingModel.ESCORT_STATE_DONE = 3;
    QujingModel.ESCORT_FIGHT_TYPE_ROB = 1;
    QujingModel.ESCORT_FIGHT_TYPE_REVENGE = 2;
    return QujingModel;
}(BaseSystem));
__reflect(QujingModel.prototype, "QujingModel");
//# sourceMappingURL=QujingModel.js.map