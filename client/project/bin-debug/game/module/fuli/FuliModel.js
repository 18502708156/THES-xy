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
var FuliModel = (function (_super) {
    __extends(FuliModel, _super);
    function FuliModel() {
        var _this = _super.call(this) || this;
        _this.FuliData = new FuliData;
        _this.mRedPoint = new FuliRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_welfare_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_welfare_signin_info, _this.getSignInInfo);
        _this.regNetMsg(S2cProtocol.sc_welfare_bonus_add, _this._briberyInfo);
        _this.regNetMsg(S2cProtocol.sc_accu_login, _this._giveGoldInfo);
        _this.regNetMsg(S2cProtocol.sc_cashCow_info, _this._GoldTreeInfo);
        return _this;
    }
    FuliModel.prototype.IsRedPoint = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_125)) {
            return false;
        }
        return this.mRedPoint.signShowRedPoint() || this.mRedPoint.lvShowRedPoint() || this.mRedPoint.PracticeShowRedPoint()
            || this.mRedPoint.GoldShowRedPoint() || this.mRedPoint.IsGoldTree() || this.mRedPoint.IsGodTreeBox();
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**请求签到*/
    FuliModel.prototype.sendSignIn = function (type) {
        if (type == 2) {
            if (GameGlobal.actorModel.vipLv < GameGlobal.Config.WelfareBaseConfig.viplv) {
                GameGlobal.UserTips.showTips("VIP等级不足，请提升VIP等级");
                return;
            }
        }
        if (type == 3) {
            if (GameGlobal.RechargeModel.dailyRechare <= 0) {
                WarnWin.show("未充值任意金额，请前往充值", function () {
                    RechargeWin.Open();
                }, this);
                return;
            }
        }
        var req = new Sproto.cs_welfare_signin_req_request;
        req.rewardType = type;
        this.Rpc(C2sProtocol.cs_welfare_signin_req, req, this.signInSuccess, this);
    };
    FuliModel.prototype.signInSuccess = function (req) {
        if (req.ret) {
            GameGlobal.UserTips.showTips("领取成功");
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED);
        }
    };
    FuliModel.prototype.getSignInInfo = function (req) {
        this.FuliData.dailyId = req.dailyId || 1;
        this.FuliData.nextGiftDay = (req.totalDay + 1) || 1;
        this.FuliData.accDay = req.totalDay || 1;
        this.FuliData.rewardMark = req.rewardMark || 0;
    };
    FuliModel.prototype.sendLvGiftBag = function (id) {
        var req = new Sproto.cs_welfare_lv_reward_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_welfare_lv_reward, req, this.getLvGiftBag, this);
    };
    FuliModel.prototype.getLvGiftBag = function (req) {
        if (req.ret) {
            GameGlobal.UserTips.showTips("领取成功");
            this.FuliData.lvMark = req.lvReward;
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED);
        }
    };
    FuliModel.prototype._DoInitInfo = function (rsp) {
        this.FuliData.month = rsp.month;
        this.FuliData.week = rsp.week;
        this.FuliData.firstMonth = rsp.firstMonth;
        this.FuliData.foreverFlag = rsp.forever > 0;
        this.FuliData.lvMark = rsp.lvReward;
        this.FuliData.welfareReward = rsp.welfareReward;
        this.FuliData.rankData = rsp.rankData;
        this.FuliData.avgLv = rsp.avgLv;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED);
        if (rsp.month > 0 || rsp.week > 0 || rsp.forever > 0)
            MessageCenter.ins().dispatch(MessageDef.FULI_MONTH_WEEK_CHANGE);
    };
    //红包 信息
    FuliModel.prototype._briberyInfo = function (rsp) {
        //this.FuliData.itemDic[rsp.id]=rsp.endtime;
        this.FuliData.briberyID = rsp.id;
        this.FuliData.playerName = rsp.name;
        this.FuliData.endtime = rsp.endtime;
        //    this.FuliData.itemDataArr = 
        if (ViewManager.ins().isShow(BriberyBasePanel) == false) {
            ViewManager.ins().open(BriberyBasePanel);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_HAVEBRIBERY, rsp);
    };
    //送十万元宝 信息
    FuliModel.prototype._giveGoldInfo = function (rsp) {
        //this.FuliData.itemDic[rsp.id]=rsp.endtime;
        this.FuliData.addDayCount = rsp.count;
        this.FuliData.recordEdIndex = rsp.record;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GIVEGOLD_INFO);
    };
    //搖錢樹 信息
    FuliModel.prototype._GoldTreeInfo = function (rsp) {
        this.FuliData.level = rsp.level;
        this.FuliData.exp = rsp.exp;
        this.FuliData.odds = rsp.odds;
        this.FuliData.shake = rsp.shake;
        this.FuliData.drawBin = rsp.drawBin;
        this.FuliData.amplitude = rsp.amplitude;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GOLDTREE_INFO);
    };
    //兑换码
    FuliModel.prototype.SendRedeemCode = function (str) {
        var req = new Sproto.cs_welfare_redeemcode_request;
        req.redeemcode = str;
        this.Rpc(C2sProtocol.cs_welfare_redeemcode, req, function (rsp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_REDEEMCODE, rsp);
        }, this);
    };
    //领取福利
    FuliModel.prototype.ReceiveItem = function (index) {
        var _this = this;
        var req = new Sproto.cs_welfare_reward_request;
        req.no = index;
        this.Rpc(C2sProtocol.cs_welfare_reward, req, function (rsp) {
            if (rsp.ret) {
                _this.FuliData.welfareReward = rsp.welfareReward;
                GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_RECEIVEITEMSIGN, rsp);
            }
        }, this);
    };
    //历练是否领取宝箱
    FuliModel.prototype.isReceive = function (index) {
        return (this.FuliData.welfareReward & Math.pow(2, index)) > 0;
    };
    //领取红包
    FuliModel.prototype.ReceiveBribery = function (id) {
        var req = new Sproto.cs_welfare_bonus_open_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_welfare_bonus_open, req, function (rsp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_RECEIVEBRIBERY, rsp);
        }, this);
    };
    //送十万元宝
    FuliModel.prototype.GiveGold = function (index) {
        var req = new Sproto.cs_accu_login_get_request;
        req.index = index;
        this.Rpc(C2sProtocol.cs_accu_login_get, req);
    };
    //送十万元宝_是否領取元宝
    FuliModel.prototype.isReceiveGold = function (Id) {
        return (this.FuliData.recordEdIndex & Math.pow(2, Id)) > 0;
    };
    //搖錢
    FuliModel.prototype.playGold = function () {
        var req = new Sproto.cs_cashCow_shake_request;
        this.Rpc(C2sProtocol.cs_cashCow_shake, req);
    };
    //搖錢_寶箱
    FuliModel.prototype.playGoldBox = function (boxid) {
        var req = new Sproto.cs_cashCow_box_rewards_request;
        req.boxid = boxid;
        this.Rpc(C2sProtocol.cs_cashCow_box_rewards, req);
    };
    return FuliModel;
}(BaseSystem));
__reflect(FuliModel.prototype, "FuliModel");
var FuliRedPoint = (function (_super) {
    __extends(FuliRedPoint, _super);
    function FuliRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.mModel = model;
        return _this;
    }
    FuliRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[FuliRedPoint.INDEX_UP_SIGN] = this.signShowRedPoint,
            _a[FuliRedPoint.INDEX_UP_LEVEL] = this.lvShowRedPoint,
            _a[FuliRedPoint.INDEX_UP_PRA] = this.PracticeShowRedPoint,
            _a[FuliRedPoint.INDEX_UP_GOLD] = this.GoldShowRedPoint,
            _a;
        var _a;
    };
    FuliRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.FULI_GET_GIFT_SUCCEED,
            MessageDef.FULI_GET_RECEIVEITEMSIGN,
            MessageDef.FULI_GIVEGOLD_INFO,
            MessageDef.DAILY_ACTIVE_UPDATE,
            MessageDef.LEVEL_CHANGE,
            MessageDef.RECHARGE_DAILY_UPDATE
        ];
    };
    FuliRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_SIGN_UPDATE);
    };
    FuliRedPoint.prototype.signShowRedPoint = function () {
        var show = false;
        var vipLv = UserVip.ins().lv;
        for (var i = 0; i < 4; i++) {
            if (GameGlobal.Config.WelfareBaseConfig.viplv > vipLv && i == 1)
                continue;
            if (GameGlobal.RechargeModel.dailyRechare <= 0 && i == 2)
                continue;
            show = !BitUtil.Has(this.mModel.FuliData.rewardMark, i);
            if (show)
                break;
        }
        return show;
    };
    FuliRedPoint.prototype.lvShowRedPoint = function () {
        var show = false;
        var config = GameGlobal.Config.LvRewardConfig;
        for (var key in config) {
            if (GameGlobal.actorModel.level >= config[key].level) {
                show = !BitUtil.Has(this.mModel.FuliData.lvMark, Object.keys(config).indexOf(key) + 1);
                if (show)
                    break;
            }
        }
        return show;
    };
    FuliRedPoint.prototype.PracticeShowRedPoint = function () {
        if (Deblocking.IsDeblocking(GameGlobal.Config.WelfareBaseConfig.opentype)) {
            var show = false;
            var baseInfo = GameGlobal.DailyModel.baseInfo;
            var score = baseInfo.mCurActive;
            var config = GameGlobal.Config.WelfareBaseConfig.score;
            for (var key in config) {
                if (score >= config[key]) {
                    show = !this.mModel.isReceive(parseInt(key) + 1);
                    if (show)
                        break;
                }
            }
            return show;
        }
        else
            return false;
    };
    FuliRedPoint.prototype.GoldShowRedPoint = function () {
        var show = false;
        var config = GameGlobal.Config.PresentGoldConfig;
        for (var key in config) {
            if (this.mModel.FuliData.addDayCount >= config[key].days) {
                show = !this.mModel.isReceiveGold(config[key].id);
                if (show)
                    break;
            }
        }
        return show;
    };
    FuliRedPoint.prototype.IsGoldTree = function () {
        var config = GameGlobal.Config.CashCowBasicConfig[GameGlobal.FuliModel.FuliData.shake + 1];
        if (config) {
            return config.yuanbao == 0;
        }
        return false;
    };
    FuliRedPoint.prototype.IsGodTreeBox = function () {
        var boxArr = GameGlobal.FuliModel.FuliData.drawBin;
        if (!boxArr || !boxArr.length) {
            return;
        }
        for (var i = 0; i < boxArr.length; i++) {
            if (boxArr[i] == 2 || boxArr[i] == 3) {
                var config = GameGlobal.Config.CashCowBoxConfig[i + 1];
                if (!config) {
                    continue;
                }
                var openBoxCount = config.time;
                if (openBoxCount <= GameGlobal.FuliModel.FuliData.shake) {
                    return true;
                }
            }
        }
        return false;
    };
    FuliRedPoint.INDEX_UP_SIGN = 0;
    FuliRedPoint.INDEX_UP_LEVEL = 1;
    FuliRedPoint.INDEX_UP_PRA = 2;
    FuliRedPoint.INDEX_UP_GOLD = 3;
    return FuliRedPoint;
}(IRedPoint));
__reflect(FuliRedPoint.prototype, "FuliRedPoint");
//# sourceMappingURL=FuliModel.js.map