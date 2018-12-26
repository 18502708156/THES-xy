
class BattleDamageBaseData extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_ACTIONHP

	target: number
	type: DamageTypes
	value: number
	actions: BUnitAction[]

	public static Create(data: Sproto.battle_event): BattleDamageBaseData {
		let damageData = new BattleDamageBaseData
		damageData.target = data.target
		damageData.type = data.args[0]
		damageData.value = data.args[1]
		if (data.actions) {
			for (let d of data.actions) {
				let data = BattleTurnDataParse.ParseData(d)
				if (data) {
					damageData.Push(data)
				}
			}
		}
		return damageData
	}

	public HasDead(): boolean {
		if (this.actions) {
			for (let ac of this.actions) {
				if (ac.mType == BattleTurnDataParse.TYPE_DEAD) {
					return true
				}
			}
		}
		return false
	}

	public Push(action: BUnitAction) {
		if (!this.actions) {
			this.actions = []
		}
		this.actions.push(action)
	}
}
