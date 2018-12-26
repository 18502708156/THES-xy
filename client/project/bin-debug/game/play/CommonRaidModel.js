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
var CommonRaidModel = (function (_super) {
    __extends(CommonRaidModel, _super);
    function CommonRaidModel() {
        var _this = _super.call(this) || this;
        _this.m_Raid = {};
        _this.regNetMsg(S2cProtocol.sc_map_enter, _this._MapEnter);
        _this.regNetMsg(S2cProtocol.sc_map_other_enter, _this._MapOtherEnter);
        _this.regNetMsg(S2cProtocol.sc_map_other_leave, _this._MapOtherLeave);
        _this.regNetMsg(S2cProtocol.sc_map_other_move, _this._MapOtherMove);
        _this.regNetMsg(S2cProtocol.sc_map_other_fly, _this._MapOtherFly);
        _this.regNetMsg(S2cProtocol.sc_map_maincity_info, _this._MainCityInfo);
        _this.regNetMsg(S2cProtocol.sc_map_player_update, _this._PlayerUpdate);
        _this.regNetMsg(S2cProtocol.sc_map_player_status, _this._PlayerStatus);
        return _this;
    }
    CommonRaidModel.prototype.GetRaid = function () {
        for (var k in this.m_Raid) {
            if (Number(k) == GameMap.TYPE_ID_CITY) {
                continue;
            }
            return this.m_Raid[k];
        }
        return null;
    };
    CommonRaidModel.prototype.ClearRaid = function () {
        for (var k in this.m_Raid) {
            if (Number(k) == GameMap.TYPE_ID_CITY) {
                continue;
            }
            delete this.m_Raid[k];
        }
    };
    Object.defineProperty(CommonRaidModel.prototype, "OpenClick", {
        // 场景是否存在
        get: function () {
            return this.GetRaid() != null;
        },
        enumerable: true,
        configurable: true
    });
    CommonRaidModel.prototype.OnSocketClose = function () {
        // this.raid = null
        this.m_Raid = {};
    };
    CommonRaidModel.prototype._MapEnter = function (rsp) {
        var mapid = rsp.mapid;
        // if (mapid == GameMap.TYPE_ID_CITY) {
        // 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_CITY)
        // 	let raid = this.m_Raid[mapid] = GameGlobal.RaidMgr.EnterCityMapRaid()
        // 	raid.RemoveAllEntity()
        // 	raid.CreateRole(rsp.myself)
        // 	raid.CreateRoleList(rsp.entitylist)
        // 	ViewManager.ins().close(PlayFunView);
        // 	ViewManager.ins().close(GameCityPanel);
        // } else {
        // 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_NORMAL)
        var cfg = GameGlobal.Config.MapConfig[mapid];
        var data = new GameMapData;
        data.fubenID = mapid;
        data.mapX = rsp.x;
        data.mapY = rsp.y;
        data.fbType = cfg.type;
        var raid = GameGlobal.RaidMgr.EnterNewMapRaid(data);
        this.m_Raid[mapid] = raid;
        raid.CreateRole(rsp.myself);
        raid.CreateRoleList(rsp.entitylist);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST);
        // 先赋值，然后处理界面
        ViewManager.ins().close(PlayFunView);
        ViewManager.ins().close(GameCityPanel);
        ViewManager.ins().close(MainTop2Panel);
        // }
    };
    CommonRaidModel.prototype._MapOtherEnter = function (rsp) {
        // if (!this.raid) {
        // 	return
        // }
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        raid.CreateRole(rsp.entity);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST);
    };
    CommonRaidModel.prototype._MapOtherLeave = function (rsp) {
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        if (rsp.id == GameGlobal.GameLogic.actorModel.actorID) {
            this.EnterNormapMap();
        }
        else {
            raid.RemoveEntity(rsp.id);
            GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST);
        }
    };
    CommonRaidModel.prototype._MapOtherMove = function (rsp) {
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        raid.OtherMoveTo(rsp.id, rsp.x, rsp.y);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST);
    };
    CommonRaidModel.prototype._MapMove = function (mapId, x, y) {
        var Move = new Sproto.cs_map_move_request();
        Move.mapid = mapId;
        Move.x = x;
        Move.y = y;
        this.Rpc(C2sProtocol.cs_map_move, Move);
    };
    CommonRaidModel.prototype._cs_map_fly = function (mapId, x, y) {
        var Fly = new Sproto.cs_map_fly_request();
        Fly.mapid = mapId;
        Fly.x = x;
        Fly.y = y;
        this.Rpc(C2sProtocol.cs_map_fly, Fly);
    };
    CommonRaidModel.prototype._MapOtherFly = function (rsp) {
        // if (!this.raid) {
        // 	return
        // }
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        raid.FlyTo(rsp.id, rsp.x, rsp.y);
    };
    CommonRaidModel.prototype._PlayerUpdate = function (rsp) {
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        raid.UpdateOtherRole(rsp);
    };
    CommonRaidModel.prototype._PlayerStatus = function (rsp) {
        var raid = this.m_Raid[rsp.mapid];
        if (!raid) {
            return;
        }
        raid.UpdatePlayerStatus(rsp.id, rsp.status);
    };
    CommonRaidModel.prototype._MainCityInfo = function (rsp) {
        this.mMainCityInfo = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.MAIN_CITY_INFO);
    };
    // 离开场景，进入挂机地图
    CommonRaidModel.prototype.EnterNormapMap = function () {
        var raid = this.GetRaid();
        if (!raid) {
            return;
        }
        if (raid.mFbType == UserFb.FB_TYPE_CLOUD_NINE) {
            SubRoles.ins().GetRoleData().ClearTmpData();
        }
        this.ClearRaid();
        GameGlobal.ViewManagerImpl.CheckMainTop2Panel();
        GameGlobal.ViewManagerImpl.CheckPlayFunviewState();
        //返回挂机场景
        var data = new GameMapData;
        data.fubenID = GameGlobal.UserFb.config.sid;
        GameGlobal.RaidMgr.EnterNewMapRaid(data);
        console.log("已经退出");
    };
    CommonRaidModel.prototype.MapLeave = function () {
        var _this = this;
        var raid = this.GetRaid();
        if (!raid) {
            return;
        }
        raid.OnLeave();
        var mapId = new Sproto.cs_map_leave_request();
        mapId.mapid = raid.mMapId;
        this.Rpc(C2sProtocol.cs_map_leave, mapId, function (rsp) {
            if (rsp.ret) {
                _this.EnterNormapMap();
            }
        });
    };
    CommonRaidModel.prototype._MapGo = function (mapId) {
        var rsp = new Sproto.cs_map_enter_request();
        rsp.mapid = mapId;
        this.Rpc(C2sProtocol.cs_map_enter, rsp, function (rsp) {
            if (rsp.ret) {
                console.log("已经进入");
            }
        });
    };
    CommonRaidModel.prototype.SendEnterCity = function (lineNo) {
        var req = new Sproto.cs_map_maincity_enter_request;
        req.channelId = lineNo;
        this.Rpc(C2sProtocol.cs_map_maincity_enter, req, function (rsp) {
            if (!rsp.ret) {
                UserTips.ins().showTips("|C:0xdb0000&T:进入主城失败|");
            }
        }, this);
    };
    CommonRaidModel.prototype.SendWorship = function (type) {
        var req = new Sproto.cs_map_maincity_worship_request;
        req.type = type;
        this.Rpc(C2sProtocol.cs_map_maincity_worship, req, function (rsp) {
            if (rsp.ret) {
            }
        }, this);
    };
    CommonRaidModel.prototype.SendGetChannelInfo = function () {
        var _this = this;
        var req = new Sproto.cs_map_maincity_channel_info_request;
        this.Rpc(C2sProtocol.cs_map_maincity_channel_info, req, function (rsp) {
            _this.mChannelInfos = rsp.channels;
            GameGlobal.MessageCenter.dispatch(MessageDef.CHANNEL_UPDATE_INFO);
        }, this);
    };
    CommonRaidModel.prototype.GetPointSource = function (count) {
        var iconNum = 1;
        var iconPath = "";
        for (var key in GameGlobal.Config.CityXStateConfig) {
            var config = GameGlobal.Config.CityXStateConfig[key];
            if (config.range >= count) {
                iconNum = parseInt(key);
                break;
            }
        }
        switch (iconNum) {
            case 1:
                iconPath = "ui_zc_bm_xian_lv";
                break;
            case 2:
                iconPath = "ui_zc_bm_xian_huang";
                break;
            case 3:
                iconPath = "ui_zc_bm_xian_hong";
                break;
        }
        return iconPath;
    };
    CommonRaidModel.prototype.RefreshChannelList = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.CHANNEL_UPDATE_LIST);
    };
    CommonRaidModel.prototype.IsInCurMap = function (mapId) {
        return this.m_Raid[mapId] != null;
    };
    return CommonRaidModel;
}(BaseSystem));
__reflect(CommonRaidModel.prototype, "CommonRaidModel");
//# sourceMappingURL=CommonRaidModel.js.map