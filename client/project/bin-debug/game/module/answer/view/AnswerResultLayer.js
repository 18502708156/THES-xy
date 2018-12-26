/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 16:21
 * @meaning: 答题结果界面
 *
 **/
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
var AnswerResultLayer = (function (_super) {
    __extends(AnswerResultLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function AnswerResultLayer() {
        var _this = _super.call(this) || this;
        _this.skinName = "AnswerResultSkin";
        _this.listView.itemRenderer = ItemBase;
        return _this;
    }
    AnswerResultLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this._AddClick(this.btnSure, this.close);
        this.tLayerData = param[0]; //
        this.updateContent();
    };
    AnswerResultLayer.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    AnswerResultLayer.prototype.close = function () {
        ViewManager.ins().close(AnswerLayer);
        ViewManager.ins().close(this);
    };
    AnswerResultLayer.prototype.updateContent = function () {
        if (!this.tLayerData)
            return;
        this.lbSort.text = this.tLayerData.rankNo || 99;
        var nScore = this.tLayerData.point || 0;
        var strSkillLv = "|C:0x682F00&T:\u4ECA\u65E5\u6210\u7EE9|C:0x369427&T:" + nScore + "|C:0x369427&T:\u5206|";
        this.lbScore.textFlow = TextFlowMaker.generateTextFlow(strSkillLv); //
        //奖励列表
        if (this.tLayerData.rewards && this.tLayerData.rewards.length) {
            this.listView.dataProvider.replaceAll(this.tLayerData.rewards);
        }
    };
    AnswerResultLayer.LAYER_LEVEL = LayerManager.UI_Popup;
    return AnswerResultLayer;
}(BaseEuiView));
__reflect(AnswerResultLayer.prototype, "AnswerResultLayer");
//# sourceMappingURL=AnswerResultLayer.js.map