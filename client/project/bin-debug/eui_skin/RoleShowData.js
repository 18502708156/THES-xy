var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RoleShowData = (function () {
    function RoleShowData() {
        this.rideId = 0;
        this.wingId = 0;
        this.tianxId = 0;
        this.titleId = 0;
    }
    RoleShowData.prototype.GetSwordId = function () {
        if (this.swordID) {
            return this.swordID;
        }
        return RoleShowData.GetSwordAppId(this.shows ? this.shows[RoleShowDataType.ROLE_SWORD] : 0, this.job, this.sex);
    };
    RoleShowData.prototype.GetWingId = function () {
        if (this.wingId) {
            return this.wingId;
        }
        return RoleShowData.GetWingAppId(this.shows ? this.shows[RoleShowDataType.ROLE_WING] : 0);
    };
    RoleShowData.prototype.GetRideId = function () {
        if (this.rideId) {
            return this.rideId;
        }
        return RoleShowData.GetRideAppId(this.shows ? this.shows[RoleShowDataType.ROLE_RIDE] : 0);
    };
    RoleShowData.prototype.GetTianx = function () {
        if (this.tianxId) {
            return this.tianxId;
        }
        return RoleShowData.GetTianxAppId(this.shows ? this.shows[RoleShowDataType.ROLE_TIANXIAN] : 0);
    };
    RoleShowData.prototype.GetBodyId = function () {
        if (this.clothID) {
            return this.clothID;
        }
        return RoleShowData.GetBodyAppId(this.shows ? this.shows[RoleShowDataType.ROLE_SKIN] : 0, this.job, this.sex);
    };
    RoleShowData.prototype.GetTitleId = function () {
        if (this.titleId) {
            return this.titleId;
        }
        return this.shows ? (this.shows[RoleShowDataType.ROLE_TITLE] || 0) : 0;
    };
    RoleShowData.GetSwordAppId = function (showId, job, sex) {
        var weaponConfig = GameGlobal.Config.WeaponSkinConfig[showId];
        if (weaponConfig) {
            return weaponConfig.pid;
        }
        return 11000;
    };
    RoleShowData.GetWingAppId = function (showId) {
        var wingConfig = GameGlobal.Config.WingSkinConfig[showId];
        if (wingConfig) {
            return wingConfig.pid;
        }
        return 0;
    };
    RoleShowData.GetRideAppId = function (showId) {
        var rideConfig = GameGlobal.Config.RideSkinConfig[showId];
        if (rideConfig) {
            return rideConfig.pid;
        }
        return 0;
    };
    RoleShowData.GetTianxAppId = function (showId) {
        var rideConfig = GameGlobal.Config.FairySkinConfig[showId];
        if (rideConfig) {
            return rideConfig.pid;
        }
        return 0;
    };
    RoleShowData.GetBodyAppId = function (showId, job, sex) {
        var config = GameGlobal.Config.FashionSkinConfig[showId];
        if (config) {
            config = config[sex];
            if (config) {
                return config.pid;
            }
        }
        return 1001;
    };
    return RoleShowData;
}());
__reflect(RoleShowData.prototype, "RoleShowData");
/**
    shows类型
    角色： 1. 坐骑 2.翅膀 3.守护 4.神兵 5.时装 6.称号
    仙侣： 1. 法阵 2.仙位
    宠物： 1. 通灵 2.兽魂
 */
var RoleShowDataType = (function () {
    function RoleShowDataType() {
    }
    RoleShowDataType.ROLE_RIDE = 0;
    RoleShowDataType.ROLE_WING = 1;
    RoleShowDataType.ROLE_TIANXIAN = 2;
    RoleShowDataType.ROLE_SWORD = 3;
    RoleShowDataType.ROLE_SKIN = 4;
    RoleShowDataType.ROLE_TITLE = 5;
    RoleShowDataType.XIANLV_FZ = 0;
    RoleShowDataType.XIANLV_XW = 1;
    RoleShowDataType.PET_TL = 0;
    RoleShowDataType.PET_SH = 1;
    RoleShowDataType.TIANNV_LQ = 1;
    RoleShowDataType.TIANNV_HUA = 2;
    return RoleShowDataType;
}());
__reflect(RoleShowDataType.prototype, "RoleShowDataType");
var RoleShowDressType;
(function (RoleShowDressType) {
    RoleShowDressType[RoleShowDressType["ROLE"] = 1] = "ROLE";
    RoleShowDressType[RoleShowDressType["ARM"] = 2] = "ARM";
    RoleShowDressType[RoleShowDressType["WING"] = 3] = "WING";
    RoleShowDressType[RoleShowDressType["RIDE"] = 4] = "RIDE";
    RoleShowDressType[RoleShowDressType["TIANX"] = 5] = "TIANX";
})(RoleShowDressType || (RoleShowDressType = {}));
//# sourceMappingURL=RoleShowData.js.map