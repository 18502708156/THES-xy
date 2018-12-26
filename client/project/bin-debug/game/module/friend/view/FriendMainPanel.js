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
var FriendMainPanel = (function (_super) {
    __extends(FriendMainPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FriendMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FriendMainSkin";
        return _this;
    }
    FriendMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(FriendsPanel, { skinName: "MyFriendSkin", mContext: this }),
            TabView.CreateTabViewData(FansPanel, { skinName: "FansSkin", mContext: this }),
            TabView.CreateTabViewData(BlacklistPanel, { skinName: "FriendBlacklistSkin", mContext: this }),
            TabView.CreateTabViewData(ReferrerPanel, { skinName: "ReferrerSkin", mContext: this }),
        ]);
    };
    FriendMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.AddClick(this.btnShop, this.tap);
        if (!args[0]) {
            if (GameGlobal.FriendModel.friendsNum > 0)
                this.commonWindowBg.OnAdded(this, 0);
            else
                this.commonWindowBg.OnAdded(this, 3);
        }
        else
            this.commonWindowBg.OnAdded(this, args[0]);
        this.observe(MessageDef.FRIEND_RED_POINT_CHANGE, this.showRedPoint);
        this.showRedPoint();
    };
    FriendMainPanel.prototype.OnClose = function () {
    };
    FriendMainPanel.prototype.tap = function () {
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YOUQING]);
    };
    FriendMainPanel.prototype.showRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.FriendModel.checkRedPoint());
    };
    FriendMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FriendMainPanel;
}(BaseEuiView));
__reflect(FriendMainPanel.prototype, "FriendMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=FriendMainPanel.js.map