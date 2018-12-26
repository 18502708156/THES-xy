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
var GuanQiaRankPanel = (function (_super) {
    __extends(GuanQiaRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GuanQiaRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GuaQiaRankSkin';
        return _this;
    }
    GuanQiaRankPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "关卡排行榜";
    };
    ;
    GuanQiaRankPanel.prototype.initData = function () {
        this.list.itemRenderer = GuanQiaRankItem;
    };
    GuanQiaRankPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_FB);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
    };
    GuanQiaRankPanel.prototype.UpdateContent = function () {
        var rankData = GameGlobal.RankingModel.ranks[RankingModel.RANK_TYPE_FB];
        this.list.dataProvider = new eui.ArrayCollection(rankData.datas);
        this.guanQiaTxt.text = GameGlobal.UserFb.guanqiaID + "\u5173";
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
    GuanQiaRankPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return GuanQiaRankPanel;
}(BaseEuiView));
__reflect(GuanQiaRankPanel.prototype, "GuanQiaRankPanel");
var GuanQiaRankItem = (function (_super) {
    __extends(GuanQiaRankItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GuanQiaRankItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GuaQiaRankItemSkin";
        return _this;
    }
    GuanQiaRankItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    GuanQiaRankItem.prototype.dataChanged = function () {
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
        this.guanQiaTxt.text = this.data.chapterlevel + "关";
        this.powerTxt.text = this.data.power;
    };
    return GuanQiaRankItem;
}(eui.ItemRenderer));
__reflect(GuanQiaRankItem.prototype, "GuanQiaRankItem");
//# sourceMappingURL=GuanQiaRankPanel.js.map