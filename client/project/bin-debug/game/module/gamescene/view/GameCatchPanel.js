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
var GameCatchPanel = (function (_super) {
    __extends(GameCatchPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GameCatchPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GameCatchSkin";
        return _this;
    }
    GameCatchPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this.AddClick(this.catchPet, this._OnClick);
        this._UpdatePos();
    };
    GameCatchPanel.prototype._UpdatePos = function () {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
    };
    GameCatchPanel.prototype._OnClick = function () {
        GameGlobal.CatchPetModel.SendPetCatch();
    };
    GameCatchPanel.prototype.Catch = function () {
        this.catchPet.visible = false;
    };
    GameCatchPanel.LAYER_LEVEL = LayerManager.UI_BATTLE;
    GameCatchPanel.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GameCatchPanel;
}(BaseEuiView));
__reflect(GameCatchPanel.prototype, "GameCatchPanel");
//# sourceMappingURL=GameCatchPanel.js.map