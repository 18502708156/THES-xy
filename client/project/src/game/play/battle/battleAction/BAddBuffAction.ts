class BAddBuffAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_ACTIONBUFF

	public src: number
	public target: number
	public args: number[]

	public static Create(data: Sproto.battle_event): BAddBuffAction {
		let action = new BAddBuffAction
		action.src = data.src
		action.target = data.target
		action.args = data.args
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		if (DEBUG) {
			// console.log("Add Buff", this.src, this.target, this.args)
		}
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	public DoExecute() {
		let target = this.mContext.GetEntity(this.target)
		if (!target) {
			return
		}
		for (let id of this.args) {
			target.mAI.AddBuff(id)
		}
	}
}
