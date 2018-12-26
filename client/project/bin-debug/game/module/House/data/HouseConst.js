var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HouseConst = (function () {
    function HouseConst() {
    }
    HouseConst.GetHouseShowConfig = function (grade) {
        return GameGlobal.Config.BasisConfig[grade];
    };
    HouseConst.GetHouseConfig = function (grade, level) {
        return GameGlobal.Config.HouseConfig[grade][level - 1];
    };
    HouseConst.GetHouseTotalAttr = function (grade, level, upNum) {
        var config = GameGlobal.Config.HouseConfig[grade][level - 1];
        var increaseAttr = config.increase;
        var attrs = [];
        // for (let attr of increaseAttr)
        // {
        // 	let tempAttr = {
        // 		type: attr.type,
        // 		value: attr.value * upNum,
        // 	}
        // 	attrs.push(tempAttr)
        // }
        return AttributeData.AttrAddition(attrs, this.GetHouseLevelAttr(grade, level));
    };
    HouseConst.GetHouseLevelAttr = function (grade, level) {
        var config = GameGlobal.Config.HouseConfig[grade][level - 1];
        if (!config) {
            return [];
        }
        return config.attrpower;
    };
    HouseConst.GetPower = function (grade, level, upNum) {
        var attrs = this.GetHouseTotalAttr(grade, level, upNum);
        return ItemConfig.CalcAttrScoreValue(attrs);
    };
    HouseConst.IsMaxLevel = function (grade, level) {
        var config = GameGlobal.Config.HouseConfig[grade][level];
        return config == null;
    };
    HouseConst.GetBuildList = function (grade) {
        var buildList = [];
        for (var key in GameGlobal.Config.BasisConfig) {
            var config = GameGlobal.Config.BasisConfig[key];
            if (config.house > grade) {
                buildList.push(config);
            }
        }
        return buildList;
    };
    return HouseConst;
}());
__reflect(HouseConst.prototype, "HouseConst");
//# sourceMappingURL=HouseConst.js.map