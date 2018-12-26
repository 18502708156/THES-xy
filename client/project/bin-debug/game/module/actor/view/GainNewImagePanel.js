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
var GainNewImagePanel = (function (_super) {
    __extends(GainNewImagePanel, _super);
    function GainNewImagePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GainNewImageSkin";
        _this.mCount = 5;
        _this._AddClick(_this, _this.CloseSelf);
        _this._AddClick(_this.btnEnter, _this._onClick);
        return _this;
    }
    GainNewImagePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        var level = this.mModel.mLevel;
        var dressId = this.mModel.BaseConfig.pictureid[level - 1];
        this.SetMainShow(dressId);
        this.SetExtraShow(dressId);
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, 0);
        eff.x = this.imgPoint.x;
        eff.y = this.imgPoint.y;
        eff.scaleX = 2.3;
        eff.scaleY = 2.3;
        this.group.addChild(eff);
        this.AddTimer(1000, 5, this._DoUpdate);
    };
    GainNewImagePanel.prototype.OnClose = function () {
    };
    GainNewImagePanel.prototype._DoUpdate = function () {
        this.mCount--;
        this.btnEnter.label = "确定(" + this.mCount.toString() + "s)";
        if (this.mCount == 0) {
            ViewManager.ins().close(this);
        }
    };
    GainNewImagePanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.btnEnter:
                ViewManager.ins().close(this);
                break;
        }
    };
    GainNewImagePanel.prototype.SetMainShow = function (dressId) {
        var model = this.mModel;
        if (model.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(model.SkinConfig[dressId].pid);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW) {
            var xianlvModel = GameGlobal.XianlvModel;
            var battledXianlvId = xianlvModel.getBattledXianlv();
            if (battledXianlvId != 0) {
                var xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId);
                this.showPanel.SetBody(xianlvInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            var petModel = GameGlobal.PetModel;
            var battledPetId = petModel.GetShowId();
            if (battledPetId != 0) {
                var petInfo = petModel.GetPetInfo(battledPetId);
                this.showPanel.SetBody(petInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_WING) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTianx(null);
            this.roleShowPanel.SetTitle(null);
            this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid));
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTianx(null);
            this.roleShowPanel.SetTitle(null);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_SHENGB) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTianx(null);
            this.roleShowPanel.SetTitle(null);
            this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid, role.job, role.sex, false, true));
            return;
        }
        this.showPanel.SetBody(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid));
    };
    GainNewImagePanel.prototype.SetExtraShow = function (dressId) {
        var model = this.mModel;
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_FZ) {
            var xianlvModel = GameGlobal.XianlvModel;
            var battledXianlvId = xianlvModel.getBattledXianlv();
            if (battledXianlvId != 0) {
                var xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId);
                this.extraPanel.SetBody(xianlvInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW || model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ) {
            var sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid);
            this.imgXianw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_TONGL) {
            var petModel = GameGlobal.PetModel;
            var battledPetId = petModel.GetShowId();
            if (battledPetId != 0) {
                var petInfo = petModel.GetPetInfo(battledPetId);
                this.extraPanel.SetBody(petInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            var sourcePath = AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid);
            this.soulPanel.SetBody(sourcePath);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            this.showTianx.SetBody(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid));
            return;
        }
    };
    GainNewImagePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return GainNewImagePanel;
}(BaseEuiView));
__reflect(GainNewImagePanel.prototype, "GainNewImagePanel");
//# sourceMappingURL=GainNewImagePanel.js.map