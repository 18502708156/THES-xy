var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangMapTaskInfo = (function () {
    function GangMapTaskInfo() {
    }
    GangMapTaskInfo.prototype.UpdateInfo = function (info) {
        this.mTaskId = info.id;
        this.mCount = info.count;
        this.mResetCount = info.recount;
        this.mRewardStatus = info.rewardStatus;
    };
    return GangMapTaskInfo;
}());
__reflect(GangMapTaskInfo.prototype, "GangMapTaskInfo");
var GangMapExchangInfo = (function () {
    function GangMapExchangInfo() {
        this.mGMItemMap = {};
    }
    GangMapExchangInfo.prototype.UpdateInfo = function (info) {
        this.mRefreshTime = info.refreshTime;
        this.mRefreshCount = info.refreshCount;
        this.mExchangeList = info.exchangeList;
        this.mExchangedMark = info.exchangeMark;
        for (var _i = 0, _a = info.guildBag; _i < _a.length; _i++) {
            var itemInfo = _a[_i];
            this.mGMItemMap[itemInfo.id] = itemInfo.count;
        }
    };
    GangMapExchangInfo.prototype.UpdateBagInfo = function (rewards) {
        for (var _i = 0, rewards_1 = rewards; _i < rewards_1.length; _i++) {
            var reward = rewards_1[_i];
            this.mGMItemMap[reward.id] = (this.mGMItemMap[reward.id] || 0) + reward.count;
        }
    };
    GangMapExchangInfo.prototype.GetGangMapItemNum = function (gmItemId) {
        return this.mGMItemMap[gmItemId] || 0;
    };
    GangMapExchangInfo.prototype.HasExchangeItem = function (itemId) {
        return (this.mExchangedMark & Math.pow(2, itemId - 1)) == 0;
    };
    GangMapExchangInfo.prototype.CanItemExchange = function () {
        for (var _i = 0, _a = this.mExchangeList; _i < _a.length; _i++) {
            var exchangeItemId = _a[_i];
            var config = GameGlobal.Config.GuildMapBuyConfig[exchangeItemId];
            if (!config)
                continue;
            var flag = true;
            for (var _b = 0, _c = config.cost; _b < _c.length; _b++) {
                var cost = _c[_b];
                if (this.GetGangMapItemNum(cost.id) < cost.count)
                    flag = false;
            }
            if (flag && !this.HasExchangeItem(exchangeItemId))
                return true;
        }
        return false;
    };
    return GangMapExchangInfo;
}());
__reflect(GangMapExchangInfo.prototype, "GangMapExchangInfo");
//# sourceMappingURL=GangMapInfo.js.map