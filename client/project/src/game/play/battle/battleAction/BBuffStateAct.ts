class BBuffStateAct extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_BUFFSTATUSACT

	public src: number
	public target: number
	public args: number[]

	public static Create(data: Sproto.battle_event): BBuffStateAct {
		let action = new BBuffStateAct
		action.src = data.src
		action.target = data.target
		action.args = data.args
		action.actions = BattleTurnDataParse.ParseDatas(data.actions)
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	protected DoExecute() {
		console.log("Status HP Buff",  this.src, this.target, this.args)
		let target = this.mContext.GetEntity(this.target)
		if (target) {
			target.mAI.BuffAct(this.args[0], this.args[1], this.HasDead())
		}
	}
}
