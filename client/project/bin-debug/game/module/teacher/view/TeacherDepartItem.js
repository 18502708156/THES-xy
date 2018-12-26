/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/5 14:01
 * @meaning: 师徒出师奖励详情
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
var TeacherDepartItem = (function (_super) {
    __extends(TeacherDepartItem, _super);
    function TeacherDepartItem() {
        var _this = _super.call(this) || this;
        _this.nType = 1; //1 完美出师 2普通出师		
        _this.skinName = "TeacherItemDepart";
        _this._AddClick(_this.btnDepart, _this.onClick);
        _this.listViewL.itemRenderer = ItemBaseNotName;
        _this.listViewR.itemRenderer = ItemBaseNotName;
        return _this;
    }
    TeacherDepartItem.prototype.onUpdate = function (_type) {
        this.nType = _type || 1;
        this.oData = GlobalConfig.ins().GraduateConfig[this.nType];
        this.onUpdateContent();
    };
    TeacherDepartItem.prototype.onUpdateContent = function () {
        if (this.oData.pupilreward && this.oData.masterreward) {
            this.listViewL.dataProvider = new eui.ArrayCollection(this.oData.pupilreward);
            this.listViewR.dataProvider = new eui.ArrayCollection(this.oData.masterreward);
        }
        if (this.nType === 2) {
            this.lbFree.visible = false;
            this.mPriceIcon.visible = true;
            if (this.oData.cost[0]) {
                this.mPriceIcon.setType(this.oData.cost[0].id);
                this.mPriceIcon.setPrice(this.oData.cost[0].count);
            }
            this.lbNe.text = "完美出师";
        }
        else {
            this.mPriceIcon.visible = false;
            this.lbFree.visible = true;
            this.lbNe.text = "普通出师";
        }
    };
    TeacherDepartItem.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnDepart:
                var id = GameGlobal.TeacherController.getTeacherIdInFirst();
                if (this.nType == 2) {
                    if (Checker.CheckDatas(this.oData.cost, false)) {
                        if (id) {
                            GameGlobal.TeacherManage.graduation(id, this.nType);
                        }
                    }
                }
                else {
                    if (id) {
                        GameGlobal.TeacherManage.graduation(id, this.nType);
                    }
                }
                break;
        }
    };
    return TeacherDepartItem;
}(BaseView));
__reflect(TeacherDepartItem.prototype, "TeacherDepartItem");
//# sourceMappingURL=TeacherDepartItem.js.map