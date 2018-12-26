class EscortBaseInfo {
	public mEscortCount: number
	public mRobCount: number
	public mState: number
	public mQuality: number
	public mFinishTime: number

	public UpdateInfo(info: Sproto.sc_escort_info_update_request) {
		this.mEscortCount = info.escortCount
		this.mRobCount = info.robCount
		this.mState = info.status
		this.mQuality = info.quality
		this.mFinishTime = info.finishTime
	}
}

class EscortInfo {
	public mPlayerId: number
	public mPlayerName: string
	public mPower: number
	public mQuality: number
	public mRobbedCount: number
	public mFinishTime: number
	public mRobMark

	public UpdateInfo(info: Sproto.escort_info) {
		this.mPlayerId = info.playerid
		this.mPlayerName = info.playerName
		this.mPower = info.power
		this.mQuality = info.quality
		this.mRobbedCount = info.catchCount
		this.mFinishTime = info.finishTime
		this.mRobMark = info.robMark
	}
}

class RecordInfo {
	public mPlayerId: number
	public mPlayerName: string
	public mRecordId: number
	public mType: number
	public mQuality: number
	public mPower: number
	public mTime: number
	public mWinFlag: boolean
	public mOperFlag: boolean

	public UpdateInfo(info: Sproto.record_info) {
		this.mPlayerId = info.playerId
		this.mPlayerName = info.name
		this.mRecordId = info.recordId
		this.mType = info.type
		this.mQuality = info.quality
		this.mPower = info.power
		this.mType = info.time
		this.mWinFlag = info.isWin
		this.mOperFlag = info.operate
	}
}