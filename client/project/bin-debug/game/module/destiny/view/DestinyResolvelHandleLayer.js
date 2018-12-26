/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 16:21
 * @meaning: 命格手动分解界面
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
var DestinyResolvelHandleLayer = (function (_super) {
    __extends(DestinyResolvelHandleLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyResolvelHandleLayer() {
        var _this = _super.call(this) || this;
        _this.skinName = "DestinyResolveHandleDlgSkin";
        _this.listView.itemRenderer = DestinyResolveHandleItem;
        _this.commonDialog.dialogReturnBtn.visible = false;
        return _this;
    }
    DestinyResolvelHandleLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this._AddClick(this.btn, this.onResolve);
        this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent); //物品变化
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //命格数据变化
        this.UpdateContent();
    };
    DestinyResolvelHandleLayer.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    DestinyResolvelHandleLayer.prototype.onResolve = function () {
        if (this.getResolveData().length)
            GameGlobal.DestinyManage.babyStartSmelt(this.getResolveData());
    };
    DestinyResolvelHandleLayer.prototype.UpdateContent = function () {
        this.tLayerData = CommonUtils.copyDataHandler(UserBag.ins().GetBagStarBySort());
        this.listView.dataProvider = new eui.ArrayCollection(this.tLayerData);
    };
    DestinyResolvelHandleLayer.prototype.getResolveData = function () {
        var tList = [];
        var tHaveData = this.tLayerData;
        for (var item in this.tLayerData) {
            var data = this.tLayerData[item];
            if (data.bSelect) {
                var ob = { id: 0, num: 0 };
                ob.id = data.configID;
                ob.num = data.count;
                tList.push(ob);
            }
        }
        return tList;
    };
    DestinyResolvelHandleLayer.LAYER_LEVEL = LayerManager.UI_Popup;
    return DestinyResolvelHandleLayer;
}(BaseEuiView));
__reflect(DestinyResolvelHandleLayer.prototype, "DestinyResolvelHandleLayer");
//# sourceMappingURL=DestinyResolvelHandleLayer.js.map