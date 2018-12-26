class MyGangInfo {
	public mGangId: number = 0
	public mLevel: number = 0
	public mMemberCount: number = 0
	public mGangName: string = ""
	public mGangMasterName: string = ""
	public mNeedPower: number = 0
	public mTotalPower: number = 0
	public mCapital: number = 0
	public mNotice: string = ""
	public mAutoJoin: number = 0

	public mOffice: number = 0
	public mCurContribute: number = 0
	public mContribute: number = 0

	public UpdateInfo(info: Sproto.guild_summary, otherInfo: Sproto.other_guild_info) {
		if (!info) {
			return
		}
		this.mGangId = info.id
		this.mLevel = otherInfo.level
		this.mMemberCount = info.playercount
		this.mGangName = info.name
		this.mGangMasterName = info.leaderinfo.playername
		this.mTotalPower = info.totalpower

		this.mCapital = otherInfo.fund
		this.mNotice = otherInfo.notice
		this.mAutoJoin = otherInfo.autoJoin
		this.mNeedPower = otherInfo.needPower
	}

	public UpdateOtherInfo(info: Sproto.sc_guild_playerinfo_request) {
		this.mOffice = info.office
		this.mCurContribute = info.curcontribute
		this.mContribute = info.contribute
	}

	public UpdateAutoJoinInfo(autoJoin, needPower) {
		this.mAutoJoin = autoJoin
		this.mNeedPower = needPower
	}
}

class GangInfo {
	public mGangId: number
	public mLevel: number
	public mMemberCount: number
	public mGangName: string
	public mGangMasterName: string
	public mNeedPower: number
	public mTotalPower: number
	public mSex: number
	public mJob: number

	public mIdx: number

	public UpdateInfo(info: Sproto.guild_summary, idx: number = 0) {
		this.mGangId = info.id
		this.mLevel = info.level
		this.mMemberCount = info.playercount
		this.mGangName = info.name
		this.mGangMasterName = info.leaderinfo.playername
		this.mNeedPower = info.needPower
		this.mTotalPower = info.totalpower
		this.mSex = info.leaderinfo.sex
		this.mJob = info.leaderinfo.job

		this.mIdx = idx
	}
}

class GangMemberInfo {
	public mPlayerId: number
	public mPlayerName: string
	public mOffice: number
	public mJob: number
	public mSex: number
	public mVipLevel: number
	public mContribute: number
	public mTodayContribute: number
	public mPower: number
	public mLogoutTime: number

	public UpdateInfo(info: Sproto.member_info) {
		this.mPlayerId = info.playerid
		this.mPlayerName = info.playername
		this.mOffice = info.office
		this.mJob = info.job
		this.mSex = info.sex
		this.mVipLevel = info.vip
		this.mContribute = info.contribute
		this.mTodayContribute = info.todayContri
		this.mPower = info.power
		this.mLogoutTime = info.logouttime
	}
}

class ApplicantInfo {
	public mPlayerId: number
	public mVipLevel: number
	public mJob: number
	public mSex: number
	public mPower: number
	public mPlayerName: string
	public mLevel: number
	public mLogoutTime: number

	public UpdateInfo(info: Sproto.guild_apply) {
		this.mPlayerId = info.playerid
		this.mVipLevel = info.vip
		this.mJob = info.job
		this.mSex = info.sex
		this.mPower = info.power
		this.mPlayerName = info.playername
		this.mLevel = info.level
		this.mLogoutTime = info.logouttime
	}
}

class GangSkillInfo {
	public mPosId: number
	public mLevel: number

	public UpdateInfo(info: Sproto.skill_info) {
		this.mPosId = info.posId
		this.mLevel = info.level
	}

	public CanUpgrade() {
		let config = GameGlobal.Config.GuildCommonSkillConfig[this.mLevel + 1]
		if (!config)
			return false

		let levelConfig = config[this.mPosId]
		if (!levelConfig || !levelConfig.cost)
			return false

		let cost = levelConfig.cost
		return Checker.Money(cost.id, cost.count, false)
	}
}

class GangProtectorInfo {
	public todayActive: number = 0 		//0 : integer		#当天活跃度
	public totalActive: number = 0		//1 : integer		#总活跃度
	public protectorLv: number = 0 		//2 : integer		#守护兽等级
	public rewardMark: number 		//3 : integer		#每日奖励领取标记  默认值为0xffffffff 按奖励索引查看对应位，0领取过，1未领取

	public parser(info: Sproto.sc_guild_protector_info_request) {
		this.todayActive = info.todayActive || 0
		this.totalActive = info.totalActive || 0
		this.protectorLv = info.protectorLv || 0
		this.rewardMark = info.rewardMark
	}
}

class GangBossInfo {
	public mStatus: number
	public mHasAward: boolean

	public UpdateInfo(info: Sproto.sc_guild_boss_info_request) {
		this.mStatus =  info.status
		this.mHasAward = info.canreward
	}
}

class GangRecordInfo {

	public static History: number = 1;//帮会记录
	public static Chat: number = 2;//聊天
	public chatRecords: Sproto.guild_chat[] = [];
	public historyRecords: Sproto.guild_history[] = [];

	public addRecordToString(rsp: Sproto.guild_record) {
		if (rsp.type == GangRecordInfo.History) {
			this.historyRecords.unshift(rsp.historyRecord);
		}
		else if (rsp.type == GangRecordInfo.History) {
			this.chatRecords.unshift(rsp.chatRecord);
		}
	}

	public getTypeName(type, time, name) {
		var str = "";
		var color = "|C:0x019704&T:";
		var colorRed = "|C:0xdb0000&T:";

		let milliSeconds = time * 1000;
		let date = new Date(milliSeconds);
		let hstr = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let mstr = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		str = (date.getMonth() + 1) + '月' + date.getDate() + '日' + hstr + ':' + mstr;

		str += "   [|C:0x2f6ff6&T:" + name + "|] "

		switch (type) {
			case 1:
				str += color + "加入了| 帮会";
				break;
			case 2:
				str += color + "离开了| 帮会"
				break;
			case 3:
				str += colorRed + "被踢出了| 帮会"
				break;
			case 4:
				str += "被任命为副会长"
				break;
			case 5:
				str += "成为新的会长"
				break;
		}
		return str
	}
}

