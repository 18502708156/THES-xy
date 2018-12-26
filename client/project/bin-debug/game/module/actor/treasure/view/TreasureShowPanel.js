/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 11:01
 * @meaning: 法宝图鉴详情
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
var TreasureShowPanel = (function (_super) {
    __extends(TreasureShowPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TreasureShowPanel() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.skinName = "TreasureShowSkin";
        _this.listView.itemRenderer = TreasureShowItem;
        return _this;
    }
    TreasureShowPanel.prototype.childrenCreated = function () {
    };
    TreasureShowPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.UpdateContent();
    };
    TreasureShowPanel.prototype.UpdateContent = function () {
        if (this.tPanelData.length)
            this.listView.dataProvider = new eui.ArrayCollection(this.tPanelData);
    };
    TreasureShowPanel.prototype.setData = function (_type) {
        this.tPanelData = GameGlobal.TreasureModel.getShowConByType(_type);
    };
    return TreasureShowPanel;
}(BaseView));
__reflect(TreasureShowPanel.prototype, "TreasureShowPanel", ["ICommonWindowTitle"]);
var TreasureShowFirPanel = (function (_super) {
    __extends(TreasureShowFirPanel, _super);
    function TreasureShowFirPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureShowFirPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setData(1);
        this.UpdateContent();
    };
    TreasureShowFirPanel.NAME = "传说";
    return TreasureShowFirPanel;
}(TreasureShowPanel));
__reflect(TreasureShowFirPanel.prototype, "TreasureShowFirPanel");
;
var TreasureShowSecPanel = (function (_super) {
    __extends(TreasureShowSecPanel, _super);
    function TreasureShowSecPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureShowSecPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setData(2);
        this.UpdateContent();
    };
    TreasureShowSecPanel.NAME = "完美";
    return TreasureShowSecPanel;
}(TreasureShowPanel));
__reflect(TreasureShowSecPanel.prototype, "TreasureShowSecPanel");
;
var TreasureShowThrPanel = (function (_super) {
    __extends(TreasureShowThrPanel, _super);
    function TreasureShowThrPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureShowThrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setData(3);
        this.UpdateContent();
    };
    TreasureShowThrPanel.NAME = "其它";
    return TreasureShowThrPanel;
}(TreasureShowPanel));
__reflect(TreasureShowThrPanel.prototype, "TreasureShowThrPanel");
//# sourceMappingURL=TreasureShowPanel.js.map