/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:21
 * @meaning: 命格展示界面
 *
 **/
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
var DestinyShow = (function (_super) {
    __extends(DestinyShow, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyShow() {
        var _this = _super.call(this) || this;
        _this.skinName = "DestinyShowSkin";
        _this.listView.itemRenderer = DestinyShowRectItem;
        _this.commonDialog.dialogReturnBtn.visible = false;
        return _this;
    }
    DestinyShow.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //命格数据变化
        this.AddItemClick(this.listView, this.onList);
        this.UpdateContent();
    };
    DestinyShow.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    DestinyShow.prototype.onList = function (e) {
        var config = e.item.bSelect;
        if (e.item.bSelect) {
            e.item.bSelect = false;
        }
        else {
            e.item.bSelect = true;
        }
        this.listView.dataProvider.replaceAll(this.tLayerData);
        this.listView.validateNow();
    };
    DestinyShow.prototype.UpdateContent = function () {
        var tData = GameGlobal.DestinyController.getShowDestinyData();
        this.tLayerData = [];
        for (var item in tData) {
            var bObj = { bSelect: false, tList: [] };
            bObj.tList = tData[item];
            this.tLayerData.push(bObj);
        }
        this.listView.dataProvider = new eui.ArrayCollection(this.tLayerData);
    };
    DestinyShow.LAYER_LEVEL = LayerManager.UI_Popup;
    return DestinyShow;
}(BaseEuiView));
__reflect(DestinyShow.prototype, "DestinyShow");
//# sourceMappingURL=DestinyShow.js.map