/**
 * 通用工具类
 */
class CommonUtils {

    /**
     *  拷贝字符串到剪切板
     */
    static CopyToClipboard(val: string): boolean {
        if (!val) {
            return false
        }
		let input = document.createElement("input");
		input.value = val
        document.body.appendChild(input)
        input.select()
        input.setSelectionRange(0, input.value.length)
        document.execCommand("Copy")
        document.body.removeChild(input)
        return true
	}

    /**
     * 给字体添加描边
     */
    public static addLableStrokeColor(lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 获取一个对象的长度
     * @param list
     */
    public static getObjectLength(list) {
        var num = 0;
        for (var i in list) {
            num++;
        }
        return num;
    };
    /**
     * 深度复制
     * @param _data
     */
    public static copyDataHandler(obj) {
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

    public static CopyTo(src, des) {
        var keys = Object.keys(src);
        for (let key of keys) {
            des[key] = this.copyDataHandler(src[key])
        }
    }

    public static labelIsOverLenght(label, num) {
        label.text = this.overLength(num);
    };

    public static overLength(num, isInt: boolean = false) {
        if (num == null) {
            return ""
        }
        var str = null;
        if (num < 100000) {
            str = num;
        } else if (num >= 100000000) {
            // num = (num / 100000000);
            // num = Math.floor(num * 10) / 10;
            // str = num + "亿";
            if (num >= 1000000000) {
                num = (num / 100000000);
                num = Math.floor(num * 100) / 100;
                str = num + "亿";
            } else {
                str = Math.floor((num / 100000000)) + "亿"
                num = num % 100000000
                if (num > 10000) {
                    str += (Math.floor(num / 10000) + "万")
                }
            }
        } else {
            num = (num / 10000);
            num = Math.floor(num * 10) / 10;
            if (isInt) num = Math.floor(num);
            str = num + "万";
        }
        return str;
    };

    public static GetArray(dict: any, sortKey: string = null, ascendingOrder = true): any[] {
        if (dict == null) {
            return []
        }
        let list = []
        for (let key in dict) {
            let data = dict[key]
            list.push(data)
        }
        if (sortKey) {
            try {
                if (ascendingOrder) {
                    list.sort(function (lhs, rhs) {
                        return lhs[sortKey] - rhs[sortKey]
                    })
                } else {
                    list.sort(function (lhs, rhs) {
                        return rhs[sortKey] - lhs[sortKey]
                    })
                }
            } catch (e) {

            }
        }
        return list
    }

    /** 最大位移长度 **/
    private static MAX_BIT_LEN: number = 32;
    /**
     * 将一个uint类型的整数转换为指定长度的Boolean元素数组
     * <li>外部要保存转换的值则必须传入result</li>
     * <li>如果没传入result，则外部只引用，不去增减</li>
     * @param value 需要转换的uint值
     * @param len 需要转换出来的数组的长度，如果大于32，则限制为32
     * @return 返回uint转换的boolean数组
     */
    public static uintToVecBool(value: number, len: number): boolean[] {
        if (len > CommonUtils.MAX_BIT_LEN) len = CommonUtils.MAX_BIT_LEN;
        let result = [];
        let i: number;
        for (i = 0; i < len; i++) result[i] = (value & (1 << i)) > 0;
        return result;
    }

    /**
     * 将一个 Vector.&lt;Boolean> 转换为一个32位整数 
     * @param data 需要转换的原始数组。如果数组是以非数字为索引，则直接返回0；如果元素是非Boolea类型的值，则自动将元素int化后，取其与0的比较值为Boolean
     * @return 返回boolean数组合成后的uint数值
     */
    public static vecBoolToUint(data: boolean[]): number {
        if (null == data) return 0;
        let len: number = data.length;
        if (0 == len) return 0;
        if (len > CommonUtils.MAX_BIT_LEN) len = CommonUtils.MAX_BIT_LEN;
        let i: number;
        let saveValue: number = 0;
        let value: number;
        for (i = 0; i < len; i++) {
            value = (true == data[i]) ? 1 : 0;
            saveValue = saveValue | (value << i);
        }
        data = null;
        return saveValue;
    }

    public static ArrayEqual(arr1: any[], arr2: any[]): boolean {
        if (!arr1 || !arr2) {
            return false
        }
        if (arr1.length != arr2.length) {
            return false
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false
            }
        }
        return true
    }
}