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
var QujingRecordWin = (function (_super) {
    __extends(QujingRecordWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QujingRecordWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "QujingRecordListSkin";
        _this.commonWindowBg.SetTitle("被劫记录");
        return _this;
    }
    QujingRecordWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = QujingRecordItem;
        this.UpdateContent();
    };
    QujingRecordWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.QUJING_UPDATE_RECORD, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
    };
    QujingRecordWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    QujingRecordWin.prototype.UpdateContent = function () {
        var recordList = GameGlobal.QujingModel.recordList;
        this.list.dataProvider = new eui.ArrayCollection(recordList);
        GameGlobal.QujingModel.RecordRobbedFlag(false);
    };
    QujingRecordWin.LAYER_LEVEL = LayerManager.UI_Main;
    return QujingRecordWin;
}(BaseEuiView));
__reflect(QujingRecordWin.prototype, "QujingRecordWin", ["ICommonWindow"]);
var QujingRecordItem = (function (_super) {
    __extends(QujingRecordItem, _super);
    function QujingRecordItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    QujingRecordItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btnRevenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    QujingRecordItem.prototype.dataChanged = function () {
        var record = this.data;
        this.btnRevenge.name = record.mRecordId;
        var config = this.GetConfigByQuality(record.mQuality);
        var color = ItemBase.GetColorByQuality(record.mQuality - 1);
        var text = "|C:0x6e330b&T:\u5F53\u524D|C:0x019704&T:\u6218\u529B\u4E3A" + record.mPower + "||C:0x6e330b&T:\u7684||C:0x1048ff&T:" + record.mPlayerName + "||C:0x6e330b&T:\u62A2\u593A\u4E86\u6211\u7684||C:" + color + "&T:" + config.name + "||";
        this.labTip.textFlow = TextFlowMaker.generateTextFlow(text);
        this.labRevenge.visible = record.mOperFlag;
        this.btnRevenge.visible = !record.mOperFlag;
        this.labRevenge.text = record.mWinFlag ? "复仇成功" : "复仇失败";
        this.labRevenge.textColor = record.mWinFlag ? 0x019704 : 0xdb0000;
        this.list.dataProvider = new eui.ArrayCollection(config.revengeaward);
    };
    QujingRecordItem.prototype._OnBtnClick = function (e) {
        var recordId = parseInt(e.currentTarget.name);
        ViewManager.ins().open(QujingRevengeWin, recordId, QujingModel.ESCORT_FIGHT_TYPE_REVENGE);
    };
    QujingRecordItem.prototype.GetConfigByQuality = function (quality) {
        for (var key in GameGlobal.Config.EscortAwardConfig) {
            var config = GameGlobal.Config.EscortAwardConfig[key];
            if (config.quality == quality)
                return config;
        }
    };
    return QujingRecordItem;
}(eui.ItemRenderer));
__reflect(QujingRecordItem.prototype, "QujingRecordItem");
//# sourceMappingURL=QujingRecordWin.js.map