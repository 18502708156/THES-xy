var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 通用工具类
 */
var CommonUtils = (function () {
    function CommonUtils() {
    }
    /**
     *  拷贝字符串到剪切板
     */
    CommonUtils.CopyToClipboard = function (val) {
        if (!val) {
            return false;
        }
        var input = document.createElement("input");
        input.value = val;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand("Copy");
        document.body.removeChild(input);
        return true;
    };
    /**
     * 给字体添加描边
     */
    CommonUtils.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    ;
    /**
     * 获取一个对象的长度
     * @param list
     */
    CommonUtils.getObjectLength = function (list) {
        var num = 0;
        for (var i in list) {
            num++;
        }
        return num;
    };
    ;
    /**
     * 深度复制
     * @param _data
     */
    CommonUtils.copyDataHandler = function (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    ;
    CommonUtils.CopyTo = function (src, des) {
        var keys = Object.keys(src);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            des[key] = this.copyDataHandler(src[key]);
        }
    };
    CommonUtils.labelIsOverLenght = function (label, num) {
        label.text = this.overLength(num);
    };
    ;
    CommonUtils.overLength = function (num, isInt) {
        if (isInt === void 0) { isInt = false; }
        if (num == null) {
            return "";
        }
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num >= 100000000) {
            // num = (num / 100000000);
            // num = Math.floor(num * 10) / 10;
            // str = num + "亿";
            if (num >= 1000000000) {
                num = (num / 100000000);
                num = Math.floor(num * 100) / 100;
                str = num + "亿";
            }
            else {
                str = Math.floor((num / 100000000)) + "亿";
                num = num % 100000000;
                if (num > 10000) {
                    str += (Math.floor(num / 10000) + "万");
                }
            }
        }
        else {
            num = (num / 10000);
            num = Math.floor(num * 10) / 10;
            if (isInt)
                num = Math.floor(num);
            str = num + "万";
        }
        return str;
    };
    ;
    CommonUtils.GetArray = function (dict, sortKey, ascendingOrder) {
        if (sortKey === void 0) { sortKey = null; }
        if (ascendingOrder === void 0) { ascendingOrder = true; }
        if (dict == null) {
            return [];
        }
        var list = [];
        for (var key in dict) {
            var data = dict[key];
            list.push(data);
        }
        if (sortKey) {
            try {
                if (ascendingOrder) {
                    list.sort(function (lhs, rhs) {
                        return lhs[sortKey] - rhs[sortKey];
                    });
                }
                else {
                    list.sort(function (lhs, rhs) {
                        return rhs[sortKey] - lhs[sortKey];
                    });
                }
            }
            catch (e) {
            }
        }
        return list;
    };
    /**
     * 将一个uint类型的整数转换为指定长度的Boolean元素数组
     * <li>外部要保存转换的值则必须传入result</li>
     * <li>如果没传入result，则外部只引用，不去增减</li>
     * @param value 需要转换的uint值
     * @param len 需要转换出来的数组的长度，如果大于32，则限制为32
     * @return 返回uint转换的boolean数组
     */
    CommonUtils.uintToVecBool = function (value, len) {
        if (len > CommonUtils.MAX_BIT_LEN)
            len = CommonUtils.MAX_BIT_LEN;
        var result = [];
        var i;
        for (i = 0; i < len; i++)
            result[i] = (value & (1 << i)) > 0;
        return result;
    };
    /**
     * 将一个 Vector.&lt;Boolean> 转换为一个32位整数
     * @param data 需要转换的原始数组。如果数组是以非数字为索引，则直接返回0；如果元素是非Boolea类型的值，则自动将元素int化后，取其与0的比较值为Boolean
     * @return 返回boolean数组合成后的uint数值
     */
    CommonUtils.vecBoolToUint = function (data) {
        if (null == data)
            return 0;
        var len = data.length;
        if (0 == len)
            return 0;
        if (len > CommonUtils.MAX_BIT_LEN)
            len = CommonUtils.MAX_BIT_LEN;
        var i;
        var saveValue = 0;
        var value;
        for (i = 0; i < len; i++) {
            value = (true == data[i]) ? 1 : 0;
            saveValue = saveValue | (value << i);
        }
        data = null;
        return saveValue;
    };
    CommonUtils.ArrayEqual = function (arr1, arr2) {
        if (!arr1 || !arr2) {
            return false;
        }
        if (arr1.length != arr2.length) {
            return false;
        }
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    };
    /** 最大位移长度 **/
    CommonUtils.MAX_BIT_LEN = 32;
    return CommonUtils;
}());
__reflect(CommonUtils.prototype, "CommonUtils");
//# sourceMappingURL=CommonUtils.js.map