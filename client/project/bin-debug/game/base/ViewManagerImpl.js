var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ViewManagerImpl = (function () {
    function ViewManagerImpl(mgr) {
        this.mMgr = mgr;
    }
    ViewManagerImpl.prototype.GetLoading = function () {
        if (this.m_Loading == null) {
            this.m_Loading = new CircleLoading;
        }
        return this.m_Loading;
    };
    ViewManagerImpl.GetComBg = function () {
        if (this.m_ComBg == null) {
            var comp_1 = this.m_ComBg = new eui.Group;
            this.m_ComBg.visible = false;
            this.m_ComBg.horizontalCenter = 0;
            var img = new eui.Image;
            img.percentWidth = 100;
            img.percentHeight = 100;
            img.source = "ui_zc_jz_ditu";
            comp_1.addChild(img);
            var img2 = new eui.Image;
            img2.left = img2.top = img2.right = img2.bottom = -10;
            img2.source = "ui_cm_black";
            img2.alpha = 0.85;
            comp_1.addChild(img2);
            var func = function () {
                comp_1.height = GameGlobal.StageUtils.GetHeight();
                comp_1.width = comp_1.height * 960 / StageUtils.HEIGHT;
            };
            GameGlobal.StageUtils.GetStage().addEventListener(egret.Event.RESIZE, func, comp_1);
            func();
        }
        return this.m_ComBg;
    };
    ViewManagerImpl.prototype.Init = function () {
        GameSocket.ins().setOnClose(this.ShowLoading, this);
        GameSocket.ins().setOnConnected(this.HideLoading, this);
    };
    /**
     * 打开一个界面，修改移除销毁参宿
     */
    ViewManagerImpl.prototype.Open = function (cls) {
        if (!cls) {
            return;
        }
        var view = ViewManager.ins().open(cls);
        view.mRemoveNotDestroyView = true;
    };
    /**
     * 关闭一个界面
     */
    ViewManagerImpl.prototype.Close = function (cls) {
        if (!cls) {
            return;
        }
        ViewManager.ins().close(cls);
    };
    /**
     * 销毁一个界面
     */
    ViewManagerImpl.prototype.Destroy = function (cls) {
        if (!cls) {
            return;
        }
        var view = ViewManager.ins().getView(cls);
        if (view) {
            view.mRemoveNotDestroyView = null;
            if (view.isShow()) {
                view.CloseSelf();
            }
            else {
                view.destoryView();
            }
        }
    };
    ViewManagerImpl.prototype.OnOpenView = function (view) {
        if (!view) {
            return;
        }
        if (view.parent == LayerManager.UI_Main) {
            this.mMgr.closeEasy(egret.getQualifiedClassName(MainTop2Panel));
            this.mMgr.closeEasy(egret.getQualifiedClassName(PlayFunView));
            this.mMgr.closeEasy(egret.getQualifiedClassName(GameSceneView));
            // this.mMgr.closeEasy(egret.getQualifiedClassName(ChatPanel))
            GameMap.SetActive(false);
            this.UpdateUIMainVisible();
            ViewManagerImpl.GetComBg().visible = true;
            // 关闭在之上的层级
            for (var _i = 0, _a = this.mMgr._opens; _i < _a.length; _i++) {
                var openViewKey = _a[_i];
                var openView = this.mMgr._views[openViewKey];
                if (openView == null) {
                    continue;
                }
                if (view == openView) {
                    break;
                }
                var viewCls = egret.getDefinitionByName(egret.getQualifiedClassName(openView));
                if (viewCls.LAYER_LEVEL == LayerManager.UI_Main_2) {
                    this.mMgr.closeEasy(egret.getQualifiedClassName(openView));
                }
            }
        }
        if (egret.is(view, "GuildWarInfoPanel")) {
            this.CloseMainTop2Panel();
        }
        else {
            // let view = this.mMgr.getView(WorldBossPlayPanel) as WorldBossPlayPanel
            // if (view) {
            //     if (view.GetShowState()) {
            //         this.CloseMainTop2Panel()
            //     }
            // }
        }
    };
    ViewManagerImpl.prototype.OnCloseOneView = function (view) {
        var viewCls = egret.getDefinitionByName(egret.getQualifiedClassName(view));
        this._CloseOneView();
    };
    ViewManagerImpl.prototype.OnClosePartView = function () {
        this._CloseOneView();
    };
    ViewManagerImpl.prototype.OnCloseAll = function () {
        ViewManagerImpl.GetComBg().visible = false;
        GameMap.SetActive(true);
    };
    ViewManagerImpl.prototype.CloseMainTop2Panel = function () {
        this.mMgr.closeEasy(egret.getQualifiedClassName(MainTop2Panel));
    };
    ViewManagerImpl.prototype._CloseOneView = function () {
        if (LayerManager.HasMainPanel()) {
            this.UpdateUIMainVisible();
            return;
        }
        ViewManagerImpl.GetComBg().visible = false;
        this.CheckMainTop2Panel();
        if (!this.mMgr.isShow(GameSceneView)) {
            this.mMgr.openEasy(GameSceneView);
        }
        // if (LayerManager.HasMainBgPanel() && this.mMgr.isShow(GameCityPanel)) {
        // if (this.mMgr.isShow(GameCityPanel)) {
        //     return
        // }
        GameMap.SetActive(true);
        this.CheckPlayFunviewState();
    };
    ViewManagerImpl.prototype.CheckPlayFunviewState = function () {
        // 没有一级界面
        // 当前在挂机场景
        // 没有在副本场景
        // 没有在主城
        if (!LayerManager.HasMainPanel() && BattleMap.IsNoramlLevel() && !GameGlobal.CommonRaidModel.OpenClick && GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_CITY) {
            if (!this.mMgr.isShow(PlayFunView)) {
                ViewManager.ins().open(PlayFunView);
            }
        }
        else {
            if (this.mMgr.isShow(PlayFunView)) {
                ViewManager.ins().close(PlayFunView);
            }
        }
        // 没有一级界面
        // 在主城
        // if (!LayerManager.HasMainPanel() && GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_CITY) {
        //     if (!this.mMgr.isShow(GameCityPanel)) {
        //         ViewManager.ins().open(GameCityPanel);
        //     }
        // } else {
        //     if (this.mMgr.isShow(GameCityPanel)) {
        //         ViewManager.ins().close(GameCityPanel);
        //     }
        // }
    };
    ViewManagerImpl.prototype.CheckMainTop2Panel = function () {
        // 没有一级界面
        // 当前在主城 或者 不在副本场景
        if (!LayerManager.HasMainPanel() && (GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_CITY || !GameGlobal.CommonRaidModel.OpenClick)) {
            if (!this.mMgr.isShow(MainTop2Panel)) {
                ViewManager.ins().open(MainTop2Panel);
            }
        }
        else {
            if (this.mMgr.isShow(MainTop2Panel)) {
                ViewManager.ins().close(MainTop2Panel);
            }
        }
    };
    ViewManagerImpl.prototype.UpdateUIMainVisible = function () {
        var UIList = LayerManager.UI_Main;
        if (UIList.$children.length == 0) {
            return;
        }
        for (var i = 0; i < UIList.$children.length; i++) {
            UIList.$children[i].visible = false;
        }
        UIList.$children[UIList.$children.length - 1].visible = true;
    };
    // 副本改变事件，处理相关界面
    ViewManagerImpl.prototype.DoBattleChange = function () {
        var fbId = BattleMap.mFbId;
        var fbType = BattleMap.mFbType;
        var oldFbId = BattleMap.mOldFbId;
        var oldFbType = BattleMap.mOldFbType;
        if (fbId != 0) {
            if (fbType == UserFb.FB_TYPE_LADDER) {
                GameGlobal.Ladder.ClearActorInfo();
            }
            // ViewManager.ins().close(GameCityPanel);
            ViewManager.ins().close(PlayFunView);
            ViewManager.ins().close(GameCityPanel);
            if (fbType == UserFb.FB_TYPE_GUANQIABOSS) {
                ViewManager.ins().close(GuanQiaRewardWin);
            }
            else {
                ViewManager.ins().close(BossMainPanel);
                ViewManager.ins().close(ArenaWin);
                ViewManager.ins().close(FbLayer);
                // ViewManager.ins().close(GangBossPanel);
                ViewManager.ins().close(GangMainWin);
                ViewManager.ins().close(ActivityWin);
                ViewManager.ins().close(KaiFuActivityWin);
                ViewManager.ins().close(QujingMainWin);
                ViewManager.ins().close(QujingRecordWin);
                ViewManager.ins().close(GangMinePanel);
                ViewManager.ins().close(GBattleMainWin);
                if (fbType == UserFb.FB_TYPE_GUILDFB) {
                    ViewManager.ins().close(GangMainWin);
                }
                else if (fbType == UserFb.FB_TYPE_CROSSTEAMFB) {
                    ViewManager.ins().close(CrossMainPanel);
                }
                else if (fbType == UserFb.FB_TYPE_LIFE_DEATH_PLUNDER) {
                    ViewManager.ins().close(CrossMainPanel);
                    ViewManager.ins().close(TsumKoBasePanel);
                    if (ViewManager.ins().isShow(TsumKoBaseRecordPanel) == true)
                        ViewManager.ins().close(TsumKoBaseRecordPanel);
                }
                else if (fbType == UserFb.FB_TYPE_FOMALHAUT) {
                    ViewManager.ins().close(CrossMainPanel);
                    ViewManager.ins().close(DailyFomalhautTaskPanel);
                    ViewManager.ins().close(DailyMainWin);
                }
                else if (fbType == UserFb.FB_TYPE_ACTIVITY_PET_FIGHT) {
                    ViewManager.ins().close(KaiFuActivityWin);
                }
            }
        }
        else {
            if (oldFbType > 0 && 0 == fbId) {
                switch (oldFbType) {
                    case UserFb.FB_TYPE_ARENA:
                        ViewManager.ins().open(ArenaWin);
                        break;
                    case UserFb.FB_TYPE_PERSONAL_BOSS://个人boss
                        ViewManager.ins().open(BossMainPanel, 0);
                        break;
                    case UserFb.FB_TYPE_PUBLIC_BOSS://全民boss
                        ViewManager.ins().open(BossMainPanel, 1);
                        break;
                    case UserFb.FB_TYPE_FIELD_BOSS://
                        ViewManager.ins().open(BossMainPanel, 2);
                        break;
                    case UserFb.FB_TYPE_MATERIAL://材料副本
                        ViewManager.ins().open(FbLayer, 0);
                        break;
                    case UserFb.FB_TYPE_TREASURE://藏宝图
                        ViewManager.ins().open(FbLayer, 1);
                        break;
                    case UserFb.FB_TYPE_TOWER://玲珑塔
                        ViewManager.ins().open(FbLayer, 2);
                        break;
                    case UserFb.FB_TYPE_TOWER2://勇闯天庭
                        ViewManager.ins().open(FbLayer, 3);
                        break;
                    case UserFb.FB_TYPE_GUILDFB://帮会副本
                        ViewManager.ins().open(GangMainWin, 1);
                        break;
                    // case UserFb.FB_TYPE_GANG_BOSS://帮会boss
                    //     ViewManager.ins().open(GangBossPanel);
                    //     break
                    case UserFb.FB_TYPE_CROSSTEAMFB://组队副本
                        ViewManager.ins().open(CrossMainPanel);
                        break;
                    case UserFb.FB_TYPE_ESCORT://护送
                        if (GameGlobal.QujingModel.mEscortFightType == QujingModel.ESCORT_FIGHT_TYPE_ROB) {
                            ViewManager.ins().open(QujingMainWin);
                        }
                        else {
                            ViewManager.ins().open(QujingMainWin);
                            ViewManager.ins().open(QujingRecordWin);
                        }
                        break;
                    case UserFb.FB_TYPE_VIP_BOSS://VipBoss
                        ViewManager.ins().open(BossMainPanel, 3);
                        break;
                    case UserFb.FB_TYPE_GANGMINE:
                        ViewManager.ins().open(GangMinePanel);
                        break;
                    case UserFb.FB_TYPE_GUILD_WAR://帮会战
                        var gateId = GameGlobal.GangBattleModel.myGBattleInfo.mGateId;
                        if (gateId == GangBattleModel.ACTIVE_TYPE_GATE) {
                            ViewManager.ins().open(GBattleMainWin);
                        }
                        break;
                    case UserFb.FB_TYPE_LIFE_DEATH_PLUNDER://八十一难
                        ViewManager.ins().open(CrossMainPanel, 2);
                        ViewManager.ins().open(TsumKoBasePanel);
                        break;
                    case UserFb.FB_TYPE_FOMALHAUT://日常
                        ViewManager.ins().open(DailyMainWin, 1);
                        break;
                    case UserFb.FB_TYPE_ACTIVITY_PET_FIGHT://哮天犬
                        KaiFuActivityWin.Show(2);
                        break;
                    case UserFb.FB_TYPE_LADDER://哮天犬
                        LadderWin.Show();
                        break;
                }
            }
            GameGlobal.ViewManagerImpl.CheckPlayFunviewState();
        }
    };
    // 地图改变时间
    ViewManagerImpl.prototype.DoMapChange = function () {
        var oldType = GameMap.oldFbType;
        var oldId = GameMap.oldFbId;
        var newType = GameMap.fbType;
        var newId = GameMap.fubenID;
        if (newType == UserFb.FB_TYPE_XIANDAO) {
            ViewManager.ins().close(ArenaWin);
            // ViewManager.ins().close(GameCityPanel)
        }
        else if (newType == UserFb.FB_TYPE_CROSSTEAMFB) {
            ViewManager.ins().close(ActivityWin);
            // ViewManager.ins().close(GameCityPanel)
        }
        else if (newType == UserFb.FB_TYPE_CLOUD_NINE) {
            ViewManager.ins().close(ActivityWin);
            // ViewManager.ins().close(GameCityPanel)
        }
    };
    ViewManagerImpl.prototype.DoRaidShowType = function () {
        var isNormal = GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_NORMAL;
        this.CheckPlayFunviewState();
        this.CheckMainTop2Panel();
    };
    ViewManagerImpl.prototype.ShowLoading = function () {
        var loading = this.GetLoading();
        if (loading.m_IsShow) {
            return;
        }
        loading._Show();
    };
    ViewManagerImpl.prototype.HideLoading = function () {
        if (!this.m_Loading) {
            return;
        }
        if (!this.m_Loading.m_IsShow) {
            return;
        }
        this.m_Loading._Hide();
    };
    ;
    return ViewManagerImpl;
}());
__reflect(ViewManagerImpl.prototype, "ViewManagerImpl", ["IViewMangerImpl"]);
//# sourceMappingURL=ViewManagerImpl.js.map