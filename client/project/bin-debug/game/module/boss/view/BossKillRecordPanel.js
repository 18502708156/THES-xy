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
var BossKillRecordPanel = (function (_super) {
    __extends(BossKillRecordPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BossKillRecordPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BossKillRecordSkin";
        _this.list.itemRenderer = KillBossRecordItem;
        return _this;
    }
    BossKillRecordPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "击杀记录";
        this.observe(MessageDef.PUBLIC_BOSS_RECORD_KILL, this.updateContent);
        GameGlobal.BossModel.sendPublicKillRecord(parseInt(param[0]));
    };
    BossKillRecordPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    BossKillRecordPanel.prototype.updateContent = function (data) {
        this.list.dataProvider = new eui.ArrayCollection(data);
        // let rank = data[0];
        // if (rank == 0)
        // {
        // 	this.rank_txt.text = "未上榜"
        // } else {
        // 	this.rank_txt.text = "第" + rank + "名";
        // }
    };
    BossKillRecordPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BossKillRecordPanel;
}(BaseEuiView));
__reflect(BossKillRecordPanel.prototype, "BossKillRecordPanel");
/**
 * BossRecordItem
 */
var KillBossRecordItem = (function (_super) {
    __extends(KillBossRecordItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KillBossRecordItem() {
        return _super.call(this) || this;
    }
    KillBossRecordItem.prototype.childrenCreated = function () {
    };
    KillBossRecordItem.prototype.dataChanged = function () {
        var data = this.data;
        this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02";
        this.time_txt.text = DateUtils.format_6(data.killtime * 1000);
        this.name_txt.text = data.name;
        this.fight_txt.text = data.power + "";
    };
    return KillBossRecordItem;
}(eui.ItemRenderer));
__reflect(KillBossRecordItem.prototype, "KillBossRecordItem");
//# sourceMappingURL=BossKillRecordPanel.js.map