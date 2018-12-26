class ForgeConst {


	/** 可锻造的装备索引 */
	public static CAN_FORGE_EQUIP = [
		EquipPos.WEAPON,
		EquipPos.HEAD,
		EquipPos.NECKLACE,
		EquipPos.CLOTHES,
		EquipPos.SHOULDER,
		EquipPos.BELT,
		EquipPos.CUFF,
		EquipPos.RING,
		EquipPos.PANTS,
		EquipPos.SHOE,
	];
	/** 装备索引对应的子类型 */
	public static EQUIP_POS_TO_SUB = {
		[EquipPos.WEAPON]: 		EquipPos.WEAPON,
		[EquipPos.HEAD]: 		EquipPos.HEAD,
		[EquipPos.NECKLACE]: 		EquipPos.NECKLACE,
		[EquipPos.CLOTHES]: 		EquipPos.CLOTHES,
		[EquipPos.SHOULDER]: 		EquipPos.SHOULDER,
		[EquipPos.BELT]: 		EquipPos.BELT,
		[EquipPos.CUFF]: 		EquipPos.CUFF,
		[EquipPos.RING]: 		EquipPos.RING,
		[EquipPos.PANTS]: 		EquipPos.PANTS,
		[EquipPos.SHOE]: 		EquipPos.SHOE,
	}

	// public static SUB_TO_EQUIP_POS = {
	// 	[EquipType.WEAPON]: [EquipPos.WEAPON],
	// 	[EquipType.HEAD]: [EquipPos.HEAD],
	// 	[EquipType.CLOTHES]: [EquipPos.CLOTHES],
	// 	[EquipType.NECKLACE]: [EquipPos.NECKLACE],
	// 	[EquipType.BRACELET]: [EquipPos.BRACELET1, EquipPos.BRACELET2],
	// 	[EquipType.RING]: [EquipPos.RING1, EquipPos.RING2],
	// }
}

// 0 强化 1 精炼 2 锻炼 3 宝石
enum ForgeType {
	BOOST = 0,
	REFINE = 1,
	EXERCISE = 2,
	GEM = 3,
}