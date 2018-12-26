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
var BossHurtRecordPanel = (function (_super) {
    __extends(BossHurtRecordPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BossHurtRecordPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BossHurtRankSkin";
        _this.list.itemRenderer = HurtBossRecordItem;
        return _this;
    }
    BossHurtRecordPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "伤害记录";
        this.observe(MessageDef.PUBLIC_BOSS_RECORD, this.updateContent);
        GameGlobal.BossModel.sendPublicRecord(parseInt(param[0]));
    };
    BossHurtRecordPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    BossHurtRecordPanel.prototype.updateContent = function (data) {
        this.list.dataProvider = new eui.ArrayCollection(data[1]);
        var rank = data[0];
        if (rank == 0) {
            this.rank_txt.text = "未上榜";
        }
        else {
            this.rank_txt.text = "第" + rank + "名";
        }
    };
    BossHurtRecordPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BossHurtRecordPanel;
}(BaseEuiView));
__reflect(BossHurtRecordPanel.prototype, "BossHurtRecordPanel");
/**
 * BossRecordItem
 */
var HurtBossRecordItem = (function (_super) {
    __extends(HurtBossRecordItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HurtBossRecordItem() {
        return _super.call(this) || this;
    }
    HurtBossRecordItem.prototype.childrenCreated = function () {
    };
    HurtBossRecordItem.prototype.dataChanged = function () {
        var data = this.data;
        this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02";
        this.rank_txt.text = (this.itemIndex + 1) + "";
        this.name_txt.text = data.name;
        this.fight_txt.text = data.injure + "";
    };
    return HurtBossRecordItem;
}(eui.ItemRenderer));
__reflect(HurtBossRecordItem.prototype, "HurtBossRecordItem");
//# sourceMappingURL=BossHurtRecordPanel.js.map