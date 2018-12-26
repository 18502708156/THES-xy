/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/29 16:15
 * @meaning: 师徒管理类
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
var TeacherManage = (function (_super) {
    __extends(TeacherManage, _super);
    function TeacherManage() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_teachers_info, _this.doInfo);
        _this.regNetMsg(S2cProtocol.sc_teachers_update, _this.doUpdate);
        _this.regNetMsg(S2cProtocol.sc_teachers_graduation, _this.dograduation);
        _this.regNetMsg(S2cProtocol.sc_teachers_message_add, _this.messageAdd);
        return _this;
    }
    TeacherManage.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    //广播招师
    TeacherManage.prototype.message = function () {
        this.Rpc(C2sProtocol.cs_teachers_message);
    };
    ;
    //获取徒弟列表
    TeacherManage.prototype.getMessage = function () {
        this.Rpc(C2sProtocol.cs_teachers_get_message, null, function (rsp) {
            var rspData = rsp;
            if (rspData.data) {
                GameGlobal.TeacherController.posStudent(rspData.data);
                MessageCenter.ins().dispatch(MessageDef.TEACHER_CHANGE);
            }
        });
    };
    ;
    //师傅招收徒弟
    TeacherManage.prototype.applyTeacher = function (sDbid) {
        var req = new Sproto.cs_teachers_apply_teacher_request;
        req.sDbid = sDbid; //学生id
        this.Rpc(C2sProtocol.cs_teachers_apply_teacher, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                UserTips.ins().showTips("已发送收徒请求");
            }
        });
    };
    ;
    //徒弟答应
    TeacherManage.prototype.applyConfirm = function (tDbid, res) {
        var req = new Sproto.cs_teachers_apply_confirm_request;
        req.tDbid = tDbid;
        req.res = res;
        this.Rpc(C2sProtocol.cs_teachers_apply_confirm, req);
        GameGlobal.TeacherController.deleteMessage(tDbid);
    };
    ;
    //师傅传功
    TeacherManage.prototype.teachExp = function (no) {
        var req = new Sproto.cs_teachers_teach_exp_request;
        req.no = no;
        this.Rpc(C2sProtocol.cs_teachers_teach_exp, req);
    };
    ;
    //徒弟领取
    TeacherManage.prototype.getExp = function (no) {
        var req = new Sproto.cs_teachers_get_exp_request;
        req.no = no;
        this.Rpc(C2sProtocol.cs_teachers_get_exp, req);
    };
    ;
    //出师
    TeacherManage.prototype.graduation = function (no, typ) {
        var req = new Sproto.cs_teachers_graduation_request;
        req.no = no;
        req.typ = typ;
        this.Rpc(C2sProtocol.cs_teachers_graduation, req);
    };
    ;
    //领取任务奖励(经验)
    TeacherManage.prototype.forceGetReward = function (no, act) {
        if (!no)
            return;
        if (!act)
            return;
        var req = new Sproto.cs_teachers_force_get_reward_request;
        req.no = no;
        req.act = act;
        this.Rpc(C2sProtocol.cs_teachers_force_get_reward, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                GameGlobal.TeacherController.changeRewards(rspData.rewards);
                MessageCenter.ins().dispatch(MessageDef.TEACHER_CHANGE);
            }
        });
    };
    ;
    /////////////////接收部分//////////////
    TeacherManage.prototype.doInfo = function (rsp) {
        GameGlobal.TeacherController.doInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE);
    };
    TeacherManage.prototype.doUpdate = function (rsp) {
        GameGlobal.TeacherController.doUpdate(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE);
    };
    TeacherManage.prototype.dograduation = function (rsp) {
        GameGlobal.TeacherController.dograduation(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE);
    };
    TeacherManage.prototype.messageAdd = function (rsp) {
        GameGlobal.TeacherController.messageAdd(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE);
    };
    return TeacherManage;
}(BaseSystem));
__reflect(TeacherManage.prototype, "TeacherManage");
//# sourceMappingURL=TeacherManage.js.map