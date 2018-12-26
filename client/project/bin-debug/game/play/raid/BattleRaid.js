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
var BattleRaid = (function (_super) {
    __extends(BattleRaid, _super);
    function BattleRaid() {
        var _this = _super.call(this) || this;
        _this.mIsPlot = 0;
        // 录像副本
        _this.mIsVideo = false;
        // 手动副本
        _this.mIsManual = false;
        _this.mEntityDatas = [];
        _this.m_AllTurnData = [];
        _this.m_TurnData = [];
        _this.m_TurnIndex = -1;
        _this.m_TurnId = 0;
        _this.m_StartTime = 1;
        _this.m_IsEnter = false;
        return _this;
    }
    BattleRaid.prototype.GetSpeed = function () {
        return SystemSettingPanel.GetSpeed();
    };
    BattleRaid.prototype.IsBackground = function () {
        return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_NORMAL;
    };
    BattleRaid.prototype.OnBackground = function () {
        if (this.mBattlePanel) {
            this.mBattlePanel.visible = false;
        }
    };
    BattleRaid.prototype.OnForeground = function () {
        if (this.mBattlePanel) {
            this.mBattlePanel.visible = true;
        }
    };
    BattleRaid.prototype.FinishBattle = function () {
        var data = this.m_TurnData[this.m_TurnIndex];
        if (data && data.mInit) {
            data.OnExit();
        }
        this.m_TurnIndex = -1;
        this.m_AllTurnData = [];
        if (!this.ExeFinishAction()) {
            console.error("not finish battle action !!!");
            GameGlobal.RaidMgr.EnterCurMapRaid();
        }
    };
    BattleRaid.prototype.FinishBattleAndReward = function () {
        var data = this.m_TurnData[this.m_TurnIndex];
        if (data && data.mInit) {
            data.OnExit();
        }
        this.m_TurnIndex = -1;
        this.m_AllTurnData = [];
        if (this.mFinishAction && this.mFinishAction.ret == 1) {
            UserTips.InfoTip("已跳过关卡战斗，奖励已进入背包");
            GameGlobal.RaidModel.SendGetBossReward();
        }
        GameGlobal.UserFb.sendExitFb();
    };
    BattleRaid.prototype.ShowBattleLayer = function () {
        // GameMap.GetBattleView().showMapBg(ResDataPath.ROOT + "image/battlemap/" + BattleMap.mMapId + ".jpg")
        GameMap.GetBattleView().ShowDefault();
    };
    BattleRaid.prototype.Create = function (entityData) {
        entityData.team = this.CalcEntityTeam(entityData);
        var isDir = entityData.side == 2;
        BattleCtrl.GetPos(isDir, entityData.posIndex, entityData);
        entityData.dir = isDir ? 7 : 3;
        var entity = this.AddEntity(entityData);
        if (!this.mNotShowBlood) {
            entity.ShowBloodBar();
        }
        var ai = new RaidAIUnit;
        entity.SetAI(ai);
        ai.UpdateBlood();
        GameMap.AddBattleEntity(entity);
        entity.SetPos(entityData.x, entityData.y);
    };
    BattleRaid.prototype.OnPlotEnd = function (plotId) {
        if (this.mIsPlot != plotId) {
            return;
        }
        this.mIsPlot = null;
        GameGlobal.MessageCenter.removeListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this);
        this.StartTurn();
    };
    BattleRaid.prototype.OnEnter = function () {
        // if (BattleMap.mFbId) {
        // 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_NORMAL)
        // }
        var _this = this;
        this.m_IsEnter = true;
        GameGlobal.RaidMgr.UpdateBGM();
        var entitys = this.mEntityDatas;
        var mySide;
        for (var _i = 0, entitys_1 = entitys; _i < entitys_1.length; _i++) {
            var list = entitys_1[_i];
            for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
                var data = list_1[_a];
                if (data.masterHandle == GameGlobal.actorModel.actorID) {
                    mySide = this.mMySide = data.side;
                    break;
                }
            }
        }
        var setBossHandle = function (data) {
            if (data.side != mySide && data.posIndex == 8) {
                _this.mBossHandle = data.handle;
            }
        };
        // 我的位置为1的时候，需要重新设置位置
        if (this.mMySide == 1) {
            var team1_1 = entitys[0];
            for (var _b = 0, team1_2 = team1_1; _b < team1_2.length; _b++) {
                var data = team1_2[_b];
                data.side = 2;
            }
            var team2_1 = entitys[1];
            for (var _c = 0, team2_2 = team2_1; _c < team2_2.length; _c++) {
                var data = team2_2[_c];
                data.side = 1;
            }
            var tmp = this.mEntityDatas[0];
            this.mEntityDatas[0] = this.mEntityDatas[1];
            this.mEntityDatas[1] = tmp;
        }
        var team1 = entitys[0] || [];
        for (var _d = 0, team1_3 = team1; _d < team1_3.length; _d++) {
            var data = team1_3[_d];
            if (data.posIndex == -1) {
                continue;
            }
            setBossHandle(data);
            this.Create(data);
        }
        var team2 = entitys[1] || [];
        for (var _e = 0, team2_3 = team2; _e < team2_3.length; _e++) {
            var data = team2_3[_e];
            if (data.posIndex == -1) {
                continue;
            }
            setBossHandle(data);
            this.Create(data);
        }
        this.m_StartTime = AIConfig.START_TURN_WAIT_TIME;
        var view = this.OpenBattlePanel();
        if (view) {
            this.mBattlePanel = view;
            view.visible = this.IsBackground() ? false : true;
        }
        this.ShowBattleLayer();
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS && GameGlobal.PlotModel.OnChapterBattleEnter(GameGlobal.UserFb.guanqiaID)) {
            GameGlobal.MessageCenter.addListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this);
            this.mIsPlot = GameGlobal.UserFb.guanqiaID;
        }
        this.UpdateMonPlot();
        GameMap.GetBattleView().UpdateSort(true);
        this.StartTurn();
    };
    BattleRaid.prototype.UpdateMonPlot = function () {
        for (var key in this.mEntityList) {
            var entity = this.mEntityList[key];
            var info = entity.GetInfo();
            if (info && info.type == EntityType.Monster) {
                var plot = info.HasPlot();
                if (plot) {
                    entity.SetPlot(plot);
                    break;
                }
            }
        }
    };
    BattleRaid.prototype.OpenBattlePanel = function () {
        return ViewManager.ins().open(GameBattlePanel);
    };
    BattleRaid.prototype.OnExit = function () {
        if (this.mBattlePanel) {
            ViewManager.ins().close(this.mBattlePanel);
            this.mBattlePanel = null;
        }
        this.m_IsEnter = false;
        GameMap.GetBattleView().Hide();
        this.RemoveAllEntity();
        this.mEntityDatas = [];
        this.m_AllTurnData = [];
        this.m_TurnData = [];
        // 清理数据
        GameMap.ClearBattleView();
        this.ClearEntityEffMgr();
        GameGlobal.MessageCenter.removeAll(this);
    };
    BattleRaid.prototype.ClearEntityEffMgr = function () {
        GameGlobal.EntityEffMgr.Clear(true);
    };
    BattleRaid.prototype.Update = function (deltaTime) {
        var speed = 1;
        if (!this.mIsManual) {
            speed = SystemSettingPanel.GetSpeed();
        }
        var delta = deltaTime * speed;
        var list = this.mEntityList;
        for (var k in list) {
            list[k].mAI.Update(delta);
        }
        if (this.mIsPlot) {
            return;
        }
        if (this.m_StartTime > 0) {
            this.m_StartTime -= delta;
            return;
        }
        if (this.m_TurnIndex >= 0 && this.m_TurnIndex < this.m_TurnData.length) {
            var data = this.m_TurnData[this.m_TurnIndex];
            if (data) {
                if (!data.mInit) {
                    data.Init(this);
                    data.OnEnter();
                    data.mInit = true;
                }
                if (data.OnUpdate(delta) == AIUnitReturn.NEXT) {
                    data.OnExit();
                    ++this.m_TurnIndex;
                }
                if (!this.m_TurnData[this.m_TurnIndex]) {
                    this.TurnFinish();
                }
            }
            else {
                this.TurnFinish();
            }
        }
    };
    BattleRaid.prototype.SetBattleData = function (entitys) {
        this.mEntityDatas = entitys;
    };
    BattleRaid.prototype.Turn = function (datas) {
        this.m_TurnData = datas;
        this.m_TurnIndex = 0;
        var data = this.m_TurnData[this.m_TurnIndex];
        if (data) {
        }
        else {
            console.error("not turn data !!!");
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN_START);
    };
    /** 自动 */
    BattleRaid.prototype.TurnAll = function (datas) {
        if (this.mIsManual) {
            return;
        }
        this.m_AllTurnData = datas;
        this.StartTurn();
    };
    BattleRaid.prototype.StartTurn = function () {
        if (this.mIsPlot) {
            return;
        }
        if (!this.m_IsEnter) {
            return;
        }
        if (this.mIsManual) {
            return;
        }
        if (this.m_AllTurnData.length) {
            ++this.m_TurnId;
            var list = this.m_AllTurnData[0];
            this.m_AllTurnData.splice(0, 1);
            if (list) {
                this.Turn(list);
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN);
        }
        else {
            this.ExeFinishAction();
        }
    };
    BattleRaid.prototype.ExeFinishAction = function () {
        if (this.mFinishAction) {
            this.mFinishAction.Execute(this);
            this.mFinishAction = null;
            return true;
        }
        return false;
    };
    BattleRaid.prototype.GetTurnId = function () {
        return this.m_TurnId;
    };
    BattleRaid.prototype.TurnFinish = function () {
        if (this.mIsManual) {
            // 回合结束，检查结果
            this.ExeFinishAction();
            GameSocket.ins().Rpc(C2sProtocol.cs_battle_play_finish);
        }
        else {
            this.StartTurn();
        }
    };
    BattleRaid.prototype.SetFinishAction = function (data) {
        this.mFinishAction = data;
        // 如果是手动的，检测是否播放结果
        if (this.mIsManual && this.m_TurnData.length && this.m_TurnIndex >= this.m_TurnData.length) {
            this.ExeFinishAction();
        }
    };
    BattleRaid.prototype.SetManual = function (flag) {
        this.mIsManual = flag;
    };
    // 开始手动释放技能
    BattleRaid.prototype.StartManual = function (time, entitySkill) {
        ++this.m_TurnId;
        GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN);
        if (this.mBattlePanel && egret.is(this.mBattlePanel, "GameBattlePanel")) {
            var panel = this.mBattlePanel;
            panel.StartManual(time, entitySkill);
        }
    };
    BattleRaid.prototype.SetAuto = function (isauto) {
        if (this.mBattlePanel && egret.is(this.mBattlePanel, "GameBattlePanel")) {
            var panel = this.mBattlePanel;
            panel.SetAuto(isauto);
        }
    };
    BattleRaid.prototype.UseSkill = function (list) {
        var rsp = new Sproto.cs_battle_use_skill_request();
        rsp.use_skill_list = [];
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var data = list_2[_i];
            var useData = new Sproto.use_skill_data;
            useData.skillid = data.skillId;
            useData.handler = data.handle;
            useData.targets = data.targets;
            rsp.use_skill_list.push(useData);
        }
        GameSocket.ins().Rpc(C2sProtocol.cs_battle_use_skill, rsp);
    };
    BattleRaid.prototype.SendSetAuto = function (isAuto) {
        var rsp = new Sproto.cs_battle_set_auto_request;
        rsp.isauto = isAuto ? 1 : 0;
        GameSocket.ins().Rpc(C2sProtocol.cs_battle_set_auto, rsp);
    };
    // 血量更新事件
    BattleRaid.prototype.OnEventDamage = function (handle) {
    };
    // public static readonly QUICK_SPEED = 1.5
    BattleRaid.MAX_INDEX = 9999;
    return BattleRaid;
}(Raid));
__reflect(BattleRaid.prototype, "BattleRaid");
//# sourceMappingURL=BattleRaid.js.map