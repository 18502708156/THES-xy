class YuanfenModel extends BaseSystem {

	private actMap: {[key: number]: boolean} = {}

	public constructor() {
		super()

		this.mRedPoint = new YuanfenModelRedPoint(this)
		this.regNetMsg(S2cProtocol.sc_brother_info, this._DoInitInfo)
	}

	public Init() {
		
	}

	private _DoInitInfo(rsp: Sproto.sc_brother_info_request) {
		for (let id of rsp.data || [])
		{
			this.actMap[id] = true
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_INIT)
	}

	public SendActCombo(id) {
		let req = new Sproto.cs_brother_activation_request
		req.no = id
		this.Rpc(C2sProtocol.cs_brother_activation, req, (rsp: Sproto.cs_brother_activation_response) => {
			if (rsp.ret)
			{
				this.actMap[rsp.no] = true
				GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_UPDATE_LIST)
			}
		}, this)
	}


	public GetDataList(type) {
		let dataList = []
		for (let key in GameGlobal.Config.FateConfig)
		{
			let config = GameGlobal.Config.FateConfig[key]
			if (config.type == type)
			{
				dataList.push(config)
			}
		}

		let getWeight =  (config) => {
			let confId = config.id
			if (this.CanYuanfenAct(confId))
			{
				return confId - 100000
			}
			if (this.HasAct(confId)) {
				return confId - 10000
			}

			return confId
		}
        
        dataList.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})

		return dataList
	}

	public HasAct(id) {
		return this.actMap[id]
	}

	public CanYuanfenAct(id) {
		if (this.actMap[id])
			return false
		
		let config = GameGlobal.Config.FateConfig[id]
		for (let info of config.group)
		{
			if (!this._HasOne(info.type, info.id))
				return false
		}

		return true
	}

	public GetAllPower() {
		let power = 0
		for (let id in this.actMap)
		{
			let confId = parseInt(id)
			let config = GameGlobal.Config.FateConfig[confId]
			if (!config) {
				continue
			}
			power += ItemConfig.CalcAttrScoreValue(config.attrs)
		}

		return power
	}

	private _HasOne(type, id) {
		let hasFlag
		switch(type)
		{
			case 1:
				hasFlag = GameGlobal.PetModel.HasPet(id)
			break
			case 2:
				hasFlag = GameGlobal.TianShenModel.HasTianShen(id)
			break
			case 3:
				hasFlag = GameGlobal.XianlvModel.HasXianlv(id)
			break
		}

		return hasFlag
	}

	public CanActInList(type) {
		if (type && !Deblocking.Check(type+89, true)) //type对应的锁表ID  1：90 2：91 3：92 4：93
			return false

		for (let key in GameGlobal.Config.FateConfig)
		{
			let config = GameGlobal.Config.FateConfig[key]
			if ((config.type == type || type == null) && this.CanYuanfenAct(config.id))
			{
				return true
			}
		}

		return false
	}

	public mRedPoint: YuanfenModelRedPoint

	public IsRedPointYuanfen(type: number) {
		return this.mRedPoint.IsRedAct(type)
	}

	public IsRedPoint() {
		return this.mRedPoint.IsRedPoint()
	}
}

class YuanfenModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly TYPE_1 = 1
		public static readonly TYPE_2 = 2
		public static readonly TYPE_3 = 3
		public static readonly TYPE_4 = 4
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}
	private mModel: YuanfenModel

	constructor(model: YuanfenModel) {
		super()
		this.mModel = model
	}

	public GetMessageDef(): string[] {
		return [MessageDef.YUANFEN_INIT, MessageDef.YUANFEN_UPDATE_LIST,
				MessageDef.PET_ACTIVE, MessageDef.XIANLV_ACTIVE,
				MessageDef.TIANSHEN_ACTIVE]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[YuanfenModelRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == YuanfenModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_ALL_NOTICE)
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
		this.mRedPointMap[YuanfenModelRedPoint.TYPE_1] = this.mModel.CanActInList(1)
		this.mRedPointMap[YuanfenModelRedPoint.TYPE_2] = this.mModel.CanActInList(2)
		this.mRedPointMap[YuanfenModelRedPoint.TYPE_3] = this.mModel.CanActInList(3)
		this.mRedPointMap[YuanfenModelRedPoint.TYPE_4] = this.mModel.CanActInList(4)
	}

	public IsRedAct(type: number) {
		this.Get(YuanfenModelRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}