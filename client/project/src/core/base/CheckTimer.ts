class CheckTimer {

	public constructor(func: Function, obj: any, gapTime = 800) {
		this.m_CheckFun = func
		this.m_CheckObj = obj
		this.m_GapTime = gapTime
	}

	private m_CheckFun: Function
	private m_CheckObj: any

	private m_GapTime: number
	private m_CheckHaveCanTimer: boolean = false
	private m_CheckTimer: number = 0

	private _ContinueCheck(): void {
		if (this.m_CheckFun && this.m_CheckObj)	{
			this.m_CheckFun.call(this.m_CheckObj)
		}
	}

	public CanCheck() {
		if (this.m_CheckTimer > egret.getTimer()) {
			// 如果在检查时间内
			if (this.m_CheckHaveCanTimer == false) {
				this.m_CheckHaveCanTimer = true
				TimerManager.ins().doTimer(this.m_GapTime + 200, 1, this._ContinueCheck, this)
			}
			return false
		}

        this.m_CheckTimer = egret.getTimer() + this.m_GapTime
		if (this.m_CheckHaveCanTimer) {
			TimerManager.ins().remove(this._ContinueCheck, this)
			this.m_CheckHaveCanTimer = false
		}
		return true
	}
}