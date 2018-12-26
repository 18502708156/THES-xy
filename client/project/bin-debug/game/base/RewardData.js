var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RewardData = (function () {
    function RewardData() {
    }
    RewardData.prototype.parser = function (bytes) {
        this.type = bytes.type;
        this.id = bytes.id;
        this.count = bytes.count;
    };
    RewardData.SetValue = function (key, src, dst) {
        if (src[key] != null) {
            dst[key] = src[key];
            return true;
        }
        return false;
    };
    RewardData.ToRewardData = function (data) {
        var obj = new RewardData;
        RewardData.SetValue("type", data, obj);
        RewardData.SetValue("id", data, obj);
        RewardData.SetValue("count", data, obj);
        return obj;
    };
    RewardData.ToRewardDatas = function (datas) {
        var list = [];
        if (datas) {
            for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                var data = datas_1[_i];
                list.push(this.ToRewardData(data));
            }
        }
        return list;
    };
    RewardData.getCurrencyName = function (v) {
        return MoneyConstToName[v] || "";
    };
    // 货币的大图标
    RewardData.getCurrencyRes = function (v) {
        return ResDataPath.GetItemFullPath(MoneyConstToRes[v] || "");
    };
    // 货币的小图标
    RewardData.GetCurrencyMiniRes = function (type) {
        var res = MoneyConstToMiniRes[type];
        if (res) {
            return res;
        }
        var config = GameGlobal.Config.ItemConfig[type];
        if (config) {
            return ResDataPath.GetItemFullPath(config.icon);
        }
        return "";
    };
    return RewardData;
}());
__reflect(RewardData.prototype, "RewardData", ["IRewardData"]);
//# sourceMappingURL=RewardData.js.map