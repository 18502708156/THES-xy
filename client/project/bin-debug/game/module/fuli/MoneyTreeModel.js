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
var MoneyTreeModel = (function (_super) {
    __extends(MoneyTreeModel, _super);
    function MoneyTreeModel() {
        var _this = _super.call(this) || this;
        _this.isOpen = [];
        _this.playNum = 0;
        _this.boxOn = 0;
        _this.addCoefficient = 1;
        _this.exp = 0;
        _this.boxInfo = 0;
        _this.mRechargeDay = 0;
        _this.regNetMsg(S2cProtocol.sc_money_tree_info, _this.doMoneyTreeInfo);
        _this.regNetMsg(S2cProtocol.sc_money_tree_play_info, _this.doPalyBack);
        _this.regNetMsg(S2cProtocol.sc_money_tree_reward_info, _this.doGetRewardBack);
        return _this;
    }
    MoneyTreeModel.prototype.sendPlayYaoYao = function () {
        // var e = this.getBytes();
        // e.writeCmd(this.protoSysID, 2), this.sendToServer(e)
        this.Rpc(C2sProtocol.cs_money_tree_play);
    };
    MoneyTreeModel.prototype.sendGetCaseReward = function (e) {
        var req = new Sproto.cs_money_tree_reward_request;
        req.id = e;
        this.Rpc(C2sProtocol.cs_money_tree_reward, req);
    };
    MoneyTreeModel.prototype.doMoneyTreeInfo = function (e) {
        this.playNum = e.playNum;
        this.boxOn = e.boxOn;
        this.addCoefficient = e.addCoefficient;
        this.exp = e.exp;
        this.boxInfo = e.boxInfo;
        GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE);
    };
    MoneyTreeModel.prototype.doPalyBack = function (e) {
        this.playNum = e.playNum;
        this.boxOn = e.boxOn;
        this.addCoefficient = e.addCoefficient;
        this.exp = e.exp;
        this.baoji = e.baoji;
        GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE, !1, this.baoji);
    };
    MoneyTreeModel.prototype.doGetRewardBack = function (e) {
        this.boxInfo = e.boxInfo;
        GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE);
    };
    MoneyTreeModel.ins = function () {
        return _super.ins.call(this);
    };
    MoneyTreeModel.prototype.getOrderByIndex = function (e) {
        if (e === void 0) { e = 0; }
        var t = this.boxInfo >> e & 1;
        return t;
    };
    MoneyTreeModel.prototype.getNowCoefficientinfo = function (e) {
        if (e === void 0) { e = 0; }
        var config = GameGlobal.Config.CashCowAmplitudeConfig;
        for (var i in config)
            if (config[i].level == this.addCoefficient + e)
                return config[i];
        return null;
    };
    Object.defineProperty(MoneyTreeModel.prototype, "maxNum", {
        get: function () {
            return this.checkCashCowBasicLenght(UserVip.MAX_LV);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MoneyTreeModel.prototype, "cruMaxNum", {
        get: function () {
            return this.checkCashCowBasicLenght();
        },
        enumerable: true,
        configurable: true
    });
    MoneyTreeModel.prototype.getIndexCost = function () {
        var config = GameGlobal.Config.CashCowBasicConfig;
        for (var t in config)
            if (config[t].time == this.boxOn + 1)
                return config[t];
        return null;
    };
    MoneyTreeModel.prototype.getBoxInfoByIndex = function (e) {
        var t = GameGlobal.Config.CashCowBoxConfig;
        for (var i in t)
            if (t[i].index == e)
                return t[i];
        return null;
    };
    MoneyTreeModel.prototype.checkCashCowBasicLenght = function (e) {
        if (e === void 0) { e = 0; }
        0 == e && (e = GameGlobal.actorModel.vipLv);
        var t = GameGlobal.Config.CashCowLimitConfig;
        for (var i in t)
            if (t[i].vip == e)
                return t[i].maxTime;
        return 0;
    };
    MoneyTreeModel.prototype.checkBoxIsCanget = function (e) {
        var t = this.getBoxInfoByIndex(e);
        return t.time <= this.playNum && this.getOrderByIndex(e - 1) <= 0 ? !0 : !1;
    };
    MoneyTreeModel.prototype.isHaveReward = function () {
        if (GameServer.serverOpenDay < 2)
            return !1;
        for (var e = 1; 4 > e; e++)
            if (this.checkBoxIsCanget(e))
                return !0;
        return this.HasFreeCountForMoneyTree();
    };
    MoneyTreeModel.GetTodayRecharge = function () {
        return 0;
    };
    MoneyTreeModel.prototype.HasFreeCountForMoneyTree = function () {
        var cost = MoneyTreeModel.ins().getIndexCost();
        var isFree = cost.yuanbao == 0 ? true : false;
        return isFree;
    };
    MoneyTreeModel.CheckOpen = function (showTip) {
        if (showTip === void 0) { showTip = false; }
        // if (GameServer.serverOpenDay < 2) {
        // 	if (showTip) {
        // 		UserTips.ins().showTips("|C:0xff0000&T:开服第三天开启聚宝盆|");
        // 	}
        // 	return false
        // }
        return true;
    };
    return MoneyTreeModel;
}(BaseSystem));
__reflect(MoneyTreeModel.prototype, "MoneyTreeModel");
//# sourceMappingURL=MoneyTreeModel.js.map