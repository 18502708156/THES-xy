/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/12 18:51
 * @meaning: 技能设置item
 *
 **/
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
var RoleSkilSetItem = (function (_super) {
    __extends(RoleSkilSetItem, _super);
    function RoleSkilSetItem() {
        var _this = _super.call(this) || this;
        _this.tSkillList = []; //技能列表
        // 皮肤名称
        _this.skinName = "RoleSkillSetSkinItemSkin";
        // this.touchChildren = true;
        //点击响应
        _this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        return _this;
    }
    RoleSkilSetItem.prototype.dataChanged = function () {
        //更新内容
        this.tSkillList = SubRoles.ins().GetRoleData().getSkillSort();
        var itemIndex = this.tSkillList[this.data] - 1; //修正技能下标
        var role = SubRoles.ins().GetRoleData();
        var skillIds = role.GetCurSkillIDs();
        var skillId = skillIds[itemIndex];
        var skillLevel = role.getSkillsDataByIndex(itemIndex);
        var skillName = SkillsConfig.GetSkillName(skillId); //名称
        var skillInfo = SkillsConfig.GetSkillDesc(skillId, skillLevel, 0); //技能描述
        if (skillLevel > 0) {
            this.btn.touchEnabled = true;
            this.filters = null;
        }
        else {
            this.btn.touchEnabled = false;
            this.filters = Color.GetFilter();
        }
        this.lb_level.text = skillLevel + "";
        this.lbSkillLv.text = skillLevel + "";
        this.lbSkillNe.text = skillName;
        this.lbInfo.text = skillInfo;
        this.img_icon.source = SkillsConfig.GetSkillIcon(skillId);
    };
    RoleSkilSetItem.prototype.OnClick = function (e) {
        if (this.data > 0) {
            this.tSkillList = this.swapItems(this.tSkillList, this.data, this.data - 1);
            UserSkill.ins().sendSkillList(this.tSkillList);
            SubRoles.ins().GetRoleData().setSkillSort(this.tSkillList);
            GameGlobal.MessageCenter.dispatch(MessageDef.SKILL_SORT_CHANGE); //技能排序变化
        }
    };
    RoleSkilSetItem.prototype.swapItems = function (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };
    return RoleSkilSetItem;
}(eui.ItemRenderer));
__reflect(RoleSkilSetItem.prototype, "RoleSkilSetItem");
//# sourceMappingURL=RoleSkilSetItem.js.map