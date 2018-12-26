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
var CatchPetResultWin = (function (_super) {
    __extends(CatchPetResultWin, _super);
    function CatchPetResultWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "CatchPetResultWinSkin";
        return _this;
    }
    CatchPetResultWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("确定");
        this.SetCloseFunc(param[1]);
        _super.prototype.OnOpen.call(this);
        var star = param[2];
        this.petShowPanel.SetBody(PetConst.GetSkin(param[0]));
        this.text.text = '恭喜获得' + GameGlobal.Config.petBiographyConfig[param[0]].name;
        if (star != null) {
            if (star == 0) {
                this.bmStar0.visible = false;
                this.bmStar1.visible = false;
                this.bmStar2.visible = false;
            }
            else if (star == 1) {
                this.bmStar0.visible = false;
                this.bmStar2.visible = false;
            }
            else if (star == 2) {
                this.bmStar1.visible = false;
                this.bmStar0.x = 233;
                this.bmStar2.x = 400;
            }
        }
        else {
            this.bmStar0.visible = false;
            this.bmStar1.visible = false;
            this.bmStar2.visible = false;
        }
        this.mc = this.mc || new MovieClip;
        this.mc.loadFile(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, -1);
        this.group.addChild(this.mc);
        this.mc.scaleX = 2.3;
        this.mc.scaleY = 2.3;
    };
    return CatchPetResultWin;
}(ResultBasePanel));
__reflect(CatchPetResultWin.prototype, "CatchPetResultWin");
//# sourceMappingURL=CatchPetResultWin.js.map