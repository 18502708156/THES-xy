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
var GBattleEnterTempleTipWin = (function (_super) {
    __extends(GBattleEnterTempleTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleEnterTempleTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleEnterTempleTipSkin";
        _this._AddClick(_this.btnEnter, _this._OnClick);
        return _this;
    }
    GBattleEnterTempleTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "龙殿入口";
        var gangList = GameGlobal.GangBattleModel.mEnterDragonInfo.guildinfos;
        for (var idx = 0; idx < 3; idx++) {
            var info = gangList[idx];
            this["labGangName" + (idx + 1)].text = info ? info.guildName + ".s" + info.serverId : "";
        }
        var endTime = GameGlobal.GangBattleModel.mEnterDragonInfo.countdown;
        this.groupDuration.visible = endTime > GameServer.serverTime;
        if (endTime <= GameServer.serverTime) {
            return;
        }
        this.durationLab.SetColor(0x6e330b);
        this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS);
    };
    GBattleEnterTempleTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GBattleEnterTempleTipWin.prototype._OnClick = function (e) {
        if (!this.CanEnter()) {
            UserTips.ins().showTips("您的帮会未获得进入资格，可回到上层继续挑战天王");
            return;
        }
        GameGlobal.GangBattleModel.SendEnterNext();
        ViewManager.ins().close(this);
    };
    GBattleEnterTempleTipWin.prototype.CanEnter = function () {
        var myGangId = GameGlobal.actorModel.guildID;
        var gangList = GameGlobal.GangBattleModel.mEnterDragonInfo.guildinfos;
        for (var _i = 0, gangList_1 = gangList; _i < gangList_1.length; _i++) {
            var info = gangList_1[_i];
            if (myGangId == info.guildId) {
                return true;
            }
        }
        return false;
    };
    GBattleEnterTempleTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GBattleEnterTempleTipWin;
}(BaseEuiView));
__reflect(GBattleEnterTempleTipWin.prototype, "GBattleEnterTempleTipWin");
//# sourceMappingURL=GBattleEnterTempleTipWin.js.map