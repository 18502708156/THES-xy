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
var LingtongInactiveView = (function (_super) {
    __extends(LingtongInactiveView, _super);
    function LingtongInactiveView() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongInactiveSkin";
        return _this;
    }
    LingtongInactiveView.prototype.OnOpen = function () {
        this.AddClick(this.goBtn, this._OnClick);
    };
    LingtongInactiveView.prototype._OnClick = function () {
        var actConfig = GameGlobal.Config.BabyActivationConfig[this.mSelId];
        if (!Checker.Data(actConfig.material)) {
            return;
        }
        GameGlobal.LingtongPetModel.SendActive(this.mSelId);
    };
    LingtongInactiveView.prototype.UpdateSelId = function (selId) {
        this.mSelId = selId;
        this.UpdateContent();
    };
    LingtongInactiveView.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.BabyProgressConfig[this.mSelId];
        if (!config) {
            return;
        }
        var configData = config[0];
        this.label1.textFlow = AttributeData.GetAttrTabString(configData.attrpower);
        if (configData.specialattr && configData.specialattr.length) {
            var type = configData.specialattr[0].type;
            var val = configData.specialattr[0].value;
            if (type >= AttributeType.atDamageEnhance) {
                val = val * 100;
            }
            var attr = [{ type: type, value: val }];
            this.label2.textFlow = AttributeData.GetAttrTabString(attr);
        }
        else {
            this.label2.text = "";
        }
        var actConfig = GameGlobal.Config.BabyActivationConfig[this.mSelId];
        this.consumeLabel.SetItem(actConfig.material.id, actConfig.material.count, GameGlobal.UserBag.GetCount(actConfig.material.id));
    };
    return LingtongInactiveView;
}(BaseView));
__reflect(LingtongInactiveView.prototype, "LingtongInactiveView");
//# sourceMappingURL=LingtongInactiveView.js.map