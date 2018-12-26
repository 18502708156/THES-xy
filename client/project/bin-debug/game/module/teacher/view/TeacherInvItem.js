/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 21:51
 * @meaning: 师徒邀请列表详情item
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
var TeacherInvItem = (function (_super) {
    __extends(TeacherInvItem, _super);
    function TeacherInvItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "TeacherInvItemSkin";
        // //点击响应
        _this.brnAg.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        _this.btnRefuse.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        _this.brnMo.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        return _this;
    }
    TeacherInvItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        //用于背景图横条显示
        this.imgBg.visible = this.data.index % 2 ? true : false;
        //判断是否为 收徒 / 接受师傅
        if (this.data.type === 1) {
            this.lbNe.text = this.data.name;
            this.lbLv.text = this.data.lv + "级";
            this.brnAg.visible = false;
            this.btnRefuse.visible = false;
            this.brnMo.visible = !this.data.tag;
            this.lbInv.visible = this.data.tag;
        }
        else {
            this.lbInv.visible = false;
            this.brnAg.visible = true;
            this.btnRefuse.visible = true;
            this.lbNe.text = "【" + this.data.name + "】";
            this.lbLv.text = "向您发出师徒邀请";
            this.brnMo.visible = false;
        }
    };
    TeacherInvItem.prototype.OnClick = function (e) {
        if (this.data.dbid) {
            switch (e.target) {
                case this.brnAg://同意
                    GameGlobal.TeacherManage.applyConfirm(this.data.dbid, true);
                    break;
                case this.btnRefuse://拒绝
                    GameGlobal.TeacherManage.applyConfirm(this.data.dbid, false);
                    break;
                case this.brnMo://收徒
                    var cost = GlobalConfig.ins().MasterBaseConfig.cost; //收徒花费
                    var lvlimit = GlobalConfig.ins().MasterBaseConfig.lvlimit || 0; //大于等级限制
                    // 收徒判断
                    var myLv = GameGlobal.actorModel.level || 0;
                    if (myLv - this.data.lv >= lvlimit) {
                        if (cost && Checker.CheckDatas(cost, false)) {
                            GameGlobal.TeacherManage.applyTeacher(this.data.dbid);
                        }
                    }
                    else {
                        UserTips.ins().showTips("师傅必须比徒弟等级>=" + lvlimit + "级方可收徒");
                    }
                    break;
            }
            GameGlobal.TeacherManage.getMessage(); //重新获取
        }
    };
    return TeacherInvItem;
}(eui.ItemRenderer));
__reflect(TeacherInvItem.prototype, "TeacherInvItem");
//# sourceMappingURL=TeacherInvItem.js.map