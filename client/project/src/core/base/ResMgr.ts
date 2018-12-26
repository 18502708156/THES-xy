class ResMgr {

	private static NONE_LIST = null

	private static GetNoneList() {
		if (!this.NONE_LIST) {
			this.NONE_LIST = {
				[ResDataPath.GetUIEffePath("eff_ui_zb_001") + ".png"]: 1,
				[ResDataPath.GetUIEffePath("eff_ui_zb_002") + ".png"]: 1,
				[ResDataPath.GetUIEffePath("eff_ui_zb_003") + ".png"]: 1,
			}
		}
		return this.NONE_LIST
	}

	public static IMG_LIFT_TIME = 30 * 1000

	public static LIFE_TIME = 3 * 1000
	private static LOOP_TIME = 3 * 1000

	private static MAX_OP_COUNT = 40

	public static LOG = false

	private static m_Instance: ResMgr

	private static m_Ref: {[key: string]: number} = {}
	private static m_Wait: {[key: string]:  number} = {}

	private static m_IsUpdate = false

	private static m_ResConfig

	public static GetName(name: string): string {
		let rName = this.m_ResConfig.getName(name)
		if (rName) {
			return rName
		}
		return name
	}

	public static ins(): ResMgr {
		if (!this.m_Instance) {
			this.m_Instance = new ResMgr()
		}
		return this.m_Instance
	}

	public static Init(): void {
		this.m_ResConfig = RES["configInstance"]
	}

	public static GmInit(): void {
		// if (ActorModel.IsSimpleGM()) {
		// 	this.LOG = true
		// }
		// if (DEBUG) {
			// this.LIFE_TIME = 10 * 1000
			// this.LOOP_TIME = 5 * 1000
		// }
	}

	private static _DoUpdate(): void {
		let hasCount = 0
		let opCount = 0
		let timer = egret.getTimer()
		for (let key in this.m_Wait) {
			++hasCount
			// 如果释放对象过多，则终止当前循环
			if (opCount >= this.MAX_OP_COUNT) {
				break
			}
			if (timer >= this.m_Wait[key]) {
				if (this.DestroyRes(key)) {
					if (this.LOG) {
						// console.log(`curtime => ${timer}; name => ${key}; objtime => ${this.m_Wait[key]}`)
						console.log(`destroy name => ${key}`)
					}
					++opCount
				}
				delete this.m_Wait[key]
				--hasCount
			}
		}
		if (hasCount < 1) {
			TimerManager.ins().remove(this._DoUpdate, this)
			this.m_IsUpdate = false
		}
	}

	public static Ref(name: string): void {
		if (!name) {
			return
		}
		if (ResMgr.GetNoneList()[name]) {
			return
		}
		// 如果存在等待回收的队列中，则移除它
		if (this.m_Wait[name]) {
			delete this.m_Wait[name]
		}
		if (this.m_Ref[name]) {
			++this.m_Ref[name]
		} else {
			this.m_Ref[name] =  1
		}
	}

	public static Unref(name: string, lifeTime = null): boolean {
		if (!name) {
			return false
		}
		if (ResMgr.GetNoneList()[name]) {
			return false
		}
		// 不存在该资源
		if (!this.m_Ref[name]) {
			return false
		}
		// 如果计数为空
		if (--this.m_Ref[name] <= 0) {
			delete this.m_Ref[name]
			// 加入待回收列表
			this.m_Wait[name] = egret.getTimer() + (lifeTime || this.LIFE_TIME)
			if (!this.m_IsUpdate) {
				this.m_IsUpdate = true
				TimerManager.ins().doTimer(this.LOOP_TIME, 0, this._DoUpdate, this)
			}
			return true
		}
		return false
	}

	// 强行释放资源
	public static ForceUnref(name: string) {
		if (this.m_Ref[name]) {
			delete this.m_Ref[name]
		}
		this.m_Wait[name] = egret.getTimer() + 5
	}

	public static RefSkin(skinName: string): void {
		if (!skinName) {
			return
		}
		let list = RES_REF ? RES_REF[skinName] : null
		if (list) {
			// console.log("Skin => " +skinName+ " Ref -----> ")
			for (let data of list) {
				ResMgr.Ref(data)
				// console.log("           " + data)
			}
		}
	}

	public static UnrefSkin(skinName: string): void {
		if (!skinName) {
			return
		}
		let list = RES_REF ? RES_REF[skinName] : null
		if (list) {
			// console.log("Skin => " +skinName+ " Unref -----> ")
			for (let data of list) {
				ResMgr.Unref(data, ResMgr.IMG_LIFT_TIME)
				// console.log("           " + data)
			}
		}
	}

	public static DestroyRes(url: string): boolean {
		return RES.destroyRes(url)
	}

	public static DebugPrint(): void {
		let list: string[] = []
		for (let key in this.m_Ref) {
			list.push("key => " + key + " => " + this.m_Ref[key])	
		}
		console.log("ref ======================")
		console.log(list.join("\n"))
		list.length = 0
		let et = egret.getTimer()
		console.log("wait ======================", et)
		for (let key in this.m_Wait) {
			let t = this.m_Wait[key]
			list.push("key => " + key + "; time => " + t + "; left => " + (t - et))	
		}
		console.log(list.join("\n"))
	}
	public static getRefCount(name:string):number
	{
		if(!this.m_Ref[name])
			return  0;
		return this.m_Ref[name];
	}


	/**
	 * CACHE LIST
	 * ItemIcon.EFF_LIST
	 */
}
