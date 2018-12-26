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
var LingtongCompositionPanel = (function (_super) {
    __extends(LingtongCompositionPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LingtongCompositionPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongCompositionSkin";
        _this.list.itemRenderer = LingtongCompositionItem;
        _this.list.dataProvider = new eui.ArrayCollection;
        return _this;
    }
    LingtongCompositionPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateList);
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this.UpdateList);
        this.UpdateList();
    };
    LingtongCompositionPanel.prototype.UpdateList = function () {
        var list = CommonUtils.GetArray(GameGlobal.Config.BabyActivationConfig, "type");
        this.list.dataProvider.replaceAll(list);
    };
    LingtongCompositionPanel.NAME = "合成";
    return LingtongCompositionPanel;
}(BaseView));
__reflect(LingtongCompositionPanel.prototype, "LingtongCompositionPanel");
var LingtongCompositionItem = (function (_super) {
    __extends(LingtongCompositionItem, _super);
    function LingtongCompositionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    LingtongCompositionItem.prototype.childrenCreated = function () {
        this.item.setItemCount(false);
        UIHelper.SetLinkStyleLabel(this.getLabel);
        this.getLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    LingtongCompositionItem.prototype.dataChanged = function () {
        var config = this.data;
        this.item.setItemImg(LingtongConst.GetHeadIcon(config.type));
        var actConfig = GameGlobal.Config.BabyActivationConfig[config.type];
        var item = actConfig.compose;
        var itemConfig = GameGlobal.Config.ItemConfig[item.id];
        this.nameLabel.text = itemConfig.name;
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        this.item.SetQuality(LingtongInfo.GetQuality(itemConfig.quality));
        var curCount = GameGlobal.UserBag.GetCount(item.id);
        var needCount = item.count;
        this.countLabel.textFlow = ConsumeLabel.GetValueColor(curCount, needCount);
        this.goBtn.visible = curCount >= needCount;
        this.getLabel.visible = !this.goBtn.visible;
    };
    LingtongCompositionItem.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goBtn:
                GameGlobal.LingtongPetModel.SendComposition(this.data.type);
                break;
            case this.getLabel:
                GainItemConfig.Guide(GameGlobal.Config.BabyActivationConfig[this.data.type].compose.id);
                break;
        }
    };
    return LingtongCompositionItem;
}(eui.ItemRenderer));
__reflect(LingtongCompositionItem.prototype, "LingtongCompositionItem");
//# sourceMappingURL=LingtongCompositionPanel.js.map