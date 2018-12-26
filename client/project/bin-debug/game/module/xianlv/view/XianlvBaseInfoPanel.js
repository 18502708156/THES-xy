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
var XianlvBaseInfoPanel = (function (_super) {
    __extends(XianlvBaseInfoPanel, _super);
    function XianlvBaseInfoPanel() {
        return _super.call(this) || this;
    }
    XianlvBaseInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.baseView.allAttrBtn, this._OnClickBtn);
        this._AddClick(this.baseView.powerLabel, this._OnClickBtn);
        this._AddClick(this.baseView.skillComp, this._OnClickBtn);
        this._AddClick(this.baseView.btnSC, this._OnClickBtn);
    };
    XianlvBaseInfoPanel.prototype._OnClickBtn = function (e) {
        switch (e.currentTarget) {
            case this.baseView.allAttrBtn:
                ViewManager.ins().open(XianlvAllAttrPanel);
                break;
            case this.baseView.skillComp:
                var xianlvId = this.mContext.mXianlvList[this.mContext.mSelectIndex].id;
                var xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId);
                ViewManager.ins().open(XianlvSkillTipPanel, xianlvInfo.GetSkillId(), xianlvInfo.GetSkillId(1), xianlvInfo.mStar);
                break;
            case this.baseView.powerLabel:
                if (this.baseView.currentState == "inactive") {
                }
                else {
                    var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
                    ViewManager.ins().open(XianlvAttrPanel, selectConfig.id);
                }
                break;
            case this.baseView.btnSC:
                ViewManager.ins().open(XianlvQyPanel);
                break;
            default:
                break;
        }
    };
    XianlvBaseInfoPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.XianlvModel;
        var selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex];
        var xianlvId = selectConfig.id;
        if (!model.HasXianlv(xianlvId)) {
            this.group.visible = false;
            return;
        }
        var xianlvInfo = model.GetXianlvInfo(xianlvId);
        this.group.visible = true;
        this.UpdateInfo(xianlvId);
        XianlvBaseInfoPanel.SetStarGroup(this.baseView.starGroup, xianlvInfo.mStar);
        this.baseView.btnZZ.icon = model.HasBattle(xianlvId) ? "ui_bt_xiuxi" : "ui_bt_chuzhan";
        this.baseView.lbLev.text = xianlvInfo.mLevel + "\n阶";
    };
    XianlvBaseInfoPanel.SetStarGroup = function (group, star) {
        for (var i = 0; i < group.numChildren; i++) {
            var item = group.getChildAt(i);
            item.source = i < star ? "ui_bm_star022" : "ui_bm_star021";
        }
    };
    XianlvBaseInfoPanel.prototype.UpdateInfo = function (id) {
        var model = GameGlobal.XianlvModel;
        var xianlvInfo = model.GetXianlvInfo(id);
        this.baseView.petShowPanel.SetBody(xianlvInfo.GetSkin());
        this.baseView.lbPower.text = "仙侣总战力：" + model.GetAllPower();
        this.baseView.lbActive0.text = "已出战：" + model.GetBattleCount() + "/2";
        this.baseView.lbActive.text = "已激活：" + model.GetActiveCount();
        this.baseView.powerLabel.text = xianlvInfo.GetPower(xianlvInfo.mLevel == 0 ? 1 : xianlvInfo.mLevel);
        var star = Math.max(xianlvInfo.mStar, 1);
        this.baseView.starNum.text = star.toString();
        PetSkillIconItem.SetContent(this.baseView.skillComp, xianlvInfo.GetSkillId(), 0);
    };
    return XianlvBaseInfoPanel;
}(BaseView));
__reflect(XianlvBaseInfoPanel.prototype, "XianlvBaseInfoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=XianlvBaseInfoPanel.js.map