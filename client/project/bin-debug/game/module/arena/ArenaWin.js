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
var ArenaWin = (function (_super) {
    __extends(ArenaWin, _super);
    /**竞技场 */
    function ArenaWin() {
        return _super.call(this) || this;
    }
    ArenaWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "ArenaWinSkin";
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(ArenaInfoPanel, { skinName: "ArenaInfoSkin" }),
            TabView.CreateTabViewData(XiandaoPanel),
            TabView.CreateTabViewData(LadderInfoPanel),
        ]);
    };
    ;
    ArenaWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        GameGlobal.Ladder.SendGetInitInfo();
        GameGlobal.Ladder.sendGetRankInfo();
        GameGlobal.XiandaoModel.SendGetInfo();
        var openIndex = args[0];
        var checkOpen = this.OnOpenIndex(openIndex);
        this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0);
        this.observe(MessageDef.ARENA_INFO_DATA, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ARENA_BUY_RESULT, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.LADDER_CHANGE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.LADDER_WINNER, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.LADDER_PRE_WEEK_REWARD, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    ArenaWin.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.Arena.IsRedPoint());
        this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.XiandaoModel.mRedPoint.IsRedPoint());
        this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.Ladder.IsRedPoint());
    };
    ArenaWin.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    ArenaWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_42);
    };
    ArenaWin.prototype.OnOpenIndex = function (selectedIndex) {
        if (1 == selectedIndex) {
            return Deblocking.Check(DeblockingType.TYPE_43);
        }
        else if (selectedIndex == 2) {
            return Deblocking.Check(GameGlobal.Config.KingSportsBaseConfig.openid);
        }
        return true;
    };
    ArenaWin.LAYER_LEVEL = LayerManager.UI_Main;
    return ArenaWin;
}(BaseEuiView));
__reflect(ArenaWin.prototype, "ArenaWin", ["ICommonWindow"]);
//# sourceMappingURL=ArenaWin.js.map