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
var GodPieModel = (function (_super) {
    __extends(GodPieModel, _super);
    function GodPieModel() {
        var _this = _super.call(this) || this;
        _this.m_Infos = [];
        _this.m_PopStep = 0;
        _this.regNetMsg(S2cProtocol.sc_rechargew_shitinit, _this.doGodPiePanlInitData);
        _this.regNetMsg(S2cProtocol.sc_rechargew_shit, _this.doGodPiePanlData);
        _this.regNetMsg(S2cProtocol.sc_rechargew_shitstep, _this.newdata);
        _this.regNetMsg(S2cProtocol.sc_rechargew_shitclose, _this._DoShitClose);
        _this.regNetMsg(S2cProtocol.sc_rechargew_shitindex, _this._DoShitIndex);
        return _this;
    }
    GodPieModel.IsActOpen = function (info) {
        if (info == null || info.config == null) {
            return false;
        }
        if (info.config.endTime < GameServer.serverTime || GameServer.serverTime < info.config.startTime) {
            return false;
        }
        return true;
    };
    GodPieModel.prototype._ShowPop = function () {
        if (this.m_PopStep > 0) {
            return;
        }
        this.m_PopStep = 1;
        TimerManager.ins().doTimer(3000, 1, this._Show, this);
    };
    GodPieModel.prototype.SetShowState = function () {
        this.m_PopStep = 2;
    };
    GodPieModel.prototype._Show = function () {
        if (this.m_PopStep == 1) {
            this.SetShowState();
            // if (UserFb.ins().guanqiaID <= 20) {
            //     return
            // }
            if (!GodPieModel.IsDeblocking()) {
                return;
            }
            for (var i = 0; i < this.m_Infos.length; ++i) {
                var info = this.m_Infos[i];
                if (!GodPieModel.IsActOpen(info)) {
                    continue;
                }
                var canBuy = false;
                for (var j = 0; j < info.config.awards.length; ++j) {
                    if ((info.info.getnum[j] || 0) < (info.config.awards[j].buycount || 1)) {
                        canBuy = true;
                    }
                }
                if (canBuy && !FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE)) {
                    ViewManager.ins().open(GodPieWin, i);
                    break;
                }
            }
        }
    };
    GodPieModel.prototype._SetDefaultData = function (config) {
        if (config == null || config.awards == null) {
            return;
        }
        for (var _i = 0, _a = config.awards; _i < _a.length; _i++) {
            var award = _a[_i];
            if (!award.buycount) {
                award.buycount = 1;
            }
        }
    };
    GodPieModel.prototype.ClearData = function () {
        this.m_Infos = [];
    };
    GodPieModel.prototype.doGodPiePanlInitData = function (rsp) {
        for (var _i = 0, _a = rsp.initinfo; _i < _a.length; _i++) {
            var data = _a[_i];
            this._SetDefaultData(data.config);
            this.m_Infos.push(data);
        }
        if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE) && this.m_Infos.length > 0) {
            this._ShowPop();
        }
        // for (let data of this.m_Infos) {
        //     if (!data.info.nopop) {
        //         this._ShowPop()
        //         break
        //     }
        // }
        GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
    };
    GodPieModel.prototype.doGodPiePanlData = function (bytes) {
        this._SetDefaultData(bytes.config);
        this.m_Infos.push(bytes);
        GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
        // if (!bytes.info.nopop) {
        //     this._ShowPop()
        // }
    };
    GodPieModel.prototype.newdata = function (bytes) {
        var info = this.GetInfo(bytes.payType, bytes.gid);
        if (info) {
            info.info.step = bytes.step;
            info.info.getnum = bytes.getnum;
            info.info.steps = bytes.steps;
            GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
        }
    };
    GodPieModel.prototype._DoShitClose = function (rsp) {
        var info = this.GetInfo(rsp.payType, rsp.gid);
        if (info) {
            info.config.endTime = 0;
            GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
        }
    };
    GodPieModel.prototype._DoShitIndex = function (rsp) {
        // Recharge.ins().Godpie(rsp.payType, rsp.gid, rsp.index, rsp.price)
    };
    GodPieModel.prototype.GetInfo = function (payType, gid) {
        for (var _i = 0, _a = this.m_Infos; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.config.payType == payType && info.config.gid == gid) {
                return info;
            }
        }
        return null;
    };
    GodPieModel.prototype.TopDataProvider = function () {
        var list = [];
        for (var _i = 0, _a = this.m_Infos; _i < _a.length; _i++) {
            var info = _a[_i];
            if (GodPieModel.IsActOpen(info) && !GodPieModel.IsGotten(info)) {
                list.push(info);
            }
        }
        return list;
    };
    // static GODPIE_ICONLIST = [
    //     "ui_hd_icon_tjxb01",
    //     "ui_hd_icon_tjxb02",
    //     "ui_hd_icon_tjxb03",
    //     "ui_hd_icon_tjxb04",
    //     "ui_hd_icon_tjxb05"
    // ]
    // public Sendnopop(payType: number, gid: number, nopop: boolean) {
    //     let req = new Sproto.cs_rechargew_setpop_request
    //     req.payType = payType
    //     req.gid = gid
    //     req.nopop = nopop
    //     // this.select = nopop
    //     let info = this.GetInfo(payType, gid)
    //     if (info) {
    //         info.info.nopop = nopop
    //     }
    //     this.Rpc(C2sProtocol.cs_rechargew_setpop, req)
    // }
    GodPieModel.prototype.Sendbuy = function (payType, gid, index) {
        var req = new Sproto.cs_rechargew_getawards_request;
        req.payType = payType;
        req.gid = gid;
        req.index = index;
        this.Rpc(C2sProtocol.cs_rechargew_getawards, req);
    };
    GodPieModel.prototype.IsRedPoint = function () {
        for (var _i = 0, _a = this.m_Infos; _i < _a.length; _i++) {
            var info = _a[_i];
            if (!GodPieModel.IsActOpen(info)) {
                continue;
            }
            for (var i = 0; i < info.config.awards.length; ++i) {
                if (GodPieModel.GetInfoStateByIndex(info, i) == RewardState.CanGet) {
                    return true;
                }
            }
        }
        return false;
    };
    GodPieModel.GetInfoIndex = function (info) {
        // 单笔充值只显示第一页
        // if (info.config.condType == GodPieCondType.TYPE_03) {
        //     return 0
        // }
        for (var i = 0; i < info.config.awards.length; i++) {
            var a = info.info.getnum[i] || 0;
            var b = info.config.awards[i].buycount || 1;
            if (a < b) {
                return i;
            }
        }
        return info.config.awards.length - 1;
    };
    GodPieModel.IsGotten = function (info) {
        if (info == null || info.config == null) {
            return false;
        }
        var awards = info.config.awards;
        // for (let award of awards) {
        for (var i = 0; i < awards.length; ++i) {
            var award = awards[i];
            var buyCount = award.buycount || 1;
            var getNum = info.info.getnum[i] || 0;
            if (getNum < buyCount) {
                return false;
            }
        }
        return true;
    };
    GodPieModel.GetInfoStateByIndex = function (info, index) {
        var totalCount = info.config.awards[index].buycount || 1;
        var buyCount = info.info.getnum[index] || 0;
        if (buyCount >= totalCount) {
            return RewardState.Gotten;
        }
        if (!this.IsActOpen(info)) {
            return RewardState.NotReached;
        }
        var cond = false;
        if (info.config.condType == 0) {
            cond = true;
        }
        else {
            if (info.config.condType == GodPieCondType.TYPE_03) {
                // for (let i = 0; i < info.config.targets.length; ++i) {
                //     if (info.info.steps[i] >= info.config.targets[i]) {
                //         cond = true
                //         break
                //     }
                // }
                cond = (info.info.steps[index] || 0) >= (info.config.targets[index] || 0);
            }
            else {
                cond = info.info.step >= (info.config.targets[index] || 0);
            }
        }
        if (!cond) {
            return RewardState.NotReached;
        }
        var prices = info.config.prices[index] || 0;
        if (!prices) {
            return RewardState.CanGet;
        }
        if (info.config.gtype == 2 && Checker.Money(MoneyConst.yuanbao, prices, false)) {
            return RewardState.CanGet;
        }
    };
    GodPieModel.GetBuyCountStr = function (info, index) {
        try {
            var buyCount = info.config.awards[index].buycount || 1;
            if (buyCount == 1) {
                return "";
            }
            return " (" + (info.info.getnum[index] || 0) + "/" + (buyCount) + ")";
        }
        catch (e) {
        }
        return "";
    };
    GodPieModel.IsFinish = function (info) {
        return info == null || GameServer.serverTime > info.config.endTime;
    };
    GodPieModel.IsDeblocking = function () {
        return Deblocking.Check(DeblockingType.TYPE_29, true);
    };
    return GodPieModel;
}(BaseSystem));
__reflect(GodPieModel.prototype, "GodPieModel");
//# sourceMappingURL=GodPieModel.js.map