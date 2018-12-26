class VipModel extends BaseSystem{
	public constructor() {
		super()
		// this.regNetMsg(S2cProtocol.sc_vip_update_data, this.getVipInfo);
	}	

	// public getVipInfo(rsp: Sproto.sc_vip_update_data_request) {
	// 	// GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS, rsp);
	// 	// GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP, rsp);
	// }

	// public sendVipLv(lv): void {
	// 	let req = new Sproto.cs_vip_get_awards_request;
	// 	req.lv = lv;
	// 	this.Rpc(C2sProtocol.cs_vip_get_awards, req);
	// }

	public configData = [];
	//获取vip配置
	public getVipConfig() {
		this.configData = []
		for(let item in GameGlobal.Config.VipConfig) {
			this.configData.push(GameGlobal.Config.VipConfig[item])
		}
		return this.configData;
	}


	//获取vip重要特权
	public getVipsDes(id: number) {
		let vipconfig = GameGlobal.Config.VipConfig[id]
		return vipconfig.des
	} 

	//获取vip等级奖励
	public getVipAward(id: number) {
		let vipconfig = GameGlobal.Config.VipConfig[id]
		return vipconfig.rewards
	} 

	//获取vip等级描述
	public getVipDes(id: number) {
		let vipconfig = GameGlobal.Config.VipConfig[id]
		return vipconfig.description
	}



}