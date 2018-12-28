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
var YingYuanAddPanel = (function (_super) {
    __extends(YingYuanAddPanel, _super);
    function YingYuanAddPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "YingYuanAddSkin";
        _this.list.itemRenderer = YingyuanAddItem;
        return _this;
    }
    YingYuanAddPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "求婚对象";
        this.updateContent();
    };
    YingYuanAddPanel.prototype.updateContent = function () {
        var arr = GameGlobal.FriendModel.FriendData.friendsDate;
        var arrData = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].friendInfo.offlineTime == 0) {
                arrData.push(arr[i]);
            }
        }
        var arrDataNum = [];
        for (var n = 0; n < arrData.length; n++) {
            var data = GameGlobal.YingYuanModel.getMarryFriends(arrData[n].friendInfo.dbid);
            if (data && !data.ismarry) {
                arrDataNum.push(arrData[n]);
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(arrDataNum);
        for (var m = 0; m < this.list.numChildren; m++) {
            if (m % 2 == 0) {
                this.list.$children[m]["bg"].source = "ui_sbm_005";
            }
            else {
                this.list.$children[m]["bg"].source = "i_sbm_002";
            }
        }
    };
    YingYuanAddPanel.prototype._OnClick = function (e) {
    };
    YingYuanAddPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanAddPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanAddPanel;
}(BaseEuiView));
__reflect(YingYuanAddPanel.prototype, "YingYuanAddPanel", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanAddPanel.js.map