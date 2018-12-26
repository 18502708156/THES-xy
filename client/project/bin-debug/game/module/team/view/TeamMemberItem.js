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
var TeamMemberItem = (function (_super) {
    __extends(TeamMemberItem, _super);
    function TeamMemberItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    TeamMemberItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.tiRen_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTap, this);
    };
    TeamMemberItem.prototype.OnTap = function () {
        var data = this.data;
        data.mModel.SendKick(data.mInfo.level, data.mInfo.members[data.mIndex].dbid);
    };
    TeamMemberItem.prototype.dataChanged = function () {
        var data = this.data;
        var mem = data.mInfo.members[data.mIndex];
        if (!mem) {
            return;
        }
        this.leader_icon.visible = mem.dbid == data.mInfo.leaderid;
        this.tiRen_btn.visible = data.mInfo.IsMyTeam() && mem.dbid != GameGlobal.actorModel.actorID;
        UIHelper.SetHead(this.head, mem.job, mem.sex, false);
        this.level_txt.text = mem.level + "级";
        this.name_txt.text = mem.name;
        this.power_txt.text = "战力 " + mem.power;
    };
    return TeamMemberItem;
}(eui.ItemRenderer));
__reflect(TeamMemberItem.prototype, "TeamMemberItem");
//# sourceMappingURL=TeamMemberItem.js.map