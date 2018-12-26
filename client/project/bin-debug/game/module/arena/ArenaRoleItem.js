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
var ArenaRoleItem = (function (_super) {
    __extends(ArenaRoleItem, _super);
    function ArenaRoleItem() {
        return _super.call(this) || this;
    }
    ArenaRoleItem.prototype.getRank = function () {
        return this.rank;
    };
    ArenaRoleItem.prototype.updateData = function (data) {
        this.rank = data.rank;
        this.totalPower.text = data.power;
        this.rankTxt.text = data.rank + '';
        this.nameTxt.text = data.name;
        this.mkillImg.visible = data.iskill;
        if (data.id > 0) {
            this.challengeImg.visible = false;
            this.nameTxt.visible = true;
            var roleData = new RoleShowData;
            roleData.job = data.job;
            roleData.sex = data.sex;
            //角色： 1. 坐骑 2.翅膀 3.天仙 4.神兵 5.时装 6.称号
            // data.shows[RoleShowDataType.ROLE_TITLE] = 0
            // data.shows[RoleShowDataType.ROLE_TIANXIAN] = 0
            roleData.shows = data.shows;
            this.roleShowPanel.SetAll(roleData);
            this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = .6;
        }
        else {
            this.challengeImg.visible = true;
            this.nameTxt.visible = false;
            this.roleShowPanel.ClearCache();
            this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(data.monId || 220004)));
            this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 1;
        }
    };
    return ArenaRoleItem;
}(eui.Component));
__reflect(ArenaRoleItem.prototype, "ArenaRoleItem");
//# sourceMappingURL=ArenaRoleItem.js.map