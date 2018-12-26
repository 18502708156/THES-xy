var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DailyBaseInfo = (function () {
    function DailyBaseInfo() {
    }
    DailyBaseInfo.prototype.UpdateInfo = function (info) {
        this.mLevel = info.lv;
        this.mExp = info.exp;
        this.mCurActive = info.active;
        this.mActiveReward = info.activeReward;
        this.mFindFlag = info.find != 0;
    };
    return DailyBaseInfo;
}());
__reflect(DailyBaseInfo.prototype, "DailyBaseInfo");
var DailyTaskInfo = (function () {
    function DailyTaskInfo() {
    }
    DailyTaskInfo.prototype.UpdateInfo = function (info) {
        this.mTaskId = info.no;
        this.mCount = info.num;
    };
    return DailyTaskInfo;
}());
__reflect(DailyTaskInfo.prototype, "DailyTaskInfo");
var OtherActiveInfo = (function () {
    function OtherActiveInfo() {
    }
    OtherActiveInfo.prototype.UpdateInfo = function (info) {
        this.mCurValue = info.num;
        this.mReward = info.reward;
    };
    return OtherActiveInfo;
}());
__reflect(OtherActiveInfo.prototype, "OtherActiveInfo");
var MonsterInfo = (function () {
    function MonsterInfo() {
        //怪物列表索引
        //public listIndex=-1;
        //怪物列表
        this.monsterList = [];
    }
    MonsterInfo.prototype.UpdateInfo = function (info) {
        this.monsterList = info.monsterList;
        this.num = info.num;
        this.timeout = info.time;
        this.reward = info.reward;
    };
    return MonsterInfo;
}());
__reflect(MonsterInfo.prototype, "MonsterInfo");
//# sourceMappingURL=DailyInfo.js.map