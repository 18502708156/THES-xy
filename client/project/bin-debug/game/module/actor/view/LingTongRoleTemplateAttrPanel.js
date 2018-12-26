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
var LingTongRoleTemplateAttrPanel = (function (_super) {
    __extends(LingTongRoleTemplateAttrPanel, _super);
    function LingTongRoleTemplateAttrPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LingTongRoleTemplateAttrPanel.prototype.ShowModel = function (pid) {
        this.ridePanel.SetBodyId(this.mPid);
    };
    LingTongRoleTemplateAttrPanel.prototype.UpdateSkinLabel = function () {
        this.skinLabel.text = "天赋属性加成";
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPid);
        if (!info) {
            return;
        }
        var config = GameGlobal.Config.BabyTalentConfig[info.mId][info.mGiftLevel - 1];
        if (!config) {
            UIHelper.SetVisible(this.skinAttr.parent, false);
            return;
        }
        var attr3 = GameGlobal.LingtongAttrModel.getTianFuAllAttr(info.mId, info.mGiftLevel, info.mGiftExp);
        if (attr3 && attr3.length) {
            this.skinAttr.textFlow = AttributeData.GetAttrTabString(attr3);
        }
        else {
            UIHelper.SetVisible(this.skinAttr.parent, false);
        }
        return attr3;
    };
    LingTongRoleTemplateAttrPanel.prototype.UpdateDrugLabel = function () {
        this.drugLabel.text = "御灵属性加成";
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPid);
        if (!info) {
            var list_1 = [];
            for (var i = 1; i <= 5; i++) {
                var attrData = LingtongConst.GetLingAttr(this.mPid, i, 1);
                list_1.push({ type: attrData.type, value: 0 });
            }
            return list_1;
        }
        var list = [];
        for (var i = 1; i <= 5; i++) {
            var lv = info.getLingByIndex(i);
            var attrData = void 0;
            if (!lv) {
                attrData = CommonUtils.copyDataHandler(LingtongConst.GetLingAttr(this.mPid, i, 1));
                attrData.value = 0;
            }
            else {
                attrData = LingtongConst.GetLingAttr(this.mPid, i, lv);
            }
            list.push(attrData);
        }
        return list;
    };
    LingTongRoleTemplateAttrPanel.prototype.UpdateSkillLabel = function () {
        this.skillLabel.text = "御魂属性加成";
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPid);
        if (!info) {
            var list_2 = [];
            return list_2;
        }
        var list = [];
        for (var i = 1; i <= 6; i++) {
            var lv = info.getHunByIndex(i);
            var attrData = void 0;
            if (!lv) {
                attrData = CommonUtils.copyDataHandler(LingtongConst.GetHunAttr(info.suitConfigId, i, 1));
                attrData.value = 0;
            }
            else {
                attrData = LingtongConst.GetHunAttr(info.suitConfigId, i, lv);
            }
            AttributeData.AttrAddToByArray(list, attrData);
        }
        this.skillAttr.textFlow = AttributeData.GetAttrTabString(list);
        return list;
    };
    LingTongRoleTemplateAttrPanel.prototype.GetAttr = function () {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPid);
        if (!info) {
            return [];
        }
        return info.GetAttr();
    };
    return LingTongRoleTemplateAttrPanel;
}(RoleTemplateAttrPanel));
__reflect(LingTongRoleTemplateAttrPanel.prototype, "LingTongRoleTemplateAttrPanel");
//# sourceMappingURL=LingTongRoleTemplateAttrPanel.js.map