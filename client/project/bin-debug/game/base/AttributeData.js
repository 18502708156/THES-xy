var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AttributeData = (function () {
    function AttributeData(config) {
        if (config === void 0) { config = null; }
        if (config) {
            this.type = config.type;
            this.value = config.value;
        }
    }
    AttributeData.prototype.parser = function (data) {
        this.type = data.type;
        this.value = data.value;
    };
    AttributeData.AttrStringAddition = function (val, pValue) {
        for (var ret = [], i = 0; i < val.length; i++) {
            var o = new AttributeData;
            o.type = val[i].type;
            o.value = val[i].value;
            o.valuePlus = pValue[i].value;
            ret.push(o);
        }
        return ret;
    };
    AttributeData.AttrAddition = function (attr1, attr2) {
        var attr = [];
        var tmp = [];
        for (var i in attr1) {
            tmp[attr1[i].type] = attr1[i].value;
        }
        for (var i in attr2) {
            tmp[attr2[i].type] = (tmp[attr2[i].type] || 0) + attr2[i].value;
        }
        for (var i in tmp) {
            var attrData = new AttributeData();
            attrData.type = parseInt(i);
            attrData.value = tmp[i];
            attr.push(attrData);
        }
        return attr;
    };
    AttributeData.AttrAddToByArray = function (attr1, attr2) {
        var set = false;
        for (var _i = 0, attr1_1 = attr1; _i < attr1_1.length; _i++) {
            var attr = attr1_1[_i];
            if (attr.type == attr2.type) {
                attr.value += attr2.value;
                set = true;
            }
        }
        if (!set) {
            attr1.push(attr2);
        }
    };
    AttributeData.AttrAddTo = function (attr1, attr2) {
        for (var i in attr2) {
            attr1[attr2[i].type] = (attr1[attr2[i].type] || 0) + attr2[i].value;
        }
    };
    /**
     * 属性列表转换（用于解析配置表后的属性列表obgject转换AttributeData[])
     * @param attrObj
     */
    AttributeData.transformAttr = function (attrObj) {
        var attrList = [];
        for (var key in attrObj) {
            var attr = new AttributeData;
            attr.type = attrObj[key].type;
            attr.value = attrObj[key].value;
            attrList.push(attr);
        }
        for (var i = 0; i < attrList.length - 1; i++) {
            for (var j = 0; j < attrList.length - i - 1; j++) {
                if (attrList[j] < attrList[j + 1]) {
                    var temp = attrList[j + 1];
                    attrList[j + 1] = attrList[j];
                    attrList[j] = temp;
                }
            }
        }
        return attrList;
    };
    ;
    // 西游默认显示的属性样式
    AttributeData.GetAttrTabString = function (atts, splitSign) {
        if (splitSign === void 0) { splitSign = "    "; }
        var str = "";
        for (var i = 0, len = atts.length; i < len; i++) {
            str += this.getAttStrByType(atts[i], 0, "+", false, "#682f00&#38983d") + "|";
            if (i == 2 && len > 3) {
                str += "\n";
            }
            if (i < atts.length - 1) {
                str += splitSign;
            }
        }
        return TextFlowMaker.generateTextFlow(str);
    };
    /**
     * 通过属性对象数组获取字符串
     * @param att	   属性对象(支持AttributeData[] | AttributeData | config )
     * @param interval  属性名与属性值间隔多宽(默认4格)
     * @param newline   属性与属性上下间隔几行(默认1行)
     * @param sign	  符号 默认 +
     */
    AttributeData.getAttStr = function (att, intervals, newline, sign, isInserte, r, frontSign) {
        if (intervals === void 0) { intervals = 4; }
        if (newline === void 0) { newline = 1; }
        if (sign === void 0) { sign = "+"; }
        if (isInserte === void 0) { isInserte = false; }
        if (r === void 0) { r = "#ffffff"; }
        if (!att) {
            return "";
        }
        var str = "";
        if (att instanceof AttributeData) {
            if (frontSign)
                return frontSign + this.getAttStrByType(att, intervals, sign, isInserte, r);
            return this.getAttStrByType(att, intervals, sign, isInserte, r);
        }
        else if (att instanceof Array) {
            var atts = att;
            for (var i = 0; i < atts.length; i++) {
                if (frontSign)
                    str += frontSign;
                str += this.getAttStrByType(atts[i], intervals, sign, isInserte, r);
                if (i < atts.length - 1) {
                    for (var j = 0; j < newline; j++)
                        str += "\n";
                }
            }
        }
        else {
            var objAtts = [];
            for (var k in this.translate) {
                if (isNaN(att[k]))
                    continue;
                var a = new AttributeData;
                a.type = parseInt(this.translate[k]);
                a.value = att[k];
                objAtts.push(a);
            }
            return this.getAttStr(objAtts, intervals, newline, sign, isInserte);
        }
        return str;
    };
    ;
    /**
     * 通过属性对象获取字符串（例如：攻击 +1000)
     * @param att   属性对象
     * @param interval  间隔多宽(默认4格)
     * @param sign  符号 默认 +
     * @param isInserte  是否插入空格 默认false
     */
    AttributeData.getAttStrByType = function (att, interval, sign, isInserte, s, omit) {
        if (interval === void 0) { interval = 4; }
        if (sign === void 0) { sign = "+"; }
        if (isInserte === void 0) { isInserte = false; }
        if (s === void 0) { s = null; }
        if (omit === void 0) { omit = false; }
        if (!att) {
            return "";
        }
        var str = "";
        var c;
        var split = -1;
        if (s) {
            if (typeof (s) == "string") {
                split = s.indexOf("&");
                if (split != -1) {
                    c = s.slice(1, split);
                }
                if (c) {
                    str += "|C:0x" + c + "&T:";
                }
            }
            str += StringUtils.complementByChar(AttributeData.getAttrStrByType(att.type, omit), interval * 8);
        }
        if (split != -1) {
            c = s.slice(split + 2);
            str += "|C:0x" + c + "&T:";
        }
        // if (att.type == AttributeType.atCrit || att.type == AttributeType.atTough)// || att.type == AttributeType.atStunRes)
        //     str += sign + (att.value / 100) + "%";
        // else if (att.type > 10)
        //     if (att.type == 15)
        //         str += sign + (att.value / 1000) + "秒";
        //     // else if (AttributeType.atAtkEx == att.type)
        //     //     str += sign + (att.value / 100) + "%";
        //     // else if (AttributeType.atCritHurt == att.type || AttributeType.atRegeneration == att.type || AttributeType.atToughHurt == att.type)
        //     //     str += sign + att.value
        //     else
        //         str += sign + (att.value / 100) + "%";
        // else
        if (att.type >= AttributeType.atDamageEnhancePerc) {
            str += sign + Math.floor(att.value / 100) + "%";
        }
        else {
            str += sign + att.value;
        }
        return str;
    };
    ;
    /**
     * 字符串插入空格
     * @param str  要更改的字符串
     * @param blankNum 插入空格数
     * @param location 插入位置 0左边 1 中间  2 右边（默认中间）
     */
    AttributeData.inserteBlank = function (str, blankNum, location) {
        if (location === void 0) { location = 1; }
        var strLen = str.length;
        var blank = "";
        while (blankNum--) {
            blank += " ";
        }
        var nStr = "";
        switch (location) {
            case 0:
                nStr = blank + str;
                break;
            case 1:
                nStr = str.slice(0, strLen / 2) + blank + str.slice(strLen / 2);
                break;
            case 2:
                nStr = str + blank;
                break;
        }
        return nStr;
    };
    ;
    /**
     * 通过物品来获取装备属性
     * @param data
     */
    AttributeData.getAttrInfoByItemData = function (data) {
        var config = GlobalConfig.ins().EquipConfig[data.configID];
        var attrStr = "";
        var type = 0;
        for (var k in this.translate) {
            if (config[k] <= 0)
                continue;
            for (var i = 0; i < data.att.length; i++) {
                type = data.att[i].type;
                if (this.translate[k] == type) {
                    attrStr += AttributeData.getAttrStrByType(type) + ": ";
                    attrStr += config[k] + ' +' + data.att[i].value + "\n";
                }
            }
        }
        return attrStr;
    };
    ;
    AttributeData.GetAttrValueByItemId = function (configId, attrType) {
        var config = GlobalConfig.ins().EquipConfig[configId];
        var attrStr = "";
        for (var k in this.translate) {
            if (this.translate[k] == attrType) {
                var value = config[k];
                return AttributeData.getAttrStrByType(attrType) + ": " + value;
            }
        }
        return attrStr;
    };
    /**
     * 通过属性类型获取属性中文名字
     *  * omit 是否用简写
     * @param type
     */
    AttributeData.getAttrStrByType = function (type, omit) {
        if (omit === void 0) { omit = false; }
        return AttributeData.TYPE_TO_NAME[type] || "";
    };
    ;
    AttributeData.getAttrStrAdd = function (attrbute, viplv) {
        var attr = [];
        // if (UserVip.ins().lv >= viplv) {
        //     var num_1 = GlobalConfig.ins().VipConfig[viplv].attrAddition["percent"];
        //     attrbute.forEach(function (element) {
        //         var attrdata = new AttributeData();
        //         attrdata.type = element.type;
        //         attrdata.value = (element.value * (100 + num_1) / 100) >> 0;
        //         attr.push(attrdata);
        //     });
        // }
        // else
        attr = attrbute;
        return attr;
    };
    ;
    AttributeData.getAttrStarAdd = function (attrbute, count) {
        var attr = [];
        attrbute.forEach(function (element) {
            var attrdata = new AttributeData();
            attrdata.type = element.type;
            attrdata.value = (element.value * count) >> 0;
            attr.push(attrdata);
        });
        return attr;
    };
    ;
    AttributeData.translateAttr = function (type) {
        switch (type) {
            case AttributeType.atMaxHp: return 'hp';
            case AttributeType.atAttack: return 'atk';
            case AttributeType.atDef: return 'def';
            // case AttributeType.atRes: return 'res';
            case AttributeType.atCrit: return 'crit';
            case AttributeType.atTough: return 'tough';
            // case AttributeType.atCritHurt: return 'critharm';
            case AttributeType.atDamageReduction: return 'reduceharm';
        }
        return "";
    };
    /**
     * @showNotValue  true时表示值为0，一样显示出来
     * @type 1为数组， 2 为object
     * @translate   属性，不给值默认为baseTranslate
     * @extraAttrs  额外属性 如果有，则与translate组合在一起
     */
    AttributeData.transformBaseAttr = function (obj, showNotValue, type, translate, extraAttrs) {
        if (showNotValue === void 0) { showNotValue = true; }
        if (type === void 0) { type = 1; }
        var attrs;
        if (type == 1) {
            attrs = [];
        }
        else if (type == 2) {
            attrs = {};
        }
        if (!translate) {
            translate = this.baseTranslate;
        }
        if (extraAttrs) {
            var i = void 0;
            var len = extraAttrs.length;
            for (i = 0; i < len; i++) {
                translate[this.translateAttr(extraAttrs[i])] = extraAttrs[i];
            }
        }
        for (var key in translate) {
            if (showNotValue == false && (isNaN(obj[key]) || obj[key] == 0)) {
                continue;
            }
            var attr = new AttributeData;
            attr.type = parseInt(AttributeData.translate[key]);
            attr.value = obj[key];
            if (type == 1) {
                attrs.push(attr);
            }
            else if (type == 2) {
                attrs[attr.type] = attr;
            }
        }
        return attrs;
    };
    ;
    /**两组属性值求和 */
    AttributeData.prototype.sumValueAttr = function (obj1, obj2) {
        var attrs = {};
        for (var key in obj1) {
            var attr = new AttributeData;
            attr.type = parseInt(AttributeData.translate[key]);
            attr.value = obj1[key];
            attrs[attr.type] = attr;
        }
        for (var key in obj2) {
            var attr = void 0;
            if (attrs.hasOwnProperty(key)) {
                attr = attrs[key];
                attr.value += obj2[key];
            }
            else {
                attr = new AttributeData;
                attr.value = obj2[key];
            }
            attr.type = parseInt(AttributeData.translate[key]);
            attrs[attr.type] = attr;
        }
        return attrs;
    };
    /**两组属性值求和 */
    AttributeData.sumArrValueAttr = function (obj1, obj2) {
        var attrs = [];
        for (var _i = 0, obj1_1 = obj1; _i < obj1_1.length; _i++) {
            var val1 = obj1_1[_i];
            var exist = false;
            for (var _a = 0, obj2_1 = obj2; _a < obj2_1.length; _a++) {
                var val2 = obj2_1[_a];
                if (val1.type == val2.type) {
                    var attr = { type: val1.type, value: val1.value + val2.value };
                    attrs.push(attr);
                    exist = true;
                    break;
                }
            }
            if (!exist)
                attrs.push(val1);
        }
        for (var _b = 0, obj2_2 = obj2; _b < obj2_2.length; _b++) {
            var val1 = obj2_2[_b];
            var exist = false;
            for (var _c = 0, attrs_1 = attrs; _c < attrs_1.length; _c++) {
                var val2 = attrs_1[_c];
                if (val1.type == val2.type) {
                    exist = true;
                    break;
                }
            }
            if (!exist)
                attrs.push(val1);
        }
        return attrs;
    };
    AttributeData.TYPE_TO_NAME = (_a = {},
        _a[AttributeType.atHp] = "当前生命",
        _a[AttributeType.atMaxHp] = "生命",
        _a[AttributeType.atAttack] = "攻击",
        _a[AttributeType.atDef] = "防御",
        _a[AttributeType.atSpeed] = "速度",
        _a[AttributeType.atCrit] = "暴击",
        _a[AttributeType.atTough] = "抗暴",
        _a[AttributeType.atHitRate] = "命中",
        _a[AttributeType.atEvade] = "闪避",
        _a[AttributeType.atDefy] = "无视防御",
        _a[AttributeType.atDefyReduction] = "减免无视",
        _a[AttributeType.atDamageEnhance] = "伤害加深",
        _a[AttributeType.atDamageReduction] = "伤害减少",
        _a[AttributeType.atDamageEnhancePerc] = "伤害加深百分比",
        _a[AttributeType.atDamageReductionPerc] = "伤害减少百分比",
        _a[AttributeType.atCritEnhance] = "暴伤加成",
        _a[AttributeType.atCritReduction] = "暴伤减免",
        _a[AttributeType.atPVPEnhance] = "PVP伤加",
        _a[AttributeType.atPVPReduction] = "PVP伤减",
        _a[AttributeType.atPVEEnhance] = "PVE伤加",
        _a[AttributeType.atPVEReduction] = "PVE伤减",
        _a[101] = "挂机银两",
        _a[102] = "挂机经验",
        _a[103] = "刷新任务品质",
        _a);
    AttributeData.translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough,
        // 'critharm':AttributeType.atCritHurt,
        'reduceharm': AttributeType.atDamageReduction,
    };
    AttributeData.heroEquipTranslate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough,
        // 'critharm':AttributeType.atCritHurt,
        'reduceharm': AttributeType.atDamageReduction,
    };
    /** 基础属性表 */
    AttributeData.baseTranslate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
    };
    return AttributeData;
}());
__reflect(AttributeData.prototype, "AttributeData");
var _a;
//# sourceMappingURL=AttributeData.js.map