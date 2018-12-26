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
var MapRaidCrossBattle = (function (_super) {
    __extends(MapRaidCrossBattle, _super);
    function MapRaidCrossBattle() {
        var _this = _super.call(this) || this;
        _this.m_HelpId = 23;
        return _this;
    }
    MapRaidCrossBattle.prototype.Init = function () {
        _super.prototype.Init.call(this);
        GameMap.GetMap().addMapCity();
    };
    MapRaidCrossBattle.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        GameMap.GetMap().removeMapCity();
        GameGlobal.ViewManagerImpl.Destroy(CrossBattleWin);
    };
    MapRaidCrossBattle.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        GameGlobal.MessageCenter.addListener(MessageDef.FUHUO_UPDATE_INFO, this._DoFuHuoUpData, this);
        this._DoFuHuoUpData();
        GameGlobal.ViewManagerImpl.Open(CrossBattleWin);
        var view = this.GetGameMapPanel();
        if (view) {
            view.helpBtn.y = 230;
        }
    };
    MapRaidCrossBattle.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        GameGlobal.ViewManagerImpl.Close(CrossBattleWin);
        GameGlobal.MessageCenter.removeAll(this);
    };
    MapRaidCrossBattle.prototype.GetRebornYb = function () {
        return GameGlobal.Config.KingBaseConfig.revivecost;
    };
    MapRaidCrossBattle.prototype.SendRelive = function () {
        GameGlobal.CrossBattleModel.fuHuo();
    };
    MapRaidCrossBattle.prototype._DoFuHuoUpData = function () {
        var time = GameGlobal.CrossBattleModel.GetDeadTime();
        if (time > 0) {
            this.ShowRebornView(time);
        }
        else {
            this.RemoveRebornView();
        }
    };
    MapRaidCrossBattle.prototype.MoveOrder = function (orderId, localX, localY) {
        // if(GameGlobal.CrossBattleModel.status == 1){
        // 	UserTips.ErrorTip("活动未开始，请在出生点等待")
        // 	return 
        // }
        if (GameGlobal.CrossBattleModel.status == 3) {
            UserTips.ErrorTip("无法移动，处于死亡状态");
            return;
        }
        if (GameGlobal.CrossBattleModel.status == 4) {
            UserTips.ErrorTip("无法移动，处于守城状态");
            return;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.MOVE_UPDATE_INFO, localX, localY);
        return _super.prototype.MoveOrder.call(this, orderId, localX, localY);
    };
    MapRaidCrossBattle.prototype.Create = function (entityData) {
        var entity = _super.prototype.Create.call(this, entityData);
        if (entity) {
            entity.SetClick();
        }
        GameGlobal.CrossBattleModel.DelayAddfightingIcon();
        return entity;
    };
    // 角色点击
    MapRaidCrossBattle.prototype.OnEntityClick = function (handle) {
        if (GameGlobal.CrossBattleModel.status == 1 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 1) {
            UserTips.ErrorTip("活动未开始，请在出生点等待");
            return;
        }
        if (GameGlobal.CrossBattleModel.status == 3 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 3) {
            UserTips.ErrorTip("无法攻击，处于死亡状态");
            return;
        }
        if (GameGlobal.CrossBattleModel.status == 4 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 4) {
            UserTips.ErrorTip("无法攻击，处于守城状态");
            return;
        }
        GameGlobal.CrossBattleModel.freePk(handle);
    };
    MapRaidCrossBattle.prototype.OnMoveLeval = function (orderId, handle, taget_x, taget_y) {
        GameGlobal.CrossBattleModel.getCity(orderId, handle);
    };
    MapRaidCrossBattle.prototype.OnLeave = function () {
        GameGlobal.CrossBattleModel.kingLeave();
        // 退出的时候清理组队数据
        GameGlobal.CrossBattleTeamModel.mTeamInfo.Clear();
    };
    MapRaidCrossBattle.prototype.UpdatePlayerStatus = function (id, status) {
        // 跨服争霸不处理通用状态更新信息
    };
    MapRaidCrossBattle.prototype.GetTeamModel = function () {
        return GameGlobal.CrossBattleTeamModel;
    };
    return MapRaidCrossBattle;
}(CommonMapRaid));
__reflect(MapRaidCrossBattle.prototype, "MapRaidCrossBattle");
//# sourceMappingURL=MapRaidCrossBattle.js.map