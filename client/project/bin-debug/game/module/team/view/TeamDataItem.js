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
var TeamDataItem = (function (_super) {
    __extends(TeamDataItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TeamDataItem() {
        return _super.call(this) || this;
    }
    TeamDataItem.prototype.childrenCreated = function () {
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
    };
    TeamDataItem.prototype.OnClick = function () {
        var model = this.data.mModel;
        var data = this.data.mInfo;
        var config = this.data.config;
        model.SendJoin(config, data.leaderid);
    };
    TeamDataItem.prototype.dataChanged = function () {
        var model = this.data.mModel;
        var data = this.data.mInfo;
        this.num_txt.text = data.count + "/3";
        var mem = data.members || [];
        for (var i = 0; i < mem.length; i++) {
            if (mem[i].dbid == data.leaderid) {
                this.name_txt.text = mem[i].name;
                break;
            }
        }
    };
    return TeamDataItem;
}(eui.ItemRenderer));
__reflect(TeamDataItem.prototype, "TeamDataItem");
//# sourceMappingURL=TeamDataItem.js.map