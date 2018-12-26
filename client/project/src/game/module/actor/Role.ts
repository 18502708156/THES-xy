class Role extends EntityRole {
    public constructor() {
        super();
    }

    public power: number = 0;
    public skillLevels: number[] = []
    public skillSortDatas = []; //技能排序
    public equipsData: Array<EquipsData> = []

	/**
     * 通过属性名获取属性类型
     * */
    public static getAttrTypeByName(attrName) {
        return this.translate[attrName];
    }

    /**通过职业类型获取职业名 */
    public static getJobNameByJob(type) {
        return this.jobNumberToName[type];
    }

    public static getEquipNameByType(type) {
        return this.typeNumberToName[type];
    }

    /** 当前的技能id列表 */
    public GetCurSkillIDs(): number[] {
        var count;
        var data = [];
        for (var i = 0; i < this.skillLevels.length; i++) {
            var lv = this.skillLevels[i] < 1 ? 1 : this.skillLevels[i];
            data.push(SkillsConfig.GetSkillId(this.job, i));
        }
        return data;
    }

    public GetCurSkillSortIds(): number[] {
        var skills = [];
        for (var i = 0; i < this.skillLevels.length; i++) {
            if (this.skillLevels[i] && this.skillLevels[i] > 0) {
                skills.push(SkillsConfig.GetSkillId(this.job, i));
            }
        }
        let ids = skills
        let sortIndex = this.skillSortDatas
        let list = []
        for (let index of sortIndex) {
            if (ids[index - 1]) {
                list.push(ids[index - 1])
            }
        }
        return list
    }

    public getSkillSort(){
        return  this.skillSortDatas
    }

    public setSkillSort(_dataList){
        if(_dataList instanceof Array)
        {
            this.skillSortDatas = _dataList
        }
    }

    public parser(rspData: Sproto.role_data) {
        this.power = rspData.power;
        this.skillLevels = rspData.skillDatas
        this.skillSortDatas = rspData.skillSortDatas

        this.equipsData = [];
        for (let value of rspData.equipsData) {
            let equip = new EquipsData();
            equip.parser(value);
            this.equipsData.push(equip);
        }

        this.parserAtt(rspData.attributeData)

        GameGlobal.MessageCenter.dispatch(MessageDef.DEITYEQUIP_INIT)
    }
    /**
     * 锻造数据更改
     * @returns 最后修改的索引
     */
    public parseForgeChange(rsp: Sproto.sc_equip_forge_request, type: ForgeType) {
        let fType = ""
        switch (type) {
            case ForgeType.BOOST:
                fType = "strengthen"
                break;
            case ForgeType.REFINE:
                fType = "refine"
                break;
            case ForgeType.EXERCISE:
                fType = "exercise"
                break;
            case ForgeType.GEM:
                fType = "gem"
                break;
        }
        for (let i = 0; i < rsp.forgeLevel.length; i++) {
            let val = rsp.forgeLevel[i]
            this.equipsData[i][fType] = val
        }
    }
    
    /**
     * 通过锻造类型获取等级最小的装备索引
     * @param type 0 强化 1 宝石 2 注灵 3 突破
     */
    public getMinEquipIndexByType(type: ForgeType) {
        let [index, lv] = this.GetMinEquipIndexAndLevel(type)
        return index
    };

    /**
     * 通过锻造类型获取等级最小的装备索引和等级
     */
    public GetMinEquipIndexAndLevel(type: ForgeType) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var lv = 0;
        var num = ForgeConst.CAN_FORGE_EQUIP.length;
        for (var n = 0; n < num; ++n) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            lv = this.equipsData[i].GetForgeValue(type)
            if (min > lv) {
                min = lv;
                index = i;
            }
        }
        return [index, min];
    }

    /**
     * 根据装备子类型获取该装备数据
     * @param subType 装备子类型
     */
    public getEquipDataBysubType(subType) {
        for (var i = 0; i < this.equipsData.length; i++) {
            var itemConfig = this.equipsData[i + 1].item.itemConfig;
            if (itemConfig) {
                if (itemConfig.subType == subType)
                    return this.equipsData[i + 1];
            }
            else
                return null;
        }
        return null;
    };
    /**
     * 技能总战斗力
     */
    public getSkillTotalPower() {
        var totalPower = 0;
        for (var i = 0; i < this.skillLevels.length; i++) {
            var skillConfig = GlobalConfig.ins().SkillPowerConfig[i];
            totalPower += this.skillLevels[i] * skillConfig.powerPerLevel;
        }
        return totalPower;
    }

    /**
     * 锻造总战斗力
     */
    public getForgeTotalPower(type: number) {
        var totalPower = 0;
        for (let i = 0, len = this.equipsData.length; i < len; i++) {
            let data = this.equipsData[i]
            let lv = data.GetForgeValue(type)
            if (lv > 0) {
                var forgeConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(i, lv, type);
                totalPower += Math.floor(UserBag.getAttrPower(forgeConfig.attr));
            }
        }

        let config = GameGlobal.ForgeModel.GetForgeMasterLevel(type) 
        if (config) {
           totalPower += ItemConfig.CalcAttrScoreValue(config.attrs) 
        }

        return totalPower;
    }

    public get lv() {
        return this._lv;
    }

    public set lv(value: number) {
        this._lv = value;
    }

    //------------------------------------------------------获取数据方法---------------------------------------------

    /**根据索引获取装备 */
    public getEquipByIndex(index): EquipsData {
        return this.equipsData[index];
    };
    /**获取装备数量 */
    public getEquipLen() {
        return this.equipsData.length;
    };
    /** 根据索引获取技能数据 */
    public getSkillsDataByIndex(index) {
        return this.skillLevels[index];
    };
    /** 根据所以设置技能数据 */
    public setSkillsDataByIndex(index, value) {
        this.skillLevels[index] = value;
    };

    public static jobNumberToName = {
        0: "通用",
        1: "职业1",
        2: "职业2",
        3: "职业3",
        4: "职业4",
    };
    public static translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough
    };

    public static typeNumberToName = [
        "武器",
        "头盔",
        "项链",
        "衣服",
        "护肩",
        "腰带",
        "护腕",
        "戒指",
        "裤子",
        "鞋子",
    ];
    public static typeNumberToName2 = [
        "部位1",
        "部位2",
        "部位3",
        "部位4",
    ];

    public GetSubRoleData(): RoleShowData {
        let data = new RoleShowData
        data.job = this.job
        data.sex = this.sex

        data.clothID = this.GetBodyId()
        data.swordID = this.GetWeaponId()
        data.rideId = this.GetRideId()
        data.wingId = this.GetWingId()
        data.tianxId = this.GetTianxId()
        data.titleId = this.GetTitleId()

        return data
    }

	public GetHeadImgName(): string {
        return ResDataPath.GetHeadMiniImgName(this.job, this.sex)
	}
    public GetHeadCircleImgName(): string {
        return ResDataPath.GetHeadCircleImgName(this.job, this.sex)
	}

    GetTitle(): number { 
        if (this.mTitle) {
            return this.mTitle
        }
        return GameGlobal.UserTitle.getWearId() || 0
    }

    GetBodyId(): number {
        return RoleShowData.GetBodyAppId(GameGlobal.UserSkin.getWearId(), this.job, this.sex)
    }

    GetWeaponId(): number {
        // return GameGlobal.SwordModel.GetAppaId()
        return RoleShowData.GetSwordAppId(GameGlobal.SwordModel.mDressId, this.job, this.sex)
    }

	GetWingId(): number {
        return GameGlobal.UserWing.GetAppaId()
    }

    GetRideId(): number {
        return GameGlobal.UserRide.GetAppaId()
    }

    GetTianxId(): number {
        return GameGlobal.TianxModel.GetAppaId()
    }

    GetTitleId(): number {
        return GameGlobal.UserTitle.getWearId()
    }

    ClearTmpData() {
        this.mTitle = null
    }
}