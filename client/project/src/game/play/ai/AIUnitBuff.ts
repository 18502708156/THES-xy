class AIUnitBuff {
	public mBuffId: number = 0

	public GetEff() {
		let config = GameGlobal.Config.EffectsConfig[this.mBuffId]
		if (!config) {
			return
		}
		let id = config[GameGlobal.Config.EffectsConfig_keys.effID]
		if (!id) {
			return
		}
		let effConfig = GameGlobal.Config.BuffEffConfig[id]
		if (!effConfig) {
			return
		}
		return effConfig
	}

}