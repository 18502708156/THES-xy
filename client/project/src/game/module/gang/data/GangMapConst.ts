class GangMapConst {

    public static TYPE_MONSTER = 0
    public static TYPE_PLANT = 1

    public static GetGangMapItemName(gmItemId) {
        let config = GameGlobal.Config.GuildGitemConfig[gmItemId]
        if (!config)
        {
            
            return ""
        }

        return config.name
    }

    public static GetGangMapEntityId(type) {
        let config = this.GetGangMapMonsterConfig(type)
        if (!config)
            return 0

        return config.pid
    }

    public static GetGangMapTaskId(type) {
        for (let key in GameGlobal.Config.GuildMapTaskConfig)
        {
            let config = GameGlobal.Config.GuildMapTaskConfig[key]
            if (config.type == type)
            {
                return config.id
            }
        }
    }

    private static GetGangMapMonsterConfig(type) {
        let curPlayerLevel = GameGlobal.actorModel.level
        let monsterConfig
        for (let key in GameGlobal.Config.GuildMonsterConfig)
        {
            let configList = GameGlobal.Config.GuildMonsterConfig[key]
            monsterConfig = configList[type]
            if (monsterConfig.level > curPlayerLevel)
            {
                break
            }
        }

        return monsterConfig
    }
}
