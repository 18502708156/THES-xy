/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 11:15
 * @meaning: 答题管理类
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
var AnswerManage = (function (_super) {
    __extends(AnswerManage, _super);
    function AnswerManage() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_answer_info, _this.doAnswerInfo);
        _this.regNetMsg(S2cProtocol.sc_answer_update, _this.doAnswerUpDateInfo);
        _this.regNetMsg(S2cProtocol.sc_answer_reward, _this.doAnswerReward);
        _this.regNetMsg(S2cProtocol.sc_answer_rank_res, _this.doAnswerRank);
        return _this;
    }
    AnswerManage.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    //答题
    // no			0 : integer #第几题
    // answer		1 : string #答案
    AnswerManage.prototype.sendAnswer = function (no, answer) {
        var req = new Sproto.cs_answer_answer_request;
        req.no = no;
        req.answer = answer;
        this.Rpc(C2sProtocol.cs_answer_answer, req);
    };
    ;
    //请求排行吧
    AnswerManage.prototype.sendRetRank = function () {
        var req = new Sproto.cs_answer_answer_rank_request;
        this.Rpc(C2sProtocol.cs_answer_answer_rank, req);
    };
    ;
    //打开界面
    AnswerManage.prototype.openAnswer = function () {
        this.Rpc(C2sProtocol.cs_answer_answer_ui, function (rsp) {
            var rspData = rsp;
        });
    };
    //#活动中发送数据
    AnswerManage.prototype.doAnswerInfo = function (rsp) {
        GameGlobal.AnswerController.updateAnswer(rsp);
        //答题数据更新
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE);
    };
    AnswerManage.prototype.doAnswerUpDateInfo = function (rsp) {
        GameGlobal.AnswerController.updateAnswer(rsp);
        //答题数据更新
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE);
    };
    AnswerManage.prototype.doAnswerReward = function (rsp) {
        //奖励界面
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_REWARD); //
        //直接打开界面
        //open
        ViewManager.ins().open(AnswerResultLayer, rsp);
        //强行把状态设置为0
        var pData = { type: 0 };
        pData.type = 0;
        GameGlobal.AnswerController.updateAnswer(pData);
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE);
    };
    AnswerManage.prototype.doAnswerRank = function (rsp) {
        //直接打开界面
        ViewManager.ins().open(AnswerRankWin, rsp.rank);
    };
    return AnswerManage;
}(BaseSystem));
__reflect(AnswerManage.prototype, "AnswerManage");
//# sourceMappingURL=AnswerManage.js.map