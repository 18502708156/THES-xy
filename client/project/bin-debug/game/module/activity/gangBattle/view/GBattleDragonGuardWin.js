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
var GBattleDragonGuardWin = (function (_super) {
    __extends(GBattleDragonGuardWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleDragonGuardWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleDragonGuardSkin";
        _this._AddClick(_this.btnConfirm, _this._OnClick);
        return _this;
    }
    GBattleDragonGuardWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "神龙鼎";
        var guardsInfo = GameGlobal.GangBattleModel.guardsInfo;
        this.bar.maximum = 100;
        this.bar.value = guardsInfo.mHp;
        this.labProgNum.text = guardsInfo.mHp + "%";
        if (guardsInfo.mGuardType == 0) {
            // this.labDurationTip.text = ""
            var monstrerIconList = GameGlobal.Config.GuildBattleBaseConfig.lboss_icon;
            var monsterNameList = GameGlobal.Config.GuildBattleBaseConfig.lboss_name;
            var idx_1 = 1;
            for (var _a = 0, monstrerIconList_1 = monstrerIconList; _a < monstrerIconList_1.length; _a++) {
                var icon = monstrerIconList_1[_a];
                if (this["item" + idx_1]) {
                    this["item" + idx_1].visible = true;
                    this["item" + idx_1].SetMonsterInfo(icon, monsterNameList[idx_1 - 1]);
                }
                idx_1++;
            }
            return;
        }
        // this.labDurationTip.text = `已占领时长：${GameServer.serverTime - guardsInfo.mHoldTime}s`
        // this.AddTimer(1000, 0, this.UpdateTime)
        var guardList = guardsInfo.mGuardList;
        if (guardList.length == 1) {
            this.item1.visible = false;
            this.item2.visible = true;
            this.item2.SetGuardInfo(guardList[0]);
            return;
        }
        var idx = 1;
        for (var _b = 0, guardList_1 = guardList; _b < guardList_1.length; _b++) {
            var info = guardList_1[_b];
            if (this["item" + idx]) {
                this["item" + idx].visible = true;
                this["item" + idx].SetGuardInfo(info);
                this["item" + idx].SetLeader(idx == 1);
            }
            idx++;
        }
    };
    GBattleDragonGuardWin.prototype.OnClose = function () {
        TimerManager.ins().removeAll(this);
        this.commonDialog.OnRemoved();
    };
    // private UpdateTime() {
    // 	let guardsInfo = GameGlobal.GangBattleModel.guardsInfo
    // 	this.labDurationTip.text = `已占领时长：${GameServer.serverTime - guardsInfo.mHoldTime}s`
    // }
    GBattleDragonGuardWin.prototype._OnClick = function (e) {
        var guardsInfo = GameGlobal.GangBattleModel.guardsInfo;
        if (guardsInfo.mGangId == GameGlobal.actorModel.guildID) {
            UserTips.ins().showTips("同帮会不可互相攻击");
            return;
        }
        GameGlobal.GangBattleModel.SendAttackBoss(null);
        this.CloseSelf();
    };
    GBattleDragonGuardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GBattleDragonGuardWin;
}(BaseEuiView));
__reflect(GBattleDragonGuardWin.prototype, "GBattleDragonGuardWin");
//# sourceMappingURL=GBattleDragonGuardWin.js.map