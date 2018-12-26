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
var CrossGuildPanel = (function (_super) {
    __extends(CrossGuildPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CrossGuildPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'CrossGuildSkin';
        return _this;
    }
    CrossGuildPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
        this.itemList.dataProvider = new eui.ArrayCollection();
    };
    CrossGuildPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent);
        this.AddClick(this.btnGo, this.onClick);
        this.AddClick(this.btnHelp, this.onClick);
    };
    CrossGuildPanel.prototype.onClick = function (e) {
        if (e.target == this.btnHelp) {
            ViewManager.ins().open(CrossGuildTipPanel);
        }
        else {
        }
    };
    CrossGuildPanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
    };
    CrossGuildPanel.prototype.UpdateContent = function () {
        //如果活动开启
        // this.group.visible = false;
    };
    CrossGuildPanel.NAME = "帮会战";
    return CrossGuildPanel;
}(BaseView));
__reflect(CrossGuildPanel.prototype, "CrossGuildPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=CrossGuildPanel.js.map