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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 11:15
 * @meaning: 答题控制类
 *
 **/
var AnswerController = (function (_super) {
    __extends(AnswerController, _super);
    function AnswerController() {
        var _this = _super.call(this) || this;
        _this.nOopenWinState = 0; //0未都未开启 1为开启了小窗口 2为开启了大窗口
        _this.bOpenLayer = false; //是否打开了答题界面
        return _this;
    }
    AnswerController.prototype.Init = function () {
        _super.prototype.Init.call(this);
        //初始化
        this.tAnswerData = { type: 0, rank: 0, answerNum: 0, answerNo: 0, answerList: [], point: 0, rankNo: 0, operation: 0, timeout: 0 };
    };
    //获取
    AnswerController.prototype.getAnswerData = function () {
        return this.tAnswerData;
    };
    //是否可以打开
    AnswerController.prototype.bOpenAnswer = function () {
        var bOpen = false;
        if (this.tAnswerData.type) {
            bOpen = true;
        }
        return bOpen;
    };
    //更新答题内容
    AnswerController.prototype.updateAnswer = function (_data) {
        this.tAnswerData.type = this.sentenceTrue(this.tAnswerData.type, _data.type);
        this.tAnswerData.rank = this.sentenceTrue(this.tAnswerData.rank, _data.rank);
        this.tAnswerData.answerNum = this.sentenceTrue(this.tAnswerData.answerNum, _data.answerNum);
        this.tAnswerData.answerNo = this.sentenceTrue(this.tAnswerData.answerNo, _data.answerNo);
        this.tAnswerData.answerList = this.sentenceTrue(this.tAnswerData.answerList, _data.answerList);
        this.tAnswerData.point = this.sentenceTrue(this.tAnswerData.point, _data.point);
        this.tAnswerData.rankNo = this.sentenceTrue(this.tAnswerData.rankNo, _data.rankNo);
        this.tAnswerData.operation = this.sentenceTrue(this.tAnswerData.operation, _data.operation);
        this.tAnswerData.timeout = this.sentenceTrue(this.tAnswerData.timeout, _data.timeout);
    };
    AnswerController.prototype.sentenceTrue = function (_orignal, _value) {
        if (typeof (_value) === "number") {
            _orignal = _value;
        }
        else if (typeof (_value) === "object") {
            _orignal = _value;
        }
        return _orignal;
    };
    AnswerController.prototype.OnSocketClose = function () {
        // 断线的时候清掉答题数据
        if (this.tAnswerData) {
            this.tAnswerData.type = 0;
        }
    };
    return AnswerController;
}(BaseSystem));
__reflect(AnswerController.prototype, "AnswerController");
//# sourceMappingURL=AnswerController.js.map