/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/4 16:01
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
//打造的信息框
var TeacherInfoItem = (function (_super) {
    __extends(TeacherInfoItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TeacherInfoItem() {
        var _this = _super.call(this) || this;
        _this.nType = 0; //0 师傅数据 1学生数据		
        _this.skinName = "TeacherItemInfoSkin";
        _this._AddClick(_this.lbSw, _this.onClick);
        _this._AddClick(_this.lbGo, _this.onClick);
        _this._AddClick(_this.btn, _this.onClick);
        UIHelper.SetLinkStyleLabel(_this.lbGo, "前往寻觅高徒"); //下划线
        return _this;
    }
    TeacherInfoItem.prototype.onUpdate = function (_type, _data) {
        this.nType = _type || 0;
        this.oData = _data;
        this.nType ? this.updateSt() : this.updateTc();
    };
    TeacherInfoItem.prototype.updateTc = function () {
        var data = this.oData;
        //外观
        if (data.sShows && data.sShows.shows) {
            UIHelper.SetHead(this.head, data.sShows.job, data.sShows.sex);
        }
        this.lbType.text = "师傅";
        this.gLook.visible = false;
        this.btn.icon = "ui_st_bt_jieshouchuangong";
        this.lbNe.text = data.tName || "";
        this.lbLv.text = (data.tLv || "") + "级";
        if (data.tLogin) {
            this.lbSt.text = "在线";
            this.lbSt.textColor = Color.l_green_1;
        }
        else {
            this.lbSt.text = "离线";
            this.lbSt.textColor = Color.RedColor;
        }
        this.lbTime.text = ""; //初始化天数
        //经验
        this.lbExp.text = this.getExp(1, GameGlobal.actorModel.level) + "";
        if (data.exp) {
            this.btn.filters = null;
            if (data.exp === 1) {
                this.gTime.visible = false;
                this.gExp.visible = true;
                this.btn.visible = true;
            }
            else {
                this.gTime.visible = true;
                this.gExp.visible = false;
                this.btn.visible = false;
            }
            var day = GlobalConfig.ins().MasterBaseConfig.graduate - (data.day || 1);
            if (day > 0) {
                this.lbTime.text = day + "天";
            }
            else {
                this.gTime.visible = false;
            }
        }
        else {
            this.gExp.visible = true;
            this.gTime.visible = false;
            this.btn.visible = true;
            this.btn.filters = Color.GetFilter();
        }
    };
    TeacherInfoItem.prototype.updateSt = function () {
        if (this.oData) {
            if (this.oData.tShows && this.oData.tShows.shows) {
                UIHelper.SetHead(this.head, this.oData.tShows.job, this.oData.tShows.sex);
            }
            this.gNormal.visible = true;
            this.gLook.visible = false;
            this.lbType.text = "徒弟";
            var data = this.oData;
            this.lbNe.text = data.sName || "";
            this.lbLv.text = (data.sLv || "") + "级";
            if (data.sLogin) {
                this.lbSt.text = "在线";
                this.lbSt.textColor = Color.l_green_1;
            }
            else {
                this.lbSt.text = "离线";
                this.lbSt.textColor = Color.RedColor;
            }
            this.lbTime.text = ""; //初始化天数
            //经验
            this.lbExp.text = this.getExp(2, GameGlobal.actorModel.level) + "";
            if (data.exp) {
                if (data.exp === 1) {
                    this.gTime.visible = false;
                    this.gExp.visible = true;
                    this.btn.filters = Color.GetFilter();
                }
                else {
                    this.gTime.visible = true;
                    this.gExp.visible = false;
                    this.btn.visible = false;
                }
                var day = GlobalConfig.ins().MasterBaseConfig.graduate - (data.day || 1);
                if (day > 0) {
                    this.lbTime.text = day + "天";
                }
                else {
                    this.gTime.visible = false;
                }
            }
        }
        else {
            this.btn.visible = true;
            this.gNormal.visible = false;
            this.gLook.visible = true;
            this.btn.filters = null;
        }
    };
    TeacherInfoItem.prototype.onClick = function (e) {
        switch (e.target) {
            case this.lbSw:
                MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN, 2);
                break;
            case this.lbGo:
                MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN, 2);
                break;
            case this.btn://传功/接受传功
                var bSend = false;
                if (this.nType) {
                    if (this.oData.exp) {
                        UserTips.ins().showTips("已传功");
                    }
                    else {
                        bSend = true;
                    }
                }
                else {
                    if (this.oData.exp === 1) {
                        bSend = true;
                    }
                    else {
                        UserTips.ins().showTips("等待传功");
                    }
                }
                if (bSend) {
                    ViewManager.ins().open(TeacherSendWin, this.oData, this.nType);
                }
                break;
        }
    };
    //_type 师徒类型 1徒弟 ,2师傅
    TeacherInfoItem.prototype.getExp = function (_type, _lv) {
        var exp = 0;
        if (_type && _lv) {
            var list = GlobalConfig.ins().ImpartExpConfig[_type];
            for (var item in list) {
                if (list[item].level) {
                    var one = list[item].level[0] || 1;
                    var two = list[item].level[1] || 99999;
                    if (_lv >= one && _lv <= two) {
                        exp = list[item].exp[0].count || 0;
                        break;
                    }
                }
            }
        }
        return exp;
    };
    return TeacherInfoItem;
}(BaseView));
__reflect(TeacherInfoItem.prototype, "TeacherInfoItem");
//# sourceMappingURL=TeacherInfoItem.js.map