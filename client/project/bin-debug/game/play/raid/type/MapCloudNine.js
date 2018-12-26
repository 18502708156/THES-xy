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
var MapCloudNine = (function (_super) {
    __extends(MapCloudNine, _super);
    function MapCloudNine() {
        return _super.call(this) || this;
    }
    MapCloudNine.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        var panel = ViewManager.ins().getView(GameMapPanel);
        panel.setOnLeaveDlgStr("退出后进入冷却时间" + GameGlobal.Config.ClimbTowerBaseConfig.cd + "秒");
        if (!this.view) {
            this.view = new CloudNineSceneView;
        }
        this.AddView(this.view);
    };
    MapCloudNine.prototype.GetEntityNameStyle = function (info) {
        return this.GetEntityNameStyleSvr(info);
    };
    // 角色点击
    MapCloudNine.prototype.OnEntityClick = function (handle) {
        if (!GameGlobal.CloudNineModel.checkPk(handle)) {
            var monsterServersId = GameGlobal.CloudNineModel.getMonsterServersId(handle);
            if (monsterServersId) {
                if (!GameGlobal.CloudNineModel.checkPk(monsterServersId))
                    GameGlobal.CloudNineModel.sendPk(monsterServersId);
                else
                    GameGlobal.UserTips.showTips("目标战斗中");
            }
            else
                GameGlobal.CloudNineModel.sendPk(handle);
        }
        else
            GameGlobal.UserTips.showTips("目标战斗中");
    };
    MapCloudNine.prototype.Create = function (entityData) {
        var entity = _super.prototype.Create.call(this, entityData);
        if (entity) {
            entity.SetClick();
        }
        return entity;
    };
    MapCloudNine.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        ViewManager.ins().close(CloudNineSceneView);
    };
    MapCloudNine.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
    };
    MapCloudNine.prototype.OnLeave = function () {
        GameGlobal.CloudNineModel.sendLeave();
    };
    return MapCloudNine;
}(CommonMapRaid));
__reflect(MapCloudNine.prototype, "MapCloudNine");
//# sourceMappingURL=MapCloudNine.js.map