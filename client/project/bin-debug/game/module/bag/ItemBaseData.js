var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ItemBaseData = (function () {
    function ItemBaseData() {
        this.score = -1;
        this.handle = 0;
        this.att = [];
    }
    ItemBaseData.prototype.parser = function (data) {
        if (data == null) {
            return;
        }
        this.handle = data.handle;
        this.UpdateConfigId(data.id);
        this.count = data.count;
        this.att = [];
        for (var _i = 0, _a = data.attrs; _i < _a.length; _i++) {
            var dataAtt = _a[_i];
            var att = new AttributeData();
            att.parser(dataAtt);
            this.att.push(att);
        }
    };
    ItemBaseData.prototype.ParserByEquipData = function (data) {
        this.UpdateConfigId(data.id);
        // 角色装备不需要handle和count
        if (this.configID) {
            this.handle = 1;
            this.count = 1;
        }
        else {
            this.handle = 0;
            this.count = 0;
        }
        if (data.attrs) {
            this.att = [];
            for (var _i = 0, _a = data.attrs; _i < _a.length; _i++) {
                var dataAtt = _a[_i];
                var att = new AttributeData();
                att.parser(dataAtt);
                this.att.push(att);
            }
        }
    };
    ItemBaseData.prototype.UpdateConfigId = function (value) {
        this.score = -1;
        this.configID = value || 0;
        if (value) {
            this.itemConfig = GlobalConfig.ins().ItemConfig[value];
        }
    };
    /** TODO hepeiye
     * 通过string数组获取多行字符串
     * @param str[]   属性string数组
     * @param newline  属性与属性上下间隔几行(默认1行)
     */
    ItemBaseData.getStringByList = function (str, newline, addStr) {
        if (newline === void 0) { newline = 1; }
        if (addStr === void 0) { addStr = ": "; }
        var ret = "";
        for (var i = 0; i < str.length; i++) {
            ret += str[i] + addStr;
            if (i < str.length - 1) {
                for (var j = 0; j < newline; j++)
                    ret += "\n";
            }
        }
        return ret;
    };
    ItemBaseData.getStringByNextList = function (now, next) {
        var ret = "";
        for (var i = 0; i < now.length; i++) {
            ret += now[i];
            if (next[i]) {
                ret += next[i];
            }
            if (i < now.length - 1) {
                ret += "\n";
            }
        }
        return ret;
    };
    ItemBaseData.prototype.GetScore = function () {
        if (this.score < 0) {
            this.score = ItemConfig.calculateBagItemScore(this);
        }
        return this.score;
        // return ItemConfig.calculateBagItemScore(this);
    };
    ItemBaseData.IsNotTimeLimitUse = function (config) {
        if (config.useType == ItemUseType.TYPE01 && config.useArg != null && config.useArg.timelimit != null) {
            try {
                var date = DateUtils.StrToDate(config.useArg.timelimit);
                if (date) {
                    if (date.getTime() * 0.001 >= GameServer.serverTime) {
                        return false;
                    }
                }
            }
            catch (e) {
            }
        }
        return true;
    };
    return ItemBaseData;
}());
__reflect(ItemBaseData.prototype, "ItemBaseData");
//# sourceMappingURL=ItemBaseData.js.map