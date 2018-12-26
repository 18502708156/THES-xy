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
var MJGeziItemType;
(function (MJGeziItemType) {
    MJGeziItemType[MJGeziItemType["socre"] = 1] = "socre";
    MJGeziItemType[MJGeziItemType["key"] = 2] = "key";
    MJGeziItemType[MJGeziItemType["box"] = 3] = "box";
})(MJGeziItemType || (MJGeziItemType = {}));
var MiJingModel = (function (_super) {
    __extends(MiJingModel, _super);
    function MiJingModel() {
        var _this = _super.call(this) || this;
        // public key:number;
        // public score:number;
        _this.usefreeTimes = 0;
        _this.dailyResetTimes = 0;
        /** 当前步数 */
        _this.dailyPace = 0;
        _this._posId = 1;
        _this._pace = 1;
        _this._floor = 1;
        _this.paceAwardFlag = [];
        _this.floorAwardFlag = [];
        _this.regNetMsg(S2cProtocol.sc_secret_info, _this._Do_sc_mijing_info);
        return _this;
    }
    Object.defineProperty(MiJingModel.prototype, "key", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiJingModel.prototype, "score", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    MiJingModel.prototype._Do_sc_mijing_info = function (rsp) {
        this._endTime = rsp.remaintime + GameServer.serverTime;
        this.posId = rsp.step;
        this.dailyPace = rsp.dailyStep;
        this.usefreeTimes = rsp.pitchCount;
        this.dailyResetTimes = rsp.resetCount;
        this.paceAwardFlag = rsp.drawBinStep;
        this.floorAwardFlag = rsp.drawBinFloor;
        MessageCenter.ins().dispatch(MessageDef.MIJING_INIT_INFO);
    };
    MiJingModel.prototype.GetPaceAwardState = function (id) {
        var data = this.paceAwardFlag[id - 1];
        return data ? data : BitRewardState.NotReached;
    };
    MiJingModel.prototype.GetFloorAwardState = function (id) {
        var data = this.floorAwardFlag[id - 1];
        return data ? data : BitRewardState.NotReached;
    };
    MiJingModel.prototype.getCurrentPaceRWCfg = function () {
        var MythPaceConfig = GameGlobal.Config.MythPaceConfig;
        for (var key in MythPaceConfig) {
            var element = MythPaceConfig[key];
            if (this.dailyPace >= element.pace) {
                var data = this.GetPaceAwardState(element.id);
                if (data == BitRewardState.CanGet) {
                    return element;
                }
            }
            else {
                return element;
            }
        }
        return null;
    };
    MiJingModel.prototype.redPointPaceRw = function () {
        var MythPaceConfig = GameGlobal.Config.MythPaceConfig;
        for (var key in MythPaceConfig) {
            var element = MythPaceConfig[key];
            if (this.dailyPace >= element.pace) {
                var data = this.GetPaceAwardState(element.id);
                if (data == BitRewardState.CanGet) {
                    return true;
                }
            }
        }
        return false;
    };
    MiJingModel.prototype.redPointFloorRw = function () {
        var cfg = GameGlobal.Config.MythFloorRwConfig;
        for (var key in cfg) {
            var element = cfg[key];
            if (this.floor >= element.floor) {
                var data = this.GetFloorAwardState(element.id);
                if (data == BitRewardState.CanGet) {
                    return true;
                }
            }
        }
        return false;
    };
    MiJingModel.prototype.getFreeTimes = function () {
        var freeTimes = GameGlobal.Config.MythBaseConfig.freeMythTimes;
        if (this.usefreeTimes > freeTimes) {
            return 0;
        }
        else {
            return freeTimes - this.usefreeTimes;
        }
    };
    MiJingModel.prototype.getEndTime = function () {
        return this._endTime - GameServer.serverTime;
    };
    Object.defineProperty(MiJingModel.prototype, "posId", {
        get: function () {
            return this._posId;
        },
        set: function (value) {
            this._posId = value;
            var cfg = GlobalConfig.ins().MythFloorConfig[this._posId];
            if (!cfg) {
                return;
            }
            this._pace = cfg.check;
            this._floor = cfg.floor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiJingModel.prototype, "floor", {
        get: function () {
            return this._floor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiJingModel.prototype, "pace", {
        get: function () {
            return this._pace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiJingModel.prototype, "maxFloor", {
        get: function () {
            return GameGlobal.Config.MythBaseConfig.maxFloor;
        },
        enumerable: true,
        configurable: true
    });
    MiJingModel.prototype.checkCanCast = function () {
        if (this.floor == this.maxFloor && this.pace == MiJingModel.MaxPace) {
            UserTips.InfoTip("已到顶层");
            return false;
        }
        var mjBaseCfg = GameGlobal.Config.MythBaseConfig;
        var freeTimes = this.getFreeTimes();
        var itemCount = 0;
        // let itemcfg = GameGlobal.Config.ItemConfig[mjBaseCfg.diceId];
        // if(itemcfg)
        // {
        // itemCount = UserBag.ins().getGoodsAllCountByid(0, itemcfg.id);
        // }
        if (freeTimes <= 0 && itemCount == 0 && Checker.Money(MoneyConst.yuanbao, mjBaseCfg.autoCost.count, false) == false) {
            UserTips.InfoTip("元宝不足");
            return false;
        }
    };
    /**抛骰子 */
    MiJingModel.prototype.onSendCast = function () {
        this.Rpc(C2sProtocol.cs_secret_pitch, null, this.callBack, this);
    };
    MiJingModel.prototype.callBack = function (rsp) {
        if (!rsp.ret) {
            return;
        }
        this.posId = this.posId + rsp.step;
        this.diceNum = rsp.step;
        GameGlobal.MessageCenter.dispatch(MessageDef.MIJING_CAST);
    };
    MiJingModel.prototype.onSendGetPosAward = function (pos) {
        this.Rpc(C2sProtocol.cs_secret_info);
        // let req = new Sproto.cs_mijing_reward_request
        // req.pos = pos
        // this.Rpc(C2sProtocol.cs_mijing_reward,req);
    };
    MiJingModel.prototype.onSendGetFloorAward = function (id) {
        var req = new Sproto.cs_secret_floor_rewards_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_secret_floor_rewards, req);
    };
    MiJingModel.prototype.onSendGetPaceAward = function (id) {
        var req = new Sproto.cs_secret_step_rewards_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_secret_step_rewards, req);
    };
    // public onSendExchange(type,id):void
    // {
    //     if (UserBag.ins().getSurplusCount() >= 1) {
    // 		let req = new Sproto.cs_mijing_exchange_request
    //         req.type = type
    //         req.id = id
    //         this.Rpc(C2sProtocol.cs_mijing_exchange,req);
    // 	} else UserTips.InfoTip("|C:0xff0000&T:背包已满，无法购买")
    // }
    MiJingModel.prototype.onSendReset = function () {
        this.Rpc(C2sProtocol.cs_secret_reset);
    };
    MiJingModel.MaxPace = 16;
    return MiJingModel;
}(BaseSystem));
__reflect(MiJingModel.prototype, "MiJingModel");
//# sourceMappingURL=MiJingModel.js.map