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
var GangRecordListWin = (function (_super) {
    __extends(GangRecordListWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangRecordListWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangRecordListSkin";
        _this.commonWindowBg.SetTitle("帮会记录");
        return _this;
    }
    GangRecordListWin.prototype.childrenCreated = function () {
        this.recordlist.itemRenderer = GangRecordItem;
        this.recordlist.dataProvider = new eui.ArrayCollection([]);
    };
    GangRecordListWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.UpdateContent();
    };
    GangRecordListWin.prototype.UpdateContent = function () {
        var itemLists = GameGlobal.GangModel.gangRecordInfo.historyRecords;
        this.recordlist.dataProvider.replaceAll(itemLists);
    };
    GangRecordListWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GangRecordListWin;
}(BaseEuiView));
__reflect(GangRecordListWin.prototype, "GangRecordListWin", ["ICommonWindow"]);
var GangRecordItem = (function (_super) {
    __extends(GangRecordItem, _super);
    function GangRecordItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangRecordItem.prototype.childrenCreated = function () {
    };
    GangRecordItem.prototype.dataChanged = function () {
        if (this.itemIndex % 2 == 0) {
            this.bg_image.visible = false;
        }
        else {
            this.bg_image.visible = true;
        }
        if (!this.data)
            return;
        var info = this.data;
        this.desc_txt.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.GangModel.gangRecordInfo.getTypeName(info.type, info.time, info.name1));
    };
    return GangRecordItem;
}(eui.ItemRenderer));
__reflect(GangRecordItem.prototype, "GangRecordItem");
//# sourceMappingURL=GangRecordListWin.js.map