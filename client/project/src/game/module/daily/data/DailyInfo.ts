class DailyBaseInfo {
	public mLevel: number
	public mExp: number
	public mCurActive: number
	public mActiveReward: number
	public mFindFlag: boolean

	public UpdateInfo(info: Sproto.sc_dailyTask_info_request) {
		this.mLevel = info.lv
		this.mExp = info.exp
		this.mCurActive = info.active
		this.mActiveReward = info.activeReward
		this.mFindFlag = info.find != 0
	}
}

class DailyTaskInfo {
	public mTaskId: number
	public mCount: number

	public UpdateInfo(info: Sproto.dailyTask_data) {
		this.mTaskId = info.no
		this.mCount = info.num
	}
}

class OtherActiveInfo {
	public mCurValue: number
	public mReward: number

	public UpdateInfo(info: Sproto.otherActivity_data) {
		this.mCurValue = info.num
		this.mReward = info.reward
	}
}

class MonsterInfo
{
	//怪物列表索引
	//public listIndex=-1;
	//怪物列表
	public monsterList=[];
	//数量
	public num:number;
	//倒计时
	public timeout:number;
	//位运算
	public reward:number;
	
	public UpdateInfo(info:Sproto.otherActivity_monster)
	{
		this.monsterList=info.monsterList;
		this.num=info.num;
		this.timeout=info.time;
		this.reward=info.reward;
	}
}
