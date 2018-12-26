var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SkillsConfig = (function () {
    function SkillsConfig() {
    }
    SkillsConfig.GetSkillEffConfig = function (skillId) {
        var gConfig = GameGlobal.Config.SkillsConfig[skillId];
        if (gConfig) {
            var effId = gConfig[GameGlobal.Config.SkillsConfig_keys.effectId];
            if (effId && GameGlobal.Config.SkillEffConfig[effId]) {
                return GameGlobal.Config.SkillEffConfig[effId];
            }
        }
        return GameGlobal.Config.SkillEffConfig[skillId] || GameGlobal.Config.SkillEffConfig[Math.floor(skillId / 1000) * 1000 + 1];
    };
    SkillsConfig.GetSkillName = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        var skinName = "";
        if (config) {
            skinName = config[GameGlobal.Config.SkillsConfig_keys.skinName];
        }
        return skinName;
    };
    //技能效果表-獲取Skill品质
    SkillsConfig.GetSkillQuality = function (skillId) {
        var quality;
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (config) {
            quality = config[GameGlobal.Config.SkillsConfig_keys.quality];
        }
        if (!quality) {
            config = GameGlobal.Config.EffectsConfig[skillId];
            if (config) {
                quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
            }
        }
        return quality;
    };
    SkillsConfig.GetSkillIcon = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        var skinIcon = "";
        //暂时缺技能图标 by al 4.3
        if (config) {
            skinIcon = config[GameGlobal.Config.SkillsConfig_keys.icon];
        }
        return skinIcon + "";
    };
    SkillsConfig.GetSkillDesc = function (skillId, level, pos) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        var desc = "";
        if (config) {
            var val = 0;
            var actionid = config[GameGlobal.Config.SkillsConfig_keys.actions][0];
            if (actionid) {
                var ecfg = GameGlobal.Config.SkillsExeConfig[actionid];
                if (ecfg) {
                    var args = ecfg[GameGlobal.Config.SkillsExeConfig_keys.args];
                    if (args) {
                        val += args.b || 0;
                    }
                }
            }
            desc = config[GameGlobal.Config.SkillsConfig_keys.desc];
            val += GameGlobal.Config.SkillsUpgradeConfig[level || 1].changeb[pos] || 0;
            return StringUtils.Format(desc, val);
        }
        return desc;
    };
    SkillsConfig.GetBuffEffConfig = function (buffId) {
        return GameGlobal.Config.BuffEffConfig[buffId] || GameGlobal.Config.BuffEffConfig[Math.floor(buffId / 1000) * 1000 + 1];
    };
    SkillsConfig.GetSkillId = function (job, index) {
        var config = GameGlobal.Config.SkillsOpenConfig[index + 1];
        if (!config) {
            return 0;
        }
        return config.id[job - 1] || 0;
    };
    SkillsConfig.IsLock = function (index) {
        var openConfig = GlobalConfig.ins().SkillsOpenConfig[index + 1];
        if (!openConfig || !openConfig.id[0]) {
            return true;
        }
        return false;
    };
    SkillsConfig.GetOpenLevel = function (index) {
        var openConfig = GlobalConfig.ins().SkillsOpenConfig[index + 1];
        if (!openConfig) {
            return 99999;
        }
        return openConfig.level;
    };
    /**
0、对象上
1、对象地面（和施法一起播放）
2、对象身上的坐标
3、对象地面的坐标
     */
    SkillsConfig.BECAST_TYPE = {
        TYPE_0: 0,
        TYPE_1: 1,
        TYPE_2: 2,
        TYPE_3: 3,
    };
    return SkillsConfig;
}());
__reflect(SkillsConfig.prototype, "SkillsConfig");
//# sourceMappingURL=SkillsConfig.js.map