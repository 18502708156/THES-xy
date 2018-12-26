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
var PetZizhiPanel = (function (_super) {
    __extends(PetZizhiPanel, _super);
    function PetZizhiPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetZizhiSkin";
        _this._AddClick(_this.btnAdd, _this._OnClick);
        _this._AddClick(_this.btnCulture, _this._OnClick);
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this.SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnCulture.label = "停止";
            }
            else {
                _this.btnCulture.label = "自动提升";
            }
        });
        return _this;
    }
    PetZizhiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.m_PetId = param[0];
        this.UpdateContent();
        this.observe(MessageDef.PET_UPATE_ZIZHI, this.UpdateZizhi);
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
    };
    PetZizhiPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    PetZizhiPanel.prototype.UpdateZizhi = function () {
        this.mRoleAutoSendData.Continue();
    };
    PetZizhiPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.PetModel;
        var petInfo = this.m_PetInfo = model.GetPetInfo(this.m_PetId);
        this.powerLabel.text = petInfo.GetZizhiPower();
        // this.lbName.text = petInfo.mName
        PetConst.SetName(this.lbName, petInfo);
        var level = petInfo.mZizhiLevel;
        var config = GameGlobal.Config.petGiftproConfig[this.m_PetId][level - 1];
        this.wuxingImg.source = PetConst.XUXING_IMG[GameGlobal.Config.petBiographyConfig[this.m_PetId].fiveele];
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = level > i ? "ui_bm_jsstar04" : "ui_bm_jsstar03";
        }
        // let attrs = model.GetAllZizhiAttrs()
        var attrs = petInfo.GetShowZizhiAttrs();
        this.attrLabel.textFlow = AttributeData.GetAttrTabString(attrs);
        if (level >= model.MAX_ZIZHI_LEVEL) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
            this.bar.maximum = config.proexp;
            this.bar.value = petInfo.mZizhiExp * config.exp;
            this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count);
        }
        this.showPanel.SetBody(petInfo.GetSkin());
    };
    PetZizhiPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnAdd:
                this.SendUp();
                break;
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle();
                break;
        }
    };
    PetZizhiPanel.prototype.SendUp = function () {
        var model = GameGlobal.PetModel;
        var config = GameGlobal.Config.petGiftproConfig[this.m_PetId][this.m_PetInfo.mZizhiLevel];
        if (!config) {
            return false;
        }
        if (Checker.Datas(config.cost, false)) {
            model.SendUpZizhi(this.m_PetId);
            return true;
        }
        else {
            UserWarn.ins().BuyGoodsWarn(config.cost[0].id);
        }
        return false;
    };
    PetZizhiPanel.LAYER_LEVEL = LayerManager.UI_Main;
    PetZizhiPanel.TYPE = [
        "初级",
        "初级",
        "中级",
        "高级",
        "特级",
        "顶级"
    ];
    return PetZizhiPanel;
}(BaseEuiView));
__reflect(PetZizhiPanel.prototype, "PetZizhiPanel");
//# sourceMappingURL=PetZizhiPanel.js.map