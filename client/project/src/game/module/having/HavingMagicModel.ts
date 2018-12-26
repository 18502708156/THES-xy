class HavingMagicModel extends BaseSystem {

	public skillData: Sproto.tiannv_equip_data[];//技能属性数据

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_tiannv_wash_res, this._DoInitInfo);
		this.regNetMsg(S2cProtocol.sc_tiannv_wash_replace_res, this._getWashReplaceInfo);
		this.regNetMsg(S2cProtocol.sc_tiannv_equip, this._epuipInfo);
	}

	//============================
	//=============处理协议==========
	//============================
	//获取初始装备数据 根据 长度显示解锁
	public _epuipInfo(rsp: Sproto.sc_tiannv_equip_request) {
		this.skillData = rsp.data;
		for (let i = 0; i < rsp.data.length; i++) {
			let datas = rsp.data[i]
			for (let j = 0; j < datas.attrData.length; j++) {
				let attrData = datas.attrData[j]
				if (attrData.type == 1) {
					if (!GameGlobal.HavingMagicModel.getAttrsConfigById(attrData.attrs)) {
						datas.attrData[j] = null
					}
				}
				if (datas.washData[j] && datas.washData[j].type == 1) {
					if (!GameGlobal.HavingMagicModel.getAttrsConfigById(datas.washData[j].attrs)) {
						datas.washData[j] = null
					}
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_UPDATE);
	}

	public _DoInitInfo(rsp: Sproto.sc_tiannv_wash_res_request) {
		if(this.skillData[rsp.pos-1])
		{
			this.skillData[rsp.pos-1].washNum=rsp.washNum;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_WASH_INFO, rsp);
	}

	public _getWashReplaceInfo(rsp: Sproto.sc_tiannv_wash_replace_res_request) {
		if(this.skillData[rsp.pos-1])
		{
			this.skillData[rsp.pos-1].attrData=rsp.attrData;
			this.skillData[rsp.pos-1].washData=rsp.washData;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_WASH_REPLACE_INFO, rsp);
	}

	//============================
	//=============发送协议==========
	//============================
	public sendTiannvWash(pos, washtype, lock): void {
		let req = new Sproto.cs_tiannv_wash_req_request;
		req.pos = pos;
		req.washType = washtype;
		req.lock = lock;
		this.Rpc(C2sProtocol.cs_tiannv_wash_req, req);
	}

	public sendTiannvWashReplace(pos): void {
		let req = new Sproto.cs_tiannv_wash_replace_req_request;
		req.pos = pos;
		this.Rpc(C2sProtocol.cs_tiannv_wash_replace_req, req);
	}

	/**
	 * 获取属性ID对应品质属性
	 * @param id
	 */
	public getAttrsConfigById(id) {
		return GameGlobal.Config.FemaleDevaSkillAttrsConfig[id];
	}

	//获取法器配置表数据
	public getMagicConfig() {
		return GameGlobal.Config.FemaleDevaMagicConfig
	}

	//获取皮肤配置
	public getSkinConfig(skinid: number) {
		return GameGlobal.Config.FemaleDevaSkinConfig[skinid];
	}

}