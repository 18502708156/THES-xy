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
/** 战斗结束事件 */
var BattleFinishData = (function (_super) {
    __extends(BattleFinishData, _super);
    function BattleFinishData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_FINISH;
        _this.ret = 0;
        return _this;
    }
    BattleFinishData.prototype.DoExecute = function () {
    };
    return BattleFinishData;
}(BUnitAction));
__reflect(BattleFinishData.prototype, "BattleFinishData");
/** 录像战斗结束事件 */
var BattleVideoFinishData = (function (_super) {
    __extends(BattleVideoFinishData, _super);
    function BattleVideoFinishData(cb) {
        var _this = _super.call(this) || this;
        _this.cb = cb;
        return _this;
    }
    BattleVideoFinishData.prototype.DoExecute = function () {
        GameGlobal.RaidMgr.EnterCurMapRaid();
        if (this.cb) {
            this.cb();
            this.cb = null;
        }
    };
    return BattleVideoFinishData;
}(BattleFinishData));
__reflect(BattleVideoFinishData.prototype, "BattleVideoFinishData");
/** 挂机战斗结束事件 */
var BattleNormalFinishData = (function (_super) {
    __extends(BattleNormalFinishData, _super);
    function BattleNormalFinishData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BattleNormalFinishData.prototype.DoExecute = function () {
        var _this = this;
        GameMap.GetBattleView().StartHide(function () {
            // 防止播放动画的时候副本切换了。
            if (GameGlobal.RaidMgr.mBattleRaid != _this.mContext) {
                return;
            }
            GameGlobal.RaidMgr.EnterCurMapRaid();
            GameGlobal.UserFb.sendWaveMonster();
        });
    };
    return BattleNormalFinishData;
}(BattleFinishData));
__reflect(BattleNormalFinishData.prototype, "BattleNormalFinishData");
/** 关卡战斗结束事件 */
var BattleDefaultFinishData = (function (_super) {
    __extends(BattleDefaultFinishData, _super);
    function BattleDefaultFinishData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rewards = [];
        _this.star = null;
        return _this;
    }
    BattleDefaultFinishData.prototype.DoExecute = function () {
        var _this = this;
        if (BattleMap.mFbType == UserFb.FB_TYPE_GANGMAP) {
            if (this.ret == 1) {
                GameGlobal.RaidModel.SendGetBossReward();
                GameGlobal.RaidMgr.ExitFbAndEnterMap();
                return;
            }
            GameGlobal.UserFb.sendExitFb();
            return;
        }
        if (this.ret == 1 || this.ret == 3) {
            ViewManager.ins().open(ResultWinPanel, this.rewards, function () {
                GameGlobal.RaidModel.SendGetBossReward();
                if (BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR && GameGlobal.GangBattleModel.NeedJumpToOutsider()
                    && _this.ret == 3) {
                    GameGlobal.UserFb.sendExitFb();
                    GameGlobal.GangBattleModel.SendEnterBattle();
                    return;
                }
                GameGlobal.RaidMgr.ExitFbAndEnterMap();
            }, this.star, this.ret);
        }
        else {
            if (BattleMap.IsGuanQiaBoss()) {
                GameGlobal.UserFb.mAuto = false;
            }
            ViewManager.ins().open(ResultFailPanel, this.rewards, function () {
                if (GameGlobal.UserFb.bCbtAutoFight) {
                    GameGlobal.UserFb.bCbtAutoFight = false; //藏宝图自动战斗中断
                }
                if (GameGlobal.UserFb.bTianTingAutoFight) {
                    GameGlobal.UserFb.bTianTingAutoFight = false; //勇闯天庭自动战斗中断
                }
                if (GameGlobal.UserFb.bLingLongTaAuto) {
                    GameGlobal.UserFb.bLingLongTaAuto = false;
                }
                if ((BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR || BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR_PK)
                    && GameGlobal.GangBattleModel.NeedJumpToOutsider()) {
                    if (GameGlobal.GangBattleModel.IsInOutsideScience()) {
                        GameGlobal.RaidMgr.ExitFbAndEnterMap();
                        GameGlobal.GangBattleModel.SendEnterBattle();
                        return;
                    }
                    GameGlobal.UserFb.sendExitFb();
                    GameGlobal.GangBattleModel.SendEnterBattle();
                    return;
                }
                GameGlobal.RaidMgr.ExitFbAndEnterMap();
            }, this.ret);
        }
    };
    return BattleDefaultFinishData;
}(BattleFinishData));
__reflect(BattleDefaultFinishData.prototype, "BattleDefaultFinishData");
/**竞技结束 */
var ArenaPKFinishData = (function (_super) {
    __extends(ArenaPKFinishData, _super);
    function ArenaPKFinishData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArenaPKFinishData.prototype.DoExecute = function () {
        if (!this.isWin && BattleMap.IsGuanQiaBoss()) {
            GameGlobal.UserFb.mAuto = false;
        }
        ViewManager.ins().open(ArenaPKResultPanel, this.isWin, this.rewards, this.maxrank, this.rank, this.lastrank, function () {
            GameGlobal.Arena.sendGetRewards();
            GameGlobal.RaidMgr.ExitFbAndEnterMap();
        });
    };
    return ArenaPKFinishData;
}(BattleDefaultFinishData));
__reflect(ArenaPKFinishData.prototype, "ArenaPKFinishData");
/**跨服争霸结束 */
var CrossFinishData = (function (_super) {
    __extends(CrossFinishData, _super);
    function CrossFinishData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrossFinishData.prototype.DoExecute = function () {
        ViewManager.ins().open(this.iswin ? CrossBattleResultWin : CrossBattleResultFailWin, this.commonpoint, function () {
            GameGlobal.RaidMgr.ExitFbAndEnterMap();
        });
    };
    return CrossFinishData;
}(BattleDefaultFinishData));
__reflect(CrossFinishData.prototype, "CrossFinishData");
/**捕捉宠物*/
var CatchPetFinishData = (function (_super) {
    __extends(CatchPetFinishData, _super);
    function CatchPetFinishData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CatchPetFinishData.prototype.DoExecute = function () {
        ViewManager.ins().open(this.iswin ? CatchPetResultWin : CatchPetResultFailWin, this.id, function () {
            GameGlobal.RaidMgr.EnterCurMapRaid();
        });
    };
    return CatchPetFinishData;
}(BattleDefaultFinishData));
__reflect(CatchPetFinishData.prototype, "CatchPetFinishData");
/**
 * 仙道会
 */
