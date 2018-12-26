class BBuffChangeHpAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_BUFFHP

	public src: number
	public target: number
	public arg: number

	public static Create(data: Sproto.battle_event): BBuffChangeHpAction {
		let action = new BBuffChangeHpAction
		action.src = data.src
		action.target = data.target
		action.arg = data.arg
		action.actions = BattleTurnDataParse.ParseDatas(data.actions)
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	protected DoExecute() {
		console.log("Change HP Buff", this.src, this.target, this.arg)
		let target = this.mContext.GetEntity(this.target)
		if (target) {
			target.mAI.ChangeHp(0, this.arg, this.HasDead())
		}
	}
}