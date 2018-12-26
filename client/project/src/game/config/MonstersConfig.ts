class MonstersConfig {

	public static GetAppId(monId: number): number {
		if (!monId) {
			return 0
		}
		let config = GameGlobal.Config.MonstersConfig[monId]
		if (config) {
			return config[GameGlobal.Config.MonstersConfig_keys.avatar] || 0
		}
		return 0
	}

	public static GetName(monId: number) {
		let config = GameGlobal.Config.MonstersConfig[monId]
		if (config) {
			return config[GameGlobal.Config.MonstersConfig_keys.name]
		}
		return ""
	}

	public static CreateModel(config, rate = null): EntityData {
		var model = new EntityData;
		model.handle = MonstersConfig.GetHandle()
		model.type = EntityType.Monster;

		let configKey = GameGlobal.Config.MonstersConfig_keys
		model.configID = config[configKey.id];
		let hp = rate ? Math.round(rate * config[configKey.hp]) : config[configKey.hp]
		model.setAtt(AttributeType.atHp, hp);
		model.setAtt(AttributeType.atMaxHp, hp);
		// model.setAtt(AttributeType.atAttack, config[configKey.atk]);
		// model.setAtt(AttributeType.atDef, config[configKey.def]);
		// model.setAtt(AttributeType.atCrit, config[configKey.crit]);
		// model.setAtt(AttributeType.atTough, config[configKey.tough]);

		model.scale = AppearanceConfig.GetScale(config[configKey.id])
		return model;
	}


	private static HANDLE = 900000

	public static CreateByData(configId: number, data: Sproto.chapter_mondata, rate = null): EntityData {
		var model = new EntityData;
		model.handle = MonstersConfig.GetHandle()
		model.type = EntityType.Monster;

		model.configID = configId
		let hp = data.hp
		let atk = data.atk
		let def = data.def
		let crit = data.crit
		let tough = data.tough
		if (rate) {
			hp = Math.round(rate * hp)
			atk = Math.round(rate * atk)
			def = Math.round(rate * def)
			crit = Math.round(rate * crit)
			tough = Math.round(rate * tough)
		} 
		model.setAtt(AttributeType.atHp, hp);
		model.setAtt(AttributeType.atMaxHp, hp);
		model.setAtt(AttributeType.atAttack, atk);
		model.setAtt(AttributeType.atDef, def);
		model.setAtt(AttributeType.atCrit, crit);
		model.setAtt(AttributeType.atTough, tough);
		return model;
	}

	public static GetHandle(): number {
		return ++MonstersConfig.HANDLE
	}
}