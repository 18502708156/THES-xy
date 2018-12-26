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
var CrossGuildWarPanel = (function (_super) {
    __extends(CrossGuildWarPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CrossGuildWarPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'CrossGuildWarSkin';
        return _this;
    }
    CrossGuildWarPanel.prototype.childrenCreated = function () {
    };
    CrossGuildWarPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent);
    };
    CrossGuildWarPanel.prototype.OnClose = function () {
    };
    CrossGuildWarPanel.prototype.UpdateContent = function () {
    };
    CrossGuildWarPanel.NAME = "帮会战";
    return CrossGuildWarPanel;
}(BaseView));
__reflect(CrossGuildWarPanel.prototype, "CrossGuildWarPanel", ["ICommonWindowTitle"]);
var CrossGuildCityItem = (function (_super) {
    __extends(CrossGuildCityItem, _super);
    function CrossGuildCityItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.STATE_IMG = ['xxx0', 'xxx1', 'xxx2', 'xxx3'];
        return _this;
    }
    CrossGuildCityItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var info = this.data;
        this.tstate.visible = info.isWaring;
        this.stateImg.source = this.STATE_IMG[info.state];
        this.s1.visible = info.state > 0;
        this.s2.visible = info.state > 1;
        this.s3.visible = info.state > 2;
        this.tname.textFlow = TextFlowMaker.generateTextFlow('玩家：' + '|C:' + info.isMySide ? '0x0fc06' : '0xdb0000' + '&T:' + info.name + '|');
        this.tpower.textFlow = TextFlowMaker.generateTextFlow('战力：' + '|C:0x000000&T:' + info.power + '|');
        this.tscore.textFlow = TextFlowMaker.generateTextFlow('积分：' + '|C:0x000000&T:' + info.score + '|');
    };
    return CrossGuildCityItem;
}(eui.ItemRenderer));
__reflect(CrossGuildCityItem.prototype, "CrossGuildCityItem");
//# sourceMappingURL=CrossGuildWarPanel.js.map