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
var XianlvBattleEntity = (function (_super) {
    __extends(XianlvBattleEntity, _super);
    function XianlvBattleEntity() {
        var _this = _super.call(this) || this;
        _this._fz = new BattleMvData(_this, false);
        _this._fz.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_FZ;
        _this._fz.SetParent(_this, CharMcOrder.OTHER_TYPE);
        _this._fz.SetNotState();
        _this._xw = new eui.Image;
        _this._xw.y = -64 + BattleEntity.POS;
        _this._xw.x = -72;
        _this.addChildAt(_this._xw, CharMcOrder.TITLE_TYPE);
        return _this;
    }
    XianlvBattleEntity.prototype.UpdateSetting = function (settingId) {
        _super.prototype.UpdateSetting.call(this, settingId);
        if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_FZ) {
            this._fz.UpdateSetting(settingId);
        }
        else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_XW) {
            if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
                if (this._xw) {
                    this._xw.source = "";
                }
            }
        }
    };
    XianlvBattleEntity.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
        this._fz.ClearCache();
        this._xw.source = "";
    };
    XianlvBattleEntity.prototype.UpdateInfo = function (model) {
        this._fz.SetId(model.mFazId);
        if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
            if (model.mXianwId) {
                var sourcePath = AppearanceConfig.GetAppe(model.mXianwId);
                this._xw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1);
            }
            else {
                this._xw.source = "";
            }
        }
        _super.prototype.UpdateInfo.call(this, model);
    };
    XianlvBattleEntity.prototype._BodyLoaded = function () {
        _super.prototype._BodyLoaded.call(this);
        this._fz.Load();
    };
    return XianlvBattleEntity;
}(BattleEntity));
__reflect(XianlvBattleEntity.prototype, "XianlvBattleEntity");
//# sourceMappingURL=XianlvBattleEntity.js.map