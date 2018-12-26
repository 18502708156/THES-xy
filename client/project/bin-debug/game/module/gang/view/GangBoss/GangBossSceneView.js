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
var GangBossSceneView = (function (_super) {
    __extends(GangBossSceneView, _super);
    function GangBossSceneView(raid) {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tCheckBox = []; //选择框
        _this.m_Raid = raid;
        _this.skinName = "AcrossBossFightSkin";
        _this.list.itemRenderer = GangBossNowRankItem;
        _this._AddClick(_this.btnArrow, _this._OnClick);
        _this._AddClick(_this.laRank, _this._OnClick);
        _this._AddClick(_this.checkBox0, _this._OnClick);
        _this._AddClick(_this.checkBox1, _this._OnClick);
        _this._AddClick(_this.checkBox2, _this._OnClick);
        _this.barProtect.thumb.source = "ui_kf_bm_lansetiao";
        _this.barProtect.maximum = 100;
        _this.barProtect.labelFunction = function (cur, max) {
            return cur + "%";
        };
        _this.barBlood.maximum = 100;
        _this.barBlood.labelFunction = function (cur, max) {
            return cur + "%";
        };
        for (var i = 0; i < 3; i++) {
            var item = _this["checkBox" + i];
            _this.tCheckBox[i] = item;
        }
        return _this;
    }
    GangBossSceneView.prototype.OnOpen = function () {
        var panel = ViewManager.ins().getView(GameMapPanel);
        if (panel) {
            panel.SetReturnBtn(-239);
        }
        this.checkBox0.selected = this.m_Raid.mSelList[0];
        this.checkBox2.selected = this.m_Raid.mSelList[2];
        this.checkBox3.selected = this.m_Raid.IsIsAutoReborn();
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this.observe(MessageDef.GANGBOSS_RANK_NOW, this._UpdateRank);
        this.observe(MessageDef.GANGBOSS_UPDATE_HP, this._UpdateHp);
        this.observe(MessageDef.PLAYER_CHANGE_SYSTEM_SETTING, this._UpdatePlayerSetting);
        this._UpdatePlayerSetting();
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this._UpdatePos();
        this._UpdateHp();
        this._UpdateTime();
        this.AddTimer(1000, 0, this._UpdateTime);
        this.OnChange(null);
    };
    GangBossSceneView.prototype._UpdatePlayerSetting = function () {
        this.checkBox1.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER);
    };
    //点击选择框改变内容
    GangBossSceneView.prototype.OnChange = function (index) {
        var raid = this.m_Raid;
        var list = [];
        for (var i = 0; i < this.tCheckBox.length; i++) {
            list.push(this.tCheckBox[i].selected);
        }
        raid.UpdateSel(index, list);
    };
    GangBossSceneView.prototype._UpdatePos = function () {
        MiniChatPanel.UpdateViewPos(this.groupAll);
    };
    GangBossSceneView.prototype.OnClose = function () {
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    };
    GangBossSceneView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnArrow:
                var show = this.list.visible = !this.list.visible;
                this.btnArrow.icon = show ? "ui_zd_bt_zhankai" : "ui_zd_bt_shousuo";
                break;
            case this.laRank:
                if (GameGlobal.GangBossModel.mCurRank && GameGlobal.GangBossModel.mCurRank.playerranks && GameGlobal.GangBossModel.mCurRank.playerranks.length) {
                    ViewManager.ins().open(RankWin, RankDataType.TYPE_GANG_BOSS_PERSON);
                }
                else {
                    UserTips.ins().showTips("赶紧冲榜吧");
                }
                break;
            case this.checkBox0:
                this.OnChange(0);
                break;
            case this.checkBox1:
                SystemSettingPanel.ChangeShowOther(this.checkBox1.selected);
                break;
            case this.checkBox2:
                this.OnChange(2);
                break;
        }
    };
    GangBossSceneView.prototype._UpdateTime = function () {
        var state = GameGlobal.GangBossModel.status;
        if (state == AcrossBossState.KILL) {
            this.titleLabel.text = GangBossSceneView.LABEL.OUT_TIME;
            var time = GameServer.serverTime - GameGlobal.GangBossModel.changetime;
            var stime = GameGlobal.Config.GuildBossBaseConfig.leavetime - time;
            this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0));
        }
        else if (state == AcrossBossState.WAIT) {
            this.titleLabel.text = GangBossSceneView.LABEL.BOSS;
            var time = GameServer.serverTime - GameGlobal.GangBossModel.changetime;
            var stime = GameGlobal.Config.GuildBossBaseConfig.readytime - time;
            this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0));
        }
        else if (state == AcrossBossState.REBORNING) {
            this.titleLabel.text = GangBossSceneView.LABEL.BOSSREBORNING;
            this.lbTime.text = DateUtils.format_1(GameGlobal.GangBossModel.getBossRebornTime() * 1000);
        }
        else {
            this.titleLabel.text = GangBossSceneView.LABEL.OUT_TIME;
            this.lbTime.text = DateUtils.format_1(GameGlobal.GangBossModel.getEndTime() * 1000);
        }
    };
    GangBossSceneView.prototype._UpdateHp = function () {
        if (GameGlobal.GangBossModel.status < AcrossBossState.BOSS) {
            this.barProtect.value = 100;
            this.barBlood.value = 100;
        }
        else if (GameGlobal.GangBossModel.status == AcrossBossState.KILL) {
            this.barBlood.value = 0;
        }
        else {
            var model = GameGlobal.GangBossModel;
            this.barProtect.value = Math.ceil(model.shieldvalue / GameGlobal.Config.GuildBossBaseConfig.shieldvalue * 100);
            this.barBlood.value = model.hpperc;
        }
    };
    GangBossSceneView.prototype._UpdateRank = function () {
        var rank = GameGlobal.GangBossModel.mCurRank;
        if (!rank) {
            this.list.dataProvider = new eui.ArrayCollection([]);
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(rank.playerranks);
    };
    GangBossSceneView.LABEL = {
        OUT_TIME: "场景关闭倒计时",
        BOSS: "BOSS降临倒计时",
        BOSSREBORNING: "BOSS复活倒计时"
    };
    return GangBossSceneView;
}(BaseView));
__reflect(GangBossSceneView.prototype, "GangBossSceneView");
var GangBossNowRankItem = (function (_super) {
    __extends(GangBossNowRankItem, _super);
    function GangBossNowRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangBossNowRankItem.prototype.dataChanged = function () {
        var data = this.data;
        this.lbName.text = data.name;
        this.lbRank.text = (this.itemIndex + 1) + "";
        this.lbLv.text = "";
        UIHelper.SetHead(this.head, data.job, data.sex, false);
        this.lbHave.visible = this.itemIndex == 0;
    };
    GangBossNowRankItem.prototype.childrenCreated = function () {
    };
    return GangBossNowRankItem;
}(eui.ItemRenderer));
__reflect(GangBossNowRankItem.prototype, "GangBossNowRankItem");
//# sourceMappingURL=GangBossSceneView.js.map