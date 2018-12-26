// 道具类型
enum ItemType {
	EQUIP = 0, 		// 装备
	MATERIAL = 1, 	// 材料
	RIDE = 2,		// 坐骑装备
	WING = 3, 		// 翅膀装备
	XIAN_FZ = 4,	// 仙侣法阵装备
	XIAN_XW = 5,	// 仙侣仙位装备
	PET_TL = 6,		// 宠物通灵装备
	PET_SH = 7,		// 宠物兽魂装备
	TIANXIAN = 8,	// 守护装备
	SHENGB = 9,		// 神兵装备
	TIANNV = 10,	// 玄女装备
	XIANQ = 11,		// 仙器装备
	HUA = 12,		// 花辇装备
	LINGQI = 13,	// 灵气装备

	DESTINY = 14,	// 命格
}

class ItemConst {

	public static OPEN_EQUIPS_TIPS = {
		[ItemType.EQUIP]: true,
		[ItemType.RIDE]: true,
		[ItemType.WING]: true,
		[ItemType.XIAN_FZ]: true,
		[ItemType.XIAN_XW]: true,
		[ItemType.PET_TL]: true,
		[ItemType.PET_SH]: true,
		[ItemType.TIANXIAN]: true,
		[ItemType.SHENGB]: true,
		[ItemType.TIANNV]: true,
		[ItemType.XIANQ]: true,
		[ItemType.HUA]: true,
		[ItemType.LINGQI]: true,
	}

	/** 显示阶数和附加值的物品类型 */
	public static ITEM_SHOW_RANK_TYPE = {
		[ItemType.RIDE]: true,
		[ItemType.WING]: true,
		[ItemType.XIAN_FZ]: true,
		[ItemType.XIAN_XW]: true,
		[ItemType.PET_TL]: true,
		[ItemType.PET_SH]: true,
		[ItemType.TIANXIAN]: true,
		[ItemType.SHENGB]: true,
		[ItemType.HUA]: true,
		[ItemType.LINGQI]: true,
	}

	public static TYPE_NAME = {
		[ItemType.RIDE]: "坐骑",
		[ItemType.WING]: "翅膀",
		[ItemType.XIAN_FZ]: "法阵",
		[ItemType.XIAN_XW]: "仙位",
		[ItemType.PET_TL]: "通灵",
		[ItemType.PET_SH]: "兽魂",
		[ItemType.TIANXIAN]: "守护",
		[ItemType.SHENGB]: "神兵",
		[ItemType.TIANNV]: "玄女",
		[ItemType.HUA]: "花辇",
		[ItemType.LINGQI]: "灵气",
	}

}

enum ItemUseType {
	TYPE00 = 0,
	TYPE01 = 1,
	TYPE02 = 2,
	TYPE03 = 3,
	TYPE04 = 4,
}
