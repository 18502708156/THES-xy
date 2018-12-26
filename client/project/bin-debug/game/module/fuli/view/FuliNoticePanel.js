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
 * 福利公告
 */
var FuliNoticePanel = (function (_super) {
    __extends(FuliNoticePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FuliNoticePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliLvNoticeSkin";
        return _this;
    }
    FuliNoticePanel.prototype.childrenCreated = function () {
    };
    FuliNoticePanel.prototype.OnOpen = function () {
        this.UpdateContent();
    };
    FuliNoticePanel.prototype.UpdateContent = function () {
        var strText = GlobalConfig.ins().NoticeConfig[1].notice || "";
        this.lbNotice.textFlow = TextFlowMaker.generateTextFlow(strText);
    };
    //skinName
    //FuliLvNoticeSkin.exml
    FuliNoticePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliNoticePanel;
}(BaseEuiView));
__reflect(FuliNoticePanel.prototype, "FuliNoticePanel");
//# sourceMappingURL=FuliNoticePanel.js.map