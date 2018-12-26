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
var YingYuanZhengShuPanel = (function (_super) {
    __extends(YingYuanZhengShuPanel, _super);
    function YingYuanZhengShuPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "YingYuanZhengShuSkin";
        _this.list.itemRenderer = YingYuanHeadItem;
        return _this;
    }
    YingYuanZhengShuPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.IS_MARRY_INFO, this.updateContent);
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "结婚证书";
        this._AddClick(this.bnt, this._OnClick);
        this.updateContent();
    };
    YingYuanZhengShuPanel.prototype.updateContent = function () {
        var Info = [];
        Info.push(GameGlobal.YingYuanModel.marryInfo.husband);
        Info.push(GameGlobal.YingYuanModel.marryInfo.wife);
        this.list.dataProvider = new eui.ArrayCollection(Info);
        this.marryTime.text = "登记日期：" + GameServer.JieHun(GameGlobal.YingYuanModel.marryInfo.time);
    };
    YingYuanZhengShuPanel.prototype._OnClick = function () {
        ViewManager.ins().close(this);
    };
    YingYuanZhengShuPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanZhengShuPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanZhengShuPanel;
}(BaseEuiView));
__reflect(YingYuanZhengShuPanel.prototype, "YingYuanZhengShuPanel", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanZhengShuPanel.js.map