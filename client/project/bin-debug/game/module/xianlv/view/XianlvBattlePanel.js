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
var XianlvBattlePanel = (function (_super) {
    __extends(XianlvBattlePanel, _super);
    function XianlvBattlePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvBattleSkin";
        _this._AddClick(_this.btn1, _this._OnClick);
        _this._AddClick(_this.btn2, _this._OnClick);
        return _this;
    }
    XianlvBattlePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.m_SelXianlvId = param[0];
        this.commonDialog.OnAdded(this);
        this.UpdateContent();
    };
    XianlvBattlePanel.prototype.OnClose = function () {
    };
    XianlvBattlePanel.prototype._OnClick = function (e) {
        var index = 0;
        switch (e.currentTarget) {
            case this.btn1:
                index = 0;
                break;
            case this.btn2:
                index = 1;
                break;
        }
        GameGlobal.XianlvModel.SendBattle(this.m_SelXianlvId, index);
        this.CloseSelf();
    };
    XianlvBattlePanel.prototype.UpdateContent = function () {
        var model = GameGlobal.XianlvModel;
        for (var i = 0; i < 2; i++) {
            var head = this["head" + (i + 1)];
            var id = model.mBattleList[i];
            if (id) {
                head.visible = true;
                XianlvHeadItem.SetContentByInfo(head, model.GetXianlvInfo(id));
            }
            else {
                head.visible = false;
            }
        }
    };
    XianlvBattlePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianlvBattlePanel;
}(BaseEuiView));
__reflect(XianlvBattlePanel.prototype, "XianlvBattlePanel");
//# sourceMappingURL=XianlvBattlePanel.js.map