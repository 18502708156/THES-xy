class XianlvModel  extends BaseSystem {

	public MAX_LEVEL = 10
	public MAX_STAR = 10
	public MAX_QY_LEVEL = 20

	public static MATERIAL_ID: {[key: number]: number} = {}

	public mXianlvList: {[key: number]: XianlvInfo} = {}
	public mBattleList: number[] = []

	public constructor() {
		super()
		this.mRedPoint = new XianlvModelRedPoint(this)
		this.regNetMsg(S2cProtocol.sc_xianlv_init, this._DoInitInfo)
	}

	public Init() {
		let partnerBiographyConfig = GameGlobal.Config.partnerBiographyConfig
		for (let k in partnerBiographyConfig) {
			let petInfo = new XianlvInfo
			petInfo.mXianlvId = parseInt(k)
			this.mXianlvList[k] = petInfo

			let id = partnerBiographyConfig[k].material.id
			XianlvModel.MATERIAL_ID[id] = Number(k)
			GameGlobal.UserBag.AddListenerItem(id, MessageDef.BAG_XIANLV_ACT_ITEM)
		}
		for (let k in GameGlobal.Config.partnerLvproConfig) {
			this.MAX_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.partnerLvproConfig[k])
			GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.partnerLvproConfig[k][0].cost[1].id, MessageDef.BAG_XIANLV_RANK_ITEM)
			break
		}
		for (let k in GameGlobal.Config.partnerAttrsConfig) {
			GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.partnerAttrsConfig[k][0].cost[0].id, MessageDef.BAG_XIANLV_STAR_ITEM)
		}
		for (let k in GameGlobal.Config.partnerAttrsConfig) {
			this.MAX_STAR = CommonUtils.getObjectLength(GameGlobal.Config.partnerAttrsConfig[k])
			break
		}
		this.MAX_QY_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.partnerFreshSkillConfig)
	}	

	public _DoInitInfo(rsp: Sproto.sc_xianlv_init_request) {
		for (let data of rsp.list) {
			let info = this.mXianlvList[data.id]
			if (info) {
				info.UpdateInfo(data)
			}
		}
		this.mBattleList = rsp.outbound
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_INIT_INFO)
	}

	public GetXianlvId(): number {
		for (let id of this.mBattleList) {
			if (id) {
				return id
			}
		}
		// for (let key in this.mXianlvList) {
		// 	let data = this.mXianlvList[key]
		// 	if (data && data.mLevel) {
		// 		return data.mXianlvId
		// 	}
		// }
		return 0
	}

	public SendActive(xianlvId: number) {
		let req = new Sproto.cs_xianlv_active_request
		req.id = xianlvId
		this.Rpc(C2sProtocol.cs_xianlv_active, req, (rsp: Sproto.cs_xianlv_active_response) => {
			if (rsp.ret) {
				if (this.mXianlvList[xianlvId]) {
					this.mXianlvList[xianlvId].Active()
					let has = false
					for (let id of this.mBattleList) {
						if (id) {
							has = true
							break
						}
					}
					if (!has) {
						this.SendBattle(xianlvId, 0)
						GameGlobal.RaidMgr.UpdateRoleXianlv(this.GetXianlvId())
					}
				} else {
					console.error("not active pet => petid " + xianlvId)
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_ACTIVE)
				GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO)
			}
		}, this)
	}

	public SendDress(xianlvId: number) {

	}

	public SendBattle(xianlvId: number, index: number) {
		let list = CommonUtils.copyDataHandler(this.mBattleList)
		list[index] = xianlvId
		let req = new Sproto.cs_xianlv_outbound_request
		req.first = list[0] || 0
		req.second = list[1] || 0
		if (CommonUtils.ArrayEqual(this.mBattleList, list)) {
			return
		}
		this.mBattleList = list
		this.Rpc(C2sProtocol.cs_xianlv_outbound, req)
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_BATTLE)

		GameGlobal.RaidMgr.UpdateRoleXianlv(this.GetXianlvId())
	}

	public SendUnBattle(xianlvId: number) {
		let list = this.mBattleList
		for (let i = 0; i < list.length; i++) {
			let id = list[i]
			if (id == xianlvId) {
				this.SendBattle(0, i)
				break
			}
		}
	}

	public SendUpLevel(xianlvId: number, autoBuy: number) {
		let req = new Sproto.cs_xianlv_addexp_request
		req.id = xianlvId
		req.autoBuy = autoBuy
		this.Rpc(C2sProtocol.cs_xianlv_addexp, req, (rsp: Sproto.cs_xianlv_addexp_response) => {
			let info = this.mXianlvList[xianlvId]
			if (info) {
				if (rsp.ret) {
					info.mExp = rsp.exp
					info.mLevel = rsp.level
					GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_EXP)
					GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO)
				}
			} else {
				console.error("not SendUpLevel petid => " + xianlvId)
			}
		}, this)
	}

	public SendUpStar(xianlvId: number) {
		let req = new Sproto.cs_xianlv_upstar_request
		req.id = xianlvId
		this.Rpc(C2sProtocol.cs_xianlv_upstar, req, (rsp: Sproto.cs_xianlv_upstar_response) => {
			let info = this.mXianlvList[xianlvId]
			if (info) {
				if (rsp.ret) {
					info.mStar = rsp.star
					GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO)
				}
			} else {
				console.error("not SendUpLevel petid => " + xianlvId)
			}
		}, this)
	}

	public HasXianlv(xianlvId: number) {
		if (!xianlvId) {
			return false
		}
		return (this.mXianlvList[xianlvId] && this.mXianlvList[xianlvId].mLevel) ? true : false
	}

	public HasBattle(xianlvId: number): boolean {
		return this.mBattleList.indexOf(xianlvId) != -1
	}

	public GetBattlePos(xianlvId: number): number {
		return this.mBattleList.indexOf(xianlvId)
	}

	public getBattledXianlv() {
		return this.mBattleList[0]
	}

	public GetXianlvInfo(xianlvId: number): XianlvInfo {
		return this.mXianlvList[xianlvId]
	}

	public GetLevel(xianlvId: number) {
		if (!xianlvId) {
			return 0
		}
		return this.mXianlvList[xianlvId].mLevel || 0
	}

	public GetAllPower(): number {
		let power = 0
		for (let k in this.mXianlvList) {
			let petInfo = this.mXianlvList[k]
			power += petInfo.GetPower()
		}
		return power
	}

	private GetAllAttrsByType(funcName: string) {
		let allAttr = []
		for (let k in this.mXianlvList) {
			let petInfo = this.mXianlvList[k]
			if (!petInfo.mLevel) {
				continue
			}
			let attr = petInfo[funcName].call(petInfo)
			if (!attr) {
				continue
			}
			for (let i = 0; i < attr.length; i++) {
				let data = attr[i]
				if (!allAttr[i]) {
					allAttr[i] = {type: data.type, value: data.value}
				} else {
					allAttr[i].value += data.value
				}
			}
		}
		return allAttr
	}

	public GetAllAttrs(): AttributeData[] {
		let allAttr = this.GetAllAttrsByType("GetAttrs")
		if (allAttr.length == 0) {
			return XianlvConst.GetBaseAttrs()
		}
		return allAttr
	}

	public GetAllQyAttr(): AttributeData[] {
		let level = this.GetQyLevel()
		if (level) {
			return GameGlobal.Config.partnerFreshSkillConfig[level].attrs
		}
		return XianlvConst.GetQyAttrs()
	}

	public GetQyLevel(): number {
		let allLevel = this.GetAllLevel()
		let config = GameGlobal.Config.partnerFreshSkillConfig
		let level = 0
		for (let i = 1; i < 99; i++) {
			let configData = config[i]
			if (!configData) {
				break
			}
			if (allLevel < configData.lv) {
				break
			}
			level = i
		}
		return level
	}

	public GetBattleCount(): number {
		let count = 0
		for (let data of this.mBattleList) {
			if (data) {
				++count
			}
		}
		return count
	}

	public GetActiveCount(): number {
		let count = 0
		for (let k in this.mXianlvList) {
			let petInfo = this.mXianlvList[k]
			if (petInfo.mLevel) {
				++count
			}
		}
		return count
	}

	public GetAllLevel(): number {
		let count = 0
		for (let k in this.mXianlvList) {
			let petInfo = this.mXianlvList[k]
			if (petInfo.mLevel) {
				count += petInfo.mLevel
			}
		}
		return count
	}

	public mRedPoint: XianlvModelRedPoint

	public IsRedPointXianlv(xianlvId: number){
		if (this.mRedPoint.IsRedAct(xianlvId)) {
			return true
		}
		if (this.mRedPoint.IsRedStar(xianlvId)) {
			return true
		}
		return false
	}

	public SetShowId(showId: number) {
		let tList = []
        let tObj = {type:6,value:showId};
        tList.push(tObj) 
        GameGlobal.Chat.chatShareInfo(12, tList);
		// UserTips.ins().showTips("展示成功")
	}
}

