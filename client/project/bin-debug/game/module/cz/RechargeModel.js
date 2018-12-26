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
var RechargeModel = (function (_super) {
    __extends(RechargeModel, _super);
    function RechargeModel() {
        var _this = _super.call(this) || this;
        /**充值类型已充记录 */
        _this.reward = {};
        _this.firsttime = 0;
        /**首充充值人民币数 */
        _this.rechargeNum = 0;
        /**首充界面领取状态 */
        _this.rewardState = [];
        /**每日充值人民币数 */
        _this.dailyRechare = 0;
        /**每日充值界面领取状态 0=未领取，1=领取 */
        _this.dailyReward = 0;
        /**每日充值界面对应哪天配置id */
        _this.dailyId = 0;
        /**玩家当天充值人民币数 */
        // public todayRechargeNum: number = 0;
        /**玩家累计充值人民币数 */
        _this.totalRechargeNum = 0;
        /**充值特惠 */
        _this.choicerechare = 0;
        _this.finish = {};
        /**玄女卡 */
        _this.xuanNvCard = false;
        _this.regNetMsg(S2cProtocol.sc_recharge_double, _this._DoUpdateDoublechargeInfo);
        _this.regNetMsg(S2cProtocol.sc_recharge_first_info, _this._DoUpdateFirstChargeInfo);
        _this.regNetMsg(S2cProtocol.sc_recharge_dailyrechare, _this._DoUpdateReChargDaily);
        _this.regNetMsg(S2cProtocol.sc_recharge_count, _this._DoUpdateReChargeCount);
        return _this;
    }
    RechargeModel.prototype.GetFirstRewardState = function (id) {
        for (var _i = 0, _a = this.rewardState; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data == id) {
                return true;
            }
        }
        return false;
    };
    RechargeModel.prototype.getPayItemsConfig = function () {
        return PayItemsConfig.GetConfig();
    };
    RechargeModel.prototype.getVipConfig = function () {
        return GameGlobal.Config.VipConfig;
    };
    RechargeModel.prototype.getListItemDate = function () {
        var config = this.getPayItemsConfig();
        var dataCll = [];
        for (var key in config) {
            var data = config[key];
            if (data.show == 1) {
                if (data.vipLv && GameGlobal.actorModel.vipLv < data.vipLv) {
                    continue;
                }
                dataCll.push(data);
            }
        }
        SortTools.sortMap(dataCll, "reorder");
        var week = GameGlobal.FuliModel.FuliData.week;
        var month = GameGlobal.FuliModel.FuliData.month;
        var foreverFlag = GameGlobal.FuliModel.FuliData.foreverFlag;
        for (var i = dataCll.length - 1; i >= 0; i--) {
            var data = dataCll[i];
            if ((data.type == 2 && month > 0)
                || (data.type == 3 && week > 0)
                || (data.type == 6 && foreverFlag)) {
                dataCll.splice(i, 1);
            }
            else if (data.condId && !this.finish[data.condId]) {
                dataCll.splice(i, 1);
            }
        }
        // if (month > 0)
        //     for (let i = 0; i < dataCll.length;)
        //         if (dataCll[i].type == 2)//2月卡
        //             dataCll.splice(i, 1);
        //         else
        //             i++
        // if (week > 0)
        //     for (let i = 0; i < dataCll.length;)
        //         if (dataCll[i].type == 3)//3周卡
        //             dataCll.splice(i, 1);
        //         else
        //             i++
        return dataCll;
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    RechargeModel.prototype.sendRecharge = function (id) {
        var orderInfo = RechargeModel.GetYbOrderInfo(id);
        if (!orderInfo) {
            console.error("not found recharge id => ", id);
            return;
        }
        if (ActorModel.IsGM()) {
            var req = new Sproto.cs_recharge_normal_request();
            req.rechargeid = id;
            this.Rpc(C2sProtocol.cs_recharge_normal, req);
        }
        else {
            this._Pay(orderInfo);
        }
    };
    RechargeModel.prototype._DoUpdateDoublechargeInfo = function (rsp) {
        this.reward = {};
        for (var _i = 0, _a = rsp.reward || []; _i < _a.length; _i++) {
            var data = _a[_i];
            this.reward[data] = true;
        }
        this.finish = {};
        for (var _b = 0, _c = rsp.finish || []; _b < _c.length; _b++) {
            var data = _c[_b];
            this.finish[data] = true;
        }
        this.choicerechare = rsp.choicerechare;
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_UPDATE, rsp.reward);
    };
    /**首充 --领取奖励 */
    RechargeModel.prototype.sendRechargeFirstReward = function (id) {
        var req = new Sproto.cs_recharge_first_reward_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_recharge_first_reward, req);
    };
    /**每日充值 1=任意金额奖励，2=48元奖励 --领取奖励*/
    RechargeModel.prototype.sendRechargeDailyReward = function (id) {
        var req = new Sproto.cs_recharge_get_dailyrecharge_reward_request;
        req.rewardid = id;
        this.Rpc(C2sProtocol.cs_recharge_get_dailyrecharge_reward, req);
    };
    /**首充 */
    RechargeModel.prototype._DoUpdateFirstChargeInfo = function (rsp) {
        this.rechargeNum = rsp.rechargeNum;
        this.rewardState = rsp.reward;
        this.firsttime = rsp.firsttime;
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_FIRST_UPDATE);
    };
    /**每日充值 */
    RechargeModel.prototype._DoUpdateReChargDaily = function (rsp) {
        this.dailyRechare = rsp.dailyrechare;
        this.dailyReward = rsp.rewardmark;
        this.dailyId = rsp.dailyid;
        // this.dailyId = (GameServer.serverOpenDay % 8) + 1
        this.xuanNvCard = true;
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_DAILY_UPDATE);
    };
    /**玩家充值数量 */
    RechargeModel.prototype._DoUpdateReChargeCount = function (rsp) {
        // this.todayRechargeNum = rsp.today;
        this.totalRechargeNum = rsp.total;
        MessageCenter.ins().dispatch(MessageDef.PLAYER_RECHARGE_UPDATE);
    };
    /**领取充值特惠奖励 */
    RechargeModel.prototype.sendGiftAward = function () {
        if (this.choicerechare > 0) {
            var req = new Sproto.cs_recharge_get_choice_reward_request;
            this.Rpc(C2sProtocol.cs_recharge_get_choice_reward, req);
        }
    };
    /** */
    RechargeModel.GetBaseInfo = function () {
        var orderInfo = {};
        orderInfo.productCode = "0";
        orderInfo.uid = Main.Instance.UserName;
        orderInfo.username = Main.Instance.UserName || "";
        orderInfo.userRoleId = GameGlobal.actorModel.actorID + "";
        orderInfo.userRoleName = GameGlobal.actorModel.name + "";
        orderInfo.userServer = Main.Instance.mConnectServerData.id + "";
        orderInfo.userLevel = (GameGlobal.actorModel.level) + "";
        orderInfo.count = 1;
        orderInfo.quantifier = '个';
        orderInfo.callbackUrl = 'http://zzby.mjh5.com:8501';
        orderInfo.extrasParams = Main.Instance.mConnectServerData.id + "," + GameGlobal.actorModel.actorID;
        orderInfo.vipLevel = UserVip.ins().lv || 0;
        return orderInfo;
    };
    RechargeModel.GetYbOrderInfo = function (id) {
        var config = GameGlobal.Config.PayItemsConfig;
        var configData = null;
        for (var key in config) {
            if (config[key].id == id) {
                configData = config[key];
                break;
            }
        }
        if (!configData) {
            console.log("not found pay id", id);
            return;
        }
        var orderInfo = RechargeModel.GetBaseInfo();
        orderInfo.cpOrderNo = 'yborderno00000' + id;
        orderInfo.amount = configData.cash + "";
        orderInfo.subject = configData.itemName + "";
        orderInfo.desc = configData.itemName + "";
        orderInfo.goodsId = this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id);
        orderInfo.extrasParams += ',' + this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id);
        return orderInfo;
    };
    RechargeModel.GetGoodsId = function (type, index) {
        switch (type) {
            case RechargeGoodsType.YUAN_BAO: return index;
            case RechargeGoodsType.MONTY_CARD: return 10000 + index;
            case RechargeGoodsType.INVEST: return 20000 + index;
            case RechargeGoodsType.GOD_01: return 1010000 + index;
            case RechargeGoodsType.GOD_02: return 1020000 + index;
            case RechargeGoodsType.RED_BAG: return index;
        }
        return index;
    };
    RechargeModel.prototype._Pay = function (orderInfo) {
        if (window["__REC__"]) {
            this.Rpc(C2sProtocol.cs_recharge_get_order_number, null, function (rsp) {
                var rspData = rsp;
                orderInfo.cpNo = rspData.order_number + "";
                window["__REC__"](orderInfo);
            });
        }
        else {
            console.error("not recharge !!!");
        }
    };
    RechargeModel.MAX_VIPLV = 20;
    return RechargeModel;
}(BaseSystem));
__reflect(RechargeModel.prototype, "RechargeModel");
var RechargeGoodsType;
(function (RechargeGoodsType) {
    RechargeGoodsType[RechargeGoodsType["YUAN_BAO"] = 0] = "YUAN_BAO";
    RechargeGoodsType[RechargeGoodsType["MONTY_CARD"] = 1] = "MONTY_CARD";
    RechargeGoodsType[RechargeGoodsType["INVEST"] = 2] = "INVEST";
    RechargeGoodsType[RechargeGoodsType["GOD_01"] = 3] = "GOD_01";
    RechargeGoodsType[RechargeGoodsType["GOD_02"] = 4] = "GOD_02";
    RechargeGoodsType[RechargeGoodsType["RED_BAG"] = 5] = "RED_BAG";
})(RechargeGoodsType || (RechargeGoodsType = {}));
//# sourceMappingURL=RechargeModel.js.map