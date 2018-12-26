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
var PetXilianPanel = (function (_super) {
    __extends(PetXilianPanel, _super);
    function PetXilianPanel() {
        var _this = _super.call(this) || this;
        _this.mItemLeft = [];
        _this.mItemRight = [];
        _this.skinName = "PetXilianSkillSkin";
        _this.commonWindowBg.SetTitle("技能洗练");
        _this._AddClick(_this.btn01, _this._OnClick);
        _this._AddClick(_this.btn02, _this._OnClick);
        _this._AddClick(_this.btnchage, _this._OnClick);
        _this._AddClick(_this.btnInfo, _this._OnClick);
        for (var i = 0; i < _this.group01.numChildren; i++) {
            var item = _this.group01.getChildAt(i);
            _this.SetBg(item, i);
            _this.mItemLeft.push(item);
            item.lockImg.name = i + "";
            _this._AddClick(item.lockImg, _this._OnLockClick);
            item.skillGroup.name = i.toString();
            _this._AddClick(item.skillGroup, _this._OnSkillIconClick);
        }
        for (var i = 0; i < _this.group02.numChildren; i++) {
            var item = _this.group02.getChildAt(i);
            _this.SetBg(item, i);
            _this.mItemRight.push(item);
            item.skillGroup.name = i.toString();
            _this._AddClick(item.skillGroup, _this._OnRightSkillIconClick);
        }
        _this.consume01.mIsImg = true;
        _this.consume02.mIsImg = true;
        return _this;
    }
    PetXilianPanel.prototype.SetBg = function (item, index) {
        item.bgImg.source = index % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02";
    };
    PetXilianPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mPetId = param[0];
        this.commonWindowBg.OnAdded(this);
        var buffSkill = this.GetBuffSkill();
        var len = buffSkill.length;
        for (var i = 0; i < len; i++) {
            var leftItem = this.mItemLeft[i];
            leftItem.skillGroup.visible = true;
            leftItem.lockGroup.visible = false;
            var rightItem = this.mItemRight[i];
            rightItem.skillGroup.visible = true;
            rightItem.lockGroup.visible = false;
        }
        for (var i = len; i < this.mItemLeft.length; i++) {
            var leftItem = this.mItemLeft[i];
            leftItem.lockImg.visible = false;
            leftItem.skillGroup.visible = false;
            leftItem.lockGroup.visible = true;
            leftItem.skillName.text = "";
            leftItem.skillDesc.text = "未开放";
            var rightItem = this.mItemRight[i];
            rightItem.lockImg.visible = false;
            rightItem.skillGroup.visible = false;
            rightItem.lockGroup.visible = true;
            rightItem.skillName.text = "";
            rightItem.skillDesc.text = "未开放";
        }
        this.GetMsgDef();
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    PetXilianPanel.prototype.GetMsgDef = function () {
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent);
    };
    PetXilianPanel.prototype.GetBuffSkill = function () {
        var petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId);
        var buffSkill = petInfo.mBuffSkill;
        return buffSkill;
    };
    PetXilianPanel.prototype.GetXilianSkill = function (i) {
        var petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId);
        return petInfo.mXilianSkill[i];
    };
    PetXilianPanel.prototype.SendSkillXilian = function () {
        GameGlobal.PetModel.SendSetXilian(this.mPetId);
    };
    PetXilianPanel.prototype.SendSendXilian = function (list, type) {
        GameGlobal.PetModel.SendXilian(this.mPetId, list, type, this.checkBox.selected);
    };
    PetXilianPanel.prototype.GetBaseConfig = function () {
        return GameGlobal.Config.petbaseConfig;
    };
    PetXilianPanel.prototype.UpdateContent = function () {
        var buffSkill = this.GetBuffSkill();
        var len = buffSkill.length;
        for (var i = 0; i < len; i++) {
            var leftItem = this.mItemLeft[i];
            var skillId = buffSkill[i];
            this.SetData(leftItem, skillId);
        }
        for (var i = 0; i < len; i++) {
            var rightItem = this.mItemRight[i];
            var data = this.GetXilianSkill(i);
            if (data) {
                this.SetData(rightItem, data);
            }
            else {
                rightItem.skillImg.source = "";
                rightItem.skillImg.source = "ui_cw_bm_cheng";
                rightItem.skillName.text = "";
                rightItem.skillDesc.text = "未洗练";
            }
        }
        var baseConfig = this.GetBaseConfig();
        var data1 = baseConfig.freshitemid[0];
        this.consume01.consumeItemId = data1.itemId;
        this.consume01.curValue = GameGlobal.UserBag.GetCount(data1.itemId);
        this.consume01.consumeValue = 1;
        var data2 = baseConfig.freshitemid[1];
        this.consume02.consumeItemId = data2.itemId;
        this.consume02.curValue = GameGlobal.UserBag.GetCount(data2.itemId);
        this.consume02.consumeValue = 1;
    };
    PetXilianPanel.GetSkillNameColor = function (skillName) {
        var sName = "";
        for (var i = 0, len = skillName.length; i < len; i++) {
            var str = skillName.charAt(i);
            sName += "|C:" + ItemBase.SKILL_NAME_COLOR[i % ItemBase.SKILL_NAME_COLOR.length] + "&T:" + str;
        }
        return TextFlowMaker.generateTextFlow(sName);
    };
    PetXilianPanel.prototype.SetData = function (item, skillId) {
        var quality = PetConst.GetPassSkillQuality(skillId);
        item.qImg.source = PetConst.QUALITY_SKILL_BG[quality];
        item.skillImg.source = PetConst.GetPassSkillIcon(skillId);
        var skillName = PetConst.GetPassSkillName(skillId);
        if (quality == 6) {
            item.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName);
        }
        else {
            item.skillName.text = skillName;
            item.skillName.textColor = ItemBase.GetColorByQuality(quality);
        }
        item.skillDesc.text = PetConst.GetPassSkillDesc(skillId);
    };
    PetXilianPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btn01:
                this.SendXilian(0);
                break;
            case this.btn02:
                this.SendXilian(1);
                break;
            case this.btnchage:
                this.SendSkillXilian();
                break;
            case this.btnInfo:
                ViewManager.ins().open(ActivityDescPanel, 46);
                break;
        }
    };
    PetXilianPanel.prototype.SendXilian = function (type) {
        var baseConfig = this.GetBaseConfig();
        var data = baseConfig.freshitemid[type];
        var itemId = data.itemId;
        var value = 1;
        var list = [];
        for (var i = 0; i < this.mItemLeft.length; i++) {
            if (this.mItemLeft[i].lock) {
                list.push(i);
            }
        }
        var yb = 0;
        if (list.length) {
            yb = this.GetBaseConfig().freshMoney[list.length - 1];
            if (!Checker.Money(MoneyConst.yuanbao, yb)) {
                return;
            }
        }
        var price = GameGlobal.actorModel.yb - yb;
        if (Checker.CheckItem(itemId, value, this.checkBox.selected, price, ShopController.EN_SHOP_YUANBAO)) {
            this.SendSendXilian(list, type);
        }
    };
    PetXilianPanel.prototype._OnLockClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        var item = this.mItemLeft[index];
        if (this._IsLastOne() && !item.lock) {
            UserTips.ins().showTips("技能不可全部锁定");
            return;
        }
        item.lock = !item.lock;
        item.lockImg.source = item.lock ? PetXilianPanel.LOCK_IMG : PetXilianPanel.UNLOCK_IMG;
        this._UpdateLock();
    };
    PetXilianPanel.prototype._OnSkillIconClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        var buffSkill = this.GetBuffSkill();
        var skillId = buffSkill[index];
        if (!skillId)
            return;
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    PetXilianPanel.prototype._OnRightSkillIconClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        var skillId = this.GetXilianSkill(index);
        if (!skillId)
            return;
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    PetXilianPanel.prototype._UpdateLock = function () {
        var lockCount = 0;
        for (var i = 0; i < this.mItemRight.length; i++) {
            var rightItem = this.mItemRight[i];
            var leftItem = this.mItemLeft[i];
            if (leftItem.lock) {
                ++lockCount;
            }
            rightItem.lockImg.source = leftItem.lockImg.source;
        }
        this.curSelCount.text = lockCount + "个";
        var cost = 0;
        if (lockCount != 0) {
            cost = this.GetBaseConfig().freshMoney[lockCount - 1];
        }
        this.needYbLabel.text = cost + "元宝";
    };
    PetXilianPanel.prototype._IsLastOne = function () {
        var lockCount = 0;
        for (var i = 0; i < this.mItemLeft.length; i++) {
            var leftItem = this.mItemLeft[i];
            if (leftItem.lock) {
                ++lockCount;
            }
        }
        var buffSkill = this.GetBuffSkill();
        return buffSkill.length == lockCount + 1;
    };
    PetXilianPanel.LAYER_LEVEL = LayerManager.UI_Main;
    /////////////////////////////////////////////////////////////////////////////
    PetXilianPanel.LOCK_IMG = "ui_bt_suo";
    PetXilianPanel.UNLOCK_IMG = "ui_bt_weisuo";
    return PetXilianPanel;
}(BaseEuiView));
__reflect(PetXilianPanel.prototype, "PetXilianPanel");
//# sourceMappingURL=PetXilianPanel.js.map