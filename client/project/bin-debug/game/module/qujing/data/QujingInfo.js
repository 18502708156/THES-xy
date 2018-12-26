var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EscortBaseInfo = (function () {
    function EscortBaseInfo() {
    }
    EscortBaseInfo.prototype.UpdateInfo = function (info) {
        this.mEscortCount = info.escortCount;
        this.mRobCount = info.robCount;
        this.mState = info.status;
        this.mQuality = info.quality;
        this.mFinishTime = info.finishTime;
    };
    return EscortBaseInfo;
}());
__reflect(EscortBaseInfo.prototype, "EscortBaseInfo");
var EscortInfo = (function () {
    function EscortInfo() {
    }
    EscortInfo.prototype.UpdateInfo = function (info) {
        this.mPlayerId = info.playerid;
        this.mPlayerName = info.playerName;
        this.mPower = info.power;
        this.mQuality = info.quality;
        this.mRobbedCount = info.catchCount;
        this.mFinishTime = info.finishTime;
        this.mRobMark = info.robMark;
    };
    return EscortInfo;
}());
__reflect(EscortInfo.prototype, "EscortInfo");
var RecordInfo = (function () {
    function RecordInfo() {
    }
    RecordInfo.prototype.UpdateInfo = function (info) {
        this.mPlayerId = info.playerId;
        this.mPlayerName = info.name;
        this.mRecordId = info.recordId;
        this.mType = info.type;
        this.mQuality = info.quality;
        this.mPower = info.power;
        this.mType = info.time;
        this.mWinFlag = info.isWin;
        this.mOperFlag = info.operate;
    };
    return RecordInfo;
}());
__reflect(RecordInfo.prototype, "RecordInfo");
//# sourceMappingURL=QujingInfo.js.map