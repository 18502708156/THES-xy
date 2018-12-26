var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityAdvancedInfo = (function () {
    // public endTime: number;
    function ActivityAdvancedInfo() {
        this.dayChargeValue = 0;
        this.chargerReward = [];
        this.m_shopDatas = {};
        this.advancedReward_datas = {};
    }
    ActivityAdvancedInfo.prototype.GetChargeReward = function (index) {
        // return (this.chargerReward & (1 << index)) > 0
        return this.chargerReward.indexOf(index) != -1;
    };
    ActivityAdvancedInfo.prototype.GetAdvancedReward = function (type, id) {
        var record = this.advancedReward_datas[type] || [];
        return record.indexOf(id) != -1;
    };
    // public updateEndTime(): void
    // {
    // 	let date: Date = new Date(GameServer.serverTimeMilli);
    // 	date.setHours(23);
    // 	date.setMinutes(59);
    // 	date.setSeconds(59);
    // 	this.endTime = date.getTime() //+ DateUtils.MS_PER_DAY;
    // }
    ActivityAdvancedInfo.prototype.getBuyNum = function (id) {
        return this.m_shopDatas[id] || 0;
    };
    ActivityAdvancedInfo.prototype.prase = function (data) {
        this.chargerReward = data.chargerReward;
        this.dayChargeValue = data.dayCharger;
        this.m_shopDatas = {};
        if (data.shop) {
            var i = void 0;
            var len = data.shop.length;
            for (i = 0; i < len; i++) {
                this.m_shopDatas[data.shop[i].id] = data.shop[i].num;
            }
        }
        this.advancedReward_datas = {};
        if (data.advancedReward) {
            var i = void 0;
            var len = data.advancedReward.length;
            for (i = 0; i < len; i++) {
                this.advancedReward_datas[data.advancedReward[i].typ] = data.advancedReward[i].reward;
            }
        }
    };
    ActivityAdvancedInfo.prototype.updateShop = function (data) {
        if (data) {
            var i = void 0;
            var len = data.length;
            for (i = 0; i < len; i++) {
                this.m_shopDatas[data[i].id] = data[i].num;
            }
        }
    };
    ActivityAdvancedInfo.prototype.updateAdvancedReward = function (data) {
        if (data) {
            var i = void 0;
            var len = data.length;
            for (i = 0; i < len; i++) {
                this.advancedReward_datas[data[i].typ] = data[i].reward;
            }
        }
    };
    return ActivityAdvancedInfo;
}());
__reflect(ActivityAdvancedInfo.prototype, "ActivityAdvancedInfo");
//# sourceMappingURL=ActivityAdvancedInfo.js.map