class TreasureHuntModel extends BaseSystem {

	public mInfo: Sproto.sc_luck_info_request

	public IsFree(): boolean {
		if (this.mInfo) {
			return this.mInfo.daylist && (this.mInfo.daylist[1] == null || this.mInfo.daylist[1] == 0)
		}
		return false
	}

	public GetRound(): number {
		if (this.mInfo) {
			return this.mInfo.round || 1
		}
		return 1
	}

	public constructor() {
		super()
		this.RegNetMsgs(S2cProtocol.sc_luck_info, this._DoInitInfo)
		this.regNetMsg(S2cProtocol.sc_luck_ret, this._DoRet)
	}

	private _DoInitInfo(rsp: Sproto.sc_luck_info_request) {
		this.mInfo = rsp
		if (rsp.equiprecords) {
			rsp.equiprecords = rsp.equiprecords.reverse()
		} else {
			rsp.equiprecords = []
		}
		SortTools.sortMap(rsp.records, "time", false)
		GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RECORD)
	}

	private _DoRet(rsp: Sproto.sc_luck_ret_request) {
		if (rsp.type == 1 || rsp.type == 2 || rsp.type == 3) {
			if (ViewManager.ins().isShow(TreasureResultPanel)) {
				ViewManager.ins().open(TreasureResultPanel, rsp)	
			} else {
				GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RET_ANIM, rsp)
			}
			GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RET_SUC)
		}
	}

	public SendTreasure(type: number, index: number) {
		let req = new Sproto.cs_luck_draw_request
		req.type = type
		req.index = index
		this.Rpc(C2sProtocol.cs_luck_draw, req)
	}

	public SendGetInfo() {
		this.Rpc(C2sProtocol.cs_luck_info)
	}

	public GetLuck(): number {
		if (this.mInfo) {
			return this.mInfo.lucky || 0
		}
		return 0
	}
}