/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 师徒获得奖励item
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
var TeacherGetReItem = (function (_super) {
    __extends(TeacherGetReItem, _super);
    function TeacherGetReItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "TeacherGetReItemSkin";
        // //点击响应
        _this.brnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        _this.brnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        return _this;
    }
    TeacherGetReItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        if (!this.data.pupilreward)
            return;
        if (this.data.taskname) {
            this.lbNe.text = this.data.taskname;
        }
        //icon
        this.item.setItemData(this.data.pupilreward[0]);
        this.item.isShowName(false);
        this.lbVl.text = this.data.num + "/" + this.data.condition;
        if (this.data.condition - this.data.num > 0) {
            this.brnGo.visible = true;
            this.brnGet.visible = false;
            this.imgGet.visible = false;
            this.lbVl.textColor = Color.l_normal;
        }
        else {
            this.lbVl.textColor = Color.l_green_1;
            if (this.data.bGet) {
                this.brnGo.visible = false;
                this.brnGet.visible = false;
                this.imgGet.visible = true;
            }
            else {
                this.brnGo.visible = false;
                this.brnGet.visible = true;
                this.imgGet.visible = false;
            }
        }
    };
    TeacherGetReItem.prototype.OnClick = function (e) {
        switch (e.target) {
            case this.brnGo:
                //前往
                if (this.data.jump)
                    ViewManager.ins().Guide(this.data.jump, null);
                break;
            case this.brnGet:
                if (GameGlobal.TeacherController.getTeacherIdInFirst()) {
                    GameGlobal.TeacherManage.forceGetReward(GameGlobal.TeacherController.getTeacherIdInFirst(), this.data.actNo);
                }
                break;
        }
    };
    return TeacherGetReItem;
}(eui.ItemRenderer));
__reflect(TeacherGetReItem.prototype, "TeacherGetReItem");
//# sourceMappingURL=TeacherGetReItem.js.map