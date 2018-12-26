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
var PetBattleEntity = (function (_super) {
    __extends(PetBattleEntity, _super);
    function PetBattleEntity() {
        var _this = _super.call(this) || this;
        _this._tl = new BattleMvData(_this, false);
        _this._sh = new BattleMvData(_this, false);
        _this._tl.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_TL;
        _this._tl.SetNotState();
        _this._tl.SetParent(_this, CharMcOrder.OTHER_TYPE);
        _this._sh.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_SH;
        _this._sh.SetNotState();
        _this._sh.SetParent(_this, CharMcOrder.TITLE_TYPE);
        return _this;
    }
    PetBattleEntity.prototype.Init = function (entity) {
        this._tl.Init();
        this._sh.Init();
        _super.prototype.Init.call(this, entity);
    };
    PetBattleEntity.prototype.UpdateSetting = function (settingId) {
        _super.prototype.UpdateSetting.call(this, settingId);
        if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TL) {
            this._tl.UpdateSetting(settingId);
        }
        else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_SH) {
            this._sh.UpdateSetting(settingId);
            // if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)) {
            // 	if (this._sh) {
            // 		this._sh.source = ""
            // 	}
            // }
        }
    };
    PetBattleEntity.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
        this._tl.ClearCache();
        this._sh.ClearCache();
        // this._sh.source = ""
    };
    PetBattleEntity.prototype.UpdateInfo = function (model) {
        this._tl.SetId(model.mTlId);
        this._sh.SetId(model.mShId);
        // if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)) {
        // 	if (model.mShId) {
        // 		let sourcePath = AppearanceConfig.GetAppe(model.mShId)
        // 		this._sh.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1)
        // 	} else {
        // 		this._sh.source = ""
        // 	}
        // }
        _super.prototype.UpdateInfo.call(this, model);
    };
    PetBattleEntity.prototype._BodyLoaded = function () {
        _super.prototype._BodyLoaded.call(this);
        this._tl.Load();
        this._sh.Load();
        this._sh.UpdateWayTween();
    };
    return PetBattleEntity;
}(BattleEntity));
__reflect(PetBattleEntity.prototype, "PetBattleEntity");
//# sourceMappingURL=PetBattleEntity.js.map