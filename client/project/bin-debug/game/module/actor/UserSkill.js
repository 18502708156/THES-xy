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
var PowerSkillState;
(function (PowerSkillState) {
    PowerSkillState[PowerSkillState["LOADING"] = 0] = "LOADING";
    PowerSkillState[PowerSkillState["USE"] = 1] = "USE";
    PowerSkillState[PowerSkillState["INIT"] = 2] = "INIT";
})(PowerSkillState || (PowerSkillState = {}));
var UserSkill = (function (_super) {
    __extends(UserSkill, _super);
    function UserSkill() {
        var _this = _super.call(this) || this;
        _this.mRedPoint = new UserSkillRedPoint;
        _this.regNetMsg(S2cProtocol.sc_skill_upgrade_result, _this.grewUpSkillResult);
        _this.regNetMsg(S2cProtocol.sc_skill_all_upgrade_result, _this.grewUpAllSkillResult);
        return _this;
    }
    UserSkill.ins = function () {
        return _super.ins.call(this);
    };
    UserSkill.prototype.Init = function () {
    };
    /**
    * 请求升级技能
    * @param roleId 角色目标唯一标识
    * @param skillID 要升级的技能id
    */
    UserSkill.prototype.sendGrewUpSkill = function (skillID) {
        var cs_skill_upgrade = new Sproto.cs_skill_upgrade_request();
        cs_skill_upgrade.skillID = skillID;
        GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade, cs_skill_upgrade);
    };
    ;
    /**
    * 调整技能释放顺序
    * @param skillID 要跳转的技能列表
    */
    UserSkill.prototype.sendSkillList = function (skills) {
        var cs_skill_sort_release = new Sproto.cs_skill_sort_release_request();
        cs_skill_sort_release.skills = skills;
        GameSocket.ins().Rpc(C2sProtocol.cs_skill_sort_release, cs_skill_sort_release);
    };
    ;
    /**
    * 技能升级结果
    */
    UserSkill.prototype.grewUpSkillResult = function (rsp) {
        var skillID = rsp.skillID;
        var level = rsp.level;
        var role = SubRoles.ins().GetRoleData();
        var skillsData = role.skillLevels;
        var upLevel = 0;
        for (var i in skillsData) {
            if (i == skillID.toString()) {
                upLevel = level - skillsData[i];
                role.setSkillsDataByIndex(i, level);
                break;
            }
        }
        MessageCenter.ins().dispatch(MessageDef.SKILL_UPGRADE, skillID, level, upLevel);
    };
    ;
    UserSkill.prototype.sendGrewUpAllSkill = function () {
        GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade_all);
    };
    ;
    /**
    * 全部技能升级结果
    */
    UserSkill.prototype.grewUpAllSkillResult = function (rsp) {
        var role = SubRoles.ins().GetRoleData();
        var skillsData = role.skillLevels;
        var skills = [];
        var upSkills = [];
        for (var i = 0; i < rsp.level.length; i++) {
            var lv = rsp.level[i];
            upSkills[i] = lv - skillsData[i];
            role.setSkillsDataByIndex(i, lv);
            skills.push(rsp.level[i]);
        }
        MessageCenter.ins().dispatch(MessageDef.SKILL_GREWUPALL, skills, upSkills);
    };
    ;
    /**
     * 获取当前技能最高等级限制
     */
    UserSkill.prototype.getSkillLimitLevel = function () {
        return GameLogic.ins().actorModel.level;
    };
    /**
     * 获取单个技能一键升级的消耗
     */
    UserSkill.prototype.getSingleSkillGrewUpCost = function (skillIndex) {
        var limitLevel = this.getSkillLimitLevel();
        var singleSkillLevel = SubRoles.ins().GetRoleData().skillLevels[skillIndex];
        var cost = 0;
        if (singleSkillLevel > 0) {
            for (var i = singleSkillLevel; i < limitLevel; i++) {
                cost += GlobalConfig.ins().SkillsUpgradeConfig[i].cost;
            }
            return cost;
        }
        return 0;
    };
    /**
     * 获取该角色技能全部升级的总消耗
     */
    UserSkill.prototype.getAllSkillGrewupCost = function () {
        var skillLimitLevel = UserSkill.ins().getSkillLimitLevel();
        var skillsLevel = SubRoles.ins().GetRoleData().skillLevels;
        var coin = GameLogic.ins().actorModel.gold;
        var cost = 0;
        var skills = [];
        for (var k in skillsLevel) {
            if (skillsLevel[k] > 0) {
                skills.push(skillsLevel[k]);
            }
        }
        while (true) {
            var minK = 0;
            for (var i = 1; i < skills.length; i++) {
                if (skills[minK] > skills[i]) {
                    minK = i;
                }
            }
            if (skills[minK] >= skillLimitLevel)
                break;
            var skillCost = GlobalConfig.ins().SkillsUpgradeConfig[skills[minK]].cost;
            if (coin >= skillCost + cost) {
                cost += skillCost;
                skills[minK]++;
            }
            else
                break;
        }
        return cost;
    };
    ;
    /**
     * 是否可以全部升级技能
     */
    UserSkill.prototype.canGrewupAllSkills = function () {
        var skillMaxLevel = GameLogic.ins().actorModel.level;
        var role = SubRoles.ins().GetRoleData();
        if (!role) {
            return false;
        }
        var skillsLevel = SubRoles.ins().GetRoleData().skillLevels;
        for (var k in skillsLevel) {
            if (skillsLevel[k] > 0 && skillsLevel[k] < skillMaxLevel) {
                return true;
            }
        }
        return false;
    };
    ;
    return UserSkill;
}(BaseSystem));
__reflect(UserSkill.prototype, "UserSkill");
var UserSkillRedPoint = (function (_super) {
    __extends(UserSkillRedPoint, _super);
    function UserSkillRedPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserSkillRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[UserSkillRedPoint.INDEX_UP_SKILL] = this.GetIndexUpSkill,
            _a;
        var _a;
    };
    UserSkillRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.SKILL_UPGRADE,
            MessageDef.SKILL_GREWUPALL,
            MessageDef.GOLD_CHANGE,
        ];
    };
    UserSkillRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_SKILL_UPGRADE);
    };
    UserSkillRedPoint.prototype.GetIndexUpSkill = function () {
        if (!UserSkill.ins().canGrewupAllSkills()) {
            return false;
        }
        var costAllNum = UserSkill.ins().getAllSkillGrewupCost();
        if (costAllNum && costAllNum <= GameLogic.ins().actorModel.gold) {
            return true;
        }
        return false;
    };
    UserSkillRedPoint.INDEX_UP_SKILL = 0;
    return UserSkillRedPoint;
}(IRedPoint));
__reflect(UserSkillRedPoint.prototype, "UserSkillRedPoint");
//# sourceMappingURL=UserSkill.js.map