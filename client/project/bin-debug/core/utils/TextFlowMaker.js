var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TextFlowMaker = (function () {
    function TextFlowMaker() {
    }
    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    TextFlowMaker.generateTextFlow = function (sourceText) {
        if (!sourceText) {
            return this.EMPTY_TABLE;
        }
        var textArr = sourceText.split("|");
        var str = "";
        for (var i = 0, len = textArr.length; i < len; i++) {
            var text = textArr[i];
            if (!text || text.length == 0) {
                continue;
            }
            str += this.getSingleTextFlow1(text);
        }
        return new egret.HtmlTextParser().parser(str);
    };
    ;
    TextFlowMaker.generateTextFlow1 = function (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    ;
    TextFlowMaker.getSingleTextFlow1 = function (text) {
        var str = "<font";
        var textArr = this.Match(text);
        var tempArr;
        var t;
        for (var i = 0, len = textArr.length; i < len; i++) {
            var type = textArr[i].type;
            var value = textArr[i].value;
            if (type == this.PROP_TEXT) {
                t = value;
            }
            else if (type == this.STYLE_SIZE) {
                str += " size=\"" + parseInt(value) + "\"";
            }
            else if (type == this.STYLE_COLOR) {
                str += " color=\"" + parseInt(value) + "\"";
            }
            else {
                t = value;
            }
        }
        str += ">" + t + "</font>";
        return str;
    };
    ;
    TextFlowMaker.getSingleTextFlow = function (text) {
        var textArr = this.Match(text);
        var textFlow = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            var type = textArr[i].type;
            var value = textArr[i].value;
            if (type == this.PROP_TEXT) {
                textFlow.text = value;
            }
            else if (type == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(value);
            }
            else if (type == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(value);
            }
            else {
                textFlow.text = value;
            }
        }
        return textFlow;
    };
    ;
    TextFlowMaker.consumeLabel = function (value, max, isShowMax) {
        if (isShowMax === void 0) { isShowMax = true; }
        var str = "";
        if (value != null && !isNaN(value)) {
            if (isShowMax)
                str += (value < max ? "|C:0xff0000&T:" : "|C:0x019704&T:") + value + "|/" + max;
            else
                str += value;
        }
        return this.generateTextFlow(str);
    };
    TextFlowMaker.Match = function (str) {
        if (str == null) {
            return;
        }
        var preType = null;
        var preStr = "";
        this.LIST.length = 0;
        for (var i = 0; i < 99; ++i) {
            var data = str.match(this._REG);
            if (data == null || data.index == -1) {
                this.LIST.push({
                    type: preType,
                    value: str
                });
                break;
            }
            if (preType != null) {
                this.LIST.push({
                    type: preType,
                    value: str.substr(0, data.index)
                });
            }
            preType = data[0].replace("&", "").replace(":", "");
            str = str.substr(data.index + data[0].length);
        }
        return this.LIST;
        // console.log(reg.exec(s))
        // console.log(reg.exec(s))
        // console.log(reg.exec(s))
        // console.log(s.match(reg))
    };
    TextFlowMaker.getCStr = function (e) {
        return this.numberList[e] ? this.numberList[e] : "";
    };
    TextFlowMaker.EMPTY_TABLE = [];
    TextFlowMaker._REG = new RegExp("&?[SCTU]:");
    TextFlowMaker.LIST = [];
    TextFlowMaker.STYLE_COLOR = "C";
    TextFlowMaker.STYLE_SIZE = "S";
    TextFlowMaker.PROP_TEXT = "T";
    TextFlowMaker.UNDERLINE_TEXT = "U";
    TextFlowMaker.numberList = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"];
    return TextFlowMaker;
}());
__reflect(TextFlowMaker.prototype, "TextFlowMaker");
//# sourceMappingURL=TextFlowMaker.js.map