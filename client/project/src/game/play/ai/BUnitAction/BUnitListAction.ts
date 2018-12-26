class BUnitListAction extends BUnitAction {

    public mList: BUnitAction[] = []
    public mIndex: number = 0
    public mIsEnter = true

	public static CreateList(list: BUnitAction[]): BUnitListAction {
        let action = new BUnitListAction
        action.mList = list
		return action 
    }

    public OnUpdate(delta: number): AIUnitReturn {
        let action = this.mList[this.mIndex]
        if (action) {

            if (!action.mInit) {
				action.Init(this.mContext)
				action.mInit = true
			}
            if (this.mIsEnter) {
                action.OnEnter()
                this.mIsEnter = false
            }
            let ret = action.OnUpdate(delta)
            if (ret != AIUnitReturn.CONTINUE) {
                action.OnExit()
                ++this.mIndex
                this.mIsEnter = true
            }
            return AIUnitReturn.CONTINUE
        }
        return AIUnitReturn.NEXT
    }

    public OnExit(): void {
        // for (let action of this.mList) {
        //     action.OnExit()
        // }
    }
}
