var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DeityEquipConst = (function () {
    function DeityEquipConst() {
    }
    DeityEquipConst.IsDeityEquip = function (id) {
        if (!id)
            return false;
        var config = GameGlobal.Config.ItemConfig[id];
        if (!config)
            return false;
        return config.quality >= 5;
    };
    DeityEquipConst.GetNextDeityEquipId = function (id, pos) {
        if (this.IsDeityEquip(id)) {
            var awakeConfig = GameGlobal.Config.DeityAwakeConfig[id];
            return awakeConfig ? awakeConfig.attrpower : -1;
        }
        var composeConf = GameGlobal.Config.DeityComposeConfig[pos];
        return composeConf ? composeConf.id : -1;
    };
    DeityEquipConst.GetAwakeCost = function (id, pos) {
        if (this.IsDeityEquip(id)) {
            var awakeConfig = GameGlobal.Config.DeityAwakeConfig[id];
            return awakeConfig ? awakeConfig.cost[0] : null;
        }
        var composeConf = GameGlobal.Config.DeityComposeConfig[pos];
        return composeConf ? composeConf.cost[0] : null;
    };
    DeityEquipConst.GetEquipAttrText = function (id) {
        var attrTextList = [];
        var config = GameGlobal.Config.EquipConfig[id];
        if (!config)
            return attrTextList;
        for (var _i = 0, _a = config.attrs || []; _i < _a.length; _i++) {
            var attr = _a[_i];
            attrTextList.push(AttributeData.getAttrStrByType(attr.type) + "+" + attr.value);
        }
        return attrTextList;
    };
    DeityEquipConst.GetInjectCost = function (pos, level) {
        var config = GameGlobal.Config.DeitySpiritConfig[pos][level - 1];
        return config ? config.cost[0] : null;
    };
    DeityEquipConst.GetInjectProgInfo = function (pos, level) {
        var config = GameGlobal.Config.DeitySpiritConfig[pos][level - 1];
        if (!config)
            return [0, 1];
        return [config.exp, config.proexp];
    };
    DeityEquipConst.GetInjectAttrText = function (pos, level) {
        var attrTextList = [];
        var specialAttrText;
        var config = GameGlobal.Config.DeitySpiritConfig[pos][level - 1];
        if (!config)
            return [attrTextList, specialAttrText];
        for (var idx in config.attrpower || []) {
            var i = parseInt(idx);
            var attr = config.attrpower[i];
            if (i < 3)
                attrTextList.push(AttributeData.getAttrStrByType(attr.type) + "+" + attr.value);
            else
                specialAttrText = AttributeData.getAttrStrByType(attr.type) + "+" + attr.value;
        }
        return [attrTextList, specialAttrText];
    };
    DeityEquipConst.GetRateText = function (injectNum) {
        var values = GameGlobal.Config.DeityBaseConfig.value;
        var des = GameGlobal.Config.DeityBaseConfig.des;
        var curKey;
        for (var key in values) {
            var val = values[key];
            if (injectNum >= val)
                curKey = parseInt(key);
            else
                break;
        }
        return des[curKey];
    };
    DeityEquipConst.IsMaxInjectLevel = function (pos, level) {
        if (level == 0)
            return false;
        var config = GameGlobal.Config.DeitySpiritConfig[pos][level];
        return config == null;
    };
    DeityEquipConst.IsMaxAwakeLevel = function (id) {
        if (!id)
            return false;
        var config = GameGlobal.Config.DeityAwakeConfig[id];
        if (!config)
            return false;
        return config.attrpower == null;
    };
    DeityEquipConst.GetCurInjectConfig = function (level) {
        var injectConfig = GameGlobal.Config.DeityResonateConfig[1];
        for (var key in GameGlobal.Config.DeityResonateConfig) {
            var config = GameGlobal.Config.DeityResonateConfig[key];
            if (level >= config.level)
                injectConfig = config;
            else
                break;
        }
        return injectConfig;
    };
    DeityEquipConst.GetNextInjectConfig = function (level) {
        for (var key in GameGlobal.Config.DeityResonateConfig) {
            var config = GameGlobal.Config.DeityResonateConfig[key];
            if (level < config.level)
                return parseInt(key) == 1 ? null : config;
        }
    };
    DeityEquipConst.GetDeityEquipActTextList = function (num) {
        var textList = [];
        for (var key in GameGlobal.Config.DeityActConfig) {
            var config = GameGlobal.Config.DeityActConfig[key];
            var color = num >= config.level ? Color.Green : Color.White;
            var text = "";
            for (var _i = 0, _a = config.attrpower; _i < _a.length; _i++) {
                var attr = _a[_i];
                text = "" + text + AttributeData.getAttrStrByType(attr.type) + ": |C:" + color + "&T:" + attr.value + "| ";
            }
            text = text + (num < config.level ? "(\u9700" + config.level + "\u4EF6)" : "");
            textList.push(text);
        }
        return textList;
    };
    DeityEquipConst.GetDeltaNum = function (pos, preInjectNum, preInjectLevel, curInjectNum, curINjectLevel) {
        var config = GameGlobal.Config.DeitySpiritConfig[pos][preInjectLevel];
        var curExp = curInjectNum * config.exp;
        if (preInjectLevel < curINjectLevel) {
            curExp = config.proexp;
        }
        return curExp - preInjectNum * config.exp;
    };
    return DeityEquipConst;
}());
__reflect(DeityEquipConst.prototype, "DeityEquipConst");
//# sourceMappingURL=DeityEquipConst.js.map