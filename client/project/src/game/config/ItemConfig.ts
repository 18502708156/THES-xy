class ItemConfig {

    static FuwenEquipSlot = {
        Slot0: 0,
        Slot1: 1,
        Slot2: 2,
        Slot3: 3,
        Slot4: 4,
        Slot5: 5,
        Slot6: 6,
        Slot7: 7,
        Slot8: 8,
        Count: 9,
    }

    public static InitConfig() {
        this.equipConfig = GlobalConfig.ins().EquipConfig
        this.powerConfig = GlobalConfig.ins().AttrPowerConfig;
    }

    public static IsLegendItem(config): boolean {
        if (!config) {
            return false
        }
        if (config.type == ItemType.EQUIP && config.quality == 5) {
            return true
        }
        return false
    }

    // private static transfrom = [
    //     '',
    //     '',
    //     'hp',
    //     '',
    //     'atk',
    //     'def',
    //     'res',
    // ];
    public static calcItemLevel(item): number {
        return item.itemConfig.zsLevel && item.itemConfig.zsLevel * 1000 || item.itemConfig.level
    }

    private static calcAttrScore(attr: {type: AttributeType, value: number}[]): number {
        var power = 0;
        var powerConfig = GlobalConfig.ins().AttrPowerConfig;
        attr.forEach(element => {
            let pData = powerConfig[element.type]
            if (pData) {
                power += pData.power * element.value
            }
        });
        return power;
    }

    public static CalcAttrScoreValue(attr: {type: AttributeType, value: number}[]): number {
        if (!attr || !attr.length) {
            return 0
        }
        return Math.floor(this.calcAttrScore(attr) * 0.01)
    }

	/** 计算普通装备的评分 */
    public static calculateBagItemScore(item: ItemBaseData): number {
        var equipConfig = GlobalConfig.ins().EquipConfig[item.itemConfig.id];
        if (!equipConfig) {
            return 0
        }
        var powerConfig = GlobalConfig.ins().AttrPowerConfig;
        var allPower = ItemConfig.calcAttrScore(item.att)
        if (equipConfig.attrs) {
            allPower += ItemConfig.calcAttrScore(equipConfig.attrs);
        }
        // let trans = AttributeData.translate
        // for (let atName in trans) {
        //     let pData = powerConfig[trans[atName]]
        //     if (pData) {
        //         let atr = equipConfig[atName]
        //         if(atr) {
        //             allPower += pData.power * atr
        //         }
        //     }
        // }
        return Math.floor(allPower / 100);
    };

    public static CalculateScore(configID: number): number {
        var equipConfig = GlobalConfig.ins().EquipConfig[configID];
        if (!equipConfig) {
            return 0
        }
        var powerConfig = GlobalConfig.ins().AttrPowerConfig;
        var allPower = 0
        if (equipConfig.attrs)
            allPower += ItemConfig.calcAttrScore(equipConfig.attrs);
        for (let i in AttributeData.translate) {
            if (powerConfig[AttributeData.translate[i]]) {
                if(equipConfig[i])
                {
                    allPower += powerConfig[AttributeData.translate[i]].power * equipConfig[i]
                }
            }
        }
        return Math.floor(allPower / 100);
    };




    public static CalculateItemScore(configID: number): number {
        var config = GlobalConfig.ins().EquipConfig[configID];
        var totalAttr = [];
        for (var k in Role.translate) {
            if (config[k] <= 0)
                continue;

            var attrs = new AttributeData;
            attrs.type = Role.getAttrTypeByName(k);
            attrs.value = config[k];
            totalAttr.push(attrs);
        
        }
        return Math.floor(UserBag.getAttrPower(totalAttr));
    }


    public static TRANSFROM = [
        '',
        '',
        'hp',
        '',
        'atk',
        'def',
        'res',
    ];

    private static equipConfig 
    private static powerConfig

    /** 计算橙装&传奇装的评分 */
    public static pointCalNumber(item): number {
        var allPower = 0;
        let equipConfig = this.equipConfig[item.id]
        let powerConfig = this.powerConfig
        for (var k in powerConfig) {
            var value = equipConfig[this.TRANSFROM[powerConfig[k].type]] || 0
            allPower += (value + value * equipConfig.additionRange * 0.01) * powerConfig[k].power;
        }
        return Math.floor(allPower * 0.01);
    };

    public static PointCalNumberRefine(item, percent: number): number {
        percent = percent * 0.01
        var allPower = 0;
        let equipConfig = this.equipConfig[item.id]
        let powerConfig = this.powerConfig
        for (var k in powerConfig) {
            var value = equipConfig[this.TRANSFROM[powerConfig[k].type]] || 0
            allPower += (value + value * equipConfig.additionRange * 0.01) * powerConfig[k].power * percent;
        }
        // if (equipConfig.baseAttr) {
        //     for (let attr of equipConfig.baseAttr) {
        //         allPower += (powerConfig[attr.type].power || 0) * attr.value * percent
        //     }
        // }
        return Math.floor(allPower * 0.01);
    };

    public static LegendRefineScore(item, percent: number): number {
        if (item == null) {
            return 0
        }
        if (!percent) {
            return 0
        }
        var allPower = 0;
        let equipConfig = this.equipConfig[item.id]
        if (equipConfig == null) {
            return 0
        }
        let powerConfig = this.powerConfig
        for (var k in powerConfig) {
            var value = equipConfig[this.TRANSFROM[powerConfig[k].type]] || 0
            allPower += (value + value * equipConfig.additionRange * 0.01) * (percent * 0.01) * powerConfig[k].power;
        }
        return Math.floor(allPower * 0.01);
    }
}