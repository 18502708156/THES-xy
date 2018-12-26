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
var GangModelRedPoint = (function (_super) {
    __extends(GangModelRedPoint, _super);
    function GangModelRedPoint() {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        return _this;
    }
    GangModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.GANG_UPDATE_BASE_INFO, MessageDef.GANG_UPDATE_APPLICANT_LIST,
            MessageDef.GANG_UPDATE_PANTAOINFO, MessageDef.GANG_SKILL_UP,
            MessageDef.GANG_SKILL_LEARN_UP, MessageDef.GANG_UPDATA_PROTECTOR_INFO,
            MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, MessageDef.GUILD_CONTRIB_UPDATE,
            MessageDef.ITEM_COUNT_CHANGE, MessageDef.GANG_EXIT_NOTICE,
            MessageDef.GANG_UPDATE_FBCOUNT, MessageDef.GANGBOSS_UPDATE_INFO,
            MessageDef.GANG_UPDATE_CONTRIBUTECOUNT, MessageDef.ACTIVITY_LIST_INFO,
            MessageDef.GANG_ID_CHANGE];
    };
    GangModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[GangModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    GangModelRedPoint.prototype.OnChange = function (index) {
        if (index == GangModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.GANG_ALL_NOTICE);
        }
    };
    GangModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    GangModelRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[GangModelRedPoint.VIEW_APPILICANT] = GameGlobal.GangModel.HasApplicant();
        this.mRedPointMap[GangModelRedPoint.CONTRIBUTE] = GameGlobal.GangModel.HasContributeAward();
        this.mRedPointMap[GangModelRedPoint.GUARD_UPGRADE] = GameGlobal.GangModel.CanGangProtectorUpgrade();
        this.mRedPointMap[GangModelRedPoint.DAILY_AWARD] = GameGlobal.GangModel.HasDailyAward();
        this.mRedPointMap[GangModelRedPoint.SKILL_UPGRADE] = GameGlobal.GangModel.CanGangSkillUpgrade();
        this.mRedPointMap[GangModelRedPoint.EAT_PEACH] = GameGlobal.GangModel.HasPantao();
        this.mRedPointMap[GangModelRedPoint.PEACH_AWARD] = GameGlobal.GangModel.HasPanTaoAward();
        this.mRedPointMap[GangModelRedPoint.GANG_MONSTER] = GameGlobal.GangBossModel.IsGangBossAct();
        this.mRedPointMap[GangModelRedPoint.GANG_MAP_ASSEMBLED] = GangConst.IsGangMapAssembledTIme();
        this.mRedPointMap[GangModelRedPoint.GANG_EXCHANGE] = GameGlobal.GangMapModel.CanItemExchange();
        this.mRedPointMap[GangModelRedPoint.GANG_BATTLE] = GameGlobal.GangModel.IsGangBattleOpen();
        this.mRedPointMap[GangModelRedPoint.GANG_FUBEN] = GameGlobal.GuildTeamModel.GetProfitCount() > 0;
        this.mRedPointMap[GangModelRedPoint.NO_GANG] = !GameGlobal.GangModel.HasGang();
    };
    GangModelRedPoint.prototype.IsRedAct = function (type) {
        this.Get(GangModelRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    GangModelRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    GangModelRedPoint.VIEW_APPILICANT = 1;
    GangModelRedPoint.CONTRIBUTE = 2;
    GangModelRedPoint.GUARD_UPGRADE = 3;
    GangModelRedPoint.DAILY_AWARD = 4;
    GangModelRedPoint.SKILL_UPGRADE = 5;
    GangModelRedPoint.EAT_PEACH = 6;
    GangModelRedPoint.PEACH_AWARD = 7;
    GangModelRedPoint.GANG_MONSTER = 8;
    GangModelRedPoint.GANG_MAP_ASSEMBLED = 9;
    GangModelRedPoint.GANG_EXCHANGE = 10;
    GangModelRedPoint.GANG_BATTLE = 11;
    GangModelRedPoint.GANG_FUBEN = 12;
    GangModelRedPoint.NO_GANG = 13;
    return GangModelRedPoint;
}(IRedPoint));
__reflect(GangModelRedPoint.prototype, "GangModelRedPoint");
//# sourceMappingURL=GangModelRedPoint.js.map