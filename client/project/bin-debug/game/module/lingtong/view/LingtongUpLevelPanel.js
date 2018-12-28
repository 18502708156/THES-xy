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
var LingtongUpLevelPanel = (function (_super) {
    __extends(LingtongUpLevelPanel, _super);
    // public static RedPointCheck(): boolean {
    //     return GameGlobal.UserRide.mRedPoint.IsRedPoint()
    // }
    function LingtongUpLevelPanel() {
        var _this = _super.call(this) || this;
        // protected itemGroup: eui.Group
        /////////////////////////////////////////////////////////////////////////////
        _this.mModel = GameGlobal.LingtongModel;
        _this.mModelRedPoint = GameGlobal.LingtongModel.mRedPoint;
        _this.mShowLevel = 0;
        _this.skinName = "LingtongUpLevelSkin";
        _this.skillList.itemRenderer = LinglongSkillItem;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this.SendUp()) {
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
            if (_this.mModel) {
                _this.mModel.SendBoost(type);
            }
        }, function () {
            var model = _this.mModel;
            var levelConfig = _this.mModel.LvproConfig[model.mLevel];
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
        _this.lbFull.text = _this.name + "已满阶";
        return _this;
    }
    LingtongUpLevelPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
        this._AddClick(this.btnAttrDrug, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
        this._AddClick(this.btnSkin, this._OnClick);
        this._AddClick(this.btn_juexing, this._OnClick);
        this._AddClick(this.btnRename, this._OnClick);
        this._AddClick(this.skillComp, this._OnClick);
        this._AddItemClick(this.skillList, this._OnItemClick);
    };
    LingtongUpLevelPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp);
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent);
        // this.observe(MessageDef.DESTINY_CHANGE, this.UpdateEquip)
        // this.observe(MessageDef.DESTINY_RP, this.UpdateEquip)
        // this.UpdateEquip()
        this.mShowLevel = this.mModel.mLevel;
        if (!this.mShowLevel) {
            return;
        }
        this.UpdateModel(Math.max(this.mShowLevel, 1));
        this.UpdateContent();
        this.UpdateRedPoint();
        // this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
        // this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
        // this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp)
        // this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
        // this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
        // this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent)
        // this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//背包变化更新
    };
    LingtongUpLevelPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    // private UpdateEquip() {
    // 	let datas = GameGlobal.DestinyController.getUseDestinyData()
    // 	let i = 0
    // 	for (let i = 0; i < 6; i++) {
    // 		let data = datas[i]
    // 		let item = this.itemGroup.getChildAt(i)	as DestinySItem
    // 		if (item) {
    // 			item.onUpdate(i, data)
    // 		}
    // 	}
    // }
    LingtongUpLevelPanel.prototype._OnItemClick = function (e) {
        if (!e.item) {
            return;
        }
        if (e.itemIndex == 0) {
            ViewManager.ins().open(PetSkillTipPanel, 0, e.item);
        }
        else {
            ViewManager.ins().open(PetSkillTipPanel, 2, e.item);
        }
    };
    LingtongUpLevelPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.skillComp:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId());
                break;
            case this.btnCulture:
                this.SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel);
                break;
            case this.powerLabel:
                ViewManager.ins().open(LingTongRoleTemplateAttrPanel, this.mModel, "灵童", this.mModel.GetLevelSkin(this.mShowLevel));
                break;
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel);
                break;
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType);
                break;
            case this.btnRename:
                ViewManager.ins().open(PetChangeNamePanel, "灵童改名", MessageDef.LINGTONG_UPDATE_INFO, GameGlobal.LingtongAttrModel.mName, function (name) {
                    GameGlobal.LingtongAttrModel.SendRename(name);
                }, this);
                break;
        }
    };
    LingtongUpLevelPanel.prototype.SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    LingtongUpLevelPanel.prototype.UpdateExp = function (upLevel) {
        if (upLevel || this.mShowLevel == 0) {
            this.UpdateModel(this.mShowLevel + 1);
            // this.mRoleAutoSendData.Stop()
        }
        // else {
        this.mRoleAutoSendData.Continue();
        // }
    };
    LingtongUpLevelPanel.prototype.UpdateContent = function () {
        var model = this.mModel;
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return;
        }
        // PetSkillIconItem.SetContent(this.skillComp as any, GameGlobal.LingtongAttrModel.GetSkillId(), 0)
        var list = [GameGlobal.LingtongAttrModel.GetSkillId()];
        for (var _i = 0, _a = GameGlobal.LingtongAttrModel.mBuffSkill; _i < _a.length; _i++) {
            var id = _a[_i];
            list.push(id);
        }
        for (var i = list.length; i < PetModel.SKILL_COUNT; i++) {
            list.push(null);
        }
        this.skillList.dataProvider = new eui.ArrayCollection(list);
        this.skillList.validateNow();
        for (var i = 0; i < this.skillList.numChildren; i++) {
            var item = this.skillList.getChildAt(i);
            if (!item.mIsLock) {
                item.skillName.visible = false;
            }
        }
        // let config = GameGlobal.Config.BabyBasisConfig.openSkill
        // 	if(config[this.itemIndex])
        // 	{
        // 		str = config[this.itemIndex]+ "阶解锁"
        // 	}
        this.powerLabel.text = model.GetDescPower() + GameGlobal.DestinyController.GetPower();
        if (!model.mLevel) {
            this.currentState = "none";
            return;
        }
        if (this.mModel.mLevel >= this.mModel.mMaxLevel) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        var levelConfig = this.mModel.LvproConfig[model.mLevel];
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = model.mUpNum * levelConfig.exp;
        this.UpdateItemContent();
        this.UpdateModel(this.mShowLevel);
    };
    LingtongUpLevelPanel.prototype.UpdateItemContent = function () {
        var levelConfig = this.mModel.LvproConfig[this.mModel.mLevel];
        if (!levelConfig) {
            return;
        }
        this.consumeLabel.Set(levelConfig.cost);
    };
    LingtongUpLevelPanel.prototype.UpdateRedPoint = function () {
        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN));
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM));
        UIHelper.ShowRedPoint(this.btn_juexing, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD));
        UIHelper.ShowRedPoint(this.btnAuto, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK));
        UIHelper.ShowRedPoint(this.btnCulture, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK));
    };
    LingtongUpLevelPanel.prototype.UpdateModel = function (level) {
        var model = this.mModel;
        this.mShowLevel = level;
        this.lbName.text = GameGlobal.LingtongAttrModel.mName || "";
        this.lbLev.text = level + "\n阶";
        LingtongViewHelper.SetRole(this.showPanel);
    };
    LingtongUpLevelPanel.RedPointCheck = function () {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_ACTIVE) || GameGlobal.LingtongModel.mRedPoint.IsRedPoint();
    };
    LingtongUpLevelPanel.NAME = "升阶";
    return LingtongUpLevelPanel;
}(BaseView));
__reflect(LingtongUpLevelPanel.prototype, "LingtongUpLevelPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LingtongUpLevelPanel.js.map