var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.IsNullOrEmpty = function (str) {
        // if (typeof(str) != "string") {
        //     return false
        // }
        return str == null || str == "";
    };
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    StringUtils.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    ;
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    StringUtils.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    ;
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    StringUtils.isChinese = function (str) {
        var reg = /^[\u4E00-\u9FA5]+$/;
        if (!reg.test(str)) {
            return true;
        }
        return false;
    };
    ;
    /**
     * 获取字符串的字节长度
     * 一个中文算2两个字节
     */
    StringUtils.strByteLen = function (str) {
        // var byteLen = 0;
        // var strLen = str.length;
        // for (var i = 0; i < strLen; i++) {
        //     byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        // }
        // return byteLen;
        var ch; //, st, re = []; 
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i); // get char  
            do {
                ++len;
                ch = ch >> 8; // shift value down by 1 byte  
            } while (ch);
        }
        return len;
    };
    /**
     * 补齐字符串
     * @param 源字符串
     * @param 指定的字节长度
     * @param 填补的字符
     * @param 是否忽略HTML代码
     * @return
     *
     */
    StringUtils.complementByChar = function (str, length, char, ignoreHtml) {
        if (char === void 0) { char = " "; }
        if (ignoreHtml === void 0) { ignoreHtml = true; }
        str = str + "";
        var byteLen = this.strByteLen(ignoreHtml ? str.replace(StringUtils.HTML, "") : str);
        return str + this.repeatStr(char, length - byteLen);
    };
    /**
     * 重复指定字符串count次
     */
    StringUtils.repeatStr = function (str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    };
    ;
    /**
     * 为文字添加颜色
     * */
    StringUtils.addColor = function (content, color) {
        color = color || 0;
        content = content == null ? "" : content;
        var colorStr;
        if (typeof (color) == "string")
            colorStr = String(color);
        else if (typeof (color) == "number")
            colorStr = "0x" + Number(color).toString(16);
        return "|C:" + colorStr + "&T:" + content + "|";
    };
    ;
    StringUtils.Format = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result = str;
        if (args.length > 0) {
            if (args.length == 1 && typeof (args[0]) == "object") {
                var objStr = args[0];
                for (var key in objStr) {
                    if (objStr[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, objStr[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < args.length; ++i) {
                    if (args[i] != undefined) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
        }
        return result;
    };
    StringUtils.FormatS = function (result) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!result) {
            return "";
        }
        if (!args || !args.length) {
            return result;
        }
        var newStr = "";
        var index = 0;
        for (var _a = 0, _b = result.split(/(%d|%s)/g); _a < _b.length; _a++) {
            var value = _b[_a];
            if (!/(%d|%s)/g.test(value)) {
                newStr = newStr + value;
            }
            else {
                newStr = newStr + (args[index++] || "");
            }
        }
        return newStr;
    };
    StringUtils.ToSingleHex = function (value) {
        var str = value.toString(16);
        if (str.length == 1) {
            return "0" + str;
        }
        return str;
    };
    StringUtils.numTenToChinese = function (number) {
        switch (number) {
            case 0: return '零';
            case 1: return '一';
            case 2: return '二';
            case 3: return '三';
            case 4: return '四';
            case 5: return '五';
            case 6: return '六';
            case 7: return '七';
            case 8: return '八';
            case 9: return '九';
            case 10: return '十';
        }
        return "";
    };
    StringUtils.numberToChinese = function (num) {
        var chinese;
        if (num <= 10) {
            chinese = StringUtils.numTenToChinese(num);
        }
        else if (num < 100) {
            var gw = num % 10;
            var sw = num / 10;
            if (gw == 0) {
                chinese = StringUtils.numTenToChinese(Math.floor(sw)) + '十';
            }
            else {
                if (sw < 2) {
                    chinese = '十' + StringUtils.numTenToChinese(gw);
                }
                else {
                    chinese = StringUtils.numTenToChinese(Math.floor(sw)) + '十' + StringUtils.numTenToChinese(gw);
                }
            }
        }
        return chinese;
    };
    StringUtils.HTML = /<[^>]+>/g;
    return StringUtils;
}());
__reflect(StringUtils.prototype, "StringUtils");
//# sourceMappingURL=StringUtils.js.map