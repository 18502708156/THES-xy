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
var ForgePanel = (function (_super) {
    __extends(ForgePanel, _super);
    function ForgePanel() {
        var _this = _super.call(this) || this;
        _this.mSelectIndex = 0;
        _this.lv = 0;
        _this.mLevelList = [];
        _this.mIsUpdate = false;
        return _this;
    }
    ForgePanel.prototype.childrenCreated = function () {
        this.equipComp.consumeLabel.mIsImg = true;
        UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel);
    };
    ForgePanel.prototype.UpdateContent = function () {
        this.UpdateConsumeLabel();
        this.UpdateMasterValue();
    };
    ForgePanel.prototype.OnOpen = function () {
        // this.equipComp.consumeLabel.consumeItemId = this.mConsumeTypeId
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return;
        }
        this.UpdateAllItem();
        this.mSelectIndex = role.getMinEquipIndexByType(this.mForgeType);
        this.UpdateSel(this.mSelectIndex);
        this.UpdateContent();
        // this.equipComp.getwayLabel.visible = true
        var data = this.GetConsumeValue();
        var txt = "";
        if (data) {
            var config = GameGlobal.Config.ItemConfig[data.id];
            if (config) {
                txt = "获取" + config.name;
            }
        }
        UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel, txt);
    };
    ForgePanel.prototype.OnClose = function () {
        this._StopUpgradeAnim();
    };
    ForgePanel.prototype.UpdateConsumeLabel = function () {
        var consumeLabel = this.equipComp.consumeLabel;
        var data = this.GetConsumeValue();
        if (!data) {
            return;
        }
        consumeLabel.consumeItemId = data.id;
        if (data.type == 0) {
            consumeLabel.overLengthFlag = true;
            consumeLabel.curValue = GameGlobal.actorModel.gold;
            consumeLabel.consumeValue = data.count;
        }
        else {
            consumeLabel.overLengthFlag = false;
            consumeLabel.curValue = GameGlobal.UserBag.GetCount(data.id);
            consumeLabel.consumeValue = data.count;
        }
    };
    ForgePanel.prototype.UpdateMasterValue = function () {
        this.equipComp.powerLabel.text = GameGlobal.SubRoles.GetRoleData().getForgeTotalPower(this.mForgeType);
        ForgeViewHelper.UpdateMasterBtn(this.mForgeType, this.equipComp.masterBtn);
    };
    ForgePanel.prototype.UpdateSelAnim = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        var nextId = (this.mSelectIndex + 1) % EquipPos.MAX;
        var equipData = role.getEquipByIndex(nextId);
        var val = this.GetForgeValue(equipData);
        this.mSelectIndex = nextId;
        if (val == this.mLevelList[nextId]) {
            this._StopUpgradeAnim();
        }
        this.UpdateSel(this.mSelectIndex);
    };
    ForgePanel.prototype.UpdateForge = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        var val = this.GetForgeValue(role.getEquipByIndex(this.mSelectIndex));
        if (val != this.mLevelList[this.mSelectIndex]) {
            this.UpdateSel(this.mSelectIndex);
            this._PlayUpgradeAnim();
        }
    };
    ForgePanel.prototype.UpdateAllItem = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return;
        }
        for (var i = 0; i < this.equipComp.itemGroup.numChildren; i++) {
            var equipData = role.getEquipByIndex(i);
            if (!equipData) {
                continue;
            }
            var child = this.equipComp.itemGroup.getChildAt(i);
            var val = this.GetForgeValue(equipData);
            this.mLevelList[i] = val;
            child.starLevel.text = "+" + val;
        }
    };
    ForgePanel.prototype.UpdateSel = function (index) {
        var role = GameGlobal.SubRoles.GetRoleData();
        for (var i = 0; i < this.equipComp.itemGroup.numChildren; i++) {
            this.equipComp.itemGroup.getChildAt(i).selectImg.visible = index == i;
        }
        var equipData = role.getEquipByIndex(index);
        var val = this.GetForgeValue(equipData);
        if (this.mLevelList[index] != val) {
            var forgeEquipItem = this.equipComp.itemGroup.getChildAt(index);
            forgeEquipItem.eff = new MovieClip;
            forgeEquipItem.eff.loadUrl(ResDataPath.GetUIEffePath2("ui_eff_qh_001"), true, 1);
            forgeEquipItem.eff.x = forgeEquipItem.width >> 1;
            forgeEquipItem.eff.y = forgeEquipItem.height >> 1;
            forgeEquipItem.addChild(forgeEquipItem.eff);
        }
        this.mLevelList[index] = val;
        this.equipComp.itemGroup.getChildAt(index).starLevel.text = "+" + val;
        this.lv = val;
        this.config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgeType);
        this.nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgeType);
        // if (val) {
        // 	let config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgetType)
        // 	this.text_1.text = AttributeData.getAttStr(config.attr)
        // } else {
        // 	this.text_1.text = "未激活"
        // }
        // let nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgetType)
        // if (nextConfig) {
        // this.text_2.text = AttributeData.getAttStr(nextConfig.attr, 0)
        // }
        var isFull = !this.nextConfig ? true : false;
        // UIHelper.SetVisible(this.arrowImg, !isFull)
        // UIHelper.SetVisible(this.text_2, !isFull)
        this.equipComp.upGroup.visible = !isFull;
        this.equipComp.fullLabel.visible = isFull;
        this.SetAttrData(this.config, this.nextConfig);
    };
    ForgePanel.prototype.SetAttrData = function (config, nextConfig) {
    };
    ForgePanel.prototype.GetForgeValue = function (data) {
        return 0;
    };
    ForgePanel.prototype.CheckUpgrade = function () {
        var data = this.GetConsumeValue();
        if (!data) {
            return false;
        }
        if (data.type == 0) {
            return Checker.Money(data.id, data.count);
        }
        else {
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                return true;
            }
        }
        return false;
    };
    ForgePanel.prototype.SendUpgrade = function () {
        if (this.mIsUpdate) {
            return;
        }
        GameGlobal.ForgeModel.SendUpGrade(this.mForgeType);
    };
    ForgePanel.prototype._PlayUpgradeAnim = function () {
        if (this.mIsUpdate) {
            return;
        }
        this.mIsUpdate = true;
        this.AddTimer(100, 0, this.UpdateSelAnim);
    };
    ForgePanel.prototype._StopUpgradeAnim = function () {
        if (!this.mIsUpdate) {
            return;
        }
        this.mIsUpdate = false;
        TimerManager.ins().remove(this.UpdateSelAnim, this);
        this.UpdateContent();
    };
    ForgePanel.prototype.GetConsumeValue = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        var _a = role.GetMinEquipIndexAndLevel(this.mForgeType), index = _a[0], lv = _a[1];
        var costConfig = GameGlobal.ForgeModel.GetConfigCostData(this.mForgeType, lv + 1);
        if (costConfig) {
            return costConfig.cost;
        }
        return null;
    };
    return ForgePanel;
}(BaseView));
__reflect(ForgePanel.prototype, "ForgePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=ForgePanel.js.map