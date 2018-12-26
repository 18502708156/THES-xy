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
var GodPetActiveModel = (function (_super) {
    __extends(GodPetActiveModel, _super);
    function GodPetActiveModel() {
        var _this = _super.call(this) || this;
        _this.mCash = 0;
        _this.mReward = 0;
        _this.mRecordMap = {};
        _this.regNetMsg(S2cProtocol.sc_holy_pet_info, _this._DoInitInfo);
        return _this;
    }
    GodPetActiveModel.prototype.Init = function () {
    };
    GodPetActiveModel.prototype._DoInitInfo = function (rsp) {
        this.mCash = rsp.cash || this.mCash;
        this.mReward = rsp.reward || this.mReward;
        this.mSDay = rsp.sTime;
        this.mEDay = rsp.eTime;
        this.mCurDay = rsp.day;
        this._CaculTime();
        this.mRedPoint = this._CheckRedPoint();
        GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_INFO);
    };
    GodPetActiveModel.prototype.SendGainAward = function (targetId) {
        var req = new Sproto.cs_holy_pet_get_reward_request;
        req.no = targetId;
        this.Rpc(C2sProtocol.cs_holy_pet_get_reward, req);
    };
    GodPetActiveModel.prototype.SendLottery = function () {
        var _this = this;
        var req = new Sproto.cs_holy_pet_luck_draw_request;
        this.Rpc(C2sProtocol.cs_holy_pet_luck_draw, req, function (rsp) {
            if (!rsp.ret)
                return;
            _this.mAwardList = rsp.data;
            _this.mAwardId = rsp.no;
            _this.UpdateRecordMap(rsp.luckLog);
            GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_LOTTERY_NOTICE);
            GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO);
            GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_LOTTERY);
        }, this);
    };
    GodPetActiveModel.prototype.SendGetAwardInfo = function () {
        var _this = this;
        var req = new Sproto.cs_holy_pet_get_info_request;
        this.Rpc(C2sProtocol.cs_holy_pet_get_info, req, function (rsp) {
            _this.mAwardList = rsp.data;
            _this.UpdateRecordMap(rsp.luckLog);
            GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO);
        }, this);
    };
    GodPetActiveModel.prototype.IsTargetDone = function (targetId) {
        var config = GameGlobal.Config.BeastAwardConfig[targetId];
        if (!config)
            return false;
        return config.money <= this.mCash;
    };
    GodPetActiveModel.prototype.GetAwardIdx = function () {
        var idx = 1;
        for (var _i = 0, _a = GameGlobal.Config.BeastLotteryConfig.showitem; _i < _a.length; _i++) {
            var award = _a[_i];
            if (award.id == this.mAwardId)
                return idx;
            idx++;
        }
        return -1;
    };
    GodPetActiveModel.prototype.UpdateRecordMap = function (records) {
        this.mRecordMap = {};
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            this.mRecordMap[record] = true;
        }
    };
    GodPetActiveModel.prototype.HasGain = function (itemId) {
        return this.mRecordMap[itemId] == true;
    };
    GodPetActiveModel.prototype.HasRewardGained = function (targetId) {
        return (this.mReward & Math.pow(2, targetId)) > 0;
    };
    GodPetActiveModel.prototype.GetCashCount = function () {
        return this.mCash;
    };
    GodPetActiveModel.prototype.GetAwardList = function () {
        return this.mAwardList.reverse();
    };
    GodPetActiveModel.prototype.GetAwards = function () {
        return [{ type: 1, count: 1, id: this.mAwardId }];
    };
    GodPetActiveModel.prototype.IsOpenActive = function () {
        return this.mCurDay >= this.mSDay && this.mCurDay <= this.mEDay;
    };
    GodPetActiveModel.prototype.GetEndtime = function () {
        return this.mEndTime;
    };
    GodPetActiveModel.prototype._CaculTime = function () {
        var date = new Date(GameServer.serverTimeMilli);
        date.setHours(0, 0, 0);
        this.mEndTime = date.getTime() + (this.mEDay - this.mCurDay + 1) * (3600 * 24 * 1000) - 6000;
    };
    GodPetActiveModel.prototype._CheckRedPoint = function () {
        for (var key in GameGlobal.Config.BeastAwardConfig) {
            var config = GameGlobal.Config.BeastAwardConfig[key];
            if (config && this.IsTargetDone(config.id) && !this.HasRewardGained(config.id))
                return true;
        }
        return false;
    };
    GodPetActiveModel.prototype.CanLottery = function () {
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        return Checker.Data(cost, false);
    };
    GodPetActiveModel.prototype.IsGodPetLotteryOpen = function () {
        return GameServer.serverOpenDay >= GameGlobal.Config.BeastLotteryConfig.Days;
    };
    return GodPetActiveModel;
}(BaseSystem));
__reflect(GodPetActiveModel.prototype, "GodPetActiveModel");
//# sourceMappingURL=GodPetActiveModel.js.map