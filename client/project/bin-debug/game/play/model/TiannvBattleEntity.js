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
var TiannvBattleEntity = (function (_super) {
    __extends(TiannvBattleEntity, _super);
    function TiannvBattleEntity() {
        var _this = _super.call(this) || this;
        _this._hua = new BattleMvData(_this, false);
        _this._hua.SetParent(_this, CharMcOrder.OTHER_TYPE);
        _this._hua.SetNotState();
        _this._xw = new eui.Image;
        _this._xw.y = -94 + BattleEntity.POS;
        _this._xw.x = -90;
        _this.addChildAt(_this._xw, CharMcOrder.TITLE_TYPE);
        return _this;
    }
    TiannvBattleEntity.prototype.GetTopPos = function () {
        return -84 + BattleEntity.POS + 60;
    };
    TiannvBattleEntity.prototype.UpdateSetting = function (settingId) {
        _super.prototype.UpdateSetting.call(this, settingId);
    };
    TiannvBattleEntity.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
        this._hua.ClearCache();
        this._xw.source = "";
    };
    TiannvBattleEntity.prototype.UpdateInfo = function (model) {
        this._hua.SetId(model.mHua);
        if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
            if (model.mLq) {
                var sourcePath = AppearanceConfig.GetAppe(model.mLq);
                this._xw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1);
            }
            else {
                this._xw.source = "";
            }
        }
        _super.prototype.UpdateInfo.call(this, model);
    };
    TiannvBattleEntity.prototype._BodyLoaded = function () {
        _super.prototype._BodyLoaded.call(this);
        this._hua.Load();
    };
    return TiannvBattleEntity;
}(BattleEntity));
__reflect(TiannvBattleEntity.prototype, "TiannvBattleEntity");
//# sourceMappingURL=TiannvBattleEntity.js.map