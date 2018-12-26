class AttributeData {

    public static TYPE_TO_NAME = {
            [AttributeType.atHp]					: "当前生命",
            [AttributeType.atMaxHp]					: "生命",
            [AttributeType.atAttack]				: "攻击",
            [AttributeType.atDef]					: "防御",
            [AttributeType.atSpeed]					: "速度",
            [AttributeType.atCrit]					: "暴击",
            [AttributeType.atTough]					: "抗暴",
            [AttributeType.atHitRate]				: "命中",
            [AttributeType.atEvade]					: "闪避",
            [AttributeType.atDefy]					: "无视防御",
            [AttributeType.atDefyReduction]			: "减免无视",
            [AttributeType.atDamageEnhance]			: "伤害加深",
            [AttributeType.atDamageReduction]		: "伤害减少",
            [AttributeType.atDamageEnhancePerc]		: "伤害加深百分比",
            [AttributeType.atDamageReductionPerc]	: "伤害减少百分比",
            [AttributeType.atCritEnhance]			: "暴伤加成",
            [AttributeType.atCritReduction]			: "暴伤减免",
            [AttributeType.atPVPEnhance]			: "PVP伤加",
            [AttributeType.atPVPReduction]			: "PVP伤减",
            [AttributeType.atPVEEnhance]			: "PVE伤加",
            [AttributeType.atPVEReduction]			: "PVE伤减",
    }

    type: AttributeType;
    value: number;

    valuePlus: number

    public constructor(config: any = null) {
        if (config) {
            this.type = config.type
            this.value = config.value
        }
    }

    public parser(data: Sproto.attribute_data) {
        this.type = data.type
        this.value = data.value
    }

    public static AttrStringAddition (val, pValue) {
		for (var ret = [], i = 0; i < val.length; i++) {
			var o = new AttributeData;
			o.type = val[i].type
            o.value = val[i].value
            o.valuePlus = pValue[i].value
            ret.push(o)
		}
		return ret
	}
    public static AttrAddition(attr1, attr2) {
        let attr = [];
        let tmp = [];
        for (let i in attr1) {
            tmp[attr1[i].type] = attr1[i].value
        }
        for (let i in attr2) {
            tmp[attr2[i].type] = (tmp[attr2[i].type] || 0) + attr2[i].value
        }
        for (let i in tmp) {
            let attrData = new AttributeData();
            attrData.type = parseInt(i);
            attrData.value = tmp[i];
            attr.push(attrData);
        }
        return attr;
    }

    public static AttrAddTo(attr1, attr2) {
        for (let i in attr2) {
            attr1[attr2[i].type] = (attr1[attr2[i].type] || 0) + attr2[i].value
        }
    }

    /**
     * 属性列表转换（用于解析配置表后的属性列表obgject转换AttributeData[])
     * @param attrObj
     */
    public static transformAttr(attrObj) {
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

    // 西游默认显示的属性样式
    public static GetAttrTabString(atts, splitSign = "    ") {
        let str = ""
        for (var i = 0; i < atts.length; i++) {
            str += this.getAttStrByType(atts[i], 0, "+", false, "#682f00&#38983d") + "|";
            if (i < atts.length - 1) {
                str += splitSign;
            }
        }
        return TextFlowMaker.generateTextFlow(str)
    }

    /**
     * 通过属性对象数组获取字符串
     * @param att	   属性对象(支持AttributeData[] | AttributeData | config )
     * @param interval  属性名与属性值间隔多宽(默认4格)
     * @param newline   属性与属性上下间隔几行(默认1行)
     * @param sign	  符号 默认 +
     */
    public static getAttStr(att, intervals: number = 4, newline: number = 1, sign: string = "+", isInserte: boolean = false, r = "#ffffff", frontSign?:string) {
        if (!att) {
            return ""
        }
        var str = "";
        if (att instanceof AttributeData)
        {
            if(frontSign) return frontSign + this.getAttStrByType(att, intervals, sign, isInserte, r);
            return this.getAttStrByType(att, intervals, sign, isInserte, r);
        }else if (att instanceof Array) {
            var atts = att;
            for (var i = 0; i < atts.length; i++) {
                if(frontSign) str += frontSign;
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
    /**
     * 通过属性对象获取字符串（例如：攻击 +1000)
     * @param att   属性对象
     * @param interval  间隔多宽(默认4格)
     * @param sign  符号 默认 +
     * @param isInserte  是否插入空格 默认false
     */
    public static getAttStrByType(att, interval: number = 4, sign: string = "+", isInserte: boolean = false, s = null,omit = false) {
        var str = ""
        let c 
        let split = -1
        if (s) {
            if (typeof(s) == "string") {
                split = s.indexOf("&")
                if(split != -1)
                {
                    c = s.slice(1,split);
                }
                if(c)
                {
                    str += "|C:0x"+c+"&T:"
                }
            }
            str += StringUtils.complementByChar(AttributeData.getAttrStrByType(att.type,omit), interval * 8);
        }
        if(split != -1)
        {
            c = s.slice(split+2);
            str += "|C:0x"+c+"&T:"
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
        if (att.type >= AttributeType.atDamageEnhance) {
            str += sign + Math.floor(att.value / 100) + "%";
        } else {
            str += sign + att.value;
        }
        return str;
    };
    /**
     * 字符串插入空格
     * @param str  要更改的字符串
     * @param blankNum 插入空格数
     * @param location 插入位置 0左边 1 中间  2 右边（默认中间）
     */
    public static inserteBlank(str, blankNum, location = 1) {
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
    /**
     * 通过物品来获取装备属性
     * @param data
     */
    public static getAttrInfoByItemData(data) {
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
    public static GetAttrValueByItemId(configId, attrType) {
        var config = GlobalConfig.ins().EquipConfig[configId];
        var attrStr = "";
        for (var k in this.translate) {
            if (this.translate[k] == attrType) {
                let value = config[k]
                return AttributeData.getAttrStrByType(attrType) + ": " + value
            }
        }
        return attrStr;
    }
    /**
     * 通过属性类型获取属性中文名字
     *  * omit 是否用简写
     * @param type
     */
    public static getAttrStrByType(type: AttributeType,omit:boolean = false) {
        return AttributeData.TYPE_TO_NAME[type] || ""
    };
    public static getAttrStrAdd(attrbute, viplv) {
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
    public static getAttrStarAdd(attrbute, count) {
        var attr = [];
        attrbute.forEach(function (element) {
            var attrdata = new AttributeData();
            attrdata.type = element.type;
            attrdata.value = (element.value * count) >> 0;
            attr.push(attrdata);
        });
        return attr;
    };
    public static translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough,
        // 'critharm':AttributeType.atCritHurt,
        'reduceharm':AttributeType.atDamageReduction,
        // 'revertigo':AttributeType.atStunRes,
        // 'touchhurt':AttributeType.atToughHurt,
        // 'RoleDamageEnhance':AttributeType.atRoleDamageEnhance,
        // 'Job1DamageEnhance':AttributeType.atJob1DamageEnhance,
        // 'Job2DamageEnhance':AttributeType.atJob2DamageEnhance,
        // 'Job3DamageEnhance':AttributeType.atJob3DamageEnhance,
        // 'RoleDamageReduction':AttributeType.atRoleDamageReduction,
        // 'Job1DamageReduction':AttributeType.atJob1DamageReduction,
        // 'Job2DamageReduction':AttributeType.atJob2DamageReduction,
        // 'Job3DamageReduction':AttributeType.atJob3DamageReduction
    };

    public static heroEquipTranslate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough,
        // 'critharm':AttributeType.atCritHurt,
        'reduceharm':AttributeType.atDamageReduction,
    }

    /** 基础属性表 */
    public static baseTranslate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
    }
    public static translateAttr(type:number):string
    {
        switch(type)
        {
            case AttributeType.atMaxHp: return 'hp';
            case AttributeType.atAttack: return 'atk';
            case AttributeType.atDef: return 'def';
            // case AttributeType.atRes: return 'res';
            case AttributeType.atCrit: return 'crit';
            case AttributeType.atTough: return 'tough';
            // case AttributeType.atCritHurt: return 'critharm';
            case AttributeType.atDamageReduction: return 'reduceharm';
            // case AttributeType.atStunRes: return 'revertigo';
            // case AttributeType.atToughHurt: return 'touchhurt';
            // case AttributeType.atRoleDamageEnhance: return 'RoleDamageEnhance';
            // case AttributeType.atJob1DamageEnhance: return 'Job1DamageEnhance';
            // case AttributeType.atJob2DamageEnhance: return 'Job2DamageEnhance';
            // case AttributeType.atJob3DamageEnhance: return 'Job3DamageEnhance';
            // case AttributeType.atRoleDamageReduction: return 'RoleDamageReduction';
            // case AttributeType.atJob1DamageReduction: return 'Job1DamageReduction';
            // case AttributeType.atJob2DamageReduction: return 'Job2DamageReduction';
            // case AttributeType.atJob3DamageReduction: return 'Job3DamageReduction';
        }
        return ""
    }

    /**
     * @showNotValue  true时表示值为0，一样显示出来
     * @type 1为数组， 2 为object
     * @translate   属性，不给值默认为baseTranslate
     * @extraAttrs  额外属性 如果有，则与translate组合在一起
     */
    public static transformBaseAttr(obj,showNotValue= true,type:number = 1,translate?:Object,extraAttrs?:number[]) {
        let attrs 
        if(type == 1)
        {
           attrs = [];
        }else if(type == 2)
        {
           attrs ={};
        }
        if(!translate)
        {
            translate = this.baseTranslate;
        }
        if(extraAttrs)
        {
            let i:number;
            let len:number = extraAttrs.length;
            for( i = 0 ; i < len ;i ++ )
            {
                translate[this.translateAttr(extraAttrs[i])] = extraAttrs[i];
            }
        }
        for (let key in translate)
        {
            if(showNotValue == false && (isNaN(obj[key]) || obj[key] == 0) )
            {
                continue;
            }
            let attr = new AttributeData;
            attr.type = parseInt(AttributeData.translate[key]);
            attr.value = obj[key];
            if(type == 1)
            {
                attrs.push(attr);
            }else if(type == 2)
            {
                attrs[attr.type] = attr;
            }
        }
        return attrs;
    };
    /**两组属性值求和 */
    public sumValueAttr(obj1:any , obj2:any )
    {
        let attrs = {}
        for (let key in obj1)
        {
            let attr = new AttributeData;
            attr.type = parseInt(AttributeData.translate[key]);
            attr.value = obj1[key];
            attrs[attr.type] = attr;
        } 
        for (let key in obj2)
        {
            let attr 
            if(attrs.hasOwnProperty(key))
            {
                attr = attrs[key];
                attr.value += obj2[key];
            }else
            {
                attr = new AttributeData;
                attr.value = obj2[key];
            }
            attr.type = parseInt(AttributeData.translate[key]);
            attrs[attr.type] = attr;
        } 
        return attrs;
    }

    /**两组属性值求和 */
    public static sumArrValueAttr(obj1:any , obj2:any )
    {
        let attrs = []
        for (let val1 of obj1)
        {
            let exist = false;
            for(let val2 of obj2){
                if(val1.type == val2.type)
                {
                    let attr = { type: val1.type, value: val1.value +  val2.value}
                    attrs.push(attr)
                    exist = true;
                    break;
                }
            }
            if(!exist)
                 attrs.push(val1);
        } 
        for (let val1 of obj2)
        {
            let exist = false;
            for(let val2 of attrs){
                if(val1.type == val2.type)
                {
                    exist = true;
                    break;
                }
            }
            if(!exist)
                 attrs.push(val1);
        } 
        return attrs;
    }
}