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
var FriendsPanel = (function (_super) {
    __extends(FriendsPanel, _super);
    function FriendsPanel() {
        var _this = _super.call(this) || this;
        _this.windowTitleIconName = "好友";
        _this.curPage = 1;
        return _this;
    }
    FriendsPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = FriendItem;
    };
    FriendsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.currentState = "normal";
        GameGlobal.FriendModel.FriendData.curState = "friend";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent);
        this._AddClick(this.allGiveBtn, this.onClick);
        this._AddClick(this.deleteBtn, this.onClick);
        this.pageBtn.setPage(1);
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.friendsDate.slice());
        this.list.dataProvider = this.dataProvider;
        this.recoverTouchPos();
        this.UpdateContent();
    };
    FriendsPanel.prototype.UpdateContent = function () {
        var maxPage = GameGlobal.FriendModel.FriendData.friendsDate.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage));
        }
        if (this.currentState == "normal") {
            this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.friendsDate.slice());
            this.allGiveBtn.visible = GameGlobal.FriendModel.friendsNum > 0;
            this.deleteBtn.visible = GameGlobal.FriendModel.friendsNum > 0;
        }
        else {
            var arr = GameGlobal.FriendModel.FriendData.friendsDate.slice();
            this.dataProvider.replaceAll(arr.reverse());
        }
        this.list.dataProvider = this.dataProvider.length > 0 ? this.dataProvider : new eui.ArrayCollection([]);
        var friendConfig = GameGlobal.Config.FriendBaseConfig;
        var friendData = GameGlobal.FriendModel.FriendData;
        var vipConfig = GameGlobal.Config.VipPrivilegeConfig;
        this.giveCountTxt.text = friendData.curCoinNum + "/" + friendConfig.givecoin;
        this.friendsTxt.text = GameGlobal.FriendModel.friendsNum + "/" + vipConfig[GameGlobal.actorModel.vipLv].friendnum;
    };
    FriendsPanel.prototype.changePage = function (page) {
        this.SetPos((page - 1) * this.scroller.width);
        this.curPage = page;
    };
    FriendsPanel.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.throwTo(pos);
    };
    FriendsPanel.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.currentScrollPos = 0;
    };
    FriendsPanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.deleteBtn:
                this.currentState = "delete";
                GameGlobal.FriendModel.FriendData.curState = "delete";
                var arr = GameGlobal.FriendModel.FriendData.friendsDate.slice();
                this.list.dataProvider = new eui.ArrayCollection(arr.reverse());
                this.pageBtn.setPage(1);
                this.recoverTouchPos();
                this.UpdateContent();
                break;
            case this.allGiveBtn:
                if (this.currentState == "delete") {
                    this.currentState = "normal";
                    GameGlobal.FriendModel.FriendData.curState = "friend";
                    this.list.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.friendsDate);
                    this.pageBtn.setPage(1);
                    this.recoverTouchPos();
                    this.UpdateContent();
                }
                else
                    GameGlobal.FriendModel.sentAllGive();
                break;
        }
    };
    FriendsPanel.NAME = "我的关注";
    return FriendsPanel;
}(BaseView));
__reflect(FriendsPanel.prototype, "FriendsPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=FriendsPanel.js.map