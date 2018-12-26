class HouseSendCheckData  {

    private m_IsTips: boolean
    private m_IsUse: boolean

	private m_Callback: Function
	private m_GetFunc: Function

	public constructor(callback: Function, getFunc: Function) {
		this.m_Callback = callback
		this.m_GetFunc = getFunc
	}

	private SendBoost() {
		if (this.m_Callback) {
			this.m_Callback()
		}
	}

	private GetCost() {
		return this.m_GetFunc()
	}

    public SendUp() {
		let cost = this.GetCost()
        let curNum = GameGlobal.YingYuanModel.GetIntimacy()

        if (cost > curNum) {
            WarnWin.show("亲密度不足，是否前往送花提升？", () => {
                ViewManager.ins().open(YingYuanXianHuaPanel)
            }, this)
            return false
        }

        this.SendBoost()
        return true
    }
}