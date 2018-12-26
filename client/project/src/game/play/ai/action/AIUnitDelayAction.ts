class AIUnitDelayAction extends AIUnitAction {

    public mDelay: number = 0

	public static Create(delay: number): AIUnitDelayAction {
        let action = new AIUnitDelayAction
        action.mDelay = delay
		return action 
    }

    public OnUpdate(delta: number): AIUnitReturn {
        return (this.mDelay -= delta) > 0 ? AIUnitReturn.CONTINUE : AIUnitReturn.NEXT
    }
}
