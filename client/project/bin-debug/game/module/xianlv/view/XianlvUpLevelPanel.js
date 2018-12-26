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
var XianlvUpLevelPanel = (function (_super) {
    __extends(XianlvUpLevelPanel, _super);
    function XianlvUpLevelPanel() {
        var _this = _super.call(this) || this;
        _this.mWindowHelpId = 5;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this._SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnCulture.label = "停止";
            }
            else {
                _this.btnCulture.label = "自动升级";
            }
        });
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            var xianlvInfo = _this.GetXianlvInfo();
            if (xianlvInfo) {
                GameGlobal.XianlvModel.SendUpLevel(xianlvInfo.mXianlvId, type);
            }
        }, function () {
            var xianlvInfo = _this.GetXianlvInfo();
            if (xianlvInfo) {
                var config = xianlvInfo.GetLevelConfig();
                if (config) {
                    var cost = config.cost;
                    return [cost[0].id, cost[0].count, cost[1].id, cost[1].count];
                }
            }
            return [null];
        }, function () {
            return _this.checkBox.selected;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        return _this;
    }
    XianlvUpLevelPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._AddClick(this.btnAdd, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.baseView.btnZZ, this._OnClick);
        this._AddClick(this.baseView.btnShow, this._OnClick);
        this._AddClick(this.btnYuanfen, this._OnClick);
        //this._AddClick(this.baseView.btnSC, this._OnClick)
    };
    XianlvUpLevelPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.observe(MessageDef.RP_XIANLV, this.UpdateRedPoint);
        this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent);
        this.observe(MessageDef.XIANLV_UPATE_EXP, this._DoUpdateExp);
        this.observe(MessageDef.BAG_XIANLV_RANK_ITEM, this._UpdateExp);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint);
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
    };
    XianlvUpLevelPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    XianlvUpLevelPanel.prototype.UpdateYuanfenRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null));
    };
    XianlvUpLevelPanel.prototype._OnClick = function (e) {
        var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
        var xianlvId = selectConfig.id;
        switch (e.currentTarget) {
            case this.btnAdd:
                this._SendUp();
                break;
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.baseView.btnZZ:
                if (GameGlobal.XianlvModel.HasBattle(xianlvId)) {
                    GameGlobal.XianlvModel.SendUnBattle(xianlvId);
                }
                else {
                    ViewManager.ins().open(XianlvBattlePanel, xianlvId);
                }
                break;
            case this.baseView.btnShow:
                GameGlobal.XianlvModel.SetShowId(xianlvId);
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    XianlvUpLevelPanel.prototype.UpdateInfo = function (id) {
        _super.prototype.UpdateInfo.call(this, id);
        var model = GameGlobal.XianlvModel;
        var info = GameGlobal.XianlvModel.GetXianlvInfo(id);
        if (info.mLevel >= model.MAX_LEVEL) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        this._UpdateExp();
        this.UpdateRedPoint();
        this.UpdateYuanfenRedPoint();
    };
    XianlvUpLevelPanel.prototype.GetXianlvInfo = function () {
        var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
        var petId = selectConfig.id;
        return GameGlobal.XianlvModel.GetXianlvInfo(petId);
    };
    XianlvUpLevelPanel.prototype._DoUpdateExp = function () {
        this.mRoleAutoSendData.Continue();
        this._UpdateExp();
    };
    XianlvUpLevelPanel.prototype._UpdateExp = function () {
        var xianlvInfo = this.GetXianlvInfo();
        if (!xianlvInfo) {
            return;
        }
        var config = xianlvInfo.GetLevelConfig();
        if (!config) {
            return;
        }
        this.bar.maximum = config.proexp;
        this.bar.value = xianlvInfo.mExp * config.exp;
        this.consumeLabel.Set(config.cost);
    };
    XianlvUpLevelPanel.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    XianlvUpLevelPanel.prototype.UpdateRedPoint = function () {
        var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
        var xianlvId = selectConfig.id;
        var redMode = GameGlobal.XianlvModel.mRedPoint;
        UIHelper.ShowRedPoint(this.baseView.btnZZ, !GameGlobal.XianlvModel.HasBattle(xianlvId) && redMode.Get(XianlvModelRedPoint.INDEX_BATTLE));
        UIHelper.ShowRedPoint(this.btnAdd, redMode.IsRedRank(xianlvId));
        UIHelper.ShowRedPoint(this.btnCulture, redMode.IsRedRank(xianlvId));
    };
    XianlvUpLevelPanel.RedPointCheck = function () {
        return GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_ACT) || GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_RANK) || GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_BATTLE) || GameGlobal.YuanfenModel.IsRedPoint();
    };
    XianlvUpLevelPanel.NAME = "仙侣";
    return XianlvUpLevelPanel;
}(XianlvBaseInfoPanel));
__reflect(XianlvUpLevelPanel.prototype, "XianlvUpLevelPanel");
//# sourceMappingURL=XianlvUpLevelPanel.js.map