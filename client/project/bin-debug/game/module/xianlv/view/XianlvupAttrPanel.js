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
var XianlvupAttr = (function (_super) {
    __extends(XianlvupAttr, _super);
    function XianlvupAttr() {
        return _super.call(this) || this;
    }
    XianlvupAttr.prototype.addAttrType = function (attrs0, attrs1) {
        for (var i = 0; i < attrs0.length; i++) {
            if (attrs0[i].type == attrs1[i].type) {
                attrs0[i].value += attrs1[i].value;
            }
        }
        return attrs0;
    };
    XianlvupAttr.prototype.setAttrNol = function (attr0, attr1) {
        this.currentState = "normal";
        for (var i = 0; i < attr0.length; i++) {
            this["text" + i].text = AttributeData.TYPE_TO_NAME[attr0[i].type] + "+" + attr0[i].value;
        }
        for (var i = 0; i < attr0.length; i++) {
            this["newtext" + i].text = AttributeData.TYPE_TO_NAME[attr1[i].type] + "+" + attr1[i].value;
        }
        //ItemConfig.CalcAttrScoreValue(attr0)
        this.zdl.text = "战斗力：+" + (ItemConfig.CalcAttrScoreValue(attr1) - ItemConfig.CalcAttrScoreValue(attr0));
    };
    XianlvupAttr.prototype.setAttrFull = function (attr0) {
        this.currentState = "full";
        for (var i = 0; i < attr0.length; i++) {
            this["text" + i].text = AttributeData.TYPE_TO_NAME[attr0[i].type] + "+" + attr0[i].value;
        }
    };
    XianlvupAttr.prototype.setStarNol = function (Star, NextStar) {
        this.starLv0.text = Star;
        this.starLv1.text = NextStar;
    };
    XianlvupAttr.prototype.setStarFull = function (Star) {
        this.starLv0.text = Star;
    };
    XianlvupAttr.prototype.setSkillNol = function (skill0, skill1) {
        this.skill0.source = skill0[0];
        this.skilltext0.text = skill0[1];
        this.say0.text = skill0[2];
        this.skill1.source = skill1[0];
        this.skilltext1.text = skill1[1];
        this.say1.text = skill1[2];
    };
    XianlvupAttr.prototype.setSkillFull = function (skill0) {
        this.skill0.source = skill0[0];
        this.skilltext0.text = skill0[1];
        this.say0.text = skill0[2];
    };
    return XianlvupAttr;
}(eui.Component));
__reflect(XianlvupAttr.prototype, "XianlvupAttr", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=XianlvupAttrPanel.js.map