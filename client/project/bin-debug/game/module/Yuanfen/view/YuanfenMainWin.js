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
var YuanfenMainWin = (function (_super) {
    __extends(YuanfenMainWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function YuanfenMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    YuanfenMainWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(YuanfenQixingPanel),
            TabView.CreateTabViewData(YuanfenTianbingPanel),
            TabView.CreateTabViewData(YuanfenTiangongPanel),
        ]);
    };
    YuanfenMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.mCommonWindowBg.OnAdded(this, index);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    YuanfenMainWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    YuanfenMainWin.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_1));
        this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_2));
        this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_3));
        // this.mCommonWindowBg.ShowTalRedPoint(3, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_4))
    };
    YuanfenMainWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return true;
    };
    YuanfenMainWin.prototype.OnOpenIndex = function (openIndex) {
        var openId = -1;
        if (openIndex == 1) {
            openId = GameGlobal.Config.FateBaseConfig.openlv2;
        }
        else if (openIndex == 2) {
            openId = GameGlobal.Config.FateBaseConfig.openlv3;
        }
        else if (openIndex == 3) {
            openId = GameGlobal.Config.FateBaseConfig.openlv4;
        }
        return Deblocking.Check(openId);
    };
    YuanfenMainWin.NAME = "缘份";
    YuanfenMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return YuanfenMainWin;
}(BaseEuiView));
__reflect(YuanfenMainWin.prototype, "YuanfenMainWin");
//# sourceMappingURL=YuanfenMainWin.js.map