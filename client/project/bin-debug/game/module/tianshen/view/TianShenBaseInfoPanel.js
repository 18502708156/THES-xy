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
var TianShenBaseInfoPanel = (function (_super) {
    __extends(TianShenBaseInfoPanel, _super);
    function TianShenBaseInfoPanel() {
        var _this = _super.call(this) || this;
        _this.model = GameGlobal.TianShenModel;
        return _this;
    }
    TianShenBaseInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.baseView.powerLabel, this._OnClickBtn);
        this._AddClick(this.baseView.btnYF, this._OnClickBtn);
        this._AddClick(this.baseView.btnSXD, this._OnClickBtn);
        this._AddClick(this.baseView.btnYuanfen, this._OnClickBtn);
        this._AddItemClick(this.baseView.skillList, this._OnItemClick);
    };
    TianShenBaseInfoPanel.prototype._OnClickBtn = function (e) {
        switch (e.currentTarget) {
            case this.baseView.btnSXD:
                ViewManager.ins().open(TianShenAttrDrugPanel);
                break;
            // case this.baseView.powerLabel:
            //     if (this.baseView.currentState == "inactive") {
            //     } else {
            //         let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex]
            //         ViewManager.ins().open(XianlvAttrPanel, selectConfig.id)
            //     }
            //     break;
            // case this.baseView.btnYF:
            //     ViewManager.ins().open(XianlvQyPanel)
            //     break;
            default:
                break;
        }
    };
    TianShenBaseInfoPanel.prototype.UpdateContent = function () {
        var selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex];
        var tianShenId = selectConfig.id;
        if (!this.model.HasTianShen(tianShenId)) {
            this.group.visible = false;
            return;
        }
        this.group.visible = true;
        var tianShenInfo = this.model.mTianShenList[tianShenId];
        this.UpdateInfo(tianShenId);
        this.baseView.btnZZ.icon = this.model.mBattleID == tianShenId ? "ui_bt_xiuxi" : "ui_bt_chuzhan";
        this.baseView.lbLev.text = tianShenInfo.mLevel + "\n阶";
    };
    TianShenBaseInfoPanel.prototype.UpdateInfo = function (id) {
        var tianshenInfo = this.model.mTianShenList[id];
        this.baseView.petShowPanel.SetBody(tianshenInfo.GetSkin());
        this.baseView.powerLabel.text = tianshenInfo.GetPower(tianshenInfo.mLevel == 0 ? 1 : tianshenInfo.mLevel);
        this.baseView.tname.text = this.mContext.mTianShenList[this.mContext.mSelectIndex].name;
        this.baseView.tname.textColor = ItemBase.GetColorByQuality(this.mContext.mTianShenList[this.mContext.mSelectIndex].quality);
        this.baseView.skillList.itemRenderer = TianShenSkillIcon;
        this.skillIds = [];
        var baseConfig = GameGlobal.Config.AirMarshalBaseConfig;
        this.skillIds.length = 6;
        this.skillIds[0] = baseConfig.skill;
        this.skillIds[1] = baseConfig.hskill;
        var ids = this.model.mTianShenList[id].GetSkillIds();
        for (var i = 0; i < ids.length; i++) {
            this.skillIds[i + 2] = ids[i];
        }
        this.baseView.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
    };
    TianShenBaseInfoPanel.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        var skillId = this.skillIds[index];
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 2);
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false);
    };
    return TianShenBaseInfoPanel;
}(BaseView));
__reflect(TianShenBaseInfoPanel.prototype, "TianShenBaseInfoPanel", ["ICommonWindowTitle"]);
var TianShenSkillIcon = (function (_super) {
    __extends(TianShenSkillIcon, _super);
    function TianShenSkillIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    TianShenSkillIcon.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var skillId = this.data;
        var quality;
        if (1 < this.itemIndex) {
            this.useTypeImg.source = "ui_tn_bm_bei";
            quality = PetConst.GetPassSkillQuality(skillId);
            this.iconImg.source = PetConst.GetPassSkillIcon(skillId);
        }
        else {
            // this.useTypeImg.source = 0 == this.itemIndex ? 'ui_bm_zhu' : 'ui_tn_bm_he';
            this.useTypeImg.source = 'ui_bm_zhu';
            quality = PetConst.GetSkillQuality(skillId);
            this.iconImg.source = PetConst.GetSkillIcon(skillId);
        }
        this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
    };
    return TianShenSkillIcon;
}(eui.ItemRenderer));
__reflect(TianShenSkillIcon.prototype, "TianShenSkillIcon");
//# sourceMappingURL=TianShenBaseInfoPanel.js.map