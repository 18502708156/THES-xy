var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Raid = (function () {
    function Raid() {
        this.mIsExit = false;
        this.mMySide = 0;
        this.mEntityList = {};
        this.m_DeltaTime = 0;
    }
    Raid.prototype.UpdateSetting = function (settingId) {
        for (var key in this.mEntityList) {
            var entity = this.mEntityList[key];
            if (!entity) {
                return;
            }
            entity.UpdateSetting(settingId);
        }
    };
    Raid.prototype.GetSpeed = function () {
        return 1;
    };
    Raid.prototype.Init = function () {
    };
    /**
     * 地图点击
     */
    Raid.prototype.OnMapClick = function (localX, localY) {
    };
    Raid.prototype.DoUpdate = function (delta) {
        if (this.IsBackground()) {
            this.m_DeltaTime += delta;
            if (this.m_DeltaTime < 250) {
                return;
            }
            delta = this.m_DeltaTime;
            this.m_DeltaTime = 0;
        }
        else {
            if (this.m_DeltaTime) {
                delta = this.m_DeltaTime + delta;
                this.m_DeltaTime = 0;
            }
        }
        this.Update(delta);
    };
    /**
     * 更新
     */
    Raid.prototype.Update = function (delta) {
    };
    /**
     * 进入
     */
    Raid.prototype.OnEnter = function () {
        this.m_DeltaTime = 0;
    };
    /**
     * 退出
     */
    Raid.prototype.OnExit = function () {
    };
    Raid.prototype.OnBackground = function () {
    };
    Raid.prototype.OnForeground = function () {
    };
    Raid.prototype.IsBackground = function () {
        return false;
    };
    /**
     * 移除所以实体
     */
    Raid.prototype.RemoveAllEntity = function () {
        for (var key in this.mEntityList) {
            var unit = this.mEntityList[key];
            unit.Dispose();
            ObjectPool.push(unit);
        }
        this.mEntityList = {};
    };
    /**
     * 移除实体
     */
    Raid.prototype.RemoveEntity = function (handle) {
        var unit = this.mEntityList[handle];
        if (!unit) {
            return false;
        }
        unit.Dispose();
        ObjectPool.push(unit);
        delete this.mEntityList[handle];
        return true;
    };
    Raid.prototype.CalcEntityTeam = function (entityData) {
        if (entityData.masterHandle) {
            if (entityData.masterHandle == GameGlobal.actorModel.actorID) {
                return Team.My;
            }
            if (SubRoles.ins().GetRoleData() && entityData.masterHandle == SubRoles.ins().GetRoleData().handle) {
                return Team.My;
            }
        }
        if (entityData.side != 0 && this.mMySide != 0 && entityData.side == this.mMySide) {
            return Team.My;
        }
        if (entityData.type == EntityType.Monster) {
            return Team.Monster;
        }
        return Team.WillEntity;
    };
    Raid.prototype.AddEntity = function (entityData) {
        var entity = ObjectPool.pop("MapEntity");
        entity.Init(this, entityData);
        this.mEntityList[entity.GetHandle()] = entity;
        return entity;
    };
    Raid.prototype.GetEntityNameStyle = function (info) {
        return info.GetName();
    };
    Raid.prototype.GetEntityNameStyleSvr = function (info) {
        return GameString.GetSerAndName(info.serverId, info.GetName());
    };
    Raid.prototype.GetEntity = function (handle) {
        return this.mEntityList[handle];
    };
    Raid.prototype.CreateEntity = function (entityData) {
        return null;
    };
    Raid.prototype.DoExitFb = function () {
        return false;
    };
    Raid.prototype.getMainRole = function () {
        var role = SubRoles.ins().GetRoleData();
        if (!role) {
            return null;
        }
        return this.mEntityList[SubRoles.ins().GetRoleData().handle];
    };
    Raid.prototype.getNoDieRole = function () {
        return this.getMainRole();
    };
    Raid.prototype.GetLookAtRole = function () {
        var role = this.getNoDieRole();
        if (role) {
            return role;
        }
        return null;
    };
    Raid.prototype.FinishBattle = function () {
    };
    Raid.prototype.GetTurnId = function () {
        return 1;
    };
    return Raid;
}());
__reflect(Raid.prototype, "Raid");
//# sourceMappingURL=BaseRaid.js.map