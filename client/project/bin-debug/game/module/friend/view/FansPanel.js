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
var FansPanel = (function (_super) {
    __extends(FansPanel, _super);
    function FansPanel() {
        var _this = _super.call(this) || this;
        _this.curPage = 1;
        return _this;
    }
    FansPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = FriendItem;
    };
    FansPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.FriendModel.FriendData.curState = "fans";
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.changePage);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.UpdateContent);
        this._AddClick(this.allGiveBtn, this.onClick);
        this.dataProvider = new eui.ArrayCollection(GameGlobal.FriendModel.FriendData.fansData);
        this.list.dataProvider = this.dataProvider;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
        this.UpdateContent();
    };
    FansPanel.prototype.UpdateContent = function () {
        var maxPage = GameGlobal.FriendModel.FriendData.fansData.length / FriendModel.MAX_COUNT;
        this.pageBtn.setMax(Math.ceil(maxPage));
        if (this.curPage > Math.ceil(maxPage)) {
            this.changePage(Math.ceil(maxPage));
        }
        this.dataProvider.replaceAll(GameGlobal.FriendModel.FriendData.fansData);
        this.dataProvider.length > 0 ? null : this.list.dataProvider = new eui.ArrayCollection([]);
        var friendConfig = GameGlobal.Config.FriendBaseConfig;
        var friendData = GameGlobal.FriendModel.FriendData;
        this.giveCountTxt.text = friendData.takeCoinNum + "/" + friendConfig.receivecoin;
        this.fansCountTxt.text = GameGlobal.FriendModel.fansNum + "/" + friendConfig.fanscount;
        this.allGiveBtn.visible = GameGlobal.FriendModel.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin;
    };
    FansPanel.prototype.changePage = function (page) {
        this.SetPos((page - 1) * this.scroller.width);
        this.curPage = page;
    };
    FansPanel.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.throwTo(pos);
    };
    FansPanel.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[8];
        touch.maxScrollPos = this.list.contentWidth;
        touch.currentScrollPos = 0;
    };
    FansPanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.allGiveBtn:
                GameGlobal.FriendModel.sentTakeAllCoin();
                break;
        }
    };
    FansPanel.NAME = "我的粉丝";
    return FansPanel;
}(BaseView));
__reflect(FansPanel.prototype, "FansPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=FansPanel.js.map