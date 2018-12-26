class TianShenModel extends BaseSystem {

	public MAX_LEVEL = 10

	/**使用属性丹数量 */
	public mDrugNum: number = 0;
	/**出战天神ID */
	public mBattleID: number = 0;
	/**天神列表 */
	public mTianShenList: { [key: number]: TianShenInfo } = {};

	public constructor() {
		super();
		this.mRedPoint = new TianShenModelRedPoint(this);
		this.regNetMsg(S2cProtocol.sc_tianshen_info, this._DoTianShenInfo);
	}

	public getBaseConfig() {
		return GameGlobal.Config.AirMarshalBaseConfig;
	}

	public GetCurDrugAttr() {
		let attr = CommonUtils.copyDataHandler(this.getBaseConfig().attredata)
		let drugNum = this.mDrugNum
		for (let k in attr) {
			attr[k].value *= drugNum
		}
		return attr
	}

	public Init() {
		for (let k in GameGlobal.Config.AirMarshalListConfig) {
			let info = new TianShenInfo
			info.mTianShenId = parseInt(k)
			this.mTianShenList[k] = info;
			GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AirMarshalListConfig[k].material.id, MessageDef.BAG_TIANSHEN_ACT_ITEM);
		}

		for (let k in GameGlobal.Config.AirMarshalLvproConfig) {
			let data = GameGlobal.Config.AirMarshalLvproConfig[k]
			this.MAX_LEVEL = CommonUtils.getObjectLength(data)
			GameGlobal.UserBag.AddListenerItem(data[0].cost[1].id, MessageDef.BAG_TIANSHEN_LEVEL_ITEM);
			break
		}
		GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AirMarshalBaseConfig.attreitemid, MessageDef.BAG_TIANSHEN_ATTR_ITEM);
	}

	public HasTianShen(tianShenId: number) {
		if (!tianShenId) {
			return false
		}
		return (this.mTianShenList[tianShenId] && this.mTianShenList[tianShenId].mLevel) ? true : false
	}

	public HasBattle(): boolean {
		return this.mBattleID > 0;
	}

	public GetLevel(id: number) {
		if (!id) {
			return 0
		}
		return this.mTianShenList[id].mLevel || 0
	}

	public GetBreachLvStr(id: number) {
		if (!id) {
			return ""
		}
		if(this.mTianShenList[id].mBreachLv==0)
		{
			return ""
		}
		return  "+"+this.mTianShenList[id].mBreachLv || ""
	}

	/**
	 * 天神列表数据
	 */
	private _DoTianShenInfo(rsp: Sproto.sc_tianshen_info_request) {
		this.mBattleID = rsp.use;
		this.mDrugNum = rsp.drugNum;
		for (let data of rsp.infoList) {
			let info = this.mTianShenList[data.no];
			if (info) {
				info.UpdateInfo(data);
			}
		}
	}

	/**合成 */
	public SendHeCheng(id: number) {
		let req = new Sproto.cs_tianshen_exchange_request
		req.no = id;
		this.Rpc(C2sProtocol.cs_tianshen_exchange, req)
	}

	/**激活天神 */
	public SendActive(id: number) {
		let req = new Sproto.cs_tianshen_activation_request
		req.no = id;
		this.Rpc(C2sProtocol.cs_tianshen_activation, req, (rsp: Sproto.cs_tianshen_activation_response) => {
			if (rsp.ret) {
				if (this.mTianShenList[id]) {
					this.mTianShenList[id].Active(rsp);
					if (!this.mBattleID) {
						this.SendBattle(id, 1)
					}
				} else {
					console.error("not active pet => petid " + id)
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_ACTIVE)
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO)
			}
		}, this)
	}


	/**
	 * 出战/休息 
	 *@ param warType 出战/休息 
	 */
	public SendBattle(tianShenId: number, warType: number) {
		let req = new Sproto.cs_tianshen_fight_request
		req.no = tianShenId;
		req.warType = warType;
		this.Rpc(C2sProtocol.cs_tianshen_fight, req, (rsp: Sproto.cs_tianshen_fight_response) => {
			if (rsp.ret) {
				let bId = this.mBattleID
				this.mBattleID = rsp.use;
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO)
				if (bId != rsp.use) {
					GameGlobal.RaidMgr.UpdateRoleTianshen(this.mBattleID)
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BATTLE)
			}
		}, this);
	}

	/**进阶 */
	public SendUpLevel(tianShenId: number, autoBuy: number) {
		let req = new Sproto.cs_tianshen_up_level_request;
		req.no = tianShenId;
		req.autoBuy = autoBuy;
		this.Rpc(C2sProtocol.cs_tianshen_up_level, req, (rsp: Sproto.cs_tianshen_up_level_response) => {
			let info = this.mTianShenList[tianShenId];
			if (info) {
				if (rsp.ret) {
					info.mLevel = rsp.lv;
					info.mExpUpNum = rsp.upNum;
					GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO)
					GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_EXP)
				}
			}
		}, this)
	}

	/**使用属性丹 */
	public SendUseDrug(useNum) {
		let req = new Sproto.cs_tianshen_drug_request;
		req.useNum = useNum;
		this.Rpc(C2sProtocol.cs_tianshen_drug, req, (rsp: Sproto.cs_tianshen_drug_response) => {
			if (rsp.ret) {
				this.mDrugNum = rsp.drugNum;
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_DRUG)
			}
		}, this)
	}

	public GetSkin(id): string {
		return AppearanceConfig.GetUIPath(id);
	}

	public mRedPoint: TianShenModelRedPoint;
	public IsRedPointTianShen(id: number) {
		if (this.mRedPoint.IsRedAct(id)) {
			return true
		}
	}
}


class TianShenModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0
	public static readonly INDEX_LEVEL = 1
	public static readonly INDEX_BATTLE = 2
	public static readonly INDEX_ATTR = 3

	private m_ActiveList: { [key: number]: boolean } = {}
	private m_LevelList: {[key: number]: boolean} = {}
	private m_Model: TianShenModel

	constructor(model: TianShenModel) {
		super()
		this.m_Model = model
	}

	protected GetCheckFuncList(): { [key: number]: Function } {
		return {
			[TianShenModelRedPoint.INDEX_ACT]: this.GetIndexAct,
			[TianShenModelRedPoint.INDEX_LEVEL]: this.GetIndexLevel,
			[TianShenModelRedPoint.INDEX_BATTLE]: this.GetIndexBattle,
			[TianShenModelRedPoint.INDEX_ATTR]: this.GetIndexAttrItem,
		}
	}

	public GetMessageDef(): string[] {
		return [MessageDef.BAG_TIANSHEN_ACT_ITEM, MessageDef.TIANSHEN_ACTIVE, MessageDef.TIANSHEN_UPDATE_INFO,
		MessageDef.BAG_TIANSHEN_LEVEL_ITEM,
		MessageDef.TIANSHEN_BATTLE,
		MessageDef.BAG_TIANSHEN_ATTR_ITEM
		]
	}

	public OnChange(index: number): void {
		if (index == TianShenModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM)
		} else {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_TIANSHEN)
		}
	}

	private GetIndexLevel(): boolean {
		this.m_LevelList = {}
		let list = this.m_Model.mTianShenList
		for (let k in list) {
			let petInfo = list[k]
			if (petInfo.mLevel > 0 && petInfo.mLevel < this.m_Model.MAX_LEVEL) {
				let config = petInfo.GetLevelConfig()
				let upnum = Math.floor(config.proexp / config.exp)
				upnum = upnum - petInfo.mExpUpNum
				let enough = true
				for (let data of config.cost) {
					if (!Checker.Data({type: data.type, id: data.id, count: data.count * upnum}, false)) {
						enough = false	
						break
					}
				}
				if (enough) {
					this.m_LevelList[petInfo.mTianShenId] = true
				}
			}
		}
		for (let k in this.m_LevelList) {
			return true
		}
		return false
	}

	private GetIndexBattle(): boolean {
		if (this.m_Model.mBattleID) {
			return false
		}
		let list = this.m_Model.mTianShenList
		for (let k in list) {
			let petInfo = list[k]
			if (petInfo.mLevel > 0) {
				return true
			}
		} 
		return false
	}

	private GetIndexAttrItem(): boolean {
		return GameGlobal.UserBag.GetCount(GameGlobal.Config.AirMarshalBaseConfig.attreitemid) > 0
	}

	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.m_ActiveList) {
			if (key) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.m_ActiveList = {}
		let config = GameGlobal.Config.AirMarshalListConfig
		for (let k in config) {
			if (this.m_Model.HasTianShen(parseInt(k))) {
				continue
			}
			let data = config[k].material
			if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
				this.m_ActiveList[k] = true
			}
		}
	}

	public IsRedAct(xianlvId: number) {
		this.Get(TianShenModelRedPoint.INDEX_ACT)
		return this.m_ActiveList[xianlvId]
	}
}