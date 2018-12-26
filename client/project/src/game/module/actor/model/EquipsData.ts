class EquipsData {

	strengthen: number = 0	// 强化
	gem: number = 0			// 宝石
	refine: number = 0 		// 精炼
	exercise: number = 0 	// 锻炼
	item: ItemData = new ItemData;
	deityEquipData: DeityEquipData = new DeityEquipData; //神装 红装数据

	public parser(data: Sproto.equip_data): void {
		this.strengthen = data.strengthen
		this.refine = data.refine
		this.exercise = data.anneal
		this.gem = data.gem
		this.item.ParserByEquipData(data.item)
		this.deityEquipData.UpdateInfo(data.reddata)
	}

	public IsOrange(): boolean {
		return this.item != null && this.item.configID != 0 && this.item.itemConfig.quality == 4
	}

	public static Create(itemId: number): EquipsData {
		let data = new EquipsData
		data.strengthen = 0
		data.gem = 0
		data.item.configID = itemId
		data.item.count = 1
		return data
	}

	public GetForgeValue(forgeType: ForgeType) {
		let value = 0
		switch (forgeType) {
			case ForgeType.BOOST:
				value = this.strengthen
				break;
			case ForgeType.REFINE:
				value = this.refine
				break;
			case ForgeType.EXERCISE:
				value = this.exercise
				break;
			case ForgeType.GEM:
				value = this.gem
				break;
		}
		return value
	}
}

class DeityEquipData {
	public injectLevel: number
	public injectNum: number

	public UpdateInfo(info: Sproto.equip_red_data) {
		this.injectLevel = info.injectstage
		this.injectNum = info.injectcount
	}
}