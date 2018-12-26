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
var XiandaoRankView = (function (_super) {
    __extends(XiandaoRankView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XiandaoRankView() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoRankSkin";
        _this.list.itemRenderer = XiandaoRankItem;
        _this.list2.itemRenderer = XiandaoRankItem2;
        return _this;
    }
    XiandaoRankView.prototype.OnOpen = function () {
        this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateRank);
        this.UpdateRank();
        GameGlobal.XiandaoModel.SendGetRank();
    };
    XiandaoRankView.prototype.OnClose = function () {
    };
    XiandaoRankView.prototype.UpdateRank = function () {
        var model = GameGlobal.XiandaoModel;
        var rank = model.GetRankData();
        this.list.dataProvider = new eui.ArrayCollection(rank);
        var myRankData = model.GetMyRankData();
        this.myRank.textFlow = TextFlowMaker.generateTextFlow("\u6211\u7684\u6392\u540D\uFF1A|C:0x019704&T:" + myRankData.GetRank() + "|");
        this.myScore.textFlow = TextFlowMaker.generateTextFlow("\u6211\u7684\u79EF\u5206\uFF1A|C:0x019704&T:" + myRankData.score + "|");
        this.titleLabel.text = model.GetGroupTypeStr();
        var record = model.GetRankRecord();
        record.sort(function (lhs, rhs) {
            return rhs.trunId - lhs.trunId;
        });
        this.list2.dataProvider = new eui.ArrayCollection(record);
    };
    XiandaoRankView.prototype.UpdateContent = function () {
    };
    XiandaoRankView.LAYER_LEVEL = LayerManager.UI_Popup;
    return XiandaoRankView;
}(BaseView));
__reflect(XiandaoRankView.prototype, "XiandaoRankView", ["ICommonWindowTitle"]);
var XiandaoRankItem = (function (_super) {
    __extends(XiandaoRankItem, _super);
    function XiandaoRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    XiandaoRankItem.prototype.dataChanged = function () {
        this.bg.visible = this.itemIndex % 2 == 0;
        var data = this.data;
        this.rankLabel.text = data.rank + "";
        this.nameLabel.text = GameString.GetSerAndName(data.serverId, data.roleName);
        // this.powerLabel.text = data.GetPower()
        this.scoreLabel.text = data.score + "";
    };
    return XiandaoRankItem;
}(eui.ItemRenderer));
__reflect(XiandaoRankItem.prototype, "XiandaoRankItem");
var XiandaoRankItem2 = (function (_super) {
    __extends(XiandaoRankItem2, _super);
    function XiandaoRankItem2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    XiandaoRankItem2.prototype.dataChanged = function () {
        var data = this.data;
        this.turn.text = "\u7B2C" + StringUtils.numberToChinese(data.trunId) + "\u5C40";
        this.retImg.source = data.isWin ? "ui_xdh_bm_icon_sheng" : "ui_xdh_bm_icon_bai";
        this.retImg1.visible = data.isWin;
        this.retImg2.visible = !data.isWin;
        this.nameLabel1.text = GameString.GetSerAndName(data.server1, data.name1);
        this.nameLabel2.text = GameString.GetSerAndName(data.server2, data.name2);
    };
    return XiandaoRankItem2;
}(eui.ItemRenderer));
__reflect(XiandaoRankItem2.prototype, "XiandaoRankItem2");
//# sourceMappingURL=XiandaoRankView.js.map