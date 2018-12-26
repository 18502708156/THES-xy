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
var LingLongTaPanel = (function (_super) {
    __extends(LingLongTaPanel, _super);
    function LingLongTaPanel() {
        var _this = _super.call(this) || this;
        _this.mCount = 0;
        _this.DOWNTIME = 5;
        _this.skinName = "LingLongTaSkin";
        return _this;
    }
    // 引导对象
    LingLongTaPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.tiaozhanBtn,
            _a;
        var _a;
    };
    LingLongTaPanel.prototype.UpdateContent = function () {
        var taData = GameGlobal.UserFb.lltModel;
        this.item0.onUpdate(); //排行榜数据更新		
        this.item1.onUpdate(taData, 1); //第一个塔数据更新
        this.item2.onUpdate(taData, 2); //第二个塔数据更新
        this.item3.onUpdate(taData, 3); //第三个塔数据更新
    };
    LingLongTaPanel.prototype.OnOpen = function () {
        GameGlobal.UserFb.rankType = RankingModel.RANK_TYPE_LLT;
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_LLT);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
        this.AddClick(this.cailiaoShop, this.onTap);
        this.AddClick(this.tiaozhanBtn, this.onTap);
        UIHelper.ShowRedPoint(this.tiaozhanBtn, true); //红点常驻
        this.checkBox.addEventListener(egret.Event.CHANGE, this.chage, this);
        this.checkBox.selected = GameGlobal.UserFb.bLingLongTaAuto;
        this.checkBox.labelDisplay.textColor = Color.Green;
        this.SetCheckInfo();
        this.UpdateContent();
    };
    LingLongTaPanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
    };
    LingLongTaPanel.prototype.onTap = function (e) {
        switch (e.target) {
            case this.cailiaoShop:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DAYAN]);
                break;
            case this.tiaozhanBtn:
                if (UserFb.FinishAndCheckFighting2()) {
                    GameGlobal.UserFb.sendfbJoin(3, 0);
                }
                break;
        }
    };
    LingLongTaPanel.prototype.chage = function () {
        GameGlobal.UserFb.bLingLongTaAuto = this.checkBox.selected;
        this.SetCheckInfo();
    };
    LingLongTaPanel.prototype.SetCheckInfo = function () {
        this.checkBox.labelDisplay.text = GameGlobal.UserFb.bLingLongTaAuto ? this.DOWNTIME + "s\u540E\u81EA\u52A8\u6311\u6218" : "\u81EA\u52A8\u6311\u6218";
        this.RemoveTimer(this.UpdateTime);
        if (GameGlobal.UserFb.bLingLongTaAuto) {
            this.AddTimer(1000, this.DOWNTIME, this.UpdateTime);
        }
    };
    LingLongTaPanel.prototype.UpdateTime = function () {
        this.mCount++;
        this.checkBox.labelDisplay.text = this.DOWNTIME - this.mCount + "s\u540E\u81EA\u52A8\u6311\u6218";
        if (this.mCount >= this.DOWNTIME) {
            if (!UserFb.FinishAndCheckFighting2()) {
                return;
            }
            GameGlobal.UserFb.sendfbJoin(3, 0);
        }
    };
    LingLongTaPanel.NAME = "玲珑宝塔";
    return LingLongTaPanel;
}(BaseView));
__reflect(LingLongTaPanel.prototype, "LingLongTaPanel", ["ICommonWindowTitle"]);
var FBRankCom = (function (_super) {
    __extends(FBRankCom, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FBRankCom() {
        var _this = _super.call(this) || this;
        _this.skinName = "FbRankSkin";
        _this.rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        return _this;
    }
    FBRankCom.prototype.onUpdate = function () {
        var rankData = GameGlobal.RankingModel.ranks[GameGlobal.UserFb.rankType];
        if (rankData)
            for (var _i = 0, _a = rankData.datas; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value.pos == 1) {
                    this.name01.text = "" + value.name;
                    this.ca01.text = " " + value.chapterlevel + "\u5C42";
                }
                else if (value.pos == 2) {
                    this.name02.text = "" + value.name;
                    this.ca02.text = " " + value.chapterlevel + "\u5C42";
                }
                else if (value.pos == 3) {
                    this.name03.text = "" + value.name;
                    this.ca03.text = " " + value.chapterlevel + "\u5C42";
                }
            }
    };
    FBRankCom.prototype.onTap = function () {
        if (GameGlobal.UserFb.rankType == RankingModel.RANK_TYPE_LLT)
            ViewManager.ins().open(LingLongRankPanel);
        if (GameGlobal.UserFb.rankType == RankingModel.RANK_TYPE_TT)
            ViewManager.ins().open(TianshilianRankPanel);
    };
    return FBRankCom;
}(eui.Component));
__reflect(FBRankCom.prototype, "FBRankCom");
//# sourceMappingURL=LingLongTaPanel.js.map