class DailyModel extends BaseSystem {
	private mBaseInfo: DailyBaseInfo
	private mTaskList: DailyTaskInfo[]
	private mYesterdayTaskMap: {[key: number]: DailyTaskInfo}
	private mRetrieveResMap: {[key: number]: DailyTaskInfo}
	private mRetrieveExpMap: {[key: number]: DailyTaskInfo}
	private mTeamActionInfo: OtherActiveInfo
	private mPeaceActionInfo: OtherActiveInfo
	//师门
	public monsterInfo:MonsterInfo;
	public mResRetrieveType: number

	//记录找回是否点击查看
	public mViewExp: boolean
	public mViewRes: boolean
	public mViewGoldRes: boolean
	public mViewBindGoldRes: boolean
	public mFindCount: number = 0

	public constructor() {
		super()

		this.mRedPoint = new DailyModelRedPoint(this)

		this.mBaseInfo = new DailyBaseInfo
		this.mTeamActionInfo = new OtherActiveInfo
		this.mPeaceActionInfo = new OtherActiveInfo

		this.monsterInfo=new MonsterInfo;

		this.regNetMsg(S2cProtocol.sc_dailyTask_info, this._DoInitInfo)
		this.regNetMsg(S2cProtocol.sc_dailyTask_update, this._DoUpdate)
	}

	public Init() {
		
	}

	private _DoInitInfo(rsp: Sproto.sc_dailyTask_info_request) {
		this.mBaseInfo.UpdateInfo(rsp)
		this.mTeamActionInfo.UpdateInfo(rsp.teamFB)
		this.mPeaceActionInfo.UpdateInfo(rsp.chapterWar)

		this.monsterInfo.UpdateInfo(rsp.monster);
		GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_FOMALHAUT_MONSTERID);

