/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 师徒获得奖励item (仅奖励)
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
var TeacherGetReLtItem = (function (_super) {
    __extends(TeacherGetReLtItem, _super);
    function TeacherGetReLtItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "TeacherShowReItemSkin";
        return _this;
    }
    TeacherGetReLtItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        if (!this.data.masterreward)
            return;
        if (this.data.taskname) {
            this.lbNe.text = this.data.taskname;
        }
        //icon
        this.item.setItemData(this.data.masterreward[0]);
        this.item.isShowName(false);
        this.lbVl.text = this.data.num + "/" + this.data.condition;
        if (this.data.condition - this.data.num > 0) {
            this.lbVl.textColor = Color.l_normal;
        }
        else {
            this.lbVl.textColor = Color.l_green_1;
        }
    };
    return TeacherGetReLtItem;
}(eui.ItemRenderer));
__reflect(TeacherGetReLtItem.prototype, "TeacherGetReLtItem");
//# sourceMappingURL=TeacherGetReLtItem.js.map