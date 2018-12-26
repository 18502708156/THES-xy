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
var DeityEquipInjectPanel = (function (_super) {
    __extends(DeityEquipInjectPanel, _super);
    function DeityEquipInjectPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mCurChooseIdx = 0;
        _this.skinName = "DeityEquipInjectSkin";
        return _this;
    }
    DeityEquipInjectPanel.prototype.childrenCreated = function () {
        for (var idx = 0; idx < 10; idx++) {
            this["item" + idx].name = "" + idx;
            this["item" + idx].UnshowDetail();
            this._AddClick(this["item" + idx], this._OnItemClick);
        }
        this.showItem.UnshowDetail();
        this._AddClick(this.btnInject, this._OnClicked);
        this.mCurChooseIdx = GameGlobal.UserEquip.GetDeityEquipPos();
    };
    DeityEquipInjectPanel.prototype.UpdateContent = function () {
        this.SetEquipList();
        this.ChooseEquip();
        this.UpdateRedPoint();
    };
    DeityEquipInjectPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateInfo);
        this.InitProgEff();
    };
    DeityEquipInjectPanel.prototype.OnClose = function () {
    };
    DeityEquipInjectPanel.prototype.UpdateInfo = function () {
        this.ChooseEquip();
        this.UpdateRedPoint();
    };
    DeityEquipInjectPanel.prototype.SetEquipList = function () {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        for (var idx = 0; idx < 10; idx++) {
            var equipData = roleModel.getEquipByIndex(idx);
            this["item" + idx].SetItemInfo(equipData, idx);
        }
    };
    DeityEquipInjectPanel.prototype.ChooseEquip = function () {
        this.SetPopTip();
        this["item" + this.mCurChooseIdx].ChooseItem(true);
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(this.mCurChooseIdx);
        this.showItem.SetItemInfo(equipData, this.mCurChooseIdx, true);
        this.showItem.SetModel(roleModel);
        var injectLv = equipData.deityEquipData.injectLevel;
        var _a = DeityEquipConst.GetInjectProgInfo(this.mCurChooseIdx, injectLv + 1), perNum = _a[0], maxProg = _a[1];
        this.SetProg(Math.floor(equipData.deityEquipData.injectNum * perNum * 100 / maxProg));
        var text = DeityEquipConst.GetRateText(equipData.deityEquipData.injectNum);
        this.labRateInfo.textFlow = TextFlowMaker.generateTextFlow(text);
        var _b = DeityEquipConst.GetInjectAttrText(this.mCurChooseIdx, injectLv), textList = _b[0], specialText = _b[1];
        this.labCurAttr1.text = injectLv == 0 ? "未激活" : textList[0] || "";
        this.labCurAttr2.text = injectLv == 0 ? "未激活" : textList[1] || "";
        this.labCurAttr3.text = injectLv == 0 ? "未激活" : textList[2] || "";
        this.labCurAttr1.textColor = injectLv == 0 ? Color.White : 0xfff01e;
        this.labCurAttr2.textColor = injectLv == 0 ? Color.White : 0xfff01e;
        this.labCurAttr3.textColor = injectLv == 0 ? Color.White : 0xfff01e;
        this.labCurProp.text = injectLv > 0 ? "+" + injectLv + " \u5F53\u524D\u5C5E\u6027" : "\u5F53\u524D\u5C5E\u6027";
        this.groupCurSpecial.visible = specialText != null;
        this.labCurSpecAttr.text = specialText || "";
        if (DeityEquipConst.IsMaxInjectLevel(this.mCurChooseIdx, injectLv)) {
            this.groupCur.x = 284;
            this.groupUpgrade.visible = false;
            this.labMax.visible = true;
            return;
        }
        this.groupCur.x = 164;
        this.groupUpgrade.visible = true;
        this.labMax.visible = false;
        var _c = DeityEquipConst.GetInjectAttrText(this.mCurChooseIdx, injectLv + 1), nextTextList = _c[0], nextSpecialText = _c[1];
        this.labNextAttr1.text = nextTextList[0] || "";
        this.labNextAttr2.text = nextTextList[1] || "";
        this.labNextAttr3.text = nextTextList[2] || "";
        this.labNextProp.text = "+" + (injectLv + 1) + " \u4E0B\u7EA7\u5C5E\u6027";
        this.groupNextSpecial.visible = nextSpecialText != null;
        this.labNextSpecAttr.text = nextSpecialText || "";
        var cost = DeityEquipConst.GetInjectCost(this.mCurChooseIdx, injectLv + 1);
        if (!cost)
            return;
        this.needItemView.SetItemId(cost.id, cost.count);
        this.getwayLabel.SetId(cost.id);
    };
    DeityEquipInjectPanel.prototype.UpdateRedPoint = function () {
        for (var idx = 0; idx < 10; idx++)
            UIHelper.ShowRedPoint(this["item" + idx], GameGlobal.UserEquip.CanTheDeityEquipInject(idx));
    };
    DeityEquipInjectPanel.prototype._OnItemClick = function (e) {
        var curChooseIdx = parseInt(e.currentTarget.name);
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(curChooseIdx);
        var curId = equipData.item.configID;
        if (!DeityEquipConst.IsDeityEquip(curId)) {
            UserTips.ins().showTips("穿戴神装才可以进行注灵");
            return;
        }
        this["item" + this.mCurChooseIdx].ChooseItem(false);
        this.mCurChooseIdx = curChooseIdx;
        this.mTempInjectLv = null;
        this.mTempInjectNum = null;
        this.ChooseEquip();
    };
    DeityEquipInjectPanel.prototype._OnClicked = function () {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(this.mCurChooseIdx);
        var curId = equipData.item.configID;
        var injectLv = equipData.deityEquipData.injectLevel;
        var cost = DeityEquipConst.GetInjectCost(this.mCurChooseIdx, injectLv + 1);
        if (!Checker.Data(cost))
            return;
        GameGlobal.UserEquip.SendDeityEquipInjectSoul(this.mCurChooseIdx, 0);
    };
    DeityEquipInjectPanel.prototype.SetPopTip = function () {
        var _this = this;
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(this.mCurChooseIdx);
        var curInjectNum = equipData.deityEquipData.injectNum;
        var curInjectLevel = equipData.deityEquipData.injectLevel;
        if (!this.mTempInjectNum) {
            this.mTempInjectLv = curInjectLevel;
            this.mTempInjectNum = curInjectNum;
            return;
        }
        var deltaNum = DeityEquipConst.GetDeltaNum(this.mCurChooseIdx, this.mTempInjectNum, this.mTempInjectLv, curInjectNum, curInjectLevel);
        this.mTempInjectLv = curInjectLevel;
        this.mTempInjectNum = curInjectNum;
        if (curInjectNum == 0) {
            this.ShowUpLvEff();
        }
        var lab = new eui.Label;
        lab.text = "+" + deltaNum;
        lab.textColor = Color.Green;
        lab.x = 110;
        lab.y = 100;
        this.groupProg.addChild(lab);
        var t = egret.Tween.get(lab);
        t.to({ "y": 30 }, 300).wait(200).to({ "alpha": 0 }, 100).call(function () {
            _this.groupProg.removeChild(lab);
        });
    };
    DeityEquipInjectPanel.prototype.InitProgEff = function () {
        if (this.mProgEff)
            return;
        var shape = new egret.Shape;
        shape.graphics.beginFill(0xffffff, 1);
        shape.graphics.drawCircle(121, 97, 49);
        shape.graphics.endFill();
        this.groupProg.addChild(shape);
        this.mProgEff = new MovieClip;
        this.mProgEff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi002"), true, -1);
        this.mProgEff.x = 121;
        this.mProgEff.y = 210;
        this.mProgEff.mask = shape;
        this.groupProg.addChild(this.mProgEff);
    };
    DeityEquipInjectPanel.prototype.SetProg = function (percent) {
        this.mProgEff.y = 210 - percent;
    };
    DeityEquipInjectPanel.prototype.ShowUpLvEff = function () {
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi003"), true, 1);
        eff.x = 121;
        eff.y = 97;
        this.groupProg.addChild(eff);
    };
    DeityEquipInjectPanel.NAME = "注灵";
    return DeityEquipInjectPanel;
}(BaseView));
__reflect(DeityEquipInjectPanel.prototype, "DeityEquipInjectPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DeityEquipInjectPanel.js.map