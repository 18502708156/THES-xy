class BDelayAction extends BUnitAction{
	
    public mDelay: number = 0

	public static Create(delay: number): BDelayAction {
        let action = new BDelayAction
        action.mDelay = delay
		return action 
    }

    public OnUpdate(delta: number): AIUnitReturn {
        return (this.mDelay -= delta) > 0 ? AIUnitReturn.CONTINUE : AIUnitReturn.NEXT
    }
}
