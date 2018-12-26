class PositionForeshowModel extends BaseSystem {
	public position_info: Sproto.sc_position_info_request

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_position_info, this._getPositionInfo);
	}

	isRedPoint() {
		if (!this.position_info) {
			return false
		}
		for (let val of this.position_info.data) {
			if (val.typ == 1)
				return true
		}
		return false;
	}

	sendGetAward(id) {
		let req = new Sproto.cs_position_getawards_request
		req.no = id;
		this.Rpc(C2sProtocol.cs_position_getawards, req, (rep: Sproto.cs_position_getawards_response) => {
			if (rep.ret) {
				MessageCenter.ins().dispatch(MessageDef.POSITION_AWARD_CHANGE)
			}
		}, this);
	}

	_getPositionInfo(req: Sproto.sc_position_info_request) {
		if (req) {
			this.position_info = req
			MessageCenter.ins().dispatch(MessageDef.POSITION_STATE_CHANGE)
		}
	}
}