class ListAction extends AIUnitAction {

    public mList: AIUnitAction[] = []
    public mIndex: number = 0
    private m_DoEnter = true

	public static Create(list: AIUnitAction[]): ParallelAction {
        let action = new ParallelAction
        action.mList = list
		return action 
    }

	public Init(unitState: AIUnitState): void {
		super.Init(unitState)
        for (let action of this.mList) {
            action.Init(unitState)
        }
    }

    public OnUpdate(delta: number): AIUnitReturn {
        let action = this.mList[this.mIndex]
        if (action) {
            if (this.m_DoEnter) {
                action.OnEnter()
                this.m_DoEnter = false
            }
            let ret = action.OnUpdate(delta)
            if (ret != AIUnitReturn.CONTINUE) {
                ++this.mIndex
                this.m_DoEnter = true
            }
            return AIUnitReturn.CONTINUE
        }
        return AIUnitReturn.NEXT
    }

    public OnExit(): void {
        for (let action of this.mList) {
            action.OnExit()
        }
    }
}
