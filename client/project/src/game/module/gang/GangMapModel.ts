class GangMapModel extends BaseSystem {

	private mTaskInfoMap: {[key: number]: GangMapTaskInfo} = {}
	private mGMExchangeInfo: GangMapExchangInfo

	public mRobotList: Sproto.guild_map_shows[] = []

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_guild_map_reward, this._DoGangMapReward)
		this.regNetMsg(S2cProtocol.sc_guild_map_one_update, this._DoUpdateGangMapInfo)
		this.regNetMsg(S2cProtocol.sc_guild_robot_datas, this._DoGetRobotList)
	}

	private _DoGangMapReward(rsp: Sproto.sc_guild_map_reward_request) {
		let tipText = ""
		for (let reward of rsp.reward)
		{
			UserTips.ins().showTips(`获得 ${GangMapConst.GetGangMapItemName(reward.id)}*${reward.count}`)
		}

		this.mGMExchangeInfo.UpdateBagInfo(rsp.reward)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO)
	}

	private _DoUpdateGangMapInfo(rsp: Sproto.sc_guild_map_one_update_request) {
		this._UpdateTaskInfo(rsp)
	}

	private _DoGetRobotList(rsp: Sproto.sc_guild_robot_datas_request) {
		this.mRobotList = rsp.robotlist || []
	}

	private _UpdateTaskInfo(taskInfo: Sproto.sc_guild_map_one_update_request)
	{
		if (!this.mTaskInfoMap[taskInfo.id])
			return

		this.mTaskInfoMap[taskInfo.id].UpdateInfo(taskInfo)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_TASKINFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_UPDATEENTITY)
	}

	public SendGetMapTaskInfo() {
		let req = new Sproto.cs_guild_map_task_info_request
		this.Rpc(C2sProtocol.cs_guild_map_task_info, req, (rsp: Sproto.cs_guild_map_task_info_response) => {
			for (let taskInfo of rsp.taskInfo)
			{
				let gmTaskInfo = this.mTaskInfoMap[taskInfo.id]
				if (!gmTaskInfo)
				{
					gmTaskInfo = new GangMapTaskInfo
					this.mTaskInfoMap[taskInfo.id] = gmTaskInfo
				}
				gmTaskInfo.UpdateInfo(taskInfo)
			}

			GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_TASKINFO)
			GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_MAPENTITY_INIT)
		}, this)
	}

	public SendFinishTask(taskId) {
		let req = new Sproto.cs_guild_map_task_complete_request
		req.taskId = taskId

		this.Rpc(C2sProtocol.cs_guild_map_task_complete, req)
	}

	public SendResetTask(taskId) {
		let req = new Sproto.cs_guild_map_task_reset_request
		req.taskId = taskId

		this.Rpc(C2sProtocol.cs_guild_map_task_reset, req, (rsp: Sproto.cs_guild_map_task_reset_response) => {
			if (rsp.ret) 
			{
				this._UpdateTaskInfo(rsp.taskInfo)
				GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_RESET_MAPENTITY)
			}
		}, this)
	}

	public SendOneKeyFinish(taskId) {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_ONEKEYFINISH)

		let req = new Sproto.cs_guild_map_task_quick_request
		req.taskId = taskId

		this.Rpc(C2sProtocol.cs_guild_map_task_quick, req, (rsp: Sproto.cs_guild_map_task_quick_response) => {
			if (rsp.ret)
			{
				this._UpdateTaskInfo(rsp.taskInfo)
			}
		}, this)
	}

	public SendGainReward(taskId) {
		let req = new Sproto.cs_guild_map_reward_request
		req.taskId = taskId

		this.Rpc(C2sProtocol.cs_guild_map_reward, req, (rsp: Sproto.cs_guild_map_reward_response) => {
			if (rsp.ret)
			{

			}
		})
	}

	public SendGetExchange() {
		let req = new Sproto.cs_guild_map_exchange_info_request
		this.Rpc(C2sProtocol.cs_guild_map_exchange_info, req, (rsp: Sproto.cs_guild_map_exchange_info_response) => {
			this.mGMExchangeInfo = new GangMapExchangInfo
			this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo)
			this.StartTimer(rsp.exchangeInfo.refreshTime || 0)
			GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO)
		}, this)
	}

	public SendRefreshExchange() {
		let req = new Sproto.cs_guild_map_exchange_refresh_request
		this.Rpc(C2sProtocol.cs_guild_map_exchange_refresh, req, (rsp: Sproto.cs_guild_map_exchange_refresh_response) => {
			this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo)
			this.StartTimer(rsp.exchangeInfo.refreshTime || 0)
			GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO)
		}, this)
	}

	public SendExchange(id) {
		let req = new Sproto.cs_guild_map_exchange_pay_request
		req.id = id

		this.Rpc(C2sProtocol.cs_guild_map_exchange_pay, req, (rsp: Sproto.cs_guild_map_exchange_pay_response) => {
			this.mGMExchangeInfo.UpdateInfo(rsp.exchangeInfo)
			GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO)
		}, this)
	}

	public GetTaskInfo(taskId) {
		return this.mTaskInfoMap[taskId]
	}

	public IsTaskDone(taskId) {
		let taskInfo = this.mTaskInfoMap[taskId]
		if (!taskInfo)
			return false

		let taskConfig = GameGlobal.Config.GuildMapTaskConfig[taskInfo.mTaskId]
		if (!taskConfig)
			return false

		return taskConfig.number <= taskInfo.mCount
	}

	public HasGainTaskReward(taskId) {
		let taskInfo = this.mTaskInfoMap[taskId]
		if (!taskInfo)
			return false

		return taskInfo.mRewardStatus
	}

	public CanResetTask(taskId) {
		let taskInfo = this.mTaskInfoMap[taskId]
		if (!taskInfo)
			return false

		let vipLv = GameGlobal.actorModel.vipLv
		let vipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv]
		if (!vipConfig)
			return false

		return taskInfo.mResetCount < vipConfig.buyreset
	}

	public get gangMapExchangeInfo() {
		return this.mGMExchangeInfo
	}

	public GetGangMapItemNum(gmItemId) {
		return this.mGMExchangeInfo.GetGangMapItemNum(gmItemId)
	}

	public HasExchangeItem(itemId) {
		return this.mGMExchangeInfo.HasExchangeItem(itemId)
	}

	public CanItemExchange() {
		if (!GameGlobal.GangModel.HasGang() || !this.mGMExchangeInfo)
			return false
			
		return this.mGMExchangeInfo.CanItemExchange()
	}

	public StartPickPlantNotice() {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_START_PICKPLANT_NOTICY)
	}

	public SetAutoTask(autoFlag) {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_AUTO_TASK, autoFlag)
	}

	public HidePickProgressNoticy() {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGMAP_HIDEPICKPROGRESS)
	}
	
	private StartTimer(endTime) {
		TimerManager.ins().removeAll(this)
		let diffTime = Math.max(endTime - GameServer.serverTime, 0)

		TimerManager.ins().doTimer(diffTime * 1000, 1, this.SendGetExchange, this)
	}
}
