/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/12 18:51
 * @meaning: 技能设置详情
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
var RoleSkilSetPanel = (function (_super) {
    __extends(RoleSkilSetPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RoleSkilSetPanel() {
        var _this = _super.call(this) || this;
        _this.tSkillList = []; //商店数据
        _this.skinName = "RoleSkillSetPanelSkin";
        _this.observe(MessageDef.SKILL_SORT_CHANGE, _this.updateList); //技能顺序变化
        _this.observe(MessageDef.SKILL_GREWUPALL, _this.updateList); //技能变化刷新
        _this.observe(MessageDef.SKILL_UPGRADE, _this.updateList); //技能变化刷新
        return _this;
    }
    RoleSkilSetPanel.prototype.OnOpen = function () {
        for (var i = 0; i < 8; i++) {
            var skList = SubRoles.ins().GetRoleData().getSkillSort();
            var itemIndex = skList[i] - 1; //修正技能下标
            var role = SubRoles.ins().GetRoleData();
            var skillIds = role.GetCurSkillIDs();
            var skillId = skillIds[itemIndex];
            if (skillId) {
                this.tSkillList.push(i); //下标
            }
        }
        this._AddItemClick(this.listView, this.onListViewClick);
        this.listView.itemRenderer = RoleSkilSetItem;
        this.UpdateContent();
    };
    RoleSkilSetPanel.prototype.OnClose = function () {
        // this.commonWindowBg.OnRemoved()
        // MessageCenter.ins().removeAll(this);
    };
    ;
    RoleSkilSetPanel.prototype.updateList = function () {
        this.listView.dataProvider.replaceAll(this.tSkillList);
    };
    RoleSkilSetPanel.prototype.UpdateContent = function () {
        this.listView.dataProvider = new eui.ArrayCollection(this.tSkillList);
    };
    RoleSkilSetPanel.prototype.onListViewClick = function (e) {
    };
    RoleSkilSetPanel.prototype.swapItems = function (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };
    ;
    /**点击 */
    RoleSkilSetPanel.prototype.onClick = function (e) {
    };
    return RoleSkilSetPanel;
}(BaseView));
__reflect(RoleSkilSetPanel.prototype, "RoleSkilSetPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=RoleSkilSetPanel.js.map