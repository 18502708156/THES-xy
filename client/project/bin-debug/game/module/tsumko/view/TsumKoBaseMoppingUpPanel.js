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
/**
 * 扫荡模块
 */
var TsumKoBaseMoppingUpPanel = (function (_super) {
    __extends(TsumKoBaseMoppingUpPanel, _super);
    function TsumKoBaseMoppingUpPanel() {
        return _super.call(this) || this;
    }
    TsumKoBaseMoppingUpPanel.prototype.childrenCreated = function () {
        this._AddClick(this.onceBtn, this._OnClick);
        this._AddClick(this.allBtn, this._OnClick);
    };
    TsumKoBaseMoppingUpPanel.prototype.OnOpen = function () {
    };
    TsumKoBaseMoppingUpPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.onceBtn:
                var id = GameGlobal.TsumKoBaseModel.recordId;
                if (id == 0) {
                    id = (GameGlobal.TsumKoBaseModel.chapterid - 1) * 9 + 1;
                }
                GameGlobal.TsumKoBaseModel.SendSweep(GameGlobal.Config.DisasterFbConfig[id].id);
                break;
            case this.allBtn:
                GameGlobal.TsumKoBaseModel.SendSweepAll();
                break;
        }
    };
    return TsumKoBaseMoppingUpPanel;
}(BaseView));
__reflect(TsumKoBaseMoppingUpPanel.prototype, "TsumKoBaseMoppingUpPanel");
//# sourceMappingURL=TsumKoBaseMoppingUpPanel.js.map