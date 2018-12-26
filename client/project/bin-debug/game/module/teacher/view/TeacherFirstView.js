/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒师傅详情
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
var TeacherFirstView = (function (_super) {
    __extends(TeacherFirstView, _super);
    function TeacherFirstView() {
        var _this = _super.call(this) || this;
        _this.state = 1; //当前状态
        _this.tRewardData = [];
        _this.skinName = "TeacherFirstSkin";
        _this.listView.itemRenderer = TeacherGetReItem;
        return _this;
    }
    TeacherFirstView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.imgSend, this.onClick);
        this._AddClick(this.lbSend, this.onClick);
        this.observe(MessageDef.POWER_CHANGE, this.UpdateContent);
        this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    TeacherFirstView.prototype.UpdateContent = function () {
        this.setData();
        if (this.state === 1) {
            this.infoItem.visible = false;
        }
        else if (this.state === 2) {
            this.upDateTeacherState();
        }
        else if (this.state === 3) {
            this.upDateDepartState();
        }
    };
    TeacherFirstView.prototype.upDateTeacherState = function () {
        this.infoItem.visible = true;
        this.infoItem.onUpdate(0, this.tPanelData.teacherData); //更新师傅数据
        this.listView.dataProvider = new eui.ArrayCollection(this.tRewardData);
    };
    TeacherFirstView.prototype.upDateDepartState = function () {
        this.infoItem.visible = true;
        this.infoItem.onUpdate(0, this.tPanelData.teacherData); //更新师傅数据
        this.depart1.onUpdate(2);
        this.depart2.onUpdate(1);
    };
    TeacherFirstView.prototype.upState = function () {
        var day = this.tPanelData.teacherData.day;
        var mitDay = GlobalConfig.ins().MasterBaseConfig.graduate; //出师天数
        if (day) {
            if (day >= mitDay) {
                this.state = 3;
                this.currentState = "depart";
            }
            else {
                this.state = 2;
                this.currentState = "teacher";
            }
        }
        else {
            this.state = 1;
            this.currentState = "null";
        }
    };
    TeacherFirstView.prototype.setData = function () {
        this.tPanelData = GameGlobal.TeacherController.teacherInfo; //获取师徒数据
        this.upState();
        if (this.state === 2) {
            this.tRewardData = []; //整合奖励数据
            var rewardMarks = [];
            if (this.tPanelData.teacherData.rewards != null) {
                rewardMarks = CommonUtils.uintToVecBool(this.tPanelData.teacherData.rewards, 16);
            }
            var tTask = GlobalConfig.ins().MasterTaskConfig;
            for (var item in tTask) {
                var oData = { actNo: 0, num: 0, bGet: false, condition: 0, pupilreward: [], masterreward: [], taskname: "", id: 0, jump: 0 };
                var oTask = tTask[item];
                oData.bGet = rewardMarks[item] || false;
                oData.condition = oTask.condition;
                oData.pupilreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 1);
                oData.masterreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 2);
                oData.taskname = oTask.taskname;
                oData.jump = oTask.jump;
                oData.id = oTask.id;
                //整合后端消息
                if (this.tPanelData.teacherData.data) {
                    var tData = this.tPanelData.teacherData.data;
                    if (tData) {
                        for (var index in tData) {
                            if (tData[index].actNo === oTask.id) {
                                oData.actNo = tData[index].actNo;
                                oData.num = tData[index].num;
                            }
                        }
                    }
                }
                this.tRewardData.push(oData);
            }
            //奖励排序
            this.sortReward();
        }
    };
    //排序
    TeacherFirstView.prototype.sortReward = function () {
        var weight = function (config) {
            if (config.bGet) {
                return 1;
            }
            else {
                return 0;
            }
        };
        this.tRewardData.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
    };
    TeacherFirstView.prototype.onClick = function (e) {
        UserTips.ins().showTips("发送寻求名师广播");
        GameGlobal.TeacherManage.message();
        // switch (e.target) {
        // 		case this.imgSend:
        // 		break
        // 	}
    };
    return TeacherFirstView;
}(BaseView));
__reflect(TeacherFirstView.prototype, "TeacherFirstView", ["ICommonWindowTitle"]);
//# sourceMappingURL=TeacherFirstView.js.map