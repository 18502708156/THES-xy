class GangBattleRankInfo {
	public mDamage: number
	public mDamageRank: number
	public mHoldtracks: number
	public mHoldtracksRank: number
	public mScore: number
	public mScoreRank: number
	public mKill: number
	public mKillRank: number

	public UpdateInfo(info: Sproto.guildwar_rank_data) {
		if (!info)
			return

		this.mDamage = info.injure
		this.mDamageRank = info.injureRank
		this.mHoldtracks = info.holdtracks
		this.mHoldtracksRank = info.holdtracksRank
		this.mScore = info.score
		this.mScoreRank = info.scoreRank
		this.mKill = info.kill
		this.mKillRank = info.killRank
	}
}

class MyGangBattleInfo {
	public mGateId: number
	public mBrokenFlag: boolean
	public mRebornTime: number
	public mAttackTime: number
	public mGBRankInfo: GangBattleRankInfo = new GangBattleRankInfo

	public mMemberCount: number = 0
	public mPassCount: number = 0
	public mMyGangRankInfo: GangBattleRankInfo = new GangBattleRankInfo

	public mCurGatePlayerCount: number

	public UpdateInfo(info: Sproto.sc_guildwar_player_info_request) {
		this.mGateId = info.barrierId
		this.mBrokenFlag = info.through
		this.mRebornTime = info.reborntime
		this.mAttackTime = info.attacktime || 0
		this.mGBRankInfo.UpdateInfo(info.rankData)
	}

	public UpdateGangInfo(info: Sproto.sc_guildwar_guild_info_request) {
		this.mMemberCount = info.playerNum || this.mMemberCount
		this.mPassCount = info.throughNum || this.mPassCount
		this.mMyGangRankInfo.UpdateInfo(info.rankData)
	}

	public UpdateGateInfo(info: Sproto.sc_guildwar_barrier_info_request) {
		this.mCurGatePlayerCount = info.playerNum
	}
}

class GangBattleBossInfo {
	public mGateId: number
	public mDefend: number
	public mHp: number
	public mRecoveryTime: number

	public UpdateInfo(info: Sproto.sc_guildwar_boss_info_request) {
		this.mGateId = info.barrierId
		this.mDefend = info.shield
		this.mHp = info.hp
		this.mRecoveryTime = info.recovertime
	}
}

class GangBattleKingInfo {
	public mBossId: number
	public mRebornTime: number

	public UpdateInfo(info: Sproto.guildwar_king_data) {
		this.mBossId = info.bossid
		this.mRebornTime = info.reborntime || 0
	}
}

class GuardInfo {
	public mName: string
	public mJob: number
	public mSex: number
	public mServerId: number
	public mGangName: string

	public UpdateInfo(info: Sproto.guildwar_guard_info) {
		this.mName = info.name
		this.mGangName = info.guildName
		this.mJob = info.job
		this.mSex = info.sex
		this.mServerId = info.serverId
	}
}

class GuardsInfo {
	public mGuardType: number
	public mHoldTime: number
	public mResistCount: number
	public mHp: number
	public mGangId: number
	public mGuardList: GuardInfo[]

	public UpdataInfo(info: Sproto.sc_guildwar_guard_info_request) {
		this.mGuardType = info.guardtype //0:怪物 1:玩家
		this.mHoldTime = info.holdtime
		this.mResistCount = info.resistNum
		this.mHp = info.hp
		this.mGangId = info.ownerGuildId
		
		if (this.mGuardType == 1)
		{
			this.mGuardList = new Array<GuardInfo>()
			for (let guardInfo of info.guardinfos)
			{
				let tempGuardInfo = new GuardInfo
				tempGuardInfo.UpdateInfo(guardInfo)
				this.mGuardList.push(tempGuardInfo)
			}
		}
	}
}

class GangRankInfo extends GangBattleRankInfo{
	public mGangId: number
	public mGangName: string
	public mServerId: number
	public mPassCount: number

	public UpdateGRankInfo(info: Sproto.guildwar_guild_info) {
		this.UpdateInfo(info.rankData)
		this.mGangId = info.guildId
		this.mGangName = info.guildName
		this.mServerId = info.serverId
		this.mPassCount = info.throughNum
	}
}

class GangRanksInfo {
	public mGateId: number
	public mGangRankInfoList: GangRankInfo[]

	public UpdateInfo(info: Sproto.sc_guildwar_guild_rank_request) {
		this.mGateId = info.barrierId

		this.mGangRankInfoList = new Array<GangRankInfo>()
		for (let gRankInfo of info.guildinfos)
		{
			let tempGRankInfo = new GangRankInfo
			tempGRankInfo.UpdateGRankInfo(gRankInfo)
			this.mGangRankInfoList.push(tempGRankInfo)
		}
	}
}

class GBattlePlayerGlobalInfo {
	public mRebornTime: number
	public mScore: number
	public mScoreRank: number
	public mKill: number
	public mKillRank: number
	public mScoreReward: number
	public mEndTime: number
	public mWorldLevel: number

	public UpdateInfo(info: Sproto.sc_guildwar_player_global_info_request) {
		this.mRebornTime = info.reborntime
		this.mScore = info.score
		this.mScoreRank = info.scoreRank
		this.mKill = info.kill
		this.mKillRank = info.killRank
		this.mScoreReward = info.rewardMark
		this.mEndTime = info.endtime
		this.mWorldLevel = info.worldlevel
	}
}

class GBattlePlayerRankInfo {
	public mPlayerId: number
	public mName: string
	public mJob: number
	public mSex: number
	public mServerId: number
	public mGangName: string
	public mRankData: GangBattleRankInfo = new GangBattleRankInfo

	public UpdateInfo(info: Sproto.guildwar_player_data) {
		this.mPlayerId = info.dbid
		this.mName = info.name
		this.mJob = info.job
		this.mSex = info.sex
		this.mServerId = info.serverId
		this.mGangName = info.guildName
		this.mRankData.UpdateInfo(info.rankData)
	}
}

class GBattlePlayerRanksInfo {
	public mGateId: number
	public mGBPlayerRankInfoList: GBattlePlayerRankInfo[]

	public UpdateInfo(info: Sproto.sc_guildwar_player_rank_request) {
		this.mGateId = info.barrierId

		this.mGBPlayerRankInfoList = new Array<GBattlePlayerRankInfo>()
		for (let gbPlayerRankInfo of info.rankInfos)
		{
			let tempgbPlayerRankInfo = new GBattlePlayerRankInfo
			tempgbPlayerRankInfo.UpdateInfo(gbPlayerRankInfo)
			this.mGBPlayerRankInfoList.push(tempgbPlayerRankInfo)
		}
	}
}

class GBattleGangGlobalInfo {
	public mPlayerCount: number
	public mScore: number
	public mScoreRank: number

	public UnpdateInfo(info: Sproto.sc_guildwar_myguild_global_info_request) {
		this.mPlayerCount = info.playerNum
		this.mScore = info.score
		this.mScoreRank = info.scoreRank
	}
}