class BBuffStatusHpAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_BUFFSTATUSHP

	public src: number
	public target: number
	public args: number[]

	public static Create(data: Sproto.battle_event): BBuffStatusHpAction {
		let action = new BBuffStatusHpAction
		action.src = data.src
		action.target = data.target
		action.args = data.args
		action.actions = BattleTurnDataParse.ParseDatas(data.actions)
		return action
	}

	public IsLianji(): boolean {
		return this.args && this.args[0] == BuffType.TYPE_10
	}

	public IsFanji(): boolean {
		return this.args && this.args[0] == BuffType.TYPE_5
	}

	public OnUpdate(delta: number): AIUnitReturn {
		this.DoExecute()
		return AIUnitReturn.NEXT
	}

	protected DoExecute() {
		if (DEBUG) {
			console.log("Status HP Buff",  this.src, this.target, this.args)
		}
		let src = this.mContext.GetEntity(this.src)
		if (src) {
			src.mAI.ChangeHp(this.args[0], this.args[1], this.HasDead())
		}
	}
}