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
var CrossBattleTeamWin = (function (_super) {
    __extends(CrossBattleTeamWin, _super);
    function CrossBattleTeamWin() {
        var _this = _super.call(this) || this;
        _this.model = GameGlobal.CrossBattleTeamModel;
        return _this;
    }
    CrossBattleTeamWin.prototype.initData = function () {
        this.list.itemRenderer = CrossBattleTeamItem;
        this.list.dataProvider = null;
    };
    CrossBattleTeamWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.createBtn, this.onClickHandler);
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.updateContent);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.showMyTeamPanel);
        this.model.SendGetTeamList(GameGlobal.CrossBattleModel.camp);
    };
    CrossBattleTeamWin.prototype.updateContent = function () {
        this.list.dataProvider = new eui.ArrayCollection(this.model.mTeamList[GameGlobal.CrossBattleModel.camp]);
    };
    CrossBattleTeamWin.prototype.onClickHandler = function (e) {
        GameGlobal.CrossBattleTeamModel.SendCreateTeam(GameGlobal.CrossBattleModel.camp);
    };
    CrossBattleTeamWin.prototype.showMyTeamPanel = function () {
        this.CloseSelf();
        // ViewManager.ins().open(CrossBattleTeamPanel);
    };
    return CrossBattleTeamWin;
}(GangMineTeamPanel));
__reflect(CrossBattleTeamWin.prototype, "CrossBattleTeamWin");
var CrossBattleTeamItem = (function (_super) {
    __extends(CrossBattleTeamItem, _super);
    function CrossBattleTeamItem() {
        return _super.call(this) || this;
    }
    CrossBattleTeamItem.prototype.onClickHandler = function (e) {
        if (this.needPower > GameGlobal.actorModel.power) {
            GameGlobal.UserTips.showTips('战力不足，不能加入');
            return;
        }
        if (this.memberLen >= 3) {
            GameGlobal.UserTips.showTips('队伍满员，不能加入');
            return;
        }
        if (GameGlobal.CrossBattleModel.status == 4) {
            GameGlobal.UserTips.showTips('守城状态中，不能加入');
            return;
        }
        GameGlobal.CrossBattleTeamModel.SendJoin(GameGlobal.CrossBattleModel.camp, this.leaderId);
    };
    return CrossBattleTeamItem;
}(GangMineTeamItem));
__reflect(CrossBattleTeamItem.prototype, "CrossBattleTeamItem");
//# sourceMappingURL=CrossBattleTeamWin.js.map