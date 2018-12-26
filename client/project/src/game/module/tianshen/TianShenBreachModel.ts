class TianShenBreachModel extends BaseSystem {

	public getLevelsConfig(id) {
		return GameGlobal.Config.AirMarshalBreachConfig[id];
	}

	/**
	 * 获取突破等级对应战力属性
	 */
	public getPower(id, level) {
		let lvConfig = this.getLevelsConfig(id)[level];
		if (lvConfig.attrs) {
			return ItemConfig.CalcAttrScoreValue(lvConfig.attrs);
		}
		return 0;
	}

	public constructor() {
		super()
	}


	/**
	 * 天神突破
	 * @param tsid 天神id
	 */
	public sendTianShenBreach(tsid): void {
		let req = new Sproto.cs_tianshen_promotion_request;
		req.no = tsid;
		this.Rpc(C2sProtocol.cs_tianshen_promotion, req, (rsp: Sproto.cs_tianshen_promotion_response) => {
			if (rsp.ret) {
				let info = GameGlobal.TianShenModel.mTianShenList[rsp.no];
				if (info) {
					info.mBreachLv = rsp.promotion;
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_BREACH)
			}
		}, this)
	}
}