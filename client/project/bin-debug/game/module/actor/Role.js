var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Role = (function (_super) {
    __extends(Role, _super);
    function Role() {
        var _this = _super.call(this) || this;
        _this.power = 0;
        _this.skillLevels = [];
        _this.skillSortDatas = []; //技能排序
        _this.equipsData = [];
        return _this;
    }
    /**
     * 通过属性名获取属性类型
     * */
    Role.getAttrTypeByName = function (attrName) {
        return this.translate[attrName];
    };
    /**通过职业类型获取职业名 */
    Role.getJobNameByJob = function (type) {
        return this.jobNumberToName[type];
    };
    Role.getEquipNameByType = function (type) {
        return this.typeNumberToName[type];
    };
    /** 当前的技能id列表 */
    Role.prototype.GetCurSkillIDs = function () {
        var count;
        var data = [];
        for (var i = 0; i < this.skillLevels.length; i++) {
            var lv = this.skillLevels[i] < 1 ? 1 : this.skillLevels[i];
            data.push(SkillsConfig.GetSkillId(this.job, i));
        }
        return data;
    };
    Role.prototype.GetCurSkillSortIds = function () {
        var skills = [];
        for (var i = 0; i < this.skillLevels.length; i++) {
            if (this.skillLevels[i] && this.skillLevels[i] > 0) {
                skills.push(SkillsConfig.GetSkillId(this.job, i));
            }
        }
        var ids = skills;
        var sortIndex = this.skillSortDatas;
        var list = [];
        for (var _i = 0, sortIndex_1 = sortIndex; _i < sortIndex_1.length; _i++) {
            var index = sortIndex_1[_i];
            if (ids[index - 1]) {
                list.push(ids[index - 1]);
            }
        }
        return list;
    };
    Role.prototype.getSkillSort = function () {
        return this.skillSortDatas;
    };
    Role.prototype.setSkillSort = function (_dataList) {
        if (_dataList instanceof Array) {
            this.skillSortDatas = _dataList;
        }
    };
    Role.prototype.parser = function (rspData) {
        this.power = rspData.power;
        this.skillLevels = rspData.skillDatas;
        this.skillSortDatas = rspData.skillSortDatas;
        this.equipsData = [];
        for (var _i = 0, _a = rspData.equipsData; _i < _a.length; _i++) {
            var value = _a[_i];
            var equip = new EquipsData();
            equip.parser(value);
            this.equipsData.push(equip);
        }
        this.parserAtt(rspData.attributeData);
        GameGlobal.MessageCenter.dispatch(MessageDef.DEITYEQUIP_INIT);
    };
    /**
     * 锻造数据更改
     * @returns 最后修改的索引
     */
    Role.prototype.parseForgeChange = function (rsp, type) {
        var fType = "";
        switch (type) {
            case ForgeType.BOOST:
                fType = "strengthen";
                break;
            case ForgeType.REFINE:
                fType = "refine";
                break;
            case ForgeType.EXERCISE:
                fType = "exercise";
                break;
            case ForgeType.GEM:
                fType = "gem";
                break;
        }
        for (var i = 0; i < rsp.forgeLevel.length; i++) {
            var val = rsp.forgeLevel[i];
            this.equipsData[i][fType] = val;
        }
    };
    /**
     * 通过锻造类型获取等级最小的装备索引
     * @param type 0 强化 1 宝石 2 注灵 3 突破
     */
    Role.prototype.getMinEquipIndexByType = function (type) {
        var _a = this.GetMinEquipIndexAndLevel(type), index = _a[0], lv = _a[1];
        return index;
    };
    ;
    /**
     * 通过锻造类型获取等级最小的装备索引和等级
     */
    Role.prototype.GetMinEquipIndexAndLevel = function (type) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var lv = 0;
        var num = ForgeConst.CAN_FORGE_EQUIP.length;
        for (var n = 0; n < num; ++n) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            lv = this.equipsData[i].GetForgeValue(type);
            if (min > lv) {
                min = lv;
                index = i;
            }
        }
        return [index, min];
    };
    /**
     * 根据装备子类型获取该装备数据
     * @param subType 装备子类型
     */
    Role.prototype.getEquipDataBysubType = function (subType) {
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
    ;
    /**
     * 技能总战斗力
     */
    Role.prototype.getSkillTotalPower = function () {
        var totalPower = 0;
        for (var i = 0; i < this.skillLevels.length; i++) {
            var skillConfig = GlobalConfig.ins().SkillPowerConfig[i];
            totalPower += this.skillLevels[i] * skillConfig.powerPerLevel;
        }
        return totalPower;
    };
    /**
     * 锻造总战斗力
     */
    Role.prototype.getForgeTotalPower = function (type) {
        var totalPower = 0;
        for (var i = 0, len = this.equipsData.length; i < len; i++) {
            var data = this.equipsData[i];
            var lv = data.GetForgeValue(type);
            if (lv > 0) {
                var forgeConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(i, lv, type);
                totalPower += Math.floor(UserBag.getAttrPower(forgeConfig.attr));
            }
        }
        var config = GameGlobal.ForgeModel.GetForgeMasterLevel(type);
        if (config) {
            totalPower += ItemConfig.CalcAttrScoreValue(config.attrs);
        }
        return totalPower;
    };
    Object.defineProperty(Role.prototype, "lv", {
        get: function () {
            return this._lv;
        },
        set: function (value) {
            this._lv = value;
        },
        enumerable: true,
        configurable: true
    });
    //------------------------------------------------------获取数据方法---------------------------------------------
    /**根据索引获取装备 */
    Role.prototype.getEquipByIndex = function (index) {
        return this.equipsData[index];
    };
    ;
    /**获取装备数量 */
    Role.prototype.getEquipLen = function () {
        return this.equipsData.length;
    };
    ;
    /** 根据索引获取技能数据 */
    Role.prototype.getSkillsDataByIndex = function (index) {
        return this.skillLevels[index];
    };
    ;
    /** 根据所以设置技能数据 */
    Role.prototype.setSkillsDataByIndex = function (index, value) {
        this.skillLevels[index] = value;
    };
    ;
    Role.prototype.GetSubRoleData = function () {
        var data = new RoleShowData;
        data.job = this.job;
        data.sex = this.sex;
        data.clothID = this.GetBodyId();
        data.swordID = this.GetWeaponId();
        data.rideId = this.GetRideId();
        data.wingId = this.GetWingId();
        data.tianxId = this.GetTianxId();
        data.titleId = this.GetTitleId();
        return data;
    };
    Role.prototype.GetHeadImgName = function () {
        return ResDataPath.GetHeadMiniImgName(this.job, this.sex);
    };
    Role.prototype.GetHeadCircleImgName = function () {
        return ResDataPath.GetHeadCircleImgName(this.job, this.sex);
    };
    Role.prototype.GetTitle = function () {
        if (this.mTitle) {
            return this.mTitle;
        }
        return GameGlobal.UserTitle.getWearId() || 0;
    };
    Role.prototype.GetBodyId = function () {
        return RoleShowData.GetBodyAppId(GameGlobal.UserSkin.getWearId(), this.job, this.sex);
    };
    Role.prototype.GetWeaponId = function () {
        // return GameGlobal.SwordModel.GetAppaId()
        return RoleShowData.GetSwordAppId(GameGlobal.SwordModel.mDressId, this.job, this.sex);
    };
    Role.prototype.GetWingId = function () {
        return GameGlobal.UserWing.GetAppaId();
    };
    Role.prototype.GetRideId = function () {
        return GameGlobal.UserRide.GetAppaId();
    };
    Role.prototype.GetTianxId = function () {
        return GameGlobal.TianxModel.GetAppaId();
    };
    Role.prototype.GetTitleId = function () {
        return GameGlobal.UserTitle.getWearId();
    };
    Role.prototype.ClearTmpData = function () {
        this.mTitle = null;
    };
    Role.jobNumberToName = {
        0: "通用",
        1: "职业1",
        2: "职业2",
        3: "职业3",
        4: "职业4",
    };
    Role.translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        // 'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough
    };
    Role.typeNumberToName = [
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
    Role.typeNumberToName2 = [
        "部位1",
        "部位2",
        "部位3",
        "部位4",
    ];
    return Role;
}(EntityRole));
__reflect(Role.prototype, "Role");
//# sourceMappingURL=Role.js.map