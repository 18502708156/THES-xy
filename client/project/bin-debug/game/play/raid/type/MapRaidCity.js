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
var MapRaidCity = (function (_super) {
    __extends(MapRaidCity, _super);
    function MapRaidCity() {
        var _this = _super.call(this) || this;
        _this.mIsOpen = false;
        _this.mNpcMap = {};
        // 主城创建角色时间间隔
        _this.m_CreateGapSetting = 0.2;
        return _this;
    }
    MapRaidCity.prototype.IsBackground = function () {
        return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_CITY;
    };
    MapRaidCity.prototype.DoEnter = function () {
        this.OnOpen();
    };
    MapRaidCity.prototype.DoExit = function () {
        // 重写
    };
    MapRaidCity.prototype.OnShowView = function () {
        // 重写
    };
    MapRaidCity.prototype.OnHideView = function () {
        // 重写
    };
    MapRaidCity.prototype.OnBackground = function () {
        _super.prototype.OnBackground.call(this);
        ViewManager.ins().close(GameCityPanel);
        GameGlobal.MessageCenter.removeAll(this);
        this.mIsOpen = false;
    };
    MapRaidCity.prototype.OnForeground = function () {
        _super.prototype.OnForeground.call(this);
        this.OnOpen();
    };
    MapRaidCity.prototype.OnOpen = function () {
        if (this.mIsOpen) {
            return;
        }
        this.mIsOpen = true;
        ViewManager.ins().open(GameCityPanel);
        GameGlobal.MessageCenter.addListener(MessageDef.MAIN_CITY_INFO, this._UpdateInfo, this);
        this._UpdateInfo();
    };
    MapRaidCity.prototype.GetMapEntityView = function () {
        return GameMap.GetMap().mCityEntityView;
    };
    MapRaidCity.prototype._UpdateInfo = function () {
        this.CreateNpcList();
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (info && info.championid == 0) {
            var pos = GameGlobal.Config.CityBaseConfig.onepos;
            this.mTheTipHandle = this.CreateImage("ui_zjm_bm_zhanlidiyi", pos[0] - 85, pos[1] - 90);
        }
        if (!info || !info.championid || !info.shows) {
            return;
        }
        info.shows.shows[RoleShowDataType.ROLE_TITLE] = 1902;
        if (!this.mWorshipModel) {
            var data = new MapNpcEntity;
            var entityRole = new EntityRole;
            entityRole.parserBase({
                shows: info.shows
            });
            data.UpdateInfo(entityRole);
            var pos = GameGlobal.Config.CityBaseConfig.onepos;
            this.mTheFirstHandle = this.CreateObject(data, pos[0], pos[1]);
            data.SetDir(5);
            data.UpdateAction(EntityClipType.STAND, false);
            this.mWorshipModel = data;
        }
        else {
            var entityRole = new EntityRole;
            entityRole.parserBase({
                shows: info.shows
            });
            this.mWorshipModel.UpdateInfo(entityRole);
        }
    };
    MapRaidCity.prototype.Create = function (entityData) {
        var entity = _super.prototype.Create.call(this, entityData);
        if (entity) {
            entity.SetClick(false);
        }
        return entity;
    };
    MapRaidCity.prototype.OnEntityClick = function (handle) {
        if (handle == this.mTheTipHandle) {
            UserTips.ins().showTips("全服战力第一，每天24:00刷新");
            return;
        }
        if (handle == this.mTheFirstHandle) {
            ViewManager.ins().open(TheFirstPlayerTipWin);
            return;
        }
        var npcId = this.GetNpcId(handle);
        if (npcId != -1) {
            ViewManager.ins().open(NpcDialogPopWin, npcId);
            return;
        }
        var entity = this.GetEntity(handle);
        this.OnMapClick(entity.$getX(), entity.$getY());
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_VIEW_ONCITYMAP, handle);
        GameGlobal.PlayerInfoModel.sendOtherId(handle);
    };
    MapRaidCity.prototype.CreateNpcList = function () {
        for (var key in GameGlobal.Config.CityNpcConfig) {
            var config = GameGlobal.Config.CityNpcConfig[key];
            if (!this.mNpcMap[config.id]) {
                var entity = this.CreateMonster(config.npcid, config.npcpos[0], config.npcpos[1]);
                this.mNpcMap[config.id] = entity.GetHandle();
            }
        }
    };
    MapRaidCity.prototype.GetNpcId = function (handle) {
        for (var key in this.mNpcMap) {
            if (this.mNpcMap[key] == handle)
                return parseInt(key);
        }
        return -1;
    };
    MapRaidCity.prototype.RemoveAllEntity = function () {
        _super.prototype.RemoveAllEntity.call(this);
        this.mNpcMap = {};
    };
    return MapRaidCity;
}(CommonMapRaid));
__reflect(MapRaidCity.prototype, "MapRaidCity");
//# sourceMappingURL=MapRaidCity.js.map