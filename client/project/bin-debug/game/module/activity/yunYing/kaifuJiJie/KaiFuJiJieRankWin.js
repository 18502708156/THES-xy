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
var KaiFuJiJieRankWin = (function (_super) {
    __extends(KaiFuJiJieRankWin, _super);
    function KaiFuJiJieRankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'KaiFuJiJieRankWinSkin';
        return _this;
    }
    KaiFuJiJieRankWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("进阶排行");
    };
    ;
    KaiFuJiJieRankWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuJiJieRankItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    KaiFuJiJieRankWin.prototype.UpdateContent = function () {
        // let myRank = 0
        // let myValue = 0
        var ranks = GameGlobal.ActivityKaiFuModel.advancedRank;
        if (ranks.length == 0) {
            this.rankTitle_group.visible = false;
            this.noRank_label.visible = true;
        }
        else {
            this.rankTitle_group.visible = true;
            this.noRank_label.visible = false;
            // let i = 0
            // for (let data of ranks) {
            //     if (data.id == GameGlobal.actorModel.actorID) {
            //         myRank = i
            //         myValue = data.power
            //     }
            //     ++i
            // }
        }
        this.list.dataProvider.replaceAll(ranks);
        var strRank = GameGlobal.ActivityKaiFuModel.advancedRankMySelfe || "未上榜";
        this.myInfo.textFlow = TextFlowMaker.generateTextFlow("\u6211\u7684\u6392\u540D\uFF1A|C:" + Color.GetStr(Color.l_green_1) + "&T:" + strRank + "|         \u6211\u7684\u6218\u529B\uFF1A|C:" + Color.GetStr(Color.l_green_1) + "&T:" + (GameGlobal.ActivityKaiFuModel.advancedSelfPower || 0) + "|");
    };
    KaiFuJiJieRankWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var type = param[0];
        this.rankTitleTxt.text = ActivityConst.JiJieTypeName2(type) + "阶数";
        this.powerTxt.text = ActivityConst.JiJieTypeName2(type) + "战力";
        this.observe(MessageDef.ACTIVITY_ADVANCED_RANK, this.UpdateContent);
        // GameGlobal.ActivityKaiFuModel.Send_advanced_rank();
        this.UpdateContent();
    };
    KaiFuJiJieRankWin.prototype.OnClose = function () { };
    ;
    KaiFuJiJieRankWin.LAYER_LEVEL = LayerManager.UI_Main;
    return KaiFuJiJieRankWin;
}(BaseEuiView));
__reflect(KaiFuJiJieRankWin.prototype, "KaiFuJiJieRankWin");
var KaiFuJiJieRankItem = (function (_super) {
    __extends(KaiFuJiJieRankItem, _super);
    function KaiFuJiJieRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    KaiFuJiJieRankItem.prototype.childrenCreated = function () { };
    KaiFuJiJieRankItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var rankData = this.data;
        this.imgBg.visible = this.itemIndex % 2 == 0;
        this.rank_txt.text = (this.itemIndex + 1) + '';
        this.name_txt.text = rankData.name;
        this.powerTxt.text = rankData.power + '';
        this.lv_txt.text = rankData.lv ? rankData.lv + '' : '0';
    };
    return KaiFuJiJieRankItem;
}(eui.ItemRenderer));
__reflect(KaiFuJiJieRankItem.prototype, "KaiFuJiJieRankItem");
//# sourceMappingURL=KaiFuJiJieRankWin.js.map