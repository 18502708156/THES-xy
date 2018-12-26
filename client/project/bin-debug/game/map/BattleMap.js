var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleMap = (function () {
    function BattleMap() {
    }
    BattleMap.Parse = function (data) {
        this.mOldFbId = this.mFbId;
        this.mOldFbType = this.mFbType;
        this.mFbId = data.mFbId;
        this.mFbType = data.mFbType;
        this.mFbName = data.mFbName;
        this.mFbDesc = data.mFbDesc;
        this.mMapId = data.mMapId;
    };
    /*
     *	退出战斗清理数据
     *	是否从战斗副本退出
     */
    BattleMap.Exit = function () {
        this.mOldFbId = this.mFbId;
        this.mOldFbType = this.mFbType;
        this.mFbId = 0;
        this.mFbType = 0;
        this.mFbName = "";
        this.mFbDesc = "";
        this.mMapId = 0;
        return this.mOldFbType ? true : false;
    };
    BattleMap.IsNoramlLevel = function () {
        return this.mFbId == 0;
    };
    BattleMap.IsCangBaoTu = function () {
        return this.mFbType == UserFb.FB_TYPE_TREASURE;
    };
    BattleMap.IsGuanQiaBoss = function () {
        return this.mFbType == UserFb.FB_TYPE_GUANQIABOSS;
    };
    BattleMap.IsFieldBoss = function () {
        return this.mFbType == UserFb.FB_TYPE_FIELD_BOSS;
    };
    BattleMap.IsPersonalBoss = function () {
        return this.mFbType == UserFb.FB_TYPE_PERSONAL_BOSS;
    };
    BattleMap.IsPublicBoss = function () {
        return this.mFbType == UserFb.FB_TYPE_PUBLIC_BOSS;
    };
    return BattleMap;
}());
__reflect(BattleMap.prototype, "BattleMap");
//# sourceMappingURL=BattleMap.js.map