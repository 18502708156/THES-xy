class AIUnitWaitAction extends AIUnitAction {

    public mWait: boolean = true

    public OnUpdate(delta: number): AIUnitReturn {
        return this.mWait ? AIUnitReturn.CONTINUE : AIUnitReturn.NEXT
    }
}
