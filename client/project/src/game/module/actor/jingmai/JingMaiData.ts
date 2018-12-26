class JingMaiData extends BaseSystem {

	/**每重级数 */
	public static MAX_LEVEL = 11;

	public level: number = 0
	public totalAttrs;

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_vein_update, this.getJingMaiData);
	}

	public getJingMaiData(rspData: Sproto.sc_vein_update_request) {
		if (rspData == null) {
			return
		}
		this.level = rspData.level
		this.totalAttrs = rspData.totalattr;
		MessageCenter.ins().dispatch(MessageDef.JINGMAI_DATA_UPDATE, rspData);
	}

	public sendJingMaiUpLevel(): void {
		this.Rpc(C2sProtocol.cs_vein_Breakthrough);
	}
}