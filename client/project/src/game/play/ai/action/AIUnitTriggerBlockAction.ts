class AIUnitTriggerBlockAction extends AIUnitAction {

	public handle: number
    public beHandle: number 	// 受保护的对象

    public static CreateByData(handle: number, beHandle: number): AIUnitTriggerBlockAction {
        let action = new AIUnitTriggerBlockAction
		action.handle = handle
        action.beHandle = beHandle
        return action
    }
    
    public OnEnter(): void {
        let unit = this.m_UnitState.mUnit.mEntity.mRaid.GetEntity(this.handle)
        unit.mAI.Protect(this.handle, this.beHandle)
    }
}