		this.mTaskList = new Array<DailyTaskInfo>()
		this._UpdateTaskInfoList(this.mTaskList, rsp.today)
		this.mYesterdayTaskMap = {}
		this._UpdateTaskInfoMap(this.mYesterdayTaskMap, rsp.yesterday)
		this.mRetrieveExpMap = {}
		this._UpdateTaskInfoMap(this.mRetrieveExpMap, rsp.findExp)
		this.mRetrieveResMap = {}
		this._UpdateTaskInfoMap(this.mRetrieveResMap, rsp.findItem)
		if (rsp.find > this.mFindCount) //找回天数变化 说明跨天
		{
			this.mFindCount = rsp.find
			this.mViewExp = false
			this.mViewRes = false
			this.mViewBindGoldRes = false
			this.mViewGoldRes = false
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW)
		}
	}

	private _DoUpdate(rsp: Sproto.sc_dailyTask_update_request) {
		if (rsp.lv)
			this.mBaseInfo.mLevel = rsp.lv
		
		if (rsp.exp)
		{
			this.mBaseInfo.mExp = rsp.exp
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE)
		}

		if (rsp.active)
		{
			this.mBaseInfo.mCurActive = rsp.active
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_ACTIVE_UPDATE)
		}

		if (rsp.activeReward)
			this.mBaseInfo.mActiveReward = rsp.activeReward

		if (rsp.find)
		{
			this.mBaseInfo.mFindFlag = rsp.find != 0
		}
			

		if (rsp.teamFB)
		{
			this.mTeamActionInfo.UpdateInfo(rsp.teamFB)
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_TEAM_UPDATE)
		}

		if (rsp.chapterWar)
		{
			this.mPeaceActionInfo.UpdateInfo(rsp.chapterWar)
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_PEACE_UPDATE)
		}

		if (rsp.today)
		{
			this.mTaskList = new Array<DailyTaskInfo>()
			this._UpdateTaskInfoList(this.mTaskList, rsp.today)
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_TASKLIST_UPDATE)
		}

		if (rsp.yesterday)
		{
			this.mYesterdayTaskMap = {}
			this._UpdateTaskInfoMap(this.mYesterdayTaskMap, rsp.yesterday)
		}

		if (rsp.findExp)
		{
			this.mRetrieveExpMap = {}
			this._UpdateTaskInfoMap(this.mRetrieveExpMap, rsp.findExp)
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE)
		}

		if (rsp.findItem)
		{
			this.mRetrieveResMap = {}
			this._UpdateTaskInfoMap(this.mRetrieveResMap, rsp.findItem)
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE)
		}
		if (rsp.monster)//师门
		{
			this.monsterInfo.UpdateInfo(rsp.monster);
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_FOMALHAUT_MONSTERID);
		}
	}

	private _UpdateTaskInfoList(taskInfoList: DailyTaskInfo[], infoList: Sproto.dailyTask_data[]) {
		for (let info of infoList)
		{
			let tempInfo = new DailyTaskInfo
			tempInfo.UpdateInfo(info)
			taskInfoList.push(tempInfo)
		}
	}

	private _UpdateTaskInfoMap(taskInfoMap: {[key: number]: DailyTaskInfo}, infoList: Sproto.dailyTask_data[])
	{
		for (let info of infoList)
		{
			let tempInfo = new DailyTaskInfo
			tempInfo.UpdateInfo(info)
			taskInfoMap[info.no] = tempInfo
		}
	}

	public SendGainAward(type: number, rewardId: number) {
		let req = new Sproto.cs_dailyTask_otherActivity_reward_request
		req.otherActivity = type
		req.reward = rewardId

		this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_reward, req)
	}
	//一键完成进度 1->师门,2->300,3->组队副本
	public SendQuilkDone(type: number) {
		let req = new Sproto.cs_dailyTask_otherActivity_complete_request
		req.otherActivity = type

		this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_complete, req)
	}

	public SendUpgradeMedal() {
		let req = new Sproto.cs_dailyTask_up_level_request
		this.Rpc(C2sProtocol.cs_dailyTask_up_level, req, (rsp: Sproto.cs_dailyTask_up_level_response) => {
			if (rsp.ret)
			{
				this.mBaseInfo.mLevel = rsp.lv
				this.mBaseInfo.mExp = rsp.exp
				GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE)
			}
		}, this)
	}

	public SendGainActiveAward(rewardId: number) {
		let req = new Sproto.cs_dailyTask_activity_reward_request
		req.rewardNo = rewardId

		this.Rpc(C2sProtocol.cs_dailyTask_activity_reward, req, (rsp: Sproto.cs_dailyTask_activity_reward_response) => {
			if (rsp.ret)
			{
				this.mBaseInfo.mActiveReward = rsp.activityReward
				GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_ACTIVE_UPDATE)
			}
		}, this)
	}

	public SendRetrieve(taskId, costType, findType, num) {
		let req = new Sproto.cs_dailyTask_activity_find_request
		req.activityNo = taskId
		req.cashtype = costType
		req.findType = findType
		req.num = num

		this.Rpc(C2sProtocol.cs_dailyTask_activity_find, req, (rsp: Sproto.cs_dailyTask_activity_find_response) => {
			if (rsp.ret)
			{
				this.mBaseInfo.mExp = rsp.exp
				GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_MEDAL_UPDATE)

				if (rsp.findType == DailyConst.TASK_RETRIEVE_TYPE_EXP)
				{
					let retrieveExpInfo = this.mRetrieveExpMap[rsp.activityNo]
					if (!retrieveExpInfo)
					{
						retrieveExpInfo = new DailyTaskInfo
						retrieveExpInfo.mTaskId = rsp.activityNo
						this.mRetrieveExpMap[rsp.activityNo] = retrieveExpInfo
					}
					retrieveExpInfo.mCount = rsp.num

					UserTips.ins().showTips(`已找回${rsp.findExpNum || 0}点历练经验`)
				}
				else
				{
					let retrieveResInfo = this.mRetrieveResMap[rsp.activityNo]
					if (!retrieveResInfo)
					{
						retrieveResInfo = new DailyTaskInfo
						retrieveResInfo.mTaskId = rsp.activityNo
						this.mRetrieveResMap[rsp.activityNo] = retrieveResInfo
					}
					retrieveResInfo.mCount = rsp.num
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_RETRIEVELIST_UPDATE)
			}
		}, this)
	}

	public SendRetrieveExp() {
		let req = new Sproto.cs_dailyTask_activity_find_all_exp_request

		this.Rpc(C2sProtocol.cs_dailyTask_activity_find_all_exp, req, (rsp: Sproto.cs_dailyTask_activity_find_all_exp_response) => {
			if (rsp.ret)
			{
				UserTips.ins().showTips(`已找回${rsp.findExpNum || 0}点历练经验`)
			}
		}, this)
	}

	//师门打怪
	public SendKoMonster(no: number) {
		let req=new Sproto.cs_dailyTask_otherActivity_monster_request;
		req.no=no;
		this.Rpc(C2sProtocol.cs_dailyTask_otherActivity_monster, req)
	}
	//师门升星
	public SendUpStar(no: number) {
		let req=new Sproto.cs_dailyTask_up_monster_request;
		req.no=no;
		this.Rpc(C2sProtocol.cs_dailyTask_up_monster, req)
	}


	public get peaceInfo() {
		return this.mPeaceActionInfo
	}

	public get teamInfo() {
		return this.mTeamActionInfo
	}

	public get baseInfo() {
		return this.mBaseInfo
	}

	//是否领取
	public IsGetItem()//:boolean 
	{
		return this.monsterInfo.reward > 0;
	}

	public IsTeamTargetDone() {
		return this.mTeamActionInfo.mCurValue >= GameGlobal.Config.DailyBaseConfig.teamFB
	}

	public HasGainedTeamReward() {
		return this.mTeamActionInfo.mReward > 0
	}

	public IsPeaceTargetDone(targetVal) {
		return this.mPeaceActionInfo.mCurValue >= targetVal
	}

	public HasGainedPeaceReward(rewardNum) {
		return (this.mPeaceActionInfo.mReward & Math.pow(2, rewardNum)) > 0
	}

	public IsActiveTargetDone(targetVal) {
		return this.mBaseInfo.mCurActive >= targetVal
	}

	public HasGainedActiveReward(rewardNum) {
		return (this.mBaseInfo.mActiveReward & Math.pow(2, rewardNum)) > 0
	}

	public RecordResRetrieveFlag(type, b) {
		if (type == DailyConst.TASK_RETRIEVE_COST_BINDGOD)
		{
			if (b && !this.mViewGoldRes)
				return

			this.mViewBindGoldRes = b
		}
		else
		{
			this.mViewGoldRes = b
		}
		
		GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW)
	}

	public RecordExpFlag(b) {
		this.mViewExp = b
		GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW)
	}

	public RecordResFlag(b) {
		this.mViewRes = b
		GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_UPDATE_RETREVE_VIEW)
	}

	public GetMonsterList() {
		let monIdList = []
		let monList = this.monsterInfo.monsterList
		for (let taskId of monList)
		{
			let monsterId = DailyConst.GetMonsterId(taskId)
			monIdList.push(monsterId)
		}

		return monIdList
	}

	public GetTaskIndex(monsterId) {
		let index = 0
		for (let taskId of this.monsterInfo.monsterList)
		{
			if (monsterId == DailyConst.GetMonsterId(taskId))
			{
				return index
			}

			index++
		}

		return -1
	}

	public GetTimeReach(level) {
		let curLevel = this.mBaseInfo.mLevel
		let totalExp = 0
		for (let id in GameGlobal.Config.DailyAttrsConfig)
		{
			let config = GameGlobal.Config.DailyAttrsConfig[id]
			if (config.level > curLevel && config.level <= level+1)
			{
				totalExp += config.proexp
			}
		}

		let maxExpPerDay = DailyConst.GetMaxExpPerDay()
		return Math.ceil((totalExp - this.mBaseInfo.mExp) / maxExpPerDay)
	}

	public GetTaskCount(rewardNum) {
		for (let taskInfo of this.mTaskList) 
		{
			if (taskInfo.mTaskId == rewardNum)
				return taskInfo.mCount
		}

		return 0
	}

	public GetRetrieveExpList() {
		if (!this.mBaseInfo.mFindFlag)
		{
			return []
		}

		let retrieveExpList = new Array<DailyTaskInfo>()
		let taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id")
		for (let config of taskList)
		{
			let yesterInfo = this.mYesterdayTaskMap[config.id]
			let yesterCount = yesterInfo ? yesterInfo.mCount : 0
			let retrieveExpInfo = this.mRetrieveExpMap[config.id]
			let retrieveExpCount = retrieveExpInfo ? retrieveExpInfo.mCount : 0
			let count = config.maxtimes - yesterCount - retrieveExpCount
			let retriveConfig = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP)
			if (retriveConfig && count > 0)
			{
				let tempInfo = new DailyTaskInfo
				tempInfo.mTaskId = config.id
				tempInfo.mCount = count
				retrieveExpList.push(tempInfo)
			}
		}

		return retrieveExpList
	}

	public HasFomalhautReward() {
		if (this.monsterInfo.num < GameGlobal.Config.DailyBaseConfig.monster)
		{
			return false
		}

		return !this.IsGetItem()
	}

	public HasMonsterAtk() {
		return this.monsterInfo.monsterList.length > 0
	}

	public GetRetrieveResList() {
		if (!this.mBaseInfo.mFindFlag)
		{
			return []
		}

		let retrieveResList = new Array<DailyTaskInfo>()
		let taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id")
		for (let config of taskList)
		{
			let yesterInfo = this.mYesterdayTaskMap[config.id]
			let yesterCount = yesterInfo ? yesterInfo.mCount : 0
			let retrieveResInfo = this.mRetrieveResMap[config.id]
			let retrieveResCount = retrieveResInfo ? retrieveResInfo.mCount : 0
			let count = config.maxtimes - yesterCount - retrieveResCount
			let retriveConfig1 = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_RES)
			let retriveConfig2 = DailyConst.GetRetrieveConfig(config.id, DailyConst.TASK_RETRIEVE_COST_BINDGOD, DailyConst.TASK_RETRIEVE_TYPE_RES)
			if ((retriveConfig1 || retriveConfig2)  && count > 0)
			{
				let tempInfo = new DailyTaskInfo
				tempInfo.mTaskId = config.id
				tempInfo.mCount = count
				retrieveResList.push(tempInfo)
			}
		}

		return retrieveResList
	}

	public GetRetrieveResListByType(type) {
		let resRetrieveList = this.GetRetrieveResList()
		let dataList = []
		for (let taskInfo of resRetrieveList)
		{
			let config = DailyConst.GetRetrieveConfig(taskInfo.mTaskId, type, DailyConst.TASK_RETRIEVE_TYPE_RES)
			if (config)
				dataList.push(taskInfo)
		}

		return dataList
	}

	public GetRetrieveExpCost() {
		let cost = {id:0, count:0, exp:0}

		let expList = this.GetRetrieveExpList()
		for (let expInfo of expList)
		{
			let retrieveConf = DailyConst.GetRetrieveConfig(expInfo.mTaskId, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP)
			let config = GameGlobal.Config.DailyProgressConfig[expInfo.mTaskId]
			cost.id = retrieveConf.cost[0].id
			cost.count += retrieveConf.cost[0].count * expInfo.mCount
			cost.exp += config.exp * expInfo.mCount
		}

		return cost
	}

	public CanMedalUpgrade() {
		return DailyConst.CanMedalUpgrade(this.mBaseInfo.mLevel, this.mBaseInfo.mExp)
	}

	public HasBoxReward() {
		let boxList = CommonUtils.GetArray(GameGlobal.Config.DailyActiveConfig, "id")
		for (let config of boxList)
		{
			if (this.IsActiveTargetDone(config.target) && !this.HasGainedActiveReward(config.id))
				return true
		}

		return false
	}

	public HasPeaceReward() {
		let peaceList = DailyConst.GetPeaceList()
		for (let config of peaceList)
		{
			if (this.IsPeaceTargetDone(config.target) && !this.HasGainedPeaceReward(config.reward))
				return true
		}

		return false
	}

	public HasTeamReward() {
		return this.IsTeamTargetDone() && !this.HasGainedTeamReward()
	}

	public mRedPoint: DailyModelRedPoint

	public IsRedPointDaily(type: number) {
		return this.mRedPoint.IsRedAct(type)
	}

	public IsRedPoint() {
		this.mRedPoint.Get(DailyModelRedPoint.INDEX_ACT)
		return this.mRedPoint.IsRedPoint()
	}
}

class DailyModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly MEDAL_UPGRADE = 1
		public static readonly ACTIVE_BOX_REWARD = 2
		public static readonly RES_RETRIEVE = 3
		public static readonly EXP_RETRIEVE = 4
		public static readonly PEACE_REWARD = 5
		public static readonly TEAM_REWARD = 6
		public static readonly FOMALHAUT_NOTICE = 7
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}
	private mModel: DailyModel

	constructor(model: DailyModel) {
		super()
		this.mModel = model
	}

	public GetMessageDef(): string[] {
		return [MessageDef.DAILY_MEDAL_UPDATE, MessageDef.DAILY_ACTIVE_UPDATE, 
				MessageDef.DAILY_RETRIEVELIST_UPDATE, MessageDef.DAILY_PEACE_UPDATE, 
				MessageDef.DAILY_TEAM_UPDATE, MessageDef.DAILY_FOMALHAUT_MONSTERID,
				MessageDef.DAILY_UPDATE_RETREVE_VIEW, MessageDef.TEAM_FUBEN_INFO]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[DailyModelRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == DailyModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.DAILY_REDPOINT_NOTICE)
		}
	}
	
	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mRedPointMap) {
			if (this.mRedPointMap[key]) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.mRedPointMap[DailyModelRedPoint.MEDAL_UPGRADE] = this.mModel.CanMedalUpgrade()
		this.mRedPointMap[DailyModelRedPoint.ACTIVE_BOX_REWARD] = this.mModel.HasBoxReward()
		this.mRedPointMap[DailyModelRedPoint.RES_RETRIEVE] = this.mModel.GetRetrieveResList().length > 0 && !this.mModel.mViewRes
		this.mRedPointMap[DailyModelRedPoint.EXP_RETRIEVE] = this.mModel.GetRetrieveExpList().length > 0 && !this.mModel.mViewExp
		this.mRedPointMap[DailyModelRedPoint.PEACE_REWARD] = this.mModel.HasPeaceReward()
		this.mRedPointMap[DailyModelRedPoint.TEAM_REWARD] = this.mModel.HasTeamReward() || GameGlobal.CrossTeamModel.GetCount() > 0
		this.mRedPointMap[DailyModelRedPoint.FOMALHAUT_NOTICE] = this.mModel.HasFomalhautReward() || this.mModel.HasMonsterAtk()
	}

	public IsRedAct(type: number) {
		this.Get(DailyModelRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}