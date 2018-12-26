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
var TianShenUpLevelPanel = (function (_super) {
    __extends(TianShenUpLevelPanel, _super);
    function TianShenUpLevelPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tianshenId = 0;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this._SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnAuto.label = "停止";
            }
            else {
                _this.btnAuto.label = "自动进阶";
            }
        }, 200);
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            if (_this.model) {
                _this.model.SendUpLevel(_this.tianshenId, type);
            }
        }, function () {
            var selectConfig = _this.mContext.mTianShenList[_this.mContext.mSelectIndex];
            var level = _this.model.mTianShenList[selectConfig.id].mLevel;
            var levelConfig = GameGlobal.Config.AirMarshalLvproConfig[selectConfig.quality][level];
            if (!levelConfig) {
                return [null];
            }
            var cost = levelConfig.cost;
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count];
        }, function () {
            return _this.checkBox.selected;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        return _this;
    }
    TianShenUpLevelPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
        this._AddClick(this.baseView.btnZZ, this._OnClick);
        this._AddClick(this.btnYuanfen, this._OnClick);
    };
    TianShenUpLevelPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.observe(MessageDef.TIANSHEN_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.TIANSHEN_UPDATE_EXP, this._DoUpdateExp);
        this.observe(MessageDef.BAG_TIANSHEN_LEVEL_ITEM, this._UpdateExp);
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateRedPoint);
        this.observe(MessageDef.RP_TIANSHEN, this.UpdateRedPoint);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint);
        this.UpdateRedPoint();
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
    };
    TianShenUpLevelPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    TianShenUpLevelPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.baseView.btnZZ, GameGlobal.TianShenModel.mRedPoint.Get(TianShenModelRedPoint.INDEX_BATTLE));
        UIHelper.ShowRedPoint(this.baseView.btnSXD, GameGlobal.TianShenModel.mRedPoint.Get(TianShenModelRedPoint.INDEX_ATTR));
    };
    TianShenUpLevelPanel.prototype.UpdateContent = function () {
        _super.prototype.UpdateContent.call(this);
        this._UpdateExp();
        this.UpdateYuanfenRedPoint();
    };
    TianShenUpLevelPanel.prototype.UpdateYuanfenRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null));
    };
    TianShenUpLevelPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this._SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.baseView.btnZZ:
                GameGlobal.TianShenModel.SendBattle(this.tianshenId, this.model.mBattleID == this.tianshenId ? 0 : 1);
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    TianShenUpLevelPanel.prototype.UpdateInfo = function (id) {
        this.tianshenId = id;
        _super.prototype.UpdateInfo.call(this, id);
        var model = GameGlobal.TianShenModel;
        var info = GameGlobal.TianShenModel.mTianShenList[id];
        if (info.mLevel >= model.MAX_LEVEL) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        this._UpdateExp();
    };
    TianShenUpLevelPanel.prototype._DoUpdateExp = function () {
        this.mRoleAutoSendData.Continue();
        this._UpdateExp();
    };
    TianShenUpLevelPanel.prototype._UpdateExp = function () {
        var selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex];
        var tianshenId = selectConfig.id;
        var quality = selectConfig.quality;
        var level = GameGlobal.TianShenModel.GetLevel(tianshenId);
        var levelConfig = GameGlobal.Config.AirMarshalLvproConfig[quality][level - 1];
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = GameGlobal.TianShenModel.mTianShenList[tianshenId].mExpUpNum * levelConfig.exp;
        this.consumeLabel.Set(levelConfig.cost);
    };
    TianShenUpLevelPanel.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    TianShenUpLevelPanel.RedPointCheck = function () {
        return GameGlobal.TianShenModel.mRedPoint.IsRedPoint() || GameGlobal.YuanfenModel.IsRedPoint();
    };
    TianShenUpLevelPanel.NAME = "天神";
    return TianShenUpLevelPanel;
}(TianShenBaseInfoPanel));
__reflect(TianShenUpLevelPanel.prototype, "TianShenUpLevelPanel");
//# sourceMappingURL=TianShenUpLevelPanel.js.map