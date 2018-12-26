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
var PetUpLevelPanel = (function (_super) {
    __extends(PetUpLevelPanel, _super);
    function PetUpLevelPanel() {
        var _this = _super.call(this) || this;
        _this.windowTitleIconName = "宠物";
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
            var petInfo = _this.GetPetInfo();
            if (petInfo) {
                GameGlobal.PetModel.SendUpLevel(petInfo.mPetId, type);
            }
        }, function () {
            var petInfo = _this.GetPetInfo();
            if (petInfo) {
                var config = petInfo.GetLevelConfig();
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
    // 引导对象
    PetUpLevelPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.btnAdd,
            _a[2] = this.btnCulture,
            _a;
        var _a;
    };
    PetUpLevelPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnFeis, this._OnClick);
        this._AddClick(this.btnZizhi, this._OnClick);
        this._AddClick(this.btnShow, this._OnClick);
        this._AddClick(this.btnZZ, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
        this._AddClick(this.btnAdd, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.showAllAttr, this._OnClick);
        this._AddClick(this.btnRename, this._OnClick);
        this._AddClick(this.skillComp, this._OnClick);
        this._AddClick(this.btnSC, this._OnClick);
        this._AddClick(this.btnYuanfen, this._OnClick);
    };
    PetUpLevelPanel.prototype.UpdateRedPoint = function () {
        var model = GameGlobal.PetModel;
        var selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex];
        var petId = selectConfig.id;
        UIHelper.ShowRedPoint(this.btnZizhi, GameGlobal.PetModel.mRedPoint.IsRedZizhi(petId));
        UIHelper.ShowRedPoint(this.btnZZ, !GameGlobal.PetModel.HasBattle(petId) && GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_BATTLE));
        // UIHelper.ShowRedPoint(this.btnAdd, GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_LEVEL))
        // UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_LEVEL))
        UIHelper.ShowRedPoint(this.btnAdd, GameGlobal.PetModel.mRedPoint.IsRedLevel(petId));
        UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.PetModel.mRedPoint.IsRedLevel(petId));
    };
    PetUpLevelPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.PetModel;
        var selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex];
        var petId = selectConfig.id;
        this.imgShen.visible = selectConfig.type == 2;
        if (!model.HasPet(petId)) {
            this.group.visible = false;
            return;
        }
        this.group.visible = true;
        var petInfo = model.GetPetInfo(petId);
        PetConst.SetName(this.lbName, petInfo);
        this.group.visible = true;
        this.wuxingImg.source = PetConst.XUXING_IMG[selectConfig.fiveele];
        var level = model.GetLevel(petId);
        this.lbLev.text = level + "\n级";
        UIHelper.SetLabelText(this.lbPower, "宠物总战力：", model.GetAllPower() + "");
        UIHelper.SetLabelText(this.lbActive, "已激活：", model.GetActiveCount() + "");
        if (level >= model.MAX_LEVEL) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
            var config = GameGlobal.Config.petLvproConfig[selectConfig.rarity][level - 1];
            var costData = config.cost;
        }
        this.btnZZ.icon = model.HasBattle(petId) ? "ui_bt_xiuxi" : "ui_bt_chuzhan";
        this._UpdateExp();
        this.powerLabel.text = petInfo.GetPower();
        this.petShowPanel.SetBody(petInfo.GetSkin());
        PetSkillIconItem.SetContent(this.skillComp, petInfo.GetSkillId(), 0);
        this.UpdateRedPoint();
        this.UpdateYuanfenRedPoint();
    };
    PetUpLevelPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.RP_PET, this.UpdateRedPoint);
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent);
        this.observe(MessageDef.PET_UPATE_EXP, this._DoUpdateExp);
        this.observe(MessageDef.BAG_PET_LEVEL_ITEM, this._UpdateExp);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint);
        this.btnSC.visible = GameGlobal.actorModel.level > GameGlobal.Config.petbaseConfig.openlv;
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
    };
    PetUpLevelPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    PetUpLevelPanel.prototype.UpdateYuanfenRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null));
    };
    PetUpLevelPanel.prototype._OnClick = function (e) {
        var selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex];
        var petId = selectConfig.id;
        switch (e.currentTarget) {
            case this.btnFeis:
                break;
            case this.btnZizhi:
                ViewManager.ins().open(PetZizhiPanel, selectConfig.id);
                break;
            case this.btnShow:
                GameGlobal.PetModel.SetShowId(selectConfig.id);
                break;
            case this.btnZZ:
                if (GameGlobal.PetModel.HasBattle(petId)) {
                    GameGlobal.PetModel.SendUnBattle(petId);
                }
                else {
                    ViewManager.ins().open(PetBattlePanel, petId);
                }
                break;
            case this.btnRename:
                ViewManager.ins().open(PetChangeNamePanel, "宠物改名", MessageDef.PET_UPATE_INFO, GameGlobal.PetModel.GetPetInfo(petId).mName, function (name) {
                    GameGlobal.PetModel.SendRename(petId, name);
                }, this);
                break;
            case this.powerLabel:
                ViewManager.ins().open(PetAttrPanel, petId);
                break;
            case this.btnAdd:
                this._SendUp();
                break;
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.showAllAttr:
                ViewManager.ins().open(PetAllAttrPanel);
                break;
            case this.skillComp:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(petId).GetSkillId());
                break;
            case this.btnSC:
                ViewManager.ins().open(PetTuJianMainPanel);
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    PetUpLevelPanel.prototype.GetPetInfo = function () {
        var selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex];
        var petId = selectConfig.id;
        return GameGlobal.PetModel.GetPetInfo(petId);
    };
    PetUpLevelPanel.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    PetUpLevelPanel.prototype._DoUpdateExp = function () {
        this.mRoleAutoSendData.Continue();
        this._UpdateExp();
    };
    PetUpLevelPanel.prototype._UpdateExp = function () {
        var petInfo = this.GetPetInfo();
        if (!petInfo) {
            return;
        }
        var config = petInfo.GetLevelConfig();
        if (!config) {
            return;
        }
        this.bar.maximum = config.proexp;
        this.bar.value = petInfo.mExp * config.exp;
        this.consumeLabel.Set(config.cost);
    };
    PetUpLevelPanel.RedPointCheck = function () {
        var redPoint = GameGlobal.PetModel.mRedPoint;
        return redPoint.Get(PetModelRedPoint.INDEX_ACT)
            || redPoint.Get(PetModelRedPoint.INDEX_LEVEL)
            || redPoint.Get(PetModelRedPoint.INDEX_BATTLE)
            || redPoint.Get(PetModelRedPoint.INDEX_ZIZHI)
            || GameGlobal.YuanfenModel.IsRedPoint();
    };
    PetUpLevelPanel.NAME = "升级";
    return PetUpLevelPanel;
}(BaseView));
__reflect(PetUpLevelPanel.prototype, "PetUpLevelPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=PetUpLevelPanel.js.map