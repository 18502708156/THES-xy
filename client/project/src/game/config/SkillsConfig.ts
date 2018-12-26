class SkillsConfig {

    /**
0、对象上
1、对象地面（和施法一起播放）
2、对象身上的坐标
3、对象地面的坐标
     */
    public static BECAST_TYPE = {
        TYPE_0: 0,
        TYPE_1: 1,
        TYPE_2: 2,
        TYPE_3: 3,
    }

    public static GetSkillEffConfig(skillId: number) {
        let gConfig = GameGlobal.Config.SkillsConfig[skillId]
        if (gConfig) {
            let effId = gConfig[GameGlobal.Config.SkillsConfig_keys.effectId]
            if (effId && GameGlobal.Config.SkillEffConfig[effId]) {
                return GameGlobal.Config.SkillEffConfig[effId]
            }
        }
        return GameGlobal.Config.SkillEffConfig[skillId] || GameGlobal.Config.SkillEffConfig[Math.floor(skillId / 1000) * 1000 + 1]
    }

    public static GetSkillName(skillId: number): string {
        let config = GameGlobal.Config.SkillsConfig[skillId]
        let skinName = ""
        if (config) {
           skinName = config[GameGlobal.Config.SkillsConfig_keys.skinName]
        }
        return skinName
    }
    //技能效果表-獲取Skill品质
     public static GetSkillQuality(skillId: number): string { 
        let config = GameGlobal.Config.EffectsConfig[skillId]
        let skinName = ""
        if (config) {
           skinName = config[GameGlobal.Config.EffectsConfig_keys.quality]
        }
        if (!skinName) {
            config = GameGlobal.Config.SkillsConfig[skillId]
            if (config) {
                skinName = config[GameGlobal.Config.SkillsConfig_keys.quality]
            }
        }
        return skinName
    }

    public static GetSkillIcon(skillId: number): string {
        let config = GameGlobal.Config.SkillsConfig[skillId]
        let skinIcon = ""
        //暂时缺技能图标 by al 4.3
        if (config) {
           skinIcon = config[GameGlobal.Config.SkillsConfig_keys.icon]
        }
        return skinIcon + ""
    }  

    public static GetSkillDesc(skillId: number, level: number, pos): string {
        let config = GameGlobal.Config.SkillsConfig[skillId]
        let desc = ""
        if (config) {
            let val = 0
            let actionid = config[GameGlobal.Config.SkillsConfig_keys.actions][0]
            if (actionid) {
                let ecfg = GameGlobal.Config.SkillsExeConfig[actionid]
                if (ecfg) {
                    let args = ecfg[GameGlobal.Config.SkillsExeConfig_keys.args]
                    if (args) {
                       val += args.b || 0
                    }
                }
            }
           desc = config[GameGlobal.Config.SkillsConfig_keys.desc]
           val += GameGlobal.Config.SkillsUpgradeConfig[level || 1].changeb[pos] || 0
           return StringUtils.Format(desc, val)
        }
        return desc
    }

    public static GetBuffEffConfig(buffId: number) {
        return GameGlobal.Config.BuffEffConfig[buffId] || GameGlobal.Config.BuffEffConfig[Math.floor(buffId / 1000) * 1000 + 1]
    }


    public static GetSkillId(job: number, index: number): number {
        let config = GameGlobal.Config.SkillsOpenConfig[index + 1]
        if (!config) {
            return 0
        }
        return config.id[job - 1] || 0
    }

    public static IsLock(index: number): boolean {
        let openConfig = GlobalConfig.ins().SkillsOpenConfig[index + 1]
        if (!openConfig || !openConfig.id[0]) {
            return true
        }
        return false
    }

    public static GetOpenLevel(index: number): number {
        let openConfig = GlobalConfig.ins().SkillsOpenConfig[index + 1]
        if (!openConfig) {
            return 99999
        }
        return openConfig.level
    }
}