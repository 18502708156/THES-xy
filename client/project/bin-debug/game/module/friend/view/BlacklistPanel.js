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
var BlacklistPanel = (function (_super) {
    __extends(BlacklistPanel, _super);
    function BlacklistPanel() {
        var _this = _super.call(this) || this;
        _this.curPage = 1;
        return _this;
    }
    BlacklistPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = FriendItem;
    };
    BlacklistPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.FriendModel.FriendData.curState = "blacklist";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent);
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.blacklistData);
        this.list.dataProvider = this.dataProvider;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
        this.UpdateContent();
    };
    BlacklistPanel.prototype.UpdateContent = function () {
        var maxPage = GameGlobal.FriendModel.FriendData.blacklistData.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage));
        }
        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.blacklistData);
        var friendConfig = GameGlobal.Config.FriendBaseConfig;
        this.blacklistTxt.text = GameGlobal.FriendModel.blacklistNum + "/" + friendConfig.blacklist;
    };
    BlacklistPanel.prototype.changePage = function (page) {
        this.SetPos((page - 1) * this.scroller.width);
        this.curPage = page;
    };
    BlacklistPanel.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.throwTo(pos);
    };
    BlacklistPanel.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.currentScrollPos = 0;
    };
    BlacklistPanel.NAME = "黑名单";
    return BlacklistPanel;
}(BaseView));
__reflect(BlacklistPanel.prototype, "BlacklistPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=BlacklistPanel.js.map