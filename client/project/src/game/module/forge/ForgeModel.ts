class ForgeModel extends BaseSystem {
	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_equip_forge, this.doForgeUpdata);
	}

	public Init() {
		super.Init()

		GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.RefineCostConfig[1].cost.id, MessageDef.FORGE_ITEM_01_UPDATE)
		GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AnnealCostConfig[1].cost.id, MessageDef.FORGE_ITEM_02_UPDATE)
		GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.GemCostConfig[1].cost.id, MessageDef.FORGE_ITEM_03_UPDATE)
	}

	public doForgeUpdata(rsp: Sproto.sc_equip_forge_request) {
		SubRoles.ins().GetRoleData().parseForgeChange(rsp, rsp.forgeType);
		GameGlobal.MessageCenter.dispatch(MessageDef.FORGE_UPDATE, rsp.forgeType)
	}

	public SendUpGrade(type: number) {
		var rsp = new Sproto.cs_equip_forge_request();
		rsp.forgeType = type;
		GameSocket.ins().Rpc(C2sProtocol.cs_equip_forge, rsp);
	}

	/**
	 * 通过部位等级 获取锻造相关配置  0 强化配置 1 宝石配置 2注灵配置 3 突破配置
	 * @param pos 部位
	 * @param lv  等级
	 * @param configType 配置类型
	 */
	public GetForgeConfigByPos(pos, lv, configType) {
		var list = this.GetConfig(configType)
		var config;
		for (let key in list) {
			config = list[key];
			if (config.posId == pos) {
				if (config.level == lv)
					return config;
			}
		}
		return null;
	}

	public GetConfig(configType: number) {
		let list
		switch (configType) {
			case ForgeType.BOOST:
				list = GlobalConfig.ins().EnhanceAttrConfig;
				break;
			case ForgeType.REFINE:
				list = GlobalConfig.ins().RefineAttrConfig;
				break;
			case ForgeType.EXERCISE:
				list = GlobalConfig.ins().AnnealAttrConfig
				break;
			case ForgeType.GEM:
				list = GlobalConfig.ins().GemAttrConfig;
				break;
		}
		return list
	}

	public GetCostConfig(configType: number) {
		let list
		switch (configType) {
			case ForgeType.BOOST:
				list = GlobalConfig.ins().EnhanceCostConfig;
				break;
			case ForgeType.REFINE:
				list = GlobalConfig.ins().RefineCostConfig;
				break;
			case ForgeType.EXERCISE:
				list = GlobalConfig.ins().AnnealCostConfig
				break;
			case ForgeType.GEM:
				list = GlobalConfig.ins().GemCostConfig;
				break;
		}
		return list
	}

	public GetMasterConfig(configType: number) {
		let list
		switch (configType) {
			case ForgeType.BOOST:
				list = GlobalConfig.ins().EnhanceSuitConfig;
				break;
			case ForgeType.REFINE:
				list = GlobalConfig.ins().RefineSuitConfig;
				break;
			case ForgeType.EXERCISE:
				list = GlobalConfig.ins().AnnealSuitConfig
				break;
			case ForgeType.GEM:
				list = GlobalConfig.ins().GemSuitConfig;
				break;
		}
		return list
	}

	public GetConfigCostData(configType: number, level: number) {
		let list = this.GetCostConfig(configType)
		var index;
		for (index in list) {
			var config = list[index];
			if (config.level == level)
				return config;
		}
		return null;
	}

	public GetForgeMasterLevel(forgeType: ForgeType) {
		let config = GameGlobal.ForgeModel.GetMasterConfig(forgeType)
		let role = GameGlobal.SubRoles.GetRoleData()
		if (!role) {
			return null
		}
		let [index, min] = role.GetMinEquipIndexAndLevel(forgeType)
		let curKey
		for (let k in config) {
			if (min >= config[k].level) {
				curKey = k
			}
		}
		let configData
		if (curKey) {
			return config[curKey]
		}
		return null
	}

	public TYPE_TO_NAME = {
		[ForgeType.BOOST]: "强化",
		[ForgeType.REFINE]: "精炼",
		[ForgeType.EXERCISE]: "锻炼",
		[ForgeType.GEM]: "镶嵌",
	}

	public mRedPoint = new ForgeModelRedPoint
}

class ForgeModelRedPoint extends IRedPoint {

	public static readonly INDEX_BOOST = 0
	public static readonly INDEX_REFINE = 1
	public static readonly INDEX_EXERCISE = 2
	public static readonly INDEX_GEM = 3

	protected GetCheckFuncList(): { [key: number]: Function } {
		return {
			[ForgeModelRedPoint.INDEX_BOOST]: this.GetIndexBoost,
			[ForgeModelRedPoint.INDEX_REFINE]: this.GetIndexRefine,
			[ForgeModelRedPoint.INDEX_EXERCISE]: this.GetIndexExercise,
			[ForgeModelRedPoint.INDEX_GEM]: this.GetIndexGem,
		}
	}

	/**
	 * 事件定义，根据事件类型更新状态
	 */
	public GetMessageDef(): string[] {
		return [
			MessageDef.FORGE_UPDATE,
			MessageDef.GOLD_CHANGE,
			MessageDef.FORGE_ITEM_01_UPDATE,
			MessageDef.FORGE_ITEM_02_UPDATE,
			MessageDef.FORGE_ITEM_03_UPDATE,
		]
	}

	protected OnChange(index: number): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.RP_FORGE)
	}

	public OnMessage(type: string): boolean {
		if (type == MessageDef.GOLD_CHANGE) {
			this.ClearFlag(ForgeModelRedPoint.INDEX_BOOST)
		} else if (type == MessageDef.FORGE_ITEM_01_UPDATE) {
			this.ClearFlag(ForgeModelRedPoint.INDEX_REFINE)
		} else if (type == MessageDef.FORGE_ITEM_02_UPDATE) {
			this.ClearFlag(ForgeModelRedPoint.INDEX_EXERCISE)
		} else if (type == MessageDef.FORGE_ITEM_03_UPDATE) {
			this.ClearFlag(ForgeModelRedPoint.INDEX_GEM)
		} else {
			return super.OnMessage(type)
		}
		return true
	}

	private GetCost(forgetType: ForgeType) {
		let role = GameGlobal.SubRoles.GetRoleData()
		if (!role) {
			return null
		}
		let [index, lv] = role.GetMinEquipIndexAndLevel(forgetType)
		var costConfig = GameGlobal.ForgeModel.GetConfigCostData(forgetType, lv + 1);
		let cost = null
		if (costConfig) {
			cost = costConfig.cost
		}
		if (cost) { 
			return Checker.Data(cost, false)
		}
		return null
	}

	public GetIndexBoost(): boolean {
		return this.GetCost(ForgeType.BOOST)
	}

	public GetIndexRefine(): boolean {
		return this.GetCost(ForgeType.REFINE)
	}

	public GetIndexExercise(): boolean {
		return this.GetCost(ForgeType.EXERCISE)
	}

	public GetIndexGem(): boolean {
		return this.GetCost(ForgeType.GEM)
	}
}