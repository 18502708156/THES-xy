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
var GangMineTeamRoleItem = (function (_super) {
    __extends(GangMineTeamRoleItem, _super);
    function GangMineTeamRoleItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GangMineTeamRoleItemSkin';
        return _this;
    }
    GangMineTeamRoleItem.prototype.childrenCreated = function () {
        this.kickBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    };
    GangMineTeamRoleItem.prototype.onClickHandler = function (e) {
        var parent = Util.GetParentByType(this, GangMineMyTeamPanel);
        if (parent) {
            parent.model.SendKick(1, this.memberId);
        }
        else {
            console.error("not parent !!!");
        }
    };
    GangMineTeamRoleItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var data = this.data;
        if (data.guardInfo) {
            var info = data.guardInfo;
            this.teamImg.visible = this.kickBtn.visible = false;
            this.iconImg.source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.bloodBar.width = 188 * (info.hp / 100);
            this.tname.text = info.name;
            this.tpower.text = info.power + '';
            this.tlevel.text = 'Lv.' + info.level;
        }
        else if (data.mInfo) {
            var mInfo = data.mInfo;
            var member = mInfo.members[data.mIndex];
            this.memberId = member.dbid;
            this.teamImg.visible = mInfo.leaderid == this.memberId;
            this.kickBtn.visible = mInfo.IsMyTeam() && mInfo.leaderid != this.memberId;
            this.iconImg.source = ResDataPath.GetHeadImgName(member.job, member.sex);
            this.tname.text = member.name;
            this.tpower.text = member.power + '';
            this.tlevel.text = 'Lv.' + member.level;
        }
    };
    return GangMineTeamRoleItem;
}(eui.ItemRenderer));
__reflect(GangMineTeamRoleItem.prototype, "GangMineTeamRoleItem");
//# sourceMappingURL=GangMineTeamRoleItem.js.map