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
var DeityEquipAwakePanel = (function (_super) {
    __extends(DeityEquipAwakePanel, _super);
    function DeityEquipAwakePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mCurChooseIdx = 0;
        _this.mAwakeFlag = false;
        _this.skinName = "DeityEquipAwakeSkin";
        return _this;
    }
    DeityEquipAwakePanel.prototype.childrenCreated = function () {
        for (var idx = 0; idx < 10; idx++) {
            this["item" + idx].name = "" + idx;
            this["item" + idx].UnshowDetail();
            this._AddClick(this["item" + idx], this._OnItemClick);
        }
        this.itemCur.UnshowDetail();
        this._AddClick(this.btnAwake, this._OnClicked);
        this._AddClick(this.labResolve, this._OnTap);
    };
    DeityEquipAwakePanel.prototype.UpdateContent = function () {
        this.SetEquipList();
        this.ChooseEquip();
        this.UpdateRedPoint();
        this.ShowAwakeEff();
    };
    DeityEquipAwakePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateContent);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        UIHelper.SetLinkStyleLabel(this.labResolve);
    };
    DeityEquipAwakePanel.prototype.OnClose = function () {
    };
    DeityEquipAwakePanel.prototype.SetEquipList = function () {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        for (var idx = 0; idx < 10; idx++) {
            var equipData = roleModel.getEquipByIndex(idx);
            this["item" + idx].SetItemInfo(equipData, idx);
        }
    };
    DeityEquipAwakePanel.prototype.ChooseEquip = function () {
        this["item" + this.mCurChooseIdx].ChooseItem(true);
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(this.mCurChooseIdx);
        this.itemCur.SetItemInfo(equipData, this.mCurChooseIdx, true);
        this.itemCur.SetModel(roleModel);
        var curId = equipData.item.configID;
        var deityEquipFlag = DeityEquipConst.IsDeityEquip(curId);
        var textList = DeityEquipConst.GetEquipAttrText(curId);
        this.labCurAttr1.text = deityEquipFlag ? textList[0] || "" : "未觉醒";
        this.labCurAttr2.text = deityEquipFlag ? textList[1] || "" : "未觉醒";
        this.labCurAttr3.text = deityEquipFlag ? textList[2] || "" : "未觉醒";
        this.labCurAttr1.textColor = deityEquipFlag ? 0xfff01e : Color.White;
        this.labCurAttr2.textColor = deityEquipFlag ? 0xfff01e : Color.White;
        this.labCurAttr3.textColor = deityEquipFlag ? 0xfff01e : Color.White;
        if (DeityEquipConst.IsMaxAwakeLevel(curId)) {
            this.groupCur.x = 284;
            this.labMax.visible = true;
            this.groupUpgrade.visible = false;
            return;
        }
        this.groupCur.x = 151;
        this.labMax.visible = false;
        this.groupUpgrade.visible = true;
        var nextEquipId = DeityEquipConst.GetNextDeityEquipId(curId, this.mCurChooseIdx);
        this.itemNext.SetItemConfigId(nextEquipId);
        var nextTextList = DeityEquipConst.GetEquipAttrText(nextEquipId);
        this.labNextAttr1.text = nextTextList[0] || "";
        this.labNextAttr2.text = nextTextList[1] || "";
        this.labNextAttr3.text = nextTextList[2] || "";
        this.btnAwake.label = DeityEquipConst.IsDeityEquip(curId) ? "觉醒" : "合成";
        var cost = DeityEquipConst.GetAwakeCost(curId, this.mCurChooseIdx);
        if (!cost)
            return;
        this.needItemView.SetItemId(cost.id, cost.count);
        this.getwayLabel.SetId(cost.id);
    };
    DeityEquipAwakePanel.prototype._OnItemClick = function (e) {
        this["item" + this.mCurChooseIdx].ChooseItem(false);
        this.mCurChooseIdx = parseInt(e.currentTarget.name);
        this.ChooseEquip();
    };
    DeityEquipAwakePanel.prototype.UpdateRedPoint = function () {
        this.imgRed.visible = GameGlobal.UserEquip.HasDeityEquipResolve();
        for (var idx = 0; idx < 10; idx++)
            UIHelper.ShowRedPoint(this["item" + idx], GameGlobal.UserEquip.CanTheDeityEquipAwake(idx));
    };
    DeityEquipAwakePanel.prototype.ShowAwakeEff = function () {
        if (!this.mAwakeFlag)
            return;
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi001"), true, 1);
        this.groupEff.addChild(eff);
        this.mAwakeFlag = false;
    };
    DeityEquipAwakePanel.prototype._OnTap = function () {
        ViewManager.ins().open(DeityEquipResolveWin);
    };
    DeityEquipAwakePanel.prototype._OnClicked = function () {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(this.mCurChooseIdx);
        var curId = equipData.item.configID;
        var nextEquipId = DeityEquipConst.GetNextDeityEquipId(curId, this.mCurChooseIdx);
        var nextConfig = GameGlobal.Config.ItemConfig[nextEquipId];
        if (nextConfig && nextConfig.level > GameGlobal.actorModel.level) {
            UserTips.ins().showTips("等级不足，不可以觉醒该装备");
            return;
        }
        var cost = DeityEquipConst.GetAwakeCost(curId, this.mCurChooseIdx);
        if (!Checker.Data(cost))
            return;
        if (!DeityEquipConst.IsDeityEquip(curId)) {
            GameGlobal.UserEquip.SendComposeDeityEquip(this.mCurChooseIdx);
        }
        else {
            this.mAwakeFlag = true;
            GameGlobal.UserEquip.SendDeityEquipAwake(this.mCurChooseIdx);
        }
    };
    DeityEquipAwakePanel.NAME = "觉醒";
    return DeityEquipAwakePanel;
}(BaseView));
__reflect(DeityEquipAwakePanel.prototype, "DeityEquipAwakePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DeityEquipAwakePanel.js.map