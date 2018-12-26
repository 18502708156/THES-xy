var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MonstersConfig = (function () {
    function MonstersConfig() {
    }
    MonstersConfig.GetAppId = function (monId) {
        if (!monId) {
            return 0;
        }
        var config = GameGlobal.Config.MonstersConfig[monId];
        if (config) {
            return config[GameGlobal.Config.MonstersConfig_keys.avatar] || 0;
        }
        return 0;
    };
    MonstersConfig.GetName = function (monId) {
        var config = GameGlobal.Config.MonstersConfig[monId];
        if (config) {
            return config[GameGlobal.Config.MonstersConfig_keys.name];
        }
        return "";
    };
    MonstersConfig.CreateModel = function (config, rate) {
        if (rate === void 0) { rate = null; }
        var model = new EntityData;
        model.handle = MonstersConfig.GetHandle();
        model.type = EntityType.Monster;
        var configKey = GameGlobal.Config.MonstersConfig_keys;
        model.configID = config[configKey.id];
        var hp = rate ? Math.round(rate * config[configKey.hp]) : config[configKey.hp];
        model.setAtt(AttributeType.atHp, hp);
        model.setAtt(AttributeType.atMaxHp, hp);
        // model.setAtt(AttributeType.atAttack, config[configKey.atk]);
        // model.setAtt(AttributeType.atDef, config[configKey.def]);
        // model.setAtt(AttributeType.atCrit, config[configKey.crit]);
        // model.setAtt(AttributeType.atTough, config[configKey.tough]);
        model.scale = AppearanceConfig.GetScale(config[configKey.id]);
        return model;
    };
    MonstersConfig.CreateByData = function (configId, data, rate) {
        if (rate === void 0) { rate = null; }
        var model = new EntityData;
        model.handle = MonstersConfig.GetHandle();
        model.type = EntityType.Monster;
        model.configID = configId;
        var hp = data.hp;
        var atk = data.atk;
        var def = data.def;
        var crit = data.crit;
        var tough = data.tough;
        if (rate) {
            hp = Math.round(rate * hp);
            atk = Math.round(rate * atk);
            def = Math.round(rate * def);
            crit = Math.round(rate * crit);
            tough = Math.round(rate * tough);
        }
        model.setAtt(AttributeType.atHp, hp);
        model.setAtt(AttributeType.atMaxHp, hp);
        model.setAtt(AttributeType.atAttack, atk);
        model.setAtt(AttributeType.atDef, def);
        model.setAtt(AttributeType.atCrit, crit);
        model.setAtt(AttributeType.atTough, tough);
        return model;
    };
    MonstersConfig.GetHandle = function () {
        return ++MonstersConfig.HANDLE;
    };
    MonstersConfig.HANDLE = 900000;
    return MonstersConfig;
}());
__reflect(MonstersConfig.prototype, "MonstersConfig");
//# sourceMappingURL=MonstersConfig.js.map