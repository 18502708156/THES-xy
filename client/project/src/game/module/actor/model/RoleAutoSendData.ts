class RoleAutoSendData {

	private static CONTINUE = 1
	private static UPDATE = 2
	private static ALL = (1 << RoleAutoSendData.CONTINUE) + (1 << RoleAutoSendData.UPDATE)

	public mSendFunc: Function
	public mStateChange: Function
	public mTime: number
	public mIsAuto = false
	public mStep = 0

	public constructor(sendFunc: Function, stateChange: Function, checkTime: number = 200) {
		this.mSendFunc = sendFunc
		this.mStateChange = stateChange
		this.mTime = checkTime
	}

	public Continue() {
		this.mStep = BitUtil.Set(this.mStep, RoleAutoSendData.CONTINUE, true)
		this.CallFunc()
	}

	public Toggle() {
		if (this.mIsAuto) {
			this.Stop()
		} else {
			this.Start()
		}
	}

	public Start() {
		if (this.mIsAuto) {
			return
		}
		this.mIsAuto = true
		this.mStep = RoleAutoSendData.ALL
		TimerManager.ins().doTimer(this.mTime, 0, this.Update, this)
		if (this.mStateChange) {
			this.mStateChange()
		}
	}

	public Stop() {
		this.mStep = 0
		if (!this.mIsAuto) {
			return
		}
		this.mIsAuto = false
		TimerManager.ins().removeAll(this)
		if (this.mStateChange) {
			this.mStateChange()
		}
	}

	public Update() {
		this.mStep = BitUtil.Set(this.mStep, RoleAutoSendData.UPDATE, true)
		this.CallFunc()
	}

	public Release() {
		this.Stop()
		this.mSendFunc = null
	}

	private CallFunc() {
		if (this.mStep != RoleAutoSendData.ALL) {
			return
		}
		if (this.mSendFunc) {
			this.mSendFunc()
		}
		this.mStep = 0
	}
}