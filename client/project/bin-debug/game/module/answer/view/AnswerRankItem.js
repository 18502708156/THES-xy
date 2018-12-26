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
var AnswerRankItem = (function (_super) {
    __extends(AnswerRankItem, _super);
    function AnswerRankItem() {
        var _this = _super.call(this) || this;
        _this.rewardList = [];
        return _this;
    }
    AnswerRankItem.prototype.childrenCreated = function () {
        this.tOther.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    AnswerRankItem.prototype.dataChanged = function () {
        if (!this.data) {
            return;
        }
        var data = this.data;
        if (data.rank) {
            this.setTxtColorByRank(data.rank);
            this.trank.text = data.rank + '';
            this.imgBg.visible = data.rank % 2 ? true : false;
        }
        this.tname.text = data.name || "";
        this.tpower.text = data.point || "";
        // UIHelper.SetLinkStyleLabel(this.tOther, "查看")
    };
    AnswerRankItem.prototype._OnClick = function (e) {
        var view = e.target;
        var nY = this.y;
    };
    AnswerRankItem.prototype.setTxtColorByRank = function (rank) {
        var color = 0x6E330B;
        switch (rank) {
            case 1:
                color = 0xd27701;
                break;
            case 2:
                color = 0xc400fd;
                break;
            case 3:
                color = 0x2F6FF6;
                break;
        }
        this.trank.textColor = this.tname.textColor = color;
    };
    return AnswerRankItem;
}(eui.ItemRenderer));
__reflect(AnswerRankItem.prototype, "AnswerRankItem");
//# sourceMappingURL=AnswerRankItem.js.map