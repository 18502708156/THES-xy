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
var SimpleRankPanel = (function (_super) {
    __extends(SimpleRankPanel, _super);
    function SimpleRankPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SimpleRankPanel.prototype, "rankType", {
        set: function (value) {
            this.m_RankType = value;
        },
        enumerable: true,
        configurable: true
    });
    SimpleRankPanel.prototype._UpdateRank = function () {
        if (!this.m_RankType) {
            return;
        }
        // this.updataFirstThree(Rank.ins().rankModel[this.m_RankType])
        // Rank.ins().sendGetRankingData(this.m_RankType)
    };
    SimpleRankPanel.prototype.childrenCreated = function () {
        this.seeRank.textFlow = (new egret.HtmlTextParser).parser("<font><u>" + this.seeRank.text + "</u></font>");
    };
    SimpleRankPanel.prototype.open = function () {
        this.visible = GameGlobal.actorModel.level >= 60;
        // this.currentState = "unshow";
        // MessageCenter.addListener(Rank.postRankingData, this.updataFirstThree, this)
        this.seeRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this._UpdateRank();
    };
    SimpleRankPanel.prototype.close = function () {
        MessageCenter.ins().removeAll(this);
        this.seeRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    SimpleRankPanel.prototype.updataFirstThree = function (rankModel) {
        if (!rankModel) {
            for (var i = 0; i < 3; i++) {
                var data = rankModel.getDataList(i);
                this._SetRankName(i, null);
                this._SetRankHarm(i, null);
            }
            return;
        }
        if (rankModel.type != this.m_RankType)
            return;
        for (var i = 0; i < 3; i++) {
            var data = rankModel.getDataList(i);
            // this._SetRankName(i, data ? data[RankDataType.DATA_PLAYER] : null)
            // this._SetRankHarm(i, data ? data[RankDataType.DATA_COUNT] : null)
        }
    };
    SimpleRankPanel.prototype._SetRankName = function (index, value) {
        this["name" + index].text = value || "暂无";
    };
    SimpleRankPanel.prototype._SetRankHarm = function (index, value) {
        if (value === void 0) { value = "0"; }
        var harm = this["harm" + index];
        if (value) {
            harm.visible = true;
            harm.text = value + "关";
        }
        else {
            harm.visible = false;
        }
    };
    SimpleRankPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.seeRank:
                if (!this.m_RankType) {
                    return;
                }
                // let rankModel = Rank.ins().rankModel[this.m_RankType]
                // if (rankModel && rankModel.getDataList.length > 0) {
                // 	if (GameGlobal.actorModel.level < 60)
                // 		UserTips.ins().showTips("60级开启排行榜");
                // 	else
                // 		ViewManager.ins().open(FbAndLevelsRankWin, this.m_RankType);
                // } else {
                // 	UserTips.ins().showTips("|C:0xff0000&T:排行榜暂时未开放|");
                // }
                break;
        }
    };
    return SimpleRankPanel;
}(eui.Component));
__reflect(SimpleRankPanel.prototype, "SimpleRankPanel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=SimpleRankPanel.js.map