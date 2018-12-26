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
var AcrossBossSceneView = (function (_super) {
    __extends(AcrossBossSceneView, _super);
    function AcrossBossSceneView(raid) {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tCheckBox = []; //选择框
        _this.m_Raid = raid;
        _this.skinName = "AcrossBossFightSkin";
        _this.list.itemRenderer = AcrossBossNowRankItem;
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
    AcrossBossSceneView.prototype.OnOpen = function () {
        var panel = ViewManager.ins().getView(GameMapPanel);
        if (panel) {
            panel.SetReturnBtn(-239);
        }
        this.checkBox0.selected = this.m_Raid.mSelList[0];
        this.checkBox2.selected = this.m_Raid.mSelList[2];
        this.checkBox3.selected = this.m_Raid.IsIsAutoReborn();
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this.observe(MessageDef.KF_BOSS_RANK_NOW, this._UpdateRank);
        this.observe(MessageDef.KF_BOSS_UPDATE_HP, this._UpdateHp);
        this.observe(MessageDef.PLAYER_CHANGE_SYSTEM_SETTING, this._UpdatePlayerSetting);
        this._UpdatePlayerSetting();
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this._UpdatePos();
        this._UpdateHp();
        this._UpdateTime();
        this.AddTimer(1000, 0, this._UpdateTime);
        this.OnChange(null);
    };
    AcrossBossSceneView.prototype._UpdatePlayerSetting = function () {
        this.checkBox1.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER);
    };
    //点击选择框改变内容
    AcrossBossSceneView.prototype.OnChange = function (index) {
        var raid = this.m_Raid;
        var list = [];
        for (var i = 0; i < this.tCheckBox.length; i++) {
            list.push(this.tCheckBox[i].selected);
        }
        raid.UpdateSel(index, list);
    };
    AcrossBossSceneView.prototype._UpdatePos = function () {
        MiniChatPanel.UpdateViewPos(this.groupAll);
    };
    AcrossBossSceneView.prototype.OnClose = function () {
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    };
    AcrossBossSceneView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnArrow:
                var show = this.list.visible = !this.list.visible;
                this.btnArrow.icon = show ? "ui_zd_bt_zhankai" : "ui_zd_bt_shousuo";
                break;
            case this.laRank:
                if (GameGlobal.AcrossBossController.mCurRank && GameGlobal.AcrossBossController.mCurRank.playerranks && GameGlobal.AcrossBossController.mCurRank.playerranks.length) {
                    ViewManager.ins().open(RankWin, RankDataType.TYPE_ACROSS_PERSON);
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
    AcrossBossSceneView.prototype._UpdateTime = function () {
        var state = GameGlobal.AcrossBossController.status;
        if (state == AcrossBossState.KILL) {
            this.titleLabel.text = AcrossBossSceneView.LABEL.OUT_TIME;
            var time = GameServer.serverTime - GameGlobal.AcrossBossController.changetime;
            var stime = GameGlobal.Config.KfBossBaseConfig.leavetime - time;
            this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0));
        }
        else if (state == AcrossBossState.WAIT) {
            this.titleLabel.text = AcrossBossSceneView.LABEL.BOSS;
            var time = GameServer.serverTime - GameGlobal.AcrossBossController.changetime;
            var stime = GameGlobal.Config.KfBossBaseConfig.readytime - time;
            this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0));
        }
        else {
            this.titleLabel.text = AcrossBossSceneView.LABEL.OUT_TIME;
            this.lbTime.text = DateUtils.format_1(GameGlobal.AcrossBossController.getEndTime() * 1000);
        }
    };
    AcrossBossSceneView.prototype._UpdateHp = function () {
        if (GameGlobal.AcrossBossController.status < AcrossBossState.BOSS) {
            this.barProtect.value = 100;
            this.barBlood.value = 100;
        }
        else if (GameGlobal.AcrossBossController.status == AcrossBossState.KILL) {
            this.barBlood.value = 0;
        }
        else {
            var model = GameGlobal.AcrossBossController;
            this.barProtect.value = Math.ceil(model.shieldvalue / GameGlobal.Config.KfBossBaseConfig.shieldvalue * 100);
            this.barBlood.value = model.hpperc;
        }
    };
    AcrossBossSceneView.prototype._UpdateRank = function () {
        var rank = GameGlobal.AcrossBossController.mCurRank;
        if (!rank) {
            this.list.dataProvider = new eui.ArrayCollection([]);
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(rank.playerranks);
    };
    AcrossBossSceneView.LABEL = {
        OUT_TIME: "场景关闭倒计时",
        BOSS: "BOSS降临倒计时",
    };
    return AcrossBossSceneView;
}(BaseView));
__reflect(AcrossBossSceneView.prototype, "AcrossBossSceneView");
var AcrossBossNowRankItem = (function (_super) {
    __extends(AcrossBossNowRankItem, _super);
    function AcrossBossNowRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    AcrossBossNowRankItem.prototype.dataChanged = function () {
        var data = this.data;
        this.lbName.text = data.name;
        this.lbRank.text = (this.itemIndex + 1) + "";
        this.lbLv.text = GameString.GetSer(data.serverid);
        UIHelper.SetHead(this.head, data.job, data.sex, false);
        this.lbHave.visible = this.itemIndex == 0;
    };
    AcrossBossNowRankItem.prototype.childrenCreated = function () {
    };
    return AcrossBossNowRankItem;
}(eui.ItemRenderer));
__reflect(AcrossBossNowRankItem.prototype, "AcrossBossNowRankItem");
//# sourceMappingURL=AcrossBossSceneView.js.map