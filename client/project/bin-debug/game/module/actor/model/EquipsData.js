var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EquipsData = (function () {
    function EquipsData() {
        this.strengthen = 0; // 强化
        this.gem = 0; // 宝石
        this.refine = 0; // 精炼
        this.exercise = 0; // 锻炼
        this.item = new ItemData;
        this.deityEquipData = new DeityEquipData; //神装 红装数据
    }
    EquipsData.prototype.parser = function (data) {
        this.strengthen = data.strengthen;
        this.refine = data.refine;
        this.exercise = data.anneal;
        this.gem = data.gem;
        this.item.ParserByEquipData(data.item);
        this.deityEquipData.UpdateInfo(data.reddata);
    };
    EquipsData.prototype.IsOrange = function () {
        return this.item != null && this.item.configID != 0 && this.item.itemConfig.quality == 4;
    };
    EquipsData.Create = function (itemId) {
        var data = new EquipsData;
        data.strengthen = 0;
        data.gem = 0;
        data.item.configID = itemId;
        data.item.count = 1;
        return data;
    };
    EquipsData.prototype.GetForgeValue = function (forgeType) {
        var value = 0;
        switch (forgeType) {
            case ForgeType.BOOST:
                value = this.strengthen;
                break;
            case ForgeType.REFINE:
                value = this.refine;
                break;
            case ForgeType.EXERCISE:
                value = this.exercise;
                break;
            case ForgeType.GEM:
                value = this.gem;
                break;
        }
        return value;
    };
    return EquipsData;
}());
__reflect(EquipsData.prototype, "EquipsData");
var DeityEquipData = (function () {
    function DeityEquipData() {
    }
    DeityEquipData.prototype.UpdateInfo = function (info) {
        this.injectLevel = info.injectstage;
        this.injectNum = info.injectcount;
    };
    return DeityEquipData;
}());
__reflect(DeityEquipData.prototype, "DeityEquipData");
//# sourceMappingURL=EquipsData.js.map