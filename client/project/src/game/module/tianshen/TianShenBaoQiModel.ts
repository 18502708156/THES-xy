class TianShenBaoQiModel extends BaseSystem {
	/**可升级至多少级 */
	public MAX_LEVEL = 10
	public MAX_GM_LEVEL = 10

	public mTianShenBaoQiDatas: { [key: number]: TianShenBaoQiInfo } = {};

	/**
	* 获取宝器配置
	*/
	public getConfig() {
		return GameGlobal.Config.AirMarshalTreasureConfig;
	}

	public getLevelsConfig(id) {
		return GameGlobal.Config.AirMarshalTreasureAttrsConfig[id];
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
		this.regNetMsg(S2cProtocol.sc_tianshen_spells_info, this._DoTianShenSpellsInfo);
	}

	public Init() {
		for (let k in GameGlobal.Config.AirMarshalTreasureConfig) {
			let info = new TianShenBaoQiInfo
			info.mPos = parseInt(k);
			this.mTianShenBaoQiDatas[k] = info;
		}
		for (let k in GameGlobal.Config.AirMarshalTreasureAttrsConfig) {
			this.MAX_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.AirMarshalTreasureAttrsConfig[k])
			break
		}
		this.MAX_GM_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.AirMarshalResonateConfig)
	}

	public GetAllLevel(): number {
		let count = 0
		for (let k in this.mTianShenBaoQiDatas) {
			let petInfo = this.mTianShenBaoQiDatas[k]
			if (petInfo.mLevel) {
				count += petInfo.mLevel
			}
		}
		return count
	}

	/**
	 * 天神宝器数据
	 */
	private _DoTianShenSpellsInfo(rsp: Sproto.sc_tianshen_spells_info_request) {
		for (let i = 0; i < rsp.data.length; i++) {
			let info = this.mTianShenBaoQiDatas[i + 1];
			if (info) {
				info.UpdateInfo(rsp.data[i]);
			}
		}
	}

	/**
	 * 宝器升级
	 * @param pos 第几个宝器 
	 * @param autoBuy 自动购买
	 */
	public sendUpLevel(pos, autoBuy): void {
		let req = new Sproto.cs_tianshen_spells_request;
		req.pos = pos;
		req.autoBuy = autoBuy;
		this.Rpc(C2sProtocol.cs_tianshen_spells, req, (rsp: Sproto.cs_tianshen_spells_response) => {
			if (rsp.ret) {
				let info = this.mTianShenBaoQiDatas[rsp.pos];
				if (info) {
					info.mLevel = rsp.lv;
					info.mExpUpNum = rsp.upNum;
					GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BAOQI_UPDATE_INFO)
					GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BAOQI_UPDATE_EXP)
				}
			}
		}, this)
	}
}