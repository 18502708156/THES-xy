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
var CommonMapRaid = (function (_super) {
    __extends(CommonMapRaid, _super);
    function CommonMapRaid() {
        var _this = _super.call(this) || this;
        _this.m_IsAutoReborn = false;
        _this.m_CreateGapSetting = 0.07;
        _this.m_CreateGap = 0;
        return _this;
    }
    CommonMapRaid.prototype.GetSceneId = function () {
        return GameGlobal.Config.MapConfig[this.mMapId].scenes[0];
    };
    /**
     * 向场景界面添加一个视图
     */
    CommonMapRaid.prototype.AddView = function (view) {
        var panel = this.GetGameMapPanel();
        if (!panel) {
            console.error("not GameMapPanel !!!");
            return;
        }
        panel.AddChildBaseView(view);
    };
    CommonMapRaid.prototype.OnBackground = function () {
        _super.prototype.OnBackground.call(this);
        this.OnHideView();
    };
    CommonMapRaid.prototype.OnForeground = function () {
        _super.prototype.OnForeground.call(this);
        this.OnShowView();
    };
    CommonMapRaid.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        this.m_CreateGap = 0;
        this.m_CreatePlayerList = null;
    };
    CommonMapRaid.prototype.OnShowView = function () {
        LayerManager.UI_GAME_MAP.visible = true;
    };
    CommonMapRaid.prototype.OnHideView = function () {
        LayerManager.UI_GAME_MAP.visible = false;
    };
    CommonMapRaid.prototype.SetSelectEntity = function (handle) {
        var panel = this.GetGameMapPanel();
        if (panel) {
            panel.SetSelect(handle);
        }
    };
    CommonMapRaid.prototype.ClearSelectEntity = function (handle) {
        var panel = this.GetGameMapPanel();
        if (panel) {
            panel.ClearSelectEntity(handle);
        }
    };
    CommonMapRaid.prototype.IsIsAutoReborn = function () {
        return this.m_IsAutoReborn;
    };
    /** 设置状态 */
    CommonMapRaid.prototype.SetCheckState = function (state) {
        this.m_IsAutoReborn = state;
        if (this.m_RebornCheckbox) {
            this.m_RebornCheckbox.selected = state;
        }
    };
    /** 设置自动复活的复选框 */
    CommonMapRaid.prototype.SetRebornCheckbox = function (box) {
        if (!box) {
            return;
        }
        if (this.m_RebornCheckbox) {
            this.m_RebornCheckbox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this);
            this.m_RebornCheckbox = null;
        }
        this.m_RebornCheckbox = box;
        this.m_RebornCheckbox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this);
    };
    /** 复选框点击事件 */
    CommonMapRaid.prototype._OnClickReborn = function () {
        var _this = this;
        if (!this.m_RebornCheckbox) {
            return;
        }
        var ybData = this.GetRebornYb();
        if (!ybData) {
            console.error("没有设置复活消耗数据");
            return;
        }
        if (!this.m_RebornCheckbox.selected) {
            this.SetCheckState(false);
            UserTips.ins().showTips("已取消挑战中自动复活");
            return;
        }
        var str = MoneyConstToName[ybData.id];
        var count = ybData.count;
        WarnWin.show("确定要在被击败时自动复活吗？<font color='#019704'>\n每次复活将消耗" + count + str + "</font>", function () {
            if (!_this.m_RebornCheckbox) {
                return;
            }
            if (Checker.Money(ybData.id, ybData.count)) {
                UserTips.ins().showTips("已开启挑战中自动复活");
                _this.SetCheckState(true);
            }
            else {
                _this.SetCheckState(false);
            }
        }, this, function () {
            _this.SetCheckState(false);
        }, this);
    };
    /** 复活消耗 */
    CommonMapRaid.prototype.GetRebornYb = function () {
        return null;
    };
    /** 复活方法 */
    CommonMapRaid.prototype.SendRelive = function () {
    };
    /**
     * 显示复活界面
     * @param time 	复活时间
     */
    CommonMapRaid.prototype.ShowRebornView = function (time) {
        var _this = this;
        var data = this.GetRebornYb();
        if (!data) {
            console.error("没有设置复活消耗数据");
            return;
        }
        if (this.m_IsAutoReborn) {
            if (Checker.Money(data.id, data.count)) {
                this.SendRelive();
                return;
            }
            else {
                this.SetCheckState(false);
            }
        }
        var panel = this.GetGameMapPanel();
        if (!panel) {
            console.error("not GameMapPanel !!!");
            return;
        }
        panel.ShowRebornView(time, data, function () {
            _this.SendRelive();
        });
    };
    CommonMapRaid.prototype.RemoveRebornView = function () {
        var panel = this.GetGameMapPanel();
        if (!panel) {
            return;
        }
        panel.RemoveRebornView();
    };
    CommonMapRaid.prototype.GetGameMapPanel = function () {
        var panel = ViewManager.ins().getView(GameMapPanel);
        if (!panel) {
            return;
        }
        return panel;
    };
    CommonMapRaid.prototype.Update = function (delta) {
        _super.prototype.Update.call(this, delta);
        if (this.m_CreatePlayerList) {
            if ((this.m_CreateGap += delta) >= this.m_CreateGapSetting) {
                this.m_CreateGap = 0;
                var data = this.m_CreatePlayerList.pop();
                if (data) {
                    this.CreateRole(data);
                }
                if (!this.m_CreatePlayerList.length) {
                    this.m_CreatePlayerList = null;
                    this.m_CreateGap = 0;
                }
            }
        }
    };
    CommonMapRaid.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.DoEnter();
    };
    CommonMapRaid.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        this.DoExit();
    };
    CommonMapRaid.prototype.DoEnter = function () {
        var view = ViewManager.ins().open(GameMapPanel);
        view.mRaid = this;
        view.visible = this.IsBackground() ? false : true;
        LayerManager.UI_GAME_MAP.visible = view.visible;
        view.SetHelpId(this.m_HelpId);
    };
    CommonMapRaid.prototype.DoExit = function () {
        ViewManager.ins().close(GameMapPanel);
        if (this.m_RebornCheckbox) {
            this.m_RebornCheckbox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this);
            this.m_RebornCheckbox = null;
        }
    };
    CommonMapRaid.prototype.GetMyTeam = function () {
        return this.cTeam[GameGlobal.actorModel.actorID];
    };
    CommonMapRaid.prototype.OnMapClick = function (localX, localY) {
        var ret = _super.prototype.OnMapClick.call(this, localX, localY);
        if (ret) {
            GameGlobal.CommonRaidModel._MapMove(this.mMapId, localX, localY);
            GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST);
        }
        return ret;
    };
    /**
     * 其它玩家的移动
     */
    CommonMapRaid.prototype.OtherMoveTo = function (handle, localX, localY) {
        if (!this.cTeam[handle] || handle == GameGlobal.actorModel.actorID) {
            return;
        }
        this.cTeam[handle].MoveTo(MoveTeam.NONE_ORDER, localX, localY, 0, this.IsBackground());
    };
    CommonMapRaid.prototype.FlyTo = function (handle, localX, localY) {
        if (!this.cTeam[handle]) {
            return;
        }
        this.cTeam[handle].FlyTo(localX, localY);
    };
    CommonMapRaid.prototype.CreateMyRole = function (player) {
        var list = [];
        var entityRole = new EntityRole;
        entityRole.parserBase({
            ownerid: player.id,
            handler: player.id,
            type: EntityType.Role,
            shows: {
                job: player.job,
                sex: player.sex,
                shows: player.shows,
                serverid: player.serverid,
                guildname: player.guildname,
                guildid: player.guildid,
            },
        });
        entityRole.x = Const.PosToPixel(player.x);
        entityRole.y = Const.PosToPixel(player.y);
        entityRole.entityName = player.name;
        list.push(entityRole);
        this.AddTeam(player.id, list);
    };
    CommonMapRaid.prototype.CreateRoleList = function (players) {
        this.m_CreatePlayerList = players || [];
        this.m_CreateGap = 0;
    };
    CommonMapRaid.prototype.CreateRole = function (player) {
        var list = [];
        var entityRole = new EntityRole;
        entityRole.parserBase({
            ownerid: player.id,
            handler: player.id,
            type: EntityType.Role,
            shows: {
                job: player.job,
                sex: player.sex,
                shows: player.shows,
                serverid: player.serverid,
                guildname: player.guildname,
                guildid: player.guildid,
            },
        });
        entityRole.x = player.x;
        entityRole.y = player.y;
        entityRole.entityName = player.name;
        list.push(entityRole);
        this.AddTeam(player.id, list);
    };
    CommonMapRaid.prototype.CreateMyShapeShiftRole = function () {
    };
    CommonMapRaid.prototype.CreateTeam = function () {
        return new CommonMoveTeam;
    };
    CommonMapRaid.prototype.RemoveEntity = function (handle) {
        var entity = this.mEntityList[handle];
        if (entity) {
            var teamHandle = entity.mTeamHandle;
            if (teamHandle) {
                var team = this.cTeam[teamHandle];
                if (team) {
                    team.RemoveMem(handle);
                    if (team.mMember.length < 1) {
                        this.DismissTeam(teamHandle);
                    }
                }
                else {
                    delete this.cTeam[teamHandle];
                }
            }
        }
        return _super.prototype.RemoveEntity.call(this, handle);
    };
    CommonMapRaid.prototype.GetTeamModel = function () {
        return null;
    };
    CommonMapRaid.prototype.DelayUpdateTeam = function () {
        var teamModel = this.GetTeamModel();
        if (!teamModel) {
            return;
        }
        TimerManager.ins().doTimer(400, 1, this.UpdateTeam, this);
    };
    CommonMapRaid.prototype.UpdateTeam = function () {
        var teamModel = this.GetTeamModel();
        if (!teamModel) {
            return;
        }
        var entityList = {};
        for (var key in this.mEntityList) {
            entityList[Number(key)] = true;
        }
        var teamList = {};
        for (var key in this.cTeam) {
            teamList[Number(key)] = true;
        }
        var data = teamModel.GetAllTeam();
        for (var key in teamList) {
            // 已经不存在的队伍，清除数据
            if (!data[key]) {
                this.DismissTeam(Number(key));
            }
        }
        for (var key in data) {
            var teamId = Number(key);
            var memIds = data[key];
            for (var _i = 0, memIds_1 = memIds; _i < memIds_1.length; _i++) {
                var id = memIds_1[_i];
                if (entityList[id]) {
                    delete entityList[id];
                }
            }
            if (this.cTeam[teamId]) {
                this.UpdateTeamEntityList(teamId, memIds);
            }
            else {
                var list = [];
                for (var _a = 0, memIds_2 = memIds; _a < memIds_2.length; _a++) {
                    var id = memIds_2[_a];
                    var entity = this.GetEntity(id);
                    if (entity) {
                        list.push(entity);
                    }
                    this.CreateTeamData(teamId, list);
                }
            }
        }
        // 给不存在队伍的对象一个自己的队伍
        for (var id in entityList) {
            var handle = Number(id);
            var entity = this.GetEntity(handle);
            if (entity) {
                this.CreateTeamData(handle, [entity]);
            }
        }
    };
    CommonMapRaid.prototype.UpdateTeamEntityList = function (teamId, memIds) {
        var team = this.cTeam[teamId];
        if (!team) {
            return;
        }
        var memKeys = {};
        for (var _i = 0, memIds_3 = memIds; _i < memIds_3.length; _i++) {
            var id = memIds_3[_i];
            memKeys[id] = true;
        }
        var memHandle = {};
        for (var _a = 0, _b = team.mMember; _a < _b.length; _a++) {
            var mem = _b[_a];
            if (mem.mTarget) {
                memHandle[mem.mTarget.GetHandle()] = true;
            }
        }
        for (var key in memHandle) {
            var handle = Number(key);
            if (!memKeys[handle]) {
                team.RemoveMem(handle);
            }
        }
        for (var key in memKeys) {
            var handle = Number(key);
            if (!memHandle[handle]) {
                var entity = this.GetEntity(handle);
                if (entity) {
                    if (entity.mTeamHandle) {
                        var oldTeam = this.cTeam[entity.mTeamHandle];
                        if (oldTeam) {
                            oldTeam.RemoveMem(handle);
                        }
                    }
                    team.AddEntity(entity);
                }
            }
        }
    };
    return CommonMapRaid;
}(MapRaid));
__reflect(CommonMapRaid.prototype, "CommonMapRaid");
//# sourceMappingURL=CommonMapRaid.js.map