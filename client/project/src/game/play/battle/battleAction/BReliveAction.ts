class BReliveAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_RELIVE

	private mSrc: number

	public static Create(data: Sproto.battle_event): BReliveAction {
		let action = new BReliveAction
		action.mSrc = data.src
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	protected DoExecute() {
		let src = this.mContext.GetEntity(this.mSrc)
		if (src) {
			src.mAI.Relive()
		}
	}
}