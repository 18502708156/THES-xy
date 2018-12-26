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
var MapRaidGangBoss = (function (_super) {
    __extends(MapRaidGangBoss, _super);
    function MapRaidGangBoss() {
        var _this = _super.call(this) || this;
        _this.mIsShowGuild = true;
        _this.m_HelpId = 31;
        _this.mAcrossBossBox = {};
        _this.mSelList = [];
        return _this;
    }
    MapRaidGangBoss.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    MapRaidGangBoss.prototype.GetRebornData = function () {
        return GameGlobal.Config.GuildBossBaseConfig.revivecost;
    };
    MapRaidGangBoss.prototype.UpdateSel = function (index, list) {
        this.mSelList = list;
        if (index == 0) {
            this.HideBoss();
        }
        else if (index == 2) {
            this.AutoChallenge();
        }
    };
    MapRaidGangBoss.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.mPreState = GameGlobal.GangBossModel.status;
        var view = new GangBossSceneView(this);
        this.AddView(view);
        this.SetRebornCheckbox(view.checkBox3);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBOSS_BOX, this.UpdateBox, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBOSS_BOX_COLLENT, this.UpdateBoxBar, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBOSS_UPDATE_INFO, this.UpdateState, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBOSS_DEAD, this.UpdateDead, this);
        this.UpdateBox(true);
        this.UpdateBoxBar();
        var state = GameGlobal.GangBossModel.status;
        if (state == AcrossBossState.BOSS) {
            this.CreateBossModel();
        }
        else if (state == AcrossBossState.KILL || state == AcrossBossState.REBORNING) {
            this.RemoveBoss();
        }
        this.UpdateDead();
    };
    MapRaidGangBoss.prototype.Create = function (entityData) {
        var entity = _super.prototype.Create.call(this, entityData);
        if (entity) {
            entity.SetClick();
        }
        return entity;
    };
    MapRaidGangBoss.prototype.GetEntityNameStyle = function (info) {
        return this.GetEntityNameStyleSvr(info);
    };
    MapRaidGangBoss.prototype.MoveOrder = function (orderId, localX, localY, offset) {
        if (offset === void 0) { offset = 0; }
        var ret = _super.prototype.MoveOrder.call(this, orderId, localX, localY, offset);
        // 有移动指令，有采集，取消采集
        var box = GameGlobal.GangBossModel.mCollectNow;
        for (var key in box) {
            for (var _i = 0, _a = box[key]; _i < _a.length; _i++) {
                var data = _a[_i];
                if (data.playerid == GameGlobal.actorModel.actorID) {
                    GameGlobal.GangBossModel.RemoveCollentBox();
                    return ret;
                }
            }
        }
        return ret;
    };
    MapRaidGangBoss.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        GameGlobal.MessageCenter.removeAll(this);
    };
    MapRaidGangBoss.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        var bossBox = this.mAcrossBossBox;
        for (var key in bossBox) {
            bossBox[key].DoRemoved();
            delete bossBox[key];
        }
        this.mAcrossBossBox = {};
        this.mBossHandle = 0;
        GameGlobal.GangBossModel.ClearData();
    };
    MapRaidGangBoss.prototype.UpdateState = function () {
        var state = GameGlobal.GangBossModel.status;
        if (state == AcrossBossState.BOSS) {
            this.CreateBossModel();
            this.AutoChallenge();
        }
        else if (state == AcrossBossState.KILL || state == AcrossBossState.REBORNING) {
            this.RemoveBoss();
        }
        this.mPreState = state;
    };
    MapRaidGangBoss.prototype.RemoveBoss = function () {
        if (this.mBossHandle) {
            this.RemoveEntity(this.mBossHandle);
            this.mBossHandle = null;
        }
        if (this.mBossDeadImgHandle)
            return;
        var config = GameGlobal.Config.GuildBossBaseConfig;
        this.mBossDeadImgHandle = this.CreateImage("bossshiwang", config.bossbron[0] - 180, config.bossbron[1] - 160, false);
    };
    MapRaidGangBoss.prototype.CreateBossModel = function () {
        if (this.mBossDeadImgHandle) {
            this.RemoveEntity(this.mBossDeadImgHandle);
            this.mBossDeadImgHandle = null;
        }
        if (this.mBossHandle) {
            return;
        }
        var config = GameGlobal.Config.GuildBossBaseConfig;
        var mons = this.CreateMonster(config.bossid, config.bossbron[0], config.bossbron[1]);
        if (mons) {
            this.mBossHandle = mons.GetHandle();
            mons.SetClick();
            if (this.mSelList[0]) {
                mons.visible = false;
            }
        }
    };
    // 角色点击之前的时间
    MapRaidGangBoss.prototype.OnPreEntityClick = function (handle) {
        var entity = this.GetEntity(handle);
        if (entity && entity.m_Info && entity.m_Info.guildID == GameGlobal.actorModel.guildID) {
            UserTips.InfoTip("不能挑战同帮会玩家");
            return false;
        }
        return true;
    };
    MapRaidGangBoss.prototype.OnEntityClick = function (handle) {
        var entity = this.GetEntity(handle);
        if (!entity) {
            return;
        }
        this.MoveOrder(handle, entity.x, entity.y);
    };
    MapRaidGangBoss.prototype.UpdateBox = function (notPlay) {
        if (notPlay === void 0) { notPlay = false; }
        var box = GameGlobal.GangBossModel.mBox;
        var bossBox = this.mAcrossBossBox;
        for (var key in bossBox) {
            if (!box[key]) {
                bossBox[key].DoRemoved();
                delete bossBox[key];
            }
        }
        for (var key in box) {
            if (!bossBox[key]) {
                var item = bossBox[key] = new AcrossBossBox(box[key], GameGlobal.Config.GuildBossBaseConfig.coltime);
                item.OnAdded(notPlay);
            }
        }
    };
    /*移动事件结束回掉*/
    MapRaidGangBoss.prototype.OnMoveLeval = function (orderId, handle, taget_x, taget_y) {
        if (GameGlobal.actorModel.actorID != handle) {
            return;
        }
        // 点击的是盒子
        var box = this.mAcrossBossBox[orderId];
        if (box) {
            GameGlobal.GangBossModel.sendCollectBox(orderId);
            return;
        }
        // 点击boss
        if (this.mBossHandle == orderId) {
            GameGlobal.GangBossModel.sendChallenge(null);
            return;
        }
        // 点击其它玩家
        var entity = this.GetEntity(orderId);
        if (entity) {
            GameGlobal.GangBossModel.sendChallenge(orderId);
            return;
        }
    };
    // 我的采集时间
    MapRaidGangBoss.prototype.GetMyBoxBar = function () {
        var actorId = GameGlobal.actorModel.actorID;
        var nows = GameGlobal.GangBossModel.mCollectNow;
        for (var key in nows) {
            for (var _i = 0, _a = nows[key]; _i < _a.length; _i++) {
                var data = _a[_i];
                if (data.playerid == actorId && data.time > GameServer.serverTime) {
                    return data.time;
                }
            }
        }
        return null;
    };
    MapRaidGangBoss.prototype.UpdateBoxBar = function () {
        var nows = GameGlobal.GangBossModel.mCollectNow;
        var boxs = this.mAcrossBossBox;
        for (var id in boxs) {
            var box = boxs[id];
            if (!nows[id]) {
                box.RemoveBar();
                continue;
            }
            box.ShowBars(nows[id]);
        }
    };
    MapRaidGangBoss.prototype.GetRebornYb = function () {
        return GameGlobal.Config.GuildBossBaseConfig.revivecost;
    };
    MapRaidGangBoss.prototype.SendRelive = function () {
        GameGlobal.GangBossModel.sendRelive();
    };
    MapRaidGangBoss.prototype.UpdateDead = function () {
        var time = GameGlobal.GangBossModel.GetDeadTime();
        if (time > 0) {
            this.ShowRebornView(time);
        }
        else {
            this.RemoveRebornView();
            this.AutoChallenge();
        }
    };
    // 自动挑战
    MapRaidGangBoss.prototype.AutoChallenge = function () {
        if (this.mSelList[2] && this.mBossHandle) {
            this.OnEntityClick(this.mBossHandle);
        }
    };
    MapRaidGangBoss.prototype.HideBoss = function () {
        var entity = this.GetEntity(this.mBossHandle);
        if (entity) {
            entity.visible = this.mSelList[0] ? false : true;
        }
    };
    return MapRaidGangBoss;
}(CommonMapRaid));
__reflect(MapRaidGangBoss.prototype, "MapRaidGangBoss");
//# sourceMappingURL=MapRaidGangBoss.js.map