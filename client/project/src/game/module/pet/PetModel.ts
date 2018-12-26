class PetModel extends BaseSystem {
	public static SKILL_COUNT = 6

	public MAX_ZIZHI_LEVEL = 5
	public MAX_LEVEL = 100
	public mPetList: { [key: number]: PetInfo } = {}
	public mBattleList: number[] = []

	public GetShowId(): number {
		for (let id of this.mBattleList) {
			if (id) {
				return id
			}
		}
		return 0
	}

	public constructor() {
		super()
		this.mRedPoint = new PetModelRedPoint(this)
		this.regNetMsg(S2cProtocol.sc_pet_init, this._DoInitInfo)
	}

	public Init() {
		for (let k in GameGlobal.Config.petBiographyConfig) {
			let petInfo = new PetInfo
			petInfo.mPetId = parseInt(k)
			this.mPetList[k] = petInfo

			let data = GameGlobal.Config.petBiographyConfig[k]
			GameGlobal.UserBag.AddListenerItem(data.material.id, MessageDef.BAG_PET_ACT_ITEM)
		}
		for (let k in GameGlobal.Config.petGiftproConfig) {
			let data = GameGlobal.Config.petGiftproConfig[k]
			this.MAX_ZIZHI_LEVEL = CommonUtils.getObjectLength(data)
			break
		}
		for (let k in GameGlobal.Config.petLvproConfig) {
			let data = GameGlobal.Config.petLvproConfig[k]
			this.MAX_LEVEL = CommonUtils.getObjectLength(data)
			GameGlobal.UserBag.AddListenerItem(data[0].cost[1].id, MessageDef.BAG_PET_LEVEL_ITEM)
			break
		}
		for (let data of GameGlobal.Config.petbaseConfig.freshitemid) {
			GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.BAG_PET_SKILL_ITEM)
		}
	}

	public _DoInitInfo(rsp: Sproto.sc_pet_init_request) {
		for (let data of rsp.list) {
			let petInfo = this.mPetList[data.petid]
			if (!petInfo) {
				petInfo = new PetInfo
				petInfo.mPetId = data.petid
				this.mPetList[petInfo.mPetId] = petInfo
			}
			petInfo.UpdateInfo(data)
		}
		this.mBattleList = rsp.outbound || []
		// this.mShowId = rsp.showid
		GameGlobal.MessageCenter.dispatch(MessageDef.PET_INIT_INFO)
		if (this.GetShowId()) {
			this.OnActive()
		}
	}

	protected OnActive() {
		GameGlobal.RaidMgr.UpdateRolePet(this.GetShowId())	
	}

	public SetShowId(showId: number) {
		let tList = []
        let tObj = {type:1,value:showId};
        tList.push(tObj) 
        GameGlobal.Chat.chatShareInfo(1, tList);
		// UserTips.ins().showTips("展示成功")
	}

	public SendActive(petId: number) {
		let req = new Sproto.cs_pet_active_request
		req.id = petId
		this.Rpc(C2sProtocol.cs_pet_active, req, (rsp: Sproto.cs_pet_active_response) => {
			if (rsp.ret) {
				if (this.mPetList[petId]) {
					this.mPetList[petId].Active()
					let has = false
					for (let id of this.mBattleList) {
						if (id) {
							has = true
							break
						}
					}
					if (!has) {
						this.SendBattle(petId, 0)
						GameGlobal.RaidMgr.UpdateRolePet(petId)
					}
					// if (!this.mShowId) {
					// 	this.mShowId = petId
					// 	GameGlobal.RaidMgr.GetCurRaid().UpdateRolePet(petId)
					// }
				} else {
					console.error("not active pet => petid " + petId)
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.PET_ACTIVE)
				GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
			}
		}, this)
	}

	public SendDress(petId: number) {

	}

	public SendBattle(petId: number, index: number) {
		let list = CommonUtils.copyDataHandler(this.mBattleList)
		list[index] = petId
		let req = new Sproto.cs_pet_outbound_request
		req.first = list[0] || 0
		req.second = list[1] || 0
		req.third = list[2] || 0
		req.four = list[3] || 0
		if (CommonUtils.ArrayEqual(this.mBattleList, list)) {
			return
		}
		this.mBattleList = list
		this.Rpc(C2sProtocol.cs_pet_outbound, req)
		GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.PET_BATTLE)

		GameGlobal.RaidMgr.UpdateRolePet(this.GetShowId())
	}

	public SendUnBattle(petId: number) {
		let list = this.mBattleList
		for (let i = 0; i < list.length; i++) {
			let id = list[i]
			if (id == petId) {
				this.SendBattle(0, i)
				break
			}
		}
	}

	public SendUpZizhi(petId: number) {
		let req = new Sproto.cs_pet_addgift_request
		req.id = petId
		this.Rpc(C2sProtocol.cs_pet_addgift, req, (rsp: Sproto.cs_pet_addgift_response) => {
			let info = this.mPetList[petId]
			if (info) {
				if (rsp.ret) {
					info.mZizhiExp = rsp.exp
					info.mZizhiLevel = rsp.level
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_ZIZHI)
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
				}
			} else {
				console.error("not upzizhi petid => " + petId)
			}
		}, this)
	}

	public SendUpLevel(petId: number, autoBuy: number) {
		let req = new Sproto.cs_pet_addexp_request
		req.id = petId
		req.autoBuy = autoBuy
		this.Rpc(C2sProtocol.cs_pet_addexp, req, (rsp: Sproto.cs_pet_addexp_response) => {
			let info = this.mPetList[petId]
			if (info) {
				if (rsp.ret) {
					info.mExp = rsp.exp
					info.mLevel = rsp.level
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_EXP)
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
				} else {
					// UserTips.ErrorTip("升级失败")
				}
			} else {
				console.error("not upzizhi petid => " + petId)
			}
		}, this)
	}

	public SendRename(petId: number, petName: string) {
		let req = new Sproto.cs_pet_rename_request
		req.id = petId
		req.name = petName
		this.Rpc(C2sProtocol.cs_pet_rename, req, (rsp: Sproto.cs_pet_rename_response) => {
			let info = this.mPetList[petId]
			if (info) {
				if (rsp.ret) {
					info.mName = rsp.name
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
				}
				else
					GameGlobal.UserTips.showTips("输入的名称含有敏感字")
			} else {
				console.error("not SendRename petid => " + petId)
			}
		}, this)

	}

	public SendXilian(petId: number, lockList: number[], type: number, autoBuy: boolean) {
		let req = new Sproto.cs_pet_refreshskill_request
		req.id = petId
		req.locklist = lockList
		req.type = type
		req.autoBuy = autoBuy ? 2 : 0
		this.Rpc(C2sProtocol.cs_pet_refreshskill, req, (rsp: Sproto.cs_pet_refreshskill_response) => {
			if (rsp.ret) {
				let info = this.mPetList[petId]
				if (info) {
					info.mXilian = rsp.xilian
					info.mXilianSkill = rsp.xilianSkills
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
				}
			}
		}, this)
	}

	public SendSetXilian(petId: number) {
		let req = new Sproto.cs_pet_setskillin_request
		req.id = petId
		this.Rpc(C2sProtocol.cs_pet_setskillin, req, (rsp: Sproto.cs_pet_setskillin_response) => {
			if (rsp.ret) {
				let info = this.mPetList[petId]
				if (info) {
					info.mBuffSkill = rsp.buffs
					info.mXilianSkill = []
					GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO)
				}
			}
		}, this)
	}

	public HasPet(petId: number) {
		if (!petId) {
			return false
		}
		return (this.mPetList[petId] && this.mPetList[petId].mLevel) ? true : false
	}

	public HasBattle(petId: number): boolean {
		return this.mBattleList.indexOf(petId) != -1
	}

	public GetBattlePos(petId: number): number {
		return this.mBattleList.indexOf(petId)
	}

	public GetPetInfo(petId: number): PetInfo {
		return this.mPetList[petId]
	}

	public GetLevel(petId: number) {
		if (!petId) {
			return 0
		}
		return this.mPetList[petId].mLevel || 0
	}

	public GetBiggestLevel(){
		let level = 0;
		for(let k in this.mPetList)
		{
			if(this.mPetList[k].mLevel > level)
			{
				level = this.mPetList[k].mLevel;
			}
		}
		return level;
	}

	public GetAllPower(): number {
		let power = 0
		for (let k in this.mPetList) {
			if (this.HasPet(parseInt(k))) {
				let petInfo = this.mPetList[k]
				power += petInfo.GetPower()
			}
		}
		return power
	}

	private GetAllAttrsByType(funcName: string) {
		let allAttr = []
		for (let k in this.mPetList) {
			let petInfo = this.mPetList[k]
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
					allAttr[i] = { type: data.type, value: data.value }
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
			return PetConst.GetBaseAttrs()
		}
		return allAttr
	}

	public GetAllZizhiAttrs(): AttributeData[] {
		return this.GetAllAttrsByType("GetZizhiAttrs")
	}

	public GetAllFeisAttrs(): AttributeData[] {
		let allAttr = this.GetAllAttrsByType("GetFeisAttrs")
		if (allAttr.length == 0) {
			return PetConst.GetFeisBaseAttrs()
		}
		return allAttr
	}

	public GetActiveCount(): number {
		let count = 0
		for (let k in this.mPetList) {
			let petInfo = this.mPetList[k]
			if (petInfo.mLevel) {
				++count
			}
		}
		return count
	}

	public mRedPoint: PetModelRedPoint

	public IsRedPointPet(petId: number) {
		if (this.mRedPoint.IsRedAct(petId)) {
			return true
		}
		if (this.mRedPoint.IsRedZizhi(petId)) {
			return true
		}
		return false
	}
}

