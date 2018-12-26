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
var LingtongYulPanel = (function (_super) {
    __extends(LingtongYulPanel, _super);
    function LingtongYulPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.itemArr = [];
        _this.skinName = "LingtongYulSkin";
        _this.itemArr = _this.itemGroup.$children;
        _this.select_GY_index = 1;
        return _this;
    }
    LingtongYulPanel.prototype.childrenCreated = function () {
        this._AddClick(this.activeBtn, this._OnClick);
        for (var _i = 0, _a = this.itemArr; _i < _a.length; _i++) {
            var item = _a[_i];
            this._AddClick(item, this._onClick2);
        }
    };
    LingtongYulPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this._UpdateInfo);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateItem);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
    };
    LingtongYulPanel.prototype.UpdateRedPoint = function () {
        var len = this.itemArr.length;
        for (var i = 0; i < len; i++) {
            this.itemArr[i].UpdateRedPoint();
        }
    };
    LingtongYulPanel.prototype.OnClose = function () {
    };
    LingtongYulPanel.prototype.UpdateItem = function () {
        var petId = this.m_petId;
        var petItemConfig = GameGlobal.Config.ItemConfig[LingtongConst.GetActiveItemId(petId)];
        if (petItemConfig) {
            var petInfo = GameGlobal.LingtongPetModel.GetInfo(this.m_petId);
            this.consumeLabel.consumeType = petItemConfig.name;
            this.consumeLabel.consumeValue = GameGlobal.LingtongPetModel.getUpGradeLingNeedPetCount(LingtongInfo.GetQuality(petId), this.select_GY_index, petInfo ? petInfo.getLingByIndex(this.select_GY_index) : 0);
            this.consumeLabel.curValue = UserBag.ins().getBagGoodsCountById(0, petItemConfig.id);
        }
    };
    LingtongYulPanel.prototype._UpdateInfo = function () {
        this.UpdateContent();
    };
    LingtongYulPanel.prototype._onClick2 = function (e) {
        this.select_GY_index = e.currentTarget.index;
        this.UpdateContent();
    };
    LingtongYulPanel.prototype.UpdateSelId = function (selId) {
        this.m_petId = selId;
        this.mLingtongInfo = GameGlobal.LingtongPetModel.GetInfo(selId);
        this.UpdateContent();
    };
    LingtongYulPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.activeBtn:
                {
                    var petModel = GameGlobal.LingtongPetModel;
                    var petInfo = petModel.GetInfo(this.m_petId);
                    var isOpen = petInfo.getLingByIndex(this.select_GY_index) != 0;
                    if (isOpen == false) {
                        if (petModel.canOpenLingByIndex(this.m_petId, this.select_GY_index) == false) {
                            UserTips.ErrorTip("灵童拥有" + petModel.openLingConditionStr(this.m_petId, this.select_GY_index) + "御灵可激活");
                            return;
                        }
                    }
                    if (this.consumeLabel.consumeValue > this.consumeLabel.curValue) {
                        UserTips.ErrorTip(this.consumeLabel.consumeType + "不足");
                        return;
                    }
                    if (isOpen) {
                        GameGlobal.LingtongPetModel.SendLingUpgrade(this.m_petId, this.select_GY_index);
                    }
                    else {
                        GameGlobal.LingtongPetModel.SendLingActive(this.m_petId, this.select_GY_index);
                    }
                }
                break;
        }
    };
    LingtongYulPanel.prototype.UpdateContent = function () {
        var petId = this.m_petId;
        var petModel = GameGlobal.LingtongPetModel;
        var petInfo = petModel.GetInfo(petId);
        if (!petInfo) {
            return;
        }
        this.powerLabel0.text = petInfo.GetYulPower();
        var i;
        var len = this.itemArr.length;
        for (i = 0; i < len; i++) {
            this.itemArr[i].data(petId, i + 1);
            this.itemArr[i].select = (i + 1) == this.select_GY_index;
        }
        // let lings = petInfo?petInfo.getLings():null;
        var lingLv = petInfo ? petInfo.getLingByIndex(this.select_GY_index) : 0;
        var currentAttrList = petModel.getLingAttrByIndex(petId, this.select_GY_index);
        if (currentAttrList == null) {
            currentAttrList = petModel.getLingNextAttrByIndex(petId, this.select_GY_index);
        }
        var nextAttrList;
        if (lingLv == 0) {
            nextAttrList = petModel.getLingTopAttrByIndex(petId, this.select_GY_index);
            this.activeBtn.label = "激活";
            this.label1.text = "激活属性";
            this.label1.textColor = ItemBase.QUALITY_COLOR[1];
            this.label2.text = "极品属性";
            this.label2.textColor = ItemBase.QUALITY_COLOR[5];
        }
        else {
            nextAttrList = petModel.getLingNextAttrByIndex(petId, this.select_GY_index);
            this.activeBtn.label = "升品";
            this.label1.text = LingtongConst.GetYulQuality(lingLv) + "属性";
            this.label1.textColor = ItemBase.QUALITY_COLOR[lingLv || 1];
            this.label2.text = (lingLv == 0 ? LingtongConst.GetYulQuality(5) : LingtongConst.GetYulQuality(lingLv + 1)) + "属性";
            this.label2.textColor = ItemBase.QUALITY_COLOR[lingLv == 0 ? LingtongPetModel.MAX_Ling_LEVEL : lingLv + 1];
        }
        this.UpdateItem();
        this.attr1.getChildAt(0).text = "战斗力+" + ItemConfig.CalcAttrScoreValue(currentAttrList);
        this.attr1.getChildAt(1).text = AttributeData.getAttStrByType(currentAttrList[0], 0, "+", false, "#ffffff");
        if (nextAttrList) {
            this.next.visible = true;
            // this.quality_txt2.textColor = ItemBase.QUALITY_COLOR[lingLv == 0 ? LingtongPetModel.MAX_Ling_LEVEL : lingLv + 1]
            // this.quality_txt2.text = lingLv == 0 ? LingtongConst.GetYulQuality(5) : LingtongConst.GetYulQuality(lingLv + 1);
            this.nextGroup.getChildAt(0).text = "战斗力+" + ItemConfig.CalcAttrScoreValue(nextAttrList);
            this.nextGroup.getChildAt(1).text = AttributeData.getAttStrByType(nextAttrList[0], 0, "+", false, "#ffffff");
        }
        else {
            this.next.visible = false;
        }
        this.activeGroup.visible = this.next.visible;
        this.fullTip.visible = !this.next.visible;
        this.cur.x = this.next.visible ? 35 : 188;
        UIHelper.ShowRedPoint(this.activeBtn, petModel.IsRedPointUpLings(petModel.GetInfo(petId), this.select_GY_index));
    };
    LingtongYulPanel.NAME = "御灵";
    return LingtongYulPanel;
}(BaseView));
__reflect(LingtongYulPanel.prototype, "LingtongYulPanel");
//# sourceMappingURL=LingtongYulPanel.js.map