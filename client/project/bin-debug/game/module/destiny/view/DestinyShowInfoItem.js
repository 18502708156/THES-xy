/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:51
 * @meaning: 灵童命格详细信息
 *
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
var DestinyShowInfoItem = (function (_super) {
    __extends(DestinyShowInfoItem, _super);
    function DestinyShowInfoItem() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._totalNum = 0;
        // 皮肤名称
        _this.skinName = "DestinyShowInfoSkin";
        return _this;
    }
    DestinyShowInfoItem.prototype.dataChanged = function () {
        if (this.data) {
            this.nameLabel.text = this.data.name || "";
            var strPower = "";
            var strArr1 = "";
            var strArr2 = "";
            if (this.data.attars) {
                strPower = "战力+" + ItemConfig.CalcAttrScoreValue(this.data.attars);
                if (this.data.attars[0]) {
                    strArr1 = AttributeData.getAttStrByType(this.data.attars[0], 0, "+", false, '#682f00');
                }
                if (this.data.attars[1]) {
                    strArr2 = AttributeData.getAttStrByType(this.data.attars[1], 0, "+", false, '#682f00');
                }
            }
            this.lbFight.text = strPower;
            if (this.data.desc) {
                strArr1 = this.data.desc;
            }
            this.lbInfo0.text = strArr1;
            this.lbInfo1.text = strArr2;
        }
    };
    return DestinyShowInfoItem;
}(eui.ItemRenderer));
__reflect(DestinyShowInfoItem.prototype, "DestinyShowInfoItem");
//# sourceMappingURL=DestinyShowInfoItem.js.map