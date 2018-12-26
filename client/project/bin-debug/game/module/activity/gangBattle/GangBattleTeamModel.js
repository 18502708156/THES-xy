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
var GangBattleTeamModel = (function (_super) {
    __extends(GangBattleTeamModel, _super);
    function GangBattleTeamModel() {
        return _super.call(this, UserFb.FB_TYPE_GUILD_WAR) || this;
    }
    GangBattleTeamModel.prototype.InnerCheckEnter = function (id) {
        return true;
    };
    GangBattleTeamModel.prototype.SendRecruit = function () {
        this.Rpc(C2sProtocol.cs_guildwar_team_recruit);
    };
    return GangBattleTeamModel;
}(TeamBaseModel));
__reflect(GangBattleTeamModel.prototype, "GangBattleTeamModel");
//# sourceMappingURL=GangBattleTeamModel.js.map