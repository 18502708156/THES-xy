class RedPointMgr {

	private static m_RolePoints: IRedPoint[] = []
	private static m_CheckPoints: {[key: string]: IRedPoint} = {}
	private static m_MessageDefs: {[key: string]: RedPointMessage} = {}
	private static m_Init = false
	private static m_IsUpdate = false

	public static Add(target: IRedPoint) {
		this.m_RolePoints.push(target)
	}

	public static AddDelayCheck(target: IRedPoint) {
		if (this.m_CheckPoints[target.GetType()]) {
			return
		}
		this.m_CheckPoints[target.GetType()] = target
		this._StartUpdate()
	}

	public static Init(): void {
		if (this.m_Init) {
			return
		}
		this.m_Init = true
		let count = 0
		let fail = 0
		for (let obj of this.m_RolePoints) {
			if (!obj.Init()) {
				console.log("RedPoint初始化失败", obj)
				++fail
				continue
			} else {
				++count
			}
			let messages = obj.GetMessageDef()
			for (let msg of messages) {
				let list = this.m_MessageDefs[msg]
				if (!list) {
					list = new RedPointMessage	
					list.mType = msg
					list.AddListener()
					this.m_MessageDefs[msg] = list
				}
				list.Add(obj)
			}
		}
		console.log("RedPointMgr:Init", count, "fail", fail)
	}

	private static _OnEnterFrame(t: number): boolean {
		if (!SubRoles.ROLE_INIT) {
			return
		}
		for (let k in this.m_CheckPoints) {
			this.m_CheckPoints[k].CheckAll()
			delete this.m_CheckPoints[k]
			return false
		}
		this._StopUpdate()
		return false
	}

	private static _StartUpdate(): void {
		if (this.m_IsUpdate) {
			return
		}
		this.m_IsUpdate = true
		egret.startTick(this._OnEnterFrame, this)
	}

	private static _StopUpdate(): void {
		if (!this.m_IsUpdate) {
			return
		}
		this.m_IsUpdate = false
		egret.stopTick(this._OnEnterFrame, this)
	}
}

class RedPointMessage {
	public mType: string
	private mList: IRedPoint[] = []
	private m_Index = 0
	private m_Length = 0

	public AddListener(): void {
		GameGlobal.MessageCenter.addListener(this.mType, this.DoMessage, this)
	}

	public DoMessage(): void {
		for (let data of this.mList) {
			if (data.OnMessage(this.mType)) {
				RedPointMgr.AddDelayCheck(data)
			}
		}
	}

	public Add(data: IRedPoint): void {
		this.mList.push(data)
		this.m_Length = this.mList.length
	}
}