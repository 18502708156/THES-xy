class ActivityDataFactory {

	static create(rsp: any) {
		var typeData: IActivityBaseData
		let id = rsp.baseData.id
		let openState = rsp.baseData.openState
		let startTime = rsp.baseData.startTime
		let endTime = rsp.baseData.endTime
		let type = rsp.baseData.type
		switch (type) {
			case 1:
				typeData = new ActivityType1Data();
				break;
			case 2:
				typeData = new ActivityType2Data();
				break;
			case 3:
				typeData = new ActivityType3Data();
				break;
			case 4:
				typeData = new ActivityType4Data();
				break;
			case 5:
				typeData = new ActivityType5Data();
				break;
			case 6:
				typeData = new ActivityType6Data();
				break;
			case 7:
				typeData = new ActivityType7Data();
				break;
			case 8:
				typeData = new ActivityType8Data();
				break;
			case 9:
				typeData = new ActivityType9Data();
				break;
			case 10:
				typeData = new ActivityType10Data();
				break;
			case 11:
				typeData = new ActivityType11Data();
				break;
			case 12:
				typeData = new ActivityType12Data();
				break;
			case 13:
				typeData = new ActivityType13Data();
				break;
			case 14:
				typeData = new ActivityType14Data();
				break;
			case 15:
				typeData = new ActivityType15Data();
				break;
			case 16:
				typeData = new ActivityType16Data();
				break;
			case 17:
				typeData = new ActivityType17Data();
				break;
			case 18:
				typeData = new ActivityType18Data();
				break;
			case 19:
				typeData = new ActivityType19Data();
				break;
			case 20:
				typeData = new ActivityType20Data();
				break;
			case 21:
				typeData = new ActivityType21Data();
				break;
			case 22:
				typeData = new ActivityType22Data();
				break;
			case 23:
				typeData = new ActivityType23Data();
				break;
			case 24:
				typeData = new ActivityType24Data();
				break;
			case 25:
				typeData = new ActivityType25Data();
				break;
			case 26:
				typeData = new ActivityType26Data();
				break;
			case 27:
				typeData = new ActivityType27Data();
				break;
			case 28:
				typeData = new ActivityType28Data();
				break;

			default:
				return null
		}
		if (typeData) {
			typeData.id = id
			typeData.startTime = startTime
			typeData.endTime = endTime
			typeData.type = type
			typeData.openState = openState
			typeData.init();
			typeData.update(rsp)
			var a = typeData.isOpenActivity() && 1 == typeData.openState;
		}

		return typeData
	}

	private static PANEL_LIST: {[key: number]: any}

	public static GetPanel(type: number) {
		if (!this.PANEL_LIST) {
			this.PANEL_LIST = {
				[ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop]: KaiFuTargetTeamBuyPanel,
				[ActivityKaiFuFuncType.ACT_1_Upgrade]: KaiFuTargetUpLevelPanel,
				[ActivityKaiFuFuncType.ACT_20_RechargeGroupon]: KaiFuTargetPowerPanel,
				[ActivityKaiFuFuncType.ACT_3_RechargeContinue]: KaiFuTargetReChargePanel,
				[ActivityKaiFuFuncType.ACT_26_DisCountShop]: KaiFuTargetShopPanel,
				[ActivityKaiFuFuncType.ACT_22_OrangePetTarget]: KaiFuTargetFightPanel,
				[ActivityKaiFuFuncType.ACT_17_ArenaTarget]: KaiFuTargetFuncTargetPanel,

				[ActivityKaiFuFuncType.ACT_99990_JiJie]: KaiFuJiJiePanel,
				[ActivityKaiFuFuncType.ACT_99991_JiJieRank]: KaiFuJiJieRankPanel,
				[ActivityKaiFuFuncType.ACT_99992_JiJieShop]: KaiFuJiJieShopPanel,
				[ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge]: KaiFuLeiJiReChargePanel,
			}
		}
		let cls = this.PANEL_LIST[type]
		if (!cls) {
			console.warn("not imple act id => ", type)
		}
		return cls
	}
}