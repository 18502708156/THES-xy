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
var EntityRole = (function (_super) {
    __extends(EntityRole, _super);
    function EntityRole() {
        var _this = _super.call(this) || this;
        /**角色所有正在使用的皮肤集合  */
        _this.skinDic = {};
        return _this;
    }
    EntityRole.prototype.parserBase = function (baseData) {
        _super.prototype.parserBase.call(this, baseData);
        var show = baseData.shows.shows;
        if (!show) {
            return;
        }
        this.mBodyId = show[RoleShowDataType.ROLE_SKIN] || 0;
        this.mRideId = show[RoleShowDataType.ROLE_RIDE] || 0;
        this.mWingId = show[RoleShowDataType.ROLE_WING] || 0;
        this.mTianxianId = show[RoleShowDataType.ROLE_TIANXIAN] || 0;
        this.mSwordId = show[RoleShowDataType.ROLE_SWORD] || 0;
        this.mTitle = show[RoleShowDataType.ROLE_TITLE] || 0;
        this.job = baseData.shows.job;
        this.sex = baseData.shows.sex;
    };
    /**
     * 角色使用的皮肤集合
     */
    EntityRole.prototype.UpdateTemplateData = function (templateType, dressId, dressList) {
        switch (templateType) {
            case UserTemplate.TYPE_RIDE:
                this.mRideId = dressId;
                break;
            case UserTemplate.TYPE_WING:
                this.mWingId = dressId;
                break;
            case UserTemplate.TYPE_TIANX:
                this.mTianxianId = dressId;
                break;
            case UserTemplate.TYPE_SHENGB:
                this.mSwordId = dressId;
                break;
            default:
                // 其它的不需要更新
                return;
        }
        this.skinDic[templateType] = dressList;
        GameGlobal.RaidMgr.UpdateRole();
    };
    EntityRole.prototype.MergeData = function (data) {
        this.type = data.type;
        this.masterHandle = data.masterHandle;
        this.handle = data.handle;
        this.serverId = data.serverId;
        this.guildName = data.guildName;
        this.guildID = data.guildID;
        if (data.x) {
            this.x = data.x;
        }
        if (data.y) {
            this.y = data.y;
        }
        return this;
    };
    EntityRole.prototype.GetSkillIDs = function () {
        return this.skillsData;
    };
    ;
    EntityRole.prototype.GetName = function () {
        return this.entityName;
    };
    EntityRole.prototype.GetTitle = function () {
        return this.mTitle || 0;
    };
    EntityRole.prototype.GetWeaponId = function () {
        return RoleShowData.GetSwordAppId(this.mSwordId, this.job, this.sex);
    };
    EntityRole.prototype.GetWingId = function () {
        return RoleShowData.GetWingAppId(this.mWingId);
    };
    EntityRole.prototype.GetRideId = function () {
        return RoleShowData.GetRideAppId(this.mRideId);
    };
    EntityRole.prototype.GetBodyId = function () {
        return RoleShowData.GetBodyAppId(this.mBodyId, this.job, this.sex);
    };
    EntityRole.prototype.GetBodyResPath = function () {
        return AppearanceConfig.GetAppe(this.GetBodyId(), this.job, this.sex);
    };
    EntityRole.prototype.GetWeapontResPath = function () {
        return;
    };
    return EntityRole;
}(EntityData));
__reflect(EntityRole.prototype, "EntityRole");
//# sourceMappingURL=EntityRole.js.map