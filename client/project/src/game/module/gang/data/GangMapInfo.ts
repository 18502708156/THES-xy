class GangMapTaskInfo {
	public mTaskId: number
	public mCount: number
	public mResetCount: number
	public mRewardStatus: boolean

	public UpdateInfo(info: Sproto.task_info) {
		this.mTaskId = info.id
		this.mCount = info.count
		this.mResetCount = info.recount
		this.mRewardStatus = info.rewardStatus
	}
}

class GangMapExchangInfo {
	public mRefreshTime: number
	public mRefreshCount: number
	public mExchangeList: number[]
	public mGMItemMap: {[key: number]: number} ={}
	public mExchangedMark: number

	public UpdateInfo(info: Sproto.exchange_info) {
		this.mRefreshTime = info.refreshTime
		this.mRefreshCount = info.refreshCount
		this.mExchangeList = info.exchangeList
		this.mExchangedMark = info.exchangeMark

		for (let itemInfo of info.guildBag)
		{
			this.mGMItemMap[itemInfo.id] = itemInfo.count
		}	
	}

	public UpdateBagInfo(rewards: Sproto.reward_data[]) {
		for (let reward of rewards) {
			this.mGMItemMap[reward.id] = (this.mGMItemMap[reward.id] || 0) + reward.count
		}
	}

	public GetGangMapItemNum(gmItemId) {
		return this.mGMItemMap[gmItemId] || 0
	}

	public HasExchangeItem(itemId) {
		return (this.mExchangedMark & Math.pow(2, itemId-1)) == 0
	}

	public CanItemExchange() {
		for (let exchangeItemId of this.mExchangeList)
		{
			let config = GameGlobal.Config.GuildMapBuyConfig[exchangeItemId]
			if (!config)
				continue

			let flag = true
			for (let cost of config.cost)
			{
				if (this.GetGangMapItemNum(cost.id) < cost.count)
					flag = false
			}

			if (flag && !this.HasExchangeItem(exchangeItemId))
				return true
		}

		return false
	}
}

