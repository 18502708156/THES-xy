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
var MapRaid = (function (_super) {
    __extends(MapRaid, _super);
    function MapRaid() {
        var _this = _super.call(this) || this;
        _this.mMapId = 0;
        _this.mObjects = {};
        // public mTeam: MoveTeam[] = []
        _this.cTeam = {};
        return _this;
    }
    MapRaid.prototype.GetSceneId = function () {
        return 0;
    };
    MapRaid.prototype.IsBackground = function () {
        return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_NORMAL;
    };
    MapRaid.prototype.OnMapClick = function (localX, localY) {
        return this.MoveOrder(MoveTeam.NONE_ORDER, localX, localY);
    };
    MapRaid.prototype.GetMyTeam = function () {
        return this.cTeam[GameGlobal.actorModel.actorID];
    };
    /**
     * 移动指令
     * @param 	MoveTeam.NONE_ORDER or null	地图点击的指令
     * 			其它
     * @param	像素
     * @param	像素
     * @param	目的点偏移
     */
    MapRaid.prototype.MoveOrder = function (orderId, localX, localY, offset) {
        if (offset === void 0) { offset = 0; }
        var team = this.GetMyTeam();
        if (team) {
            team.MoveTo(orderId, localX, localY, offset, this.IsBackground());
            return true;
        }
        else {
            // UserTips.InfoTip("")
            console.log("队长才能移动");
        }
        return false;
    };
    MapRaid.prototype.Create = function (entityData) {
        if (this.mEntityList[entityData.handle]) {
            console.warn("重复添加对象 handle => " + entityData.handle);
            return null;
        }
        entityData.team = this.CalcEntityTeam(entityData);
        switch (entityData.type) {
            case EntityType.Role:
                var roleModel = entityData;
                if (entityData.team == Team.My) {
                    //把属性数据合拼到子角色信息里`
                    var role = GameGlobal.SubRoles.GetRoleData();
                    if (role) {
                        entityData = role.MergeData(roleModel);
                    }
                    else {
                        console.error('my team not my role => ');
                    }
                }
                break;
            case EntityType.Monster:
                break;
            case EntityType.Pet:
                break;
        }
        var entity = this.AddEntity(entityData);
        // 隐藏其它玩家
        var hideEntity = entityData.team == Team.WillEntity && FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER);
        if (!hideEntity) {
            this.AddToMap(entity);
        }
        entity.SetPos(entityData.x || 0, entityData.y || 0);
        return entity;
    };
    MapRaid.prototype.AddToMap = function (entity) {
        if (entity.GetTeam() == Team.WillEntity) {
            var count = 0;
            for (var key in this.mEntityList) {
                var data = this.mEntityList[key];
                if (data.GetTeam() == Team.WillEntity) {
                    ++count;
                }
            }
            if (count > MapRaid.MAX_ENTITY_COUNT) {
                return;
            }
            if (count > MapRaid.MAX_SHOW_COUNT) {
                if (entity.m_Model) {
                    entity.m_Model.SetMaxCountState(true);
                }
            }
        }
        this.GetMapEntityView().AddEntity(entity);
    };
    MapRaid.prototype.AddTeam = function (handle, entityDatas) {
        // 偏移坐标
        for (var i = 1; i < entityDatas.length; i++) {
            entityDatas[i].x = entityDatas[i - 1].x - 50;
            entityDatas[i].y = entityDatas[i - 1].y;
        }
        var list = [];
        for (var _i = 0, entityDatas_1 = entityDatas; _i < entityDatas_1.length; _i++) {
            var entityData = entityDatas_1[_i];
            var entity = this.Create(entityData);
            if (entity) {
                list.push(entity);
            }
        }
        if (!list.length) {
            return;
        }
        this.CreateTeamData(handle, list);
    };
    MapRaid.prototype.AddEntityToTeamByHandle = function (handle, entityData) {
        var team = this.cTeam[handle];
        if (team) {
            this.AddEntityToTeam(team, entityData);
        }
    };
    MapRaid.prototype.AddEntityToTeam = function (team, entityData) {
        var entity = this.Create(entityData);
        if (!entity) {
            return;
        }
        team.AddEntity(entity);
    };
    MapRaid.prototype.CreateTeam = function () {
        return new MoveTeam;
    };
    MapRaid.prototype.CreateEntity = function (entityData) {
        return this.Create(entityData);
    };
    MapRaid.prototype.Update = function (delta) {
        for (var key in this.cTeam) {
            this.cTeam[key].Update(delta);
        }
        if (this.IsBackground()) {
            return;
        }
        GameMap.GetMap().LookAt(this.GetLookAtRole());
    };
    MapRaid.prototype.Init = function () {
        GameMap.UpdateScene();
    };
    MapRaid.prototype.OnForeground = function () {
        GameMap.UpdateScene();
        GameMap.GetMap().LookAt(this.GetLookAtRole());
    };
    MapRaid.prototype.OnEnter = function () {
        GameGlobal.RaidMgr.UpdateBGM();
        this.GetMapEntityView().AddEntityLayer();
        GameMap.GetMap().LookAt(this.GetLookAtRole());
    };
    MapRaid.prototype.OnExit = function () {
        this.GetMapEntityView().RemoveEntityLayer();
    };
    MapRaid.prototype.GetMapEntityView = function () {
        return GameMap.GetMap().mMapEntityView;
    };
    /**
     * 清理场景
     */
    MapRaid.prototype.Clear = function () {
        this.GetMapEntityView().RemoveDropLayer();
        this.RemoveAllEntity();
        this.cTeam = {};
        this.mObjects = {};
        GameGlobal.MessageCenter.removeAll(this);
        TimerManager.ins().removeAll(this);
    };
    // 解散队伍信息，并不清除实体信息
    MapRaid.prototype.DismissTeam = function (handle) {
        var team = this.cTeam[handle];
        if (team) {
            team.Clear();
            delete this.cTeam[handle];
        }
        else {
            console.warn("解散不存在的队伍 => " + handle);
        }
    };
    MapRaid.prototype.CreateTeamData = function (handle, list) {
        var team = this.CreateTeam();
        team.mMasterHandle = handle;
        team.Init(list);
        this.cTeam[handle] = team;
    };
    // public UpdateEntityTeam(teamHandle: number, memIds: number[]) {
    // 	let memKeys = {}
    // 	for (let id of memIds) {
    // 		memKeys[id] = true
    // 	}
    // 	let team = this.GetTeam(teamHandle)
    // 	if (team) {
    // 		let memHandle = {}
    // 		for (let mem of team.mMember) {
    // 			if (mem.mTarget) {
    // 				memHandle[mem.mTarget.GetHandle()] = true
    // 			}
    // 		}
    // 		for (let key in memHandle) {
    // 			let handle = Number(key)
    // 			if (!memKeys[handle]) {
    // 				team.RemoveMem(handle)
    // 			}
    // 		}
    // 		for (let key in memKeys) {
    // 			let handle = Number(key)
    // 			if (!memHandle[handle]) {
    // 				let entity = this.GetEntity(handle)
    // 				if (entity) {
    // 					team.AddEntity(entity)
    // 				}
    // 			}
    // 		}
    // 	} else {
    // 	}
    // }
    /**
     * 创建一个怪物对象
     * 怪物id
     * x：像素坐标
     * y：像素坐标
     * @return 对象的唯一id
     */
    MapRaid.prototype.CreateMonster = function (monsterId, x, y) {
        var config = GameGlobal.Config.MonstersConfig[monsterId];
        if (!config) {
            console.warn("not monster id => " + monsterId);
            return;
        }
        var data = MonstersConfig.CreateModel(config);
        data.x = x;
        data.y = y;
        var entity = this.Create(data);
        if (!entity) {
            console.warn("create monster failure => " + monsterId);
            return null;
        }
        entity.UpdateAction(EntityClipType.STAND, false);
        return entity;
    };
    /**
     * 创建一个图片对象
     * 图片资源名
     * x：像素坐标
     * y：像素坐标
     * @return 对象的唯一id
     */
    MapRaid.prototype.CreateImage = function (imageName, x, y, touchEnabled) {
        if (touchEnabled === void 0) { touchEnabled = true; }
        var img = new eui.Image;
        img.source = imageName;
        img.touchEnabled = touchEnabled;
        return this.CreateObject(img, x, y);
    };
    /**
     * 创建一个静态对象
     * x：像素坐标
     * y：像素坐标
     * @return 对象的唯一id
     */
    MapRaid.prototype.CreateObject = function (obj, x, y) {
        var img = obj;
        var id = MonstersConfig.GetHandle();
        img.name = id + "";
        img.x = x;
        img.y = y;
        img.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var mapRaid = GameGlobal.RaidMgr.GetCurMapRaid();
            mapRaid.OnEntityClick(Number(this.name));
        }, img);
        this.mObjects[id] = img;
        this.GetMapEntityView().AddDrop(img);
        return id;
    };
    MapRaid.prototype.RemoveEntity = function (handle) {
        var ret = _super.prototype.RemoveEntity.call(this, handle);
        if (!ret) {
            var obj = this.mObjects[handle];
            if (obj) {
                if (obj["Dispose"]) {
                    obj["Dispose"]();
                }
                DisplayUtils.removeFromParent(obj);
                delete this.mObjects[handle];
            }
        }
        return ret;
    };
    MapRaid.prototype.UpdatePlayerStatus = function (id, status) {
        var entity = this.mEntityList[id];
        if (!entity) {
            return;
        }
        entity.ChageStatus(status);
    };
    MapRaid.prototype.SetSelectEntity = function (handle) {
    };
    MapRaid.prototype.ClearSelectEntity = function (handle) {
    };
    /***************************************************************************
     * 副本事件
     */
    /*移动事件结束回掉*/
    MapRaid.prototype.OnMoveLeval = function (orderId, handle, taget_x, taget_y) {
    };
    // 角色点击之前的时间
    MapRaid.prototype.OnPreEntityClick = function (handle) {
        return true;
    };
    // 角色点击
    MapRaid.prototype.OnEntityClick = function (handle) {
    };
    //  退出场景回调
    MapRaid.prototype.OnLeave = function () {
    };
    //是否隐藏其他角色
    MapRaid.prototype.IsShowOther = function (bool) {
        for (var key in this.mEntityList) {
            var entity = this.mEntityList[key];
            if (!entity) {
                continue;
            }
            if (entity.GetInfo().team != Team.WillEntity) {
                continue;
            }
            if (!entity.parent) {
                this.AddToMap(entity);
            }
            else {
                DisplayUtils.removeFromParent(entity);
            }
        }
    };
    MapRaid.prototype.ShapeShift = function (handle, id) {
        if (!this.mEntityList[handle]) {
            return;
        }
        var model = this.mEntityList[handle].m_Model;
        if (!model) {
            return;
        }
        model.SetReplaceBody(id);
    };
    MapRaid.prototype.replyShapeShift = function (handle) {
        if (!this.mEntityList[handle]) {
            return;
        }
        var model = this.mEntityList[handle].m_Model;
        if (!model) {
            return;
        }
        var BodyId = this.mEntityList[handle].m_Info.GetBodyId();
        model.SetReplaceBody(null);
    };
    MapRaid.prototype.UpdateRole = function () {
        var handle = SubRoles.ins().GetRoleData().handle;
        var role = this.mEntityList[handle];
        if (role) {
            role.UpdateInfo();
        }
    };
    MapRaid.prototype.UpdateOtherRole = function (rsp) {
        var entity = this.mEntityList[rsp.id];
        if (!entity) {
            return;
        }
        if (!rsp.player) {
            return;
        }
        var info = entity.GetInfo();
        if (!info || info.type != EntityType.Role) {
            return;
        }
        // 自己的角色
        if (info.handle == GameGlobal.actorModel.actorID) {
            // 九重天需要更新临时称号
            if (this.mFbType == UserFb.FB_TYPE_CLOUD_NINE) {
                var show_1 = rsp.player.shows || [];
                info.mTitle = show_1[RoleShowDataType.ROLE_TITLE] || 0;
                entity.UpdateInfo();
            }
            return;
        }
        var show = rsp.player.shows || [];
        info.mBodyId = show[RoleShowDataType.ROLE_SKIN] || 0;
        info.mRideId = show[RoleShowDataType.ROLE_RIDE] || 0;
        info.mWingId = show[RoleShowDataType.ROLE_WING] || 0;
        info.mTianxianId = show[RoleShowDataType.ROLE_TIANXIAN] || 0;
        info.mSwordId = show[RoleShowDataType.ROLE_SWORD] || 0;
        info.mTitle = show[RoleShowDataType.ROLE_TITLE] || 0;
        entity.UpdateInfo();
    };
    // 最大实体模型显示数量
    MapRaid.MAX_SHOW_COUNT = 12;
    // 最大实体显示数量
    MapRaid.MAX_ENTITY_COUNT = 25;
    return MapRaid;
}(Raid));
__reflect(MapRaid.prototype, "MapRaid");
//# sourceMappingURL=MapRaid.js.map