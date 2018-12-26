
class DeityEquipRedPoint extends IRedPoint {
	public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly AWAKE = 1
		public static readonly INJECT = 2
		public static readonly RESOLVE = 3
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}

	constructor() {
		super()
	}

	public GetMessageDef(): string[] {
		return [MessageDef.CHANGE_EQUIP, MessageDef.DEITYEQUIP_INIT, MessageDef.ITEM_COUNT_CHANGE]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[DeityEquipRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == DeityEquipRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.DEITYEQUIP_ALL_NOTICE)
		}
	}
	
	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mRedPointMap) {
			if (this.mRedPointMap[key]) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.mRedPointMap[DeityEquipRedPoint.AWAKE] = GameGlobal.UserEquip.HasDeityEquipAwake()
		this.mRedPointMap[DeityEquipRedPoint.INJECT] = GameGlobal.UserEquip.HasDeityEquipInject()
		this.mRedPointMap[DeityEquipRedPoint.RESOLVE] = GameGlobal.UserEquip.HasDeityEquipResolve()
	}

	public IsRedAct(type: number) {
		this.Get(DeityEquipRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}