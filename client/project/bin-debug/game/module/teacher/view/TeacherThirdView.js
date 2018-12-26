/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒邀请详情
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
var TeacherThirdView = (function (_super) {
    __extends(TeacherThirdView, _super);
    function TeacherThirdView() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.skinName = "TeacherThird";
        _this.listView.itemRenderer = TeacherInvItem;
        return _this;
    }
    TeacherThirdView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent); //
        GameGlobal.TeacherManage.getMessage();
        this.UpdateContent();
    };
    TeacherThirdView.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider = new eui.ArrayCollection(this.tPanelData); // 
    };
    TeacherThirdView.prototype.setData = function () {
        this.tPanelData = GameGlobal.TeacherController.getInvList(); //招收列表
    };
    return TeacherThirdView;
}(BaseView));
__reflect(TeacherThirdView.prototype, "TeacherThirdView", ["ICommonWindowTitle"]);
//# sourceMappingURL=TeacherThirdView.js.map