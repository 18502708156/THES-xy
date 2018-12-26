class BUnitAction {
	// 子类事件
	public actions: BUnitAction[] = null

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

	public mType: number

	public mInit: boolean
	protected mContext: BattleRaid

	/** 帧循环事件 */
	public Init(context: BattleRaid) {
		this.mContext = context
	}

	public OnUpdate(delta: number): AIUnitReturn {
		return AIUnitReturn.NEXT
	}

	OnEnter(): void {

	}

	OnExit(): void {

	}
	/** 帧循环事件结束 */

	/** 数据执行事件，直接执行结果 */
	public Execute(raid: BattleRaid) {
		this.mContext = raid
		this.DoExecute()
	}

	protected DoExecute() {

	}
}