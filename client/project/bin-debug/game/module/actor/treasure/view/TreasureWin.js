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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 14:59
 * @meaning: 法宝主界面
 *
 **/
var TreasureWin = (function (_super) {
    __extends(TreasureWin, _super);
    function TreasureWin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tShopData = [];
        return _this;
    }
    TreasureWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (!Deblocking.Check(DeblockingType.TYPE_31)) {
            return false;
        }
        return true;
    };
    TreasureWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "TreasureLayerSkin";
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(TreasureUpFirPanel),
            TabView.CreateTabViewData(TreasureUpSecPanel),
            TabView.CreateTabViewData(TreasureMakePanel),
            TabView.CreateTabViewData(TreasureResolvePanel),
        ];
    };
    TreasureWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.viewStack.UpdateTabShowState(this.viewStack.length, false);
        this.commonWindowBg.OnAdded(this, nIndex);
        this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    TreasureWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    TreasureWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    TreasureWin.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(1);
        this.mCommonWindowBg.CheckTalRedPoint(2);
        this.mCommonWindowBg.CheckTalRedPoint(3);
    };
    TreasureWin.prototype.UpdateContent = function () { };
    TreasureWin.LAYER_LEVEL = LayerManager.UI_Main;
    return TreasureWin;
}(BaseEuiView));
__reflect(TreasureWin.prototype, "TreasureWin", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=TreasureWin.js.map