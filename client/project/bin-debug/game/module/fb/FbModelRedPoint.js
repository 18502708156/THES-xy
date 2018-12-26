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
var FbModelRedPoint = (function (_super) {
    __extends(FbModelRedPoint, _super);
    function FbModelRedPoint() {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        return _this;
    }
    FbModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.FB_INFO_UPDATE, MessageDef.FB_CBT_UPDATE,
            MessageDef.FB_CBT_UPDATE_REWARD, MessageDef.FB_TIANTING_UPDATE];
    };
    FbModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[FbModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    FbModelRedPoint.prototype.OnChange = function (index) {
        if (index == FbModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.FB_REDPOINT_NOTICE);
        }
    };
    FbModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    FbModelRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[FbModelRedPoint.CAILIAO_FB] = GameGlobal.UserFb.IsCailiaoNotice();
        this.mRedPointMap[FbModelRedPoint.CANGBAOTU_FB] = false; //藏宝图有宝箱未领取
        this.mRedPointMap[FbModelRedPoint.TIANTING_FB] = GameGlobal.UserFb.IsTianshilianNotice();
    };
    FbModelRedPoint.prototype.IsRedAct = function (type) {
        this.Get(DailyModelRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    FbModelRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    FbModelRedPoint.CAILIAO_FB = 1;
    FbModelRedPoint.CANGBAOTU_FB = 2;
    FbModelRedPoint.TIANTING_FB = 3;
    return FbModelRedPoint;
}(IRedPoint));
__reflect(FbModelRedPoint.prototype, "FbModelRedPoint");
//# sourceMappingURL=FbModelRedPoint.js.map