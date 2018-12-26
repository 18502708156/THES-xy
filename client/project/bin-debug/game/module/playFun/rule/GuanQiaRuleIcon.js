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
var GuanQiaRuleIcon = (function (_super) {
    __extends(GuanQiaRuleIcon, _super);
    function GuanQiaRuleIcon(tar) {
        var _this = _super.call(this, tar) || this;
        _this.updateMessage = [
            MessageDef.RAID_KILL_MONSTER_COUNT
        ];
        _this.tar.imgf0.visible = false;
        _this.tar.imgf1.visible = false;
        _this.tar.imgf2.visible = false;
        _this.tar.currentState = "s0";
        return _this;
    }
    GuanQiaRuleIcon.prototype.DoHide = function () {
        this.tar.visible = false;
    };
    GuanQiaRuleIcon.prototype.update = function () {
        _super.prototype.update.call(this);
        this.tar.cbAuto.selected = GameGlobal.UserFb.mAuto;
        this.upDataGuanqia();
    };
    GuanQiaRuleIcon.prototype.checkShowIcon = function () {
        return !GameGlobal.UserFb.nextMap;
    };
    GuanQiaRuleIcon.prototype.checkShowRedPoint = function () {
        return 0;
    };
    GuanQiaRuleIcon.prototype.upDataGuanqia = function () {
        var userFb = GameGlobal.UserFb;
        var gqID = userFb.guanqiaID;
        if (gqID >= 0) {
            var need = Math.min(3, userFb.config.bossNeedWave);
            this.tar.currentState = "s" + need;
            var newValue = Math.min(userFb.killMonsterCount, userFb.config.bossNeedWave);
            ;
            this.SetVisibleState(newValue, need);
            var isBoss = userFb.killMonsterCount >= userFb.config.bossNeedWave;
            this.tar.goBossBtn.visible = isBoss;
            this.tar.imgOpen.visible = !isBoss;
        }
        else {
            this.tar.currentState = "s0";
        }
    };
    GuanQiaRuleIcon.prototype.SetVisibleState = function (cur, max) {
        var tar = this.tar;
        if (max == 1) {
            tar.imgf1.visible = cur >= 1;
        }
        else if (max == 2) {
            tar.imgf0.visible = cur >= 1;
            tar.imgf2.visible = cur >= 2;
        }
        else if (max == 3) {
            tar.imgf0.visible = cur >= 1;
            tar.imgf1.visible = cur >= 2;
            tar.imgf2.visible = cur >= 3;
        }
    };
    GuanQiaRuleIcon.prototype.tapExecute = function (tapTarget) {
        if (tapTarget == this.tar.cbAuto) {
            if (Deblocking.Check(DeblockingType.TYPE_3)) {
                GameGlobal.UserFb.mAuto = this.tar.cbAuto.selected;
                GameGlobal.UserFb.sendSetAuto();
            }
            else {
                this.tar.cbAuto.selected = false;
            }
        }
        else {
            ViewManager.ins().open(GuanQiaRewardWin);
        }
    };
    return GuanQiaRuleIcon;
}(RuleIconBase));
__reflect(GuanQiaRuleIcon.prototype, "GuanQiaRuleIcon");
var GuanQiaRuleIconTar = (function (_super) {
    __extends(GuanQiaRuleIconTar, _super);
    function GuanQiaRuleIconTar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GuanQiaRuleIconTar;
}(eui.Component));
__reflect(GuanQiaRuleIconTar.prototype, "GuanQiaRuleIconTar");
//# sourceMappingURL=GuanQiaRuleIcon.js.map