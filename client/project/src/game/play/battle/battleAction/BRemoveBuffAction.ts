class BRemoveBuffAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_REMOVEBUFF

	public id: number
	public src: number
	public args: number[]

	public static Create(data: Sproto.battle_event): BRemoveBuffAction {
		let action = new BRemoveBuffAction
		action.id = data.id
		action.src = data.src
		action.args = data.args
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	public DoExecute() {
		let target = this.mContext.GetEntity(this.src)
		if (!target) {
			return
		}
		// for (let id of this.args) {
		// 	target.mAI.RemoveBuff(id)
		// }
		target.mAI.RemoveBuff(this.id, this.args[0] == 2)
	}
}