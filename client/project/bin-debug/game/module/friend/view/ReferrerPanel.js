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
var ReferrerPanel = (function (_super) {
    __extends(ReferrerPanel, _super);
    function ReferrerPanel() {
        var _this = _super.call(this) || this;
        _this.curPage = 1;
        return _this;
    }
    ReferrerPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = FriendItem;
    };
    ReferrerPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.FriendModel.FriendData.curState = "referrer";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent);
        GameGlobal.FriendModel.sendReferrer();
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.referrerDate);
        this.list.dataProvider = this.dataProvider;
        this._AddClick(this.btn, this.onClick);
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
        this.UpdateContent();
    };
    ReferrerPanel.prototype.UpdateContent = function () {
        var maxPage = GameGlobal.FriendModel.FriendData.referrerDate.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (maxPage && this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage));
        }
        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.referrerDate);
        this.list.dataProvider = this.dataProvider.length > 0 ? this.dataProvider : new eui.ArrayCollection([]);
        var vipConfig = GameGlobal.Config.VipPrivilegeConfig;
        this.friendsTxt.text = GameGlobal.FriendModel.friendsNum + "/" + vipConfig[GameGlobal.actorModel.vipLv].friendnum;
    };
    ReferrerPanel.prototype.changePage = function (page) {
        this.SetPos((page - 1) * this.scroller.width);
        this.curPage = page;
    };
    ReferrerPanel.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.throwTo(pos);
    };
    ReferrerPanel.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.currentScrollPos = 0;
    };
    ReferrerPanel.prototype.onClick = function (e) {
        GameGlobal.FriendModel.sentAllFollow();
    };
    ReferrerPanel.NAME = "关注推荐";
    return ReferrerPanel;
}(BaseView));
__reflect(ReferrerPanel.prototype, "ReferrerPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=ReferrerPanel.js.map