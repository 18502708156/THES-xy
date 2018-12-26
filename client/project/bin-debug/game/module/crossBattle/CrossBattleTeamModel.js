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
var CrossBattleTeamModel = (function (_super) {
    __extends(CrossBattleTeamModel, _super);
    function CrossBattleTeamModel() {
        return _super.call(this, UserFb.FB_TYPE_KING_CITY) || this;
    }
    CrossBattleTeamModel.prototype._DoTeamInfo = function (rsp) {
        var hasTeam = this.mTeamInfo.HasTeam();
        _super.prototype._DoTeamInfo.call(this, rsp);
        if (!hasTeam && this.mTeamInfo.HasTeam()) {
            ViewManager.ins().open(CrossBattleTeamPanel);
        }
    };
    CrossBattleTeamModel.prototype._DoTeamList = function (rsp) {
        _super.prototype._DoTeamList.call(this, rsp);
    };
    CrossBattleTeamModel.prototype._ChageTeam = function (rsp) {
        _super.prototype._ChageTeam.call(this, rsp);
    };
    CrossBattleTeamModel.prototype.SendQuickJoin = function (level) {
        var req = new Sproto.cs_team_quick_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_quick, req, this._DoQuickJoin, this);
    };
    CrossBattleTeamModel.prototype.SendCreateTeam = function (level) {
        var req = new Sproto.cs_team_create_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_create, req, this._DoCreate, this);
    };
    CrossBattleTeamModel.prototype.SendJoin = function (level, leaderId, raidtype) {
        if (raidtype === void 0) { raidtype = this.mRaidType; }
        if (!UserFb.CheckFighting()) {
            return;
        }
        var req = new Sproto.cs_team_join_request;
        req.raidtype = raidtype;
        req.level = level;
        req.leaderid = leaderId;
        this.Rpc(C2sProtocol.cs_team_join, req, this._DoJoin, this);
    };
    return CrossBattleTeamModel;
}(TeamBaseModel));
__reflect(CrossBattleTeamModel.prototype, "CrossBattleTeamModel");
//# sourceMappingURL=CrossBattleTeamModel.js.map