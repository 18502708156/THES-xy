/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒徒弟详情
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
var TeacherSecondView = (function (_super) {
    __extends(TeacherSecondView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TeacherSecondView() {
        var _this = _super.call(this) || this;
        _this.selectedIndex = 0;
        _this.tRewardData = [];
        _this.skinName = "TeacherSecendSkin";
        _this.tabBar.dataProvider = new eui.ArrayCollection(["大徒弟", "小徒弟"]);
        _this.listReward.itemRenderer = TeacherGetReLtItem;
        return _this;
    }
    TeacherSecondView.prototype.childrenCreated = function () {
    };
    TeacherSecondView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.lbTip, this.onClick);
        this.observe(MessageDef.POWER_CHANGE, this.UpdateContent);
        this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent);
        this.tabBar.selectedIndex = 0;
        this.selectedIndex = 0;
        this.AddItemClick(this.tabBar, this.onTabTap);
        this.UpdateContent();
    };
    TeacherSecondView.prototype.onTabTap = function () {
        this.selectedIndex = this.tabBar.selectedIndex;
        this.UpdateContent();
    };
    TeacherSecondView.prototype.UpdateContent = function () {
        this.setData();
        this.upDateStuCon();
        this.infoItem0.onUpdate(1, this.tPanelData[0]);
        this.infoItem1.onUpdate(1, this.tPanelData[1]);
    };
    TeacherSecondView.prototype.upDateStuCon = function () {
        if (this.tNowData && this.tNowData.no) {
            this.listReward.dataProvider.replaceAll(this.tRewardData);
            var mitDay = GlobalConfig.ins().MasterBaseConfig.graduate; //出师天数
            if (this.tNowData.day && this.tNowData.day >= mitDay) {
                //可以出师
                this.gReward.visible = false;
                this.lbTip.text = "等待徒弟出师";
            }
            else {
                //已经有徒弟内容
                this.gReward.visible = true;
                this.lbTip.text = "";
            }
        }
        else {
            //没有徒弟内容
            this.gReward.visible = false;
            this.lbTip.text = "仙君还没收徒";
        }
    };
    TeacherSecondView.prototype.setData = function () {
        this.tPanelData = GameGlobal.TeacherController.teacherInfo.studentData; //获取徒弟列表数据
        this.tNowData = this.tPanelData[this.selectedIndex];
        if (this.tNowData && this.tNowData.day) {
            this.tRewardData = [];
            var rewardMarks = [];
            if (this.tNowData.rewards != null) {
                rewardMarks = CommonUtils.uintToVecBool(this.tNowData.rewards, 16);
            }
            var tTask = GlobalConfig.ins().MasterTaskConfig;
            for (var item in tTask) {
                var oData = { actNo: 0, num: 0, bGet: false, condition: 0, pupilreward: [], masterreward: [], taskname: "", id: 0 };
                var oTask = tTask[item];
                oData.bGet = rewardMarks[item] || false;
                oData.condition = oTask.condition;
                oData.pupilreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 1);
                oData.masterreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 2);
                oData.taskname = oTask.taskname;
                oData.id = oTask.id;
                //整合后端消息
                if (this.tNowData.data) {
                    var tData = this.tNowData.data;
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
            this.sortReward();
        }
    };
    //排序
    TeacherSecondView.prototype.sortReward = function () {
        var weight = function (config) {
            if (config.condition - config.num > 0) {
                return 0;
            }
            else {
                return 1;
            }
        };
        this.tRewardData.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
    };
    TeacherSecondView.prototype.onClick = function (e) {
        switch (e.target) {
            case this.lbTip:
                //跳到 寻找界面
                MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN, 2);
                break;
        }
    };
    return TeacherSecondView;
}(BaseView));
__reflect(TeacherSecondView.prototype, "TeacherSecondView", ["ICommonWindowTitle"]);
//# sourceMappingURL=TeacherSecondView.js.map