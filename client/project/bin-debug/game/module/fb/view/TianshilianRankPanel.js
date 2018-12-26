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
var TianshilianRankPanel = (function (_super) {
    __extends(TianshilianRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TianshilianRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GuaQiaRankSkin';
        return _this;
    }
    TianshilianRankPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "天庭排行榜";
    };
    ;
    TianshilianRankPanel.prototype.initData = function () {
        this.list.itemRenderer = LingLongRankItem;
    };
    TianshilianRankPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_TT);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
        this.UpdateContent();
    };
    TianshilianRankPanel.prototype.UpdateContent = function () {
        var rankData = GameGlobal.RankingModel.ranks[RankingModel.RANK_TYPE_TT];
        this.list.dataProvider = new eui.ArrayCollection(rankData.datas);
        this.guanQiaTxt.text = GameGlobal.UserFb.tFbTiantingServerData.todayLayer + "\u5C42";
        var isMe;
        for (var _i = 0, _a = rankData.datas; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.id == GameGlobal.actorModel.actorID)
                isMe = true;
        }
        if (isMe)
            this.isMeTxt.text = "" + rankData.selfRank;
        else
            this.isMeTxt.text = "未上榜";
    };
    TianshilianRankPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return TianshilianRankPanel;
}(BaseEuiView));
__reflect(TianshilianRankPanel.prototype, "TianshilianRankPanel");
var TianshilianRankItem = (function (_super) {
    __extends(TianshilianRankItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TianshilianRankItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GuaQiaRankItemSkin";
        return _this;
    }
    TianshilianRankItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    TianshilianRankItem.prototype.dataChanged = function () {
        if (this.itemIndex % 2 == 0)
            this.currentState = "state1";
        else
            this.currentState = "state2";
        this.rankTxt.textColor = 0x6C310A;
        this.nameTxt.textColor = 0x6C310A;
        if (this.data.pos == 1) {
            this.rankTxt.textColor = 0xFF5900;
            this.nameTxt.textColor = 0xFF5900;
        }
        else if (this.data.pos == 2) {
            this.rankTxt.textColor = 0xAF2BB7;
            this.nameTxt.textColor = 0xAF2BB7;
        }
        else if (this.data.pos == 3) {
            this.rankTxt.textColor = 0x5A6EE7;
            this.nameTxt.textColor = 0x5A6EE7;
        }
        this.rankTxt.text = this.data.pos;
        this.nameTxt.text = this.data.name;
        this.guanQiaTxt.text = this.data.chapterlevel + "层";
        this.powerTxt.text = this.data.power;
    };
    return TianshilianRankItem;
}(eui.ItemRenderer));
__reflect(TianshilianRankItem.prototype, "TianshilianRankItem");
//# sourceMappingURL=TianshilianRankPanel.js.map