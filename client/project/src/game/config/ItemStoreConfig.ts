class ItemStoreConfig {

	private static mBangYuanStore
	private static mYuanBaoStore

	static getStoreByItemID(id: number,type =ShopController.EN_SHOP_BANGYUAN) {
		var arr;
		switch(type)
		{
			case ShopController.EN_SHOP_BANGYUAN: arr = this.GetItemBYStoreConfig();
			break
			case ShopController.EN_SHOP_YUANBAO: arr = this.GetItemYBStoreConfig();
			break	
		}
		if (arr) {
			return arr[id] || null
		}
		return null
	}

	static GetItemBYStoreConfig() {
		if (!this.mBangYuanStore) {
			let datas = this.mBangYuanStore = {}
			let config = GameGlobal.Config.BangYuanStore
			for (let key in config) {
				datas[config[key].id] = config[key]
			}
		}
		return this.mBangYuanStore
	}

	static GetItemYBStoreConfig() {
		if (!this.mYuanBaoStore) {
			let datas = this.mYuanBaoStore = {}
			let config = GameGlobal.Config.YuanBaoStore
			for (let key in config) {
				datas[config[key].id] = config[key]
			}
		}
		return this.mYuanBaoStore
	}

	public static GetPrice(itemId: number,type =ShopController.EN_SHOP_BANGYUAN): number {
		let config = this.getStoreByItemID(itemId,type)
		if (config) {
			return config.currency.count
		}
		return 9999999
	}

	public static GetStoreType(id: number): number {
		if (this.GetItemBYStoreConfig()[id]) {
			return ShopController.EN_SHOP_BANGYUAN
		}
		if (this.GetItemYBStoreConfig()[id]) {
			return ShopController.EN_SHOP_YUANBAO
		}
		return -1
	}
}