var XiandaoFinishData = (function (_super) {
    __extends(XiandaoFinishData, _super);
    function XiandaoFinishData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.roleData = [];
        return _this;
    }
    XiandaoFinishData.prototype.DoExecute = function () {
        // 关闭界面的时候请求地图数据
        if (GameGlobal.XiandaoModel.IsKnockout()) {
            GameGlobal.XiandaoModel.SendGetTime();
        }
        else {
            GameGlobal.XiandaoModel.SendGetMapInfo();
        }
        GameGlobal.RaidMgr.ExitFbAndEnterMap();
        ViewManager.ins().open(XiandaoResultPanel, this.isWin, this.roleData);
    };
    return XiandaoFinishData;
}(BattleDefaultFinishData));
__reflect(XiandaoFinishData.prototype, "XiandaoFinishData");
var CrossBossFinishData = (function (_super) {
    __extends(CrossBossFinishData, _super);
    function CrossBossFinishData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rewards = [];
        return _this;
    }
    CrossBossFinishData.prototype.DoExecute = function () {
        var view = ViewManager.ins().open(ResultAcrossBossPanel, this.rewards);
        view.SetCloseFunc(function () {
            GameGlobal.RaidModel.SendGetBossReward();
            GameGlobal.RaidMgr.ExitFbAndEnterMap();
        });
    };
    return CrossBossFinishData;
}(BattleFinishData));
__reflect(CrossBossFinishData.prototype, "CrossBossFinishData");
var LadderFinishData = (function (_super) {
    __extends(LadderFinishData, _super);
    function LadderFinishData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LadderFinishData.prototype.DoExecute = function () {
        var view = ViewManager.ins().open(LadderResultWin, this.isWin, this.list, this.upGrade, this.upStar, this.changeStar);
    };
    return LadderFinishData;
}(BattleFinishData));
__reflect(LadderFinishData.prototype, "LadderFinishData");
//# sourceMappingURL=BattleFinishData.js.map