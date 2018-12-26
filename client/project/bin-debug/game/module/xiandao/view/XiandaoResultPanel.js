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
var XiandaoResultPanel = (function (_super) {
    __extends(XiandaoResultPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XiandaoResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoResultSkin";
        return _this;
    }
    XiandaoResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddTimer(4000, 1, this.CloseSelf);
        var isWin = param[0];
        var roleData = param[1];
        this.retImg.source = isWin ? "ui_xdh_bm_shengli" : "ui_xdh_bm_shibai";
        this.Set(this.head1, this.levelLabel1, this.nameLabel1, this.ret1, 1, 0, roleData[0]);
        this.Set(this.head2, this.levelLabel2, this.nameLabel2, this.ret2, 1, 0, roleData[1]);
    };
    XiandaoResultPanel.prototype.Set = function (head, levelLabel, nameLabel, ret, job, sex, roleData) {
        UIHelper.SetHead(head, job, sex, false);
        var point = "";
        if (roleData.addpoint != null) {
            point = "\n积分：+" + roleData.addpoint;
        }
        nameLabel.text = GameString.GetSerAndName(roleData.serverid, roleData.name) + point;
        levelLabel.text = "Lv." + roleData.level;
        ret.source = roleData.win ? "ui_xdh_bm_sheng" : "ui_xdh_bm_bai";
    };
    XiandaoResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XiandaoResultPanel;
}(BaseEuiView));
__reflect(XiandaoResultPanel.prototype, "XiandaoResultPanel");
//# sourceMappingURL=XiandaoResultPanel.js.map