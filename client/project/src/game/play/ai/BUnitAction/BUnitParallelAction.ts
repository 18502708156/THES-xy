class BUnitParallelAction extends BUnitAction {

    public mList: BUnitAction[] = []

	public static Create(list: BUnitAction[]): BUnitParallelAction {
        let action = new BUnitParallelAction
        action.mList = list
		return action 
    }
    
	public Init(context: BattleRaid) {
		for (let action of this.mList) {
            action.Init(context)
        }
	}

    public OnEnter(): void {
        for (let action of this.mList) {
            action.OnEnter()
        }
    }

    public OnUpdate(delta: number): AIUnitReturn {
        for (let i = this.mList.length - 1; i >= 0; --i) {
            let action = this.mList[i]
            if (action.OnUpdate(delta) != AIUnitReturn.CONTINUE) {
                this.mList.splice(i, 1)
            }
        }
        if (this.mList.length < 1) {
            return AIUnitReturn.NEXT
        }
        return AIUnitReturn.CONTINUE
    }

    public OnExit(): void {
        for (let action of this.mList) {
            action.OnExit()
        }
    }
}