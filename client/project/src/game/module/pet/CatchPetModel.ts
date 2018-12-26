class CatchPetModel extends BaseSystem {

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_pet_catch, this.CatchPet)
		this.regNetMsg(S2cProtocol.sc_pet_catch_result, this.CatchPetResult)
	}

	public monsterid: number = null
	public catchtime: number = null
	public result: boolean

	public HasCatch(): boolean {
		if (GameGlobal.CatchPetModel.catchtime != null && GameGlobal.CatchPetModel.monsterid != null) {
			return true
		}
		return false
	}

	public ClearTime() {
		this.monsterid = null
		this.catchtime = null
	}

	public CatchPet(rsp: Sproto.sc_pet_catch_request) {
		if (GameGlobal.Config.petBiographyConfig[rsp.monsterid]) {
			this.monsterid = rsp.monsterid
			this.catchtime = rsp.catchtime
			GameGlobal.MessageCenter.dispatch(MessageDef.BZ_PET_INFO)
		}
	}

	public CatchPetResult(rsp: Sproto.sc_pet_catch_result_request) {
		this.result = rsp.result
		let raid = GameGlobal.RaidMgr.mBattleRaid
		if (raid && egret.is(raid, "CatchPetRaid")) {
			let finishAction = new CatchPetFinishData
			finishAction.iswin = rsp.result
			finishAction.id = this.monsterid
			raid.SetFinishAction(finishAction)
		}
		this.ClearTime()

		GameGlobal.RaidMgr.BuZhuoPet();
	}

	public SendPetCatch() {
		this.Rpc(C2sProtocol.cs_pet_catch);
	}

	public OpenRaid() {
		return egret.is(GameGlobal.RaidMgr.mBattleRaid, "CatchPetRaid")
	}

	public OnSocketClose() {
		this.ClearTime()
	}

}