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
 * @Date: 2018/5/29 16:15
 * @meaning: 师徒控制类
 *
 **/
var TeacherController = (function (_super) {
    __extends(TeacherController, _super);
    function TeacherController() {
        var _this = _super.call(this) || this;
        _this.tInvList = []; //邀请列表
        return _this;
    }
    TeacherController.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    TeacherController.prototype.doInfo = function (rsp) {
        this.teacherInfo = rsp;
    };
    TeacherController.prototype.changeRewards = function (reward) {
        if (reward) {
            this.teacherInfo.teacherData.rewards = reward;
        }
    };
    TeacherController.prototype.doUpdate = function (rsp) {
        if (rsp.studentData) {
            for (var item in this.teacherInfo.studentData) {
                var tStu = this.teacherInfo.studentData[item];
                if (tStu.no == rsp.studentData.no) {
                    this.analyze(tStu, rsp.studentData);
                }
            }
        }
        if (rsp.teacherData) {
            this.analyze(this.teacherInfo.teacherData, rsp.teacherData);
        }
    };
    TeacherController.prototype.posStudent = function (rsp) {
        this.tPosStudent = rsp;
    };
    //lv 等级 type 1为徒弟, 2为师傅
    TeacherController.prototype.lookForReward = function (_lv, _type) {
        var tReward = [];
        if (_lv) {
            var tList = GlobalConfig.ins().MasterTaskRewardConfig;
            for (var item in tList) {
                var data = tList[item];
                if (data.level) {
                    var one = data.level[0] || 1;
                    var two = data.level[1] || 100000;
                    if (_lv >= one && _lv <= two) {
                        if (_type == 1) {
                            tReward = data.pupilreward;
                        }
                        else if (_type == 2) {
                            tReward = data.masterreward;
                        }
                    }
                }
            }
        }
        return tReward;
    };
    TeacherController.prototype.dograduation = function (rsp) {
        var tStu = this.teacherInfo.studentData;
        var tTea = this.teacherInfo.teacherData;
        if (tStu) {
            for (var i = 0; i < tStu.length; i++) {
                if (tStu[i].no === rsp.no) {
                    tStu.splice(i, 1);
                    return;
                }
            }
        }
        if (tTea) {
            if (tTea.no === rsp.no) {
                for (var item in tTea) {
                    delete tTea[item]; //清空数据对象
                }
            }
        }
    };
    TeacherController.prototype.messageAdd = function (rsp) {
        if (this.teacherInfo.messageData) {
            this.teacherInfo.messageData.push(rsp);
        }
        else {
            this.teacherInfo.messageData = [];
            this.teacherInfo.messageData.push(rsp);
        }
    };
    //把邀请内容删除
    TeacherController.prototype.deleteMessage = function (_id) {
        var object = this.teacherInfo.messageData;
        for (var i = 0; i < object.length; i++) {
            if (object[i].dbid && object[i].dbid === _id) {
                object.splice(i, 1);
                GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE);
                break;
            }
        }
    };
    //对匹配的对象进行替换
    TeacherController.prototype.analyze = function (_origanal, _update) {
        for (var item in _origanal) {
            if (_update.hasOwnProperty(item)) {
                _origanal[item] = _update[item]; //赋值
            }
        }
    };
    //获取邀请列表
    TeacherController.prototype.getInvList = function () {
        var tList = [];
        //接受邀请
        for (var item in this.teacherInfo.messageData) {
            var data = this.teacherInfo.messageData[item];
            var tMess = { dbid: 0, name: "name", lv: 0, type: 0, tag: false };
            tMess.dbid = data.dbid;
            tMess.name = data.name;
            tMess.lv = data.lv;
            tMess.type = 2;
            tList.push(tMess);
        }
        for (var item in this.tPosStudent) {
            var data = this.tPosStudent[item];
            var tMess = { dbid: 0, name: "name", lv: 0, type: 0, tag: false };
            tMess.dbid = data.dbid;
            tMess.name = data.name;
            tMess.lv = data.lv;
            tMess.type = 1;
            tMess.tag = data.tag;
            tList.push(tMess);
        }
        //增加下标
        for (var item in tList) {
            tList[item].index = parseInt(item);
        }
        return tList; //整合列表
    };
    //获取师傅界面师徒id
    TeacherController.prototype.getTeacherIdInFirst = function () {
        var id = 0;
        if (this.teacherInfo && this.teacherInfo.teacherData && this.teacherInfo.teacherData.no) {
            id = this.teacherInfo.teacherData.no;
        }
        return id;
    };
    return TeacherController;
}(BaseSystem));
__reflect(TeacherController.prototype, "TeacherController");
//# sourceMappingURL=TeacherController.js.map