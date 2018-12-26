class UserBagData {
	public mItems: {[key: number]: ItemData} = {}
	private m_Length = 0

	public Clear(): void {
		this.mItems = {}
		this.m_Length = 0
	}

	public Add(itemData: ItemData): void {
		if (!this.mItems[itemData.handle]) {
			++this.m_Length
		}
		this.mItems[itemData.handle] = itemData
	}

	public Delete(handle: number): ItemData {
		let data = this.mItems[handle]
		if (data) {
			--this.m_Length
			delete this.mItems[handle]
			return data
		}
		return null
	}

	public Update(handle: number, count: number, temp: {itemData: ItemData}): number {
		let data = this.mItems[handle]
		if (data) {
			let addNum = count - data.count
			data.count = count
			temp.itemData = data
			return addNum
		}
		return null
	}

	public GetById(configId: number): ItemData {
		for (let key in this.mItems) {
			if (this.mItems[key].configID == configId) {
				return this.mItems[key]
			}
		}
		return null
	}

	public GetByIds(configId: number): ItemData[] {
		let list = []
		for (let key in this.mItems) {
			if (this.mItems[key].configID == configId) {
				list.push(this.mItems[key])
			}
		}
		return list
	}

	public GetByHandle(handle: number): ItemData {
		return this.mItems[handle]
	}

	public GetLength(): number {
		return this.m_Length
	}
}

class UserBagData02 extends UserBagData {
	private m_ConfigIds: {[key: number]: number} = {}

	public Clear(): void {
		super.Clear()
		this.m_ConfigIds = {}
	}

	public Add(itemData: ItemData): void {
		super.Add(itemData)
		this.m_ConfigIds[itemData.configID] = itemData.handle
	}

	public GetById(configId: number): ItemData {
		return this.GetByHandle(this.m_ConfigIds[configId])
	}

	public Delete(handle: number): ItemData {
		let itemData = super.Delete(handle)
		if (itemData) {
			delete this.m_ConfigIds[itemData.configID]
		}
		return itemData
	}
}