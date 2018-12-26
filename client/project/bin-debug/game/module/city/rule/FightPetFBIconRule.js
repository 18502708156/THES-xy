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
var FightPetFBIconRule = (function (_super) {
    __extends(FightPetFBIconRule, _super);
    function FightPetFBIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    FightPetFBIconRule.prototype.checkShowIcon = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
        if (activityData == null) {
            return false;
        }
        if (activityData.AllGotten()) {
            return false;
        }
        var actid = activityData.id;
        var btnConfig = GameGlobal.Config.ActivitySumBtnConfig;
        if (btnConfig[actid] && btnConfig[actid].icon) {
            this.iconDisplay.source = btnConfig[actid].icon + "_zc";
        }
        //let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(2);
        var b = Deblocking.Check(DeblockingType.TYPE_98, true) && activityData && activityData.isOpenActivity();
        if (b) {
            this.setTime(activityData.endTime * 1000);
        }
        else {
            this.setTime(0);
        }
        return b;
    };
    FightPetFBIconRule.prototype.checkShowRedPoint = function () {
        var actData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
        if (actData == null) {
            return false;
        }
        if (actData && actData.hasReward()) {
            return true;
        }
        if (FightPetFBIconRule.mIsFirst) {
            return true;
        }
        return false;
    };
    FightPetFBIconRule.prototype.tapExecute = function () {
        FightPetFBIconRule.mIsFirst = false;
        FightPetFBIconRule.Open();
    };
    FightPetFBIconRule.Open = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
        if (activityData == null) {
            return;
        }
        KaiFuActivityWin.Show(activityData.id); //传如了一个战宠副本id 打开要选中战宠icon
    };
    FightPetFBIconRule.mIsFirst = true;
    return FightPetFBIconRule;
}(RuleIconBase));
__reflect(FightPetFBIconRule.prototype, "FightPetFBIconRule");
//# sourceMappingURL=FightPetFBIconRule.js.map