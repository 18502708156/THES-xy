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
var GangProtectorJinJieAwardWin = (function (_super) {
    __extends(GangProtectorJinJieAwardWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangProtectorJinJieAwardWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangProtectorJinJieAwardSkin";
        _this.commonDialog.title = "进阶奖励";
        return _this;
    }
    GangProtectorJinJieAwardWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBase;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    GangProtectorJinJieAwardWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        if (args && args.length > 0)
            this.UpdateContent(args[0]);
    };
    GangProtectorJinJieAwardWin.prototype.UpdateContent = function (lv) {
        var itemLists = [];
        var config = GameGlobal.Config.GuildActiveConfig[lv + 1];
        if (config == null) {
            config = GameGlobal.Config.GuildActiveConfig[lv];
        }
        this.list.dataProvider.replaceAll(config.reward);
        this.desc_text.text = "守护达到" + lv + "级可获得";
    };
    GangProtectorJinJieAwardWin.prototype.OnClose = function () {
        this.removeEvents();
    };
    GangProtectorJinJieAwardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangProtectorJinJieAwardWin;
}(BaseEuiView));
__reflect(GangProtectorJinJieAwardWin.prototype, "GangProtectorJinJieAwardWin");
//# sourceMappingURL=GangProtectorJinJieAwardWin.js.map