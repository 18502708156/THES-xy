var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EntityData = (function () {
    function EntityData() {
        this.skillsData = [];
        this.attributeData = [];
        this.sex = 0;
        this.job = 1;
        this.masterHandle = 0;
        this.posIndex = 0;
        this.side = 0;
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }
    // 是否在战场下面
    EntityData.prototype.IsSide = function () {
        return this.side == 2;
    };
    EntityData.prototype.parserBase = function (baseData) {
        this.serverId = 0;
        this.scale = AppearanceConfig.GetScale(baseData.monid);
        this.type = baseData.type;
        this.handle = baseData.handler;
        this.configID = baseData.monid;
        this.attributeData = baseData.attrs || [];
        this.masterHandle = baseData.ownerid;
        this.skillsData = baseData.skills || [];
        if (baseData.shows) {
            var shows = baseData.shows;
            this.entityName = shows.name;
            this.serverId = shows.serverid || 0;
            this.guildName = shows.guildname || "";
            this.guildID = shows.guildid || 0;
        }
        else {
            this.entityName = "";
        }
    };
    EntityData.prototype.parserAtt = function (attrs) {
        this.attributeData = attrs;
    };
    EntityData.prototype.getAtt = function (attType) {
        return this.attributeData[attType] || 0;
    };
    EntityData.prototype.GetAttr = function (attType) {
        return this.attributeData[attType] || 0;
    };
    EntityData.prototype.setAtt = function (attType, value) {
        if (attType == AttributeType.atHp) {
            if (value < 0) {
                value = 0;
            }
        }
        this.attributeData[attType] = value;
    };
    EntityData.prototype.GetName = function () {
        var config = GlobalConfig.ins().MonstersConfig[this.configID];
        if (config && config[GameGlobal.Config.MonstersConfig_keys.warname]) {
            return config[GameGlobal.Config.MonstersConfig_keys.name];
        }
        // 不显示名称
        return "";
    };
    // public get lv() {
    // 	let config = GlobalConfig.ins().MonstersConfig[this.configID]
    // 	if (config) {
    // 		return config[GameGlobal.Config.MonstersConfig_keys.level]
    // 	}
    // 	let data = UserFb.MonDict[this.configID]
    // 	if (data) {
    // 		return data.level
    // 	}
    // 	return 1
    // }
    EntityData.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    EntityData.prototype.GetHeadImgName = function () {
        return "";
    };
    EntityData.prototype.GetHeadImgName2 = function () {
        return "";
    };
    EntityData.prototype.GetSkillIDs = function () {
        if (this.skillsData && this.skillsData.length) {
            return this.skillsData;
        }
        return EntityData.default_skill_ids;
    };
    EntityData.prototype.GetTitle = function () { return null; };
    EntityData.prototype.GetWeaponId = function () { return null; };
    EntityData.prototype.GetWingId = function () { return null; };
    EntityData.prototype.GetRideId = function () { return null; };
    EntityData.prototype.GetBodyId = function () {
        var config = GlobalConfig.ins().MonstersConfig[this.configID];
        if (config) {
            return config[GameGlobal.Config.MonstersConfig_keys.avatar] || 0;
        }
        var data = UserFb.MonDict[this.configID];
        if (data) {
            return Number(data.avatar);
        }
        var chapterData = GameGlobal.RaidModel.mChapterData;
        if (chapterData && chapterData.mondata) {
            var data_1 = chapterData.mondata[this.configID];
            if (data_1) {
                return data_1.avatar || 0;
            }
        }
        return 0;
    };
    EntityData.prototype.GetBodyResPath = function () {
        return AppearanceConfig.GetAppe(this.GetBodyId());
    };
    EntityData.prototype.HasPlot = function () {
        var config = GlobalConfig.ins().MonstersConfig[this.configID];
        if (config) {
            return config[GameGlobal.Config.MonstersConfig_keys.talk];
        }
        var data = UserFb.MonDict[this.configID];
        if (data) {
            return data.talk;
        }
        return null;
    };
    EntityData.default_skill_ids = [14001];
    return EntityData;
}());
__reflect(EntityData.prototype, "EntityData", ["IBattleModel"]);
//# sourceMappingURL=EntityData.js.